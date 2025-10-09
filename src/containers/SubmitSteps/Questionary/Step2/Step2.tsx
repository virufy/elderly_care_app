import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import usePortal from 'react-useportal';
import { useTranslation, Trans } from 'react-i18next';

// Form
import { useForm, Controller } from 'react-hook-form';
import { useStateMachine } from 'little-state-machine';
import { yupResolver } from '@hookform/resolvers';
import { ErrorMessage } from '@hookform/error-message';
import * as Yup from 'yup';

// Update Action
import { updateAction } from 'utils/wizard';

// Header Control
import useHeaderContext from 'hooks/useHeaderContext';

// Utils
import { scrollToTop } from 'helper/scrollHelper';

// Components
import OptionList from 'components/OptionList';
import WizardButtons from 'components/WizardButtons';
import ProgressIndicator from 'components/ProgressIndicator';

// Icons
import { ReactComponent as ExclamationSVG } from 'assets/icons/exclamationCircle.svg';

// Styles
import { BoldBlackText, TextErrorContainer } from 'containers/Welcome/style';
import DatePicker from 'components/DatePicker';
import {
  QuestionText, MainContainer, QuestionNote,
} from '../style';

const schema = Yup.object({
  currentSymptoms: Yup.array().of(Yup.string()),
  dateOfDiagnosis: Yup.date().nullable().required(),
}).defined();

type Step5aType = Yup.InferType<typeof schema>;

const Step2 = ({
  previousStep,
  nextStep,
  storeKey,
  otherSteps,
  metadata,
}: Wizard.StepProps) => {
  // Hooks
  const { Portal } = usePortal({
    bindTo: document && document.getElementById('wizard-buttons') as HTMLDivElement,
  });
  const {
    setDoGoBack, setTitle, setType, setSubtitle,
  } = useHeaderContext();
  const history = useHistory();
  const { t } = useTranslation();
  const { state, action } = useStateMachine(updateAction(storeKey));

  // States
  const [activeStep, setActiveStep] = React.useState(true);

  // Form
  const {
    control, handleSubmit, formState,
  } = useForm({
    mode: 'onChange',
    defaultValues: state?.[storeKey],
    resolver: yupResolver(schema),
  });
  const { errors, isValid } = formState;

  const handleDoBack = React.useCallback(() => {
    setActiveStep(false);
    if (previousStep) {
      history.push(previousStep);
    } else {
      history.goBack();
    }
  }, [history, previousStep]);

  useEffect(() => {
    scrollToTop();
    setTitle(`${t('questionary:symptoms.title')}`);
    setType('primary');
    setDoGoBack(() => handleDoBack);
    setSubtitle('');
  }, [handleDoBack, setDoGoBack, setTitle, setSubtitle, setType, metadata, t]);

  // Handlers
  const onSubmit = async (values: Step5aType) => {
    if (values) {
      const {
        currentSymptoms,
      } = (values as any);

      action(values);

      const covidSymptoms = ['dryCough', 'wetCough', 'feverChillsSweating', 'worseCough', 'breathShortness'];

      let output = false;
      // eslint-disable-next-line no-plusplus
      for (let index = 0; !output && index < currentSymptoms?.length; index++) {
        output = covidSymptoms.includes(currentSymptoms[index]);
      }

      if (output && otherSteps) {
        setActiveStep(false);
        history.push(otherSteps.covidSymptomsStep);
        return;
      }

      if (nextStep) {
        setActiveStep(false);
        history.push(nextStep);
      }
      console.log(state);
    }
  };

  return (
    <MainContainer>
      <ProgressIndicator
        currentStep={metadata?.current}
        totalSteps={metadata?.total}
        progressBar
      />
      <QuestionText extraSpace first>
        <Trans i18nKey="questionary:symptoms.question">
          <strong>Which of the below symptoms do you currently have?</strong>
        </Trans>
        <QuestionNote>{t('questionary:allThatApply')}</QuestionNote>
      </QuestionText>
      <Controller
        control={control}
        name="currentSymptoms"
        defaultValue={[]}
        render={({ onChange, value }) => (
          <OptionList
            isCheckbox
            enableOther
            otherPlaceholder="Fill in"
            value={{ selected: value || [] }}
            onChange={v => onChange(v.selected || [])}
            items={[
              {
                value: 'none',
                label: t('questionary:symptoms.options.none'),
              },
              {
                value: 'pneumonia',
                label: t('questionary:symptoms.options.pneumonia'),
              },
              {
                value: 'copd',
                label: t('questionary:symptoms.options.copd'),
              },
              {
                value: 'influenza',
                label: t('questionary:symptoms.options.influenza'),
              },
              {
                value: 'covid',
                label: t('questionary:symptoms.options.covid'),
              },
              {
                value: 'rsv',
                label: t('questionary:symptoms.options.rsv'),
              },
              {
                value: 'other',
                label: t('questionary:symptoms.options.otherRD'),
              },
            ]}
            excludableValues={['none']}
          />
        )}
      />
      {/* Bottom Buttons */}
      <ErrorMessage
        errors={errors}
        name="currentSymptoms"
        render={({ message }) => (
          <TextErrorContainer>
            <ExclamationSVG />
            {t(`main:${message}`, 'Please select at least one option')}
          </TextErrorContainer>
        )}
      />

      <BoldBlackText>
        If one of those respiratory diseases ha
        s been diagnosed in the past
        two weeks, please specify the date
      </BoldBlackText>
      {/* Facility Dropdown */}
      <Controller
        control={control}
        name="dateOfDiagnosis"
        defaultValue=""
        render={({ onChange, value }) => (
          <DatePicker
            value={value}
            locale="en"
            onChange={date => onChange(date as Date)}
          />
        )}
      />

      {activeStep && (
        <Portal>
          <WizardButtons
            leftLabel={t('questionary:nextButton')}
            leftDisabled={!isValid}
            leftHandler={handleSubmit(onSubmit)}
            invert
          />
        </Portal>
      )}
    </MainContainer>
  );
};

export default React.memo(Step2);
