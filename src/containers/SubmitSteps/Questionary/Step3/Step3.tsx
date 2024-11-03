import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import usePortal from 'react-useportal';
import { Trans, useTranslation } from 'react-i18next';

// Form
import { useForm, Controller } from 'react-hook-form';
import { useStateMachine } from 'little-state-machine';
import { yupResolver } from '@hookform/resolvers';
import { ErrorMessage } from '@hookform/error-message';
import * as Yup from 'yup';

// Update Action
import { updateAction } from 'utils/wizard';

// Components
import ProgressIndicator from 'components/ProgressIndicator';
import OptionList from 'components/OptionList';
import WizardButtons from 'components/WizardButtons';

// Icons
import { ReactComponent as ExclamationSVG } from 'assets/icons/exclamationCircle.svg';

// Hooks
import useHeaderContext from 'hooks/useHeaderContext';

// Utils
import { scrollToTop } from 'helper/scrollHelper';

// Styles
import { TextErrorContainer } from 'containers/Welcome/style';
import {
  QuestionText, MainContainer, QuestionAllApply,
} from '../style';

const schema = Yup.object({
  currentMedicalCondition: Yup.array().of(Yup.string().required()).required('currentMedicalConditionRequired').default([])
    .test('SelecteOne', 'Select one', v => !(!!v && v.length > 1 && (v.includes('none')))),
}).defined();

type Step6Type = Yup.InferType<typeof schema>;

const Step3 = ({
  previousStep,
  nextStep,
  storeKey,
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

  /*  */
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
    setTitle(`${t('questionary:respiration.title')}`);
    setType('primaryBlue');
    setDoGoBack(() => handleDoBack);
    setSubtitle(t('questionary:respiration:subtitle'));
  }, [handleDoBack, setDoGoBack, setSubtitle, setTitle, setType, metadata, t]);

  // Handlers
  const onSubmit = async (values: Step6Type) => {
    if (values) {
      action(values);
      if (nextStep) {
        setActiveStep(false);
        history.push(nextStep);
      }
    }
  };

  return (
    <MainContainer>
      <ProgressIndicator
        currentStep={metadata?.current}
        totalSteps={metadata?.total}
        progressBar
      />
      <QuestionText extraSpace first >
        <Trans i18nKey="questionary:medical.question">
          <strong>Which of the below medical conditions do you currently have?</strong>
        </Trans>
        <QuestionAllApply>{t('questionary:allThatApply')}</QuestionAllApply>
      </QuestionText>

      <Controller
        control={control}
        name="currentMedicalCondition"
        defaultValue={[]}
        render={({ onChange, value }) => (
          <OptionList
            isCheckbox
            enableOther={true}
            otherPlaceholder='回答を入力'
            value={{ selected: value || [] }}  
            onChange={(v) => onChange(v.selected || [])}
            items={[
              {
                value: 'none',
                label: t('questionary:medical.options.none'),
              },
              {
                value: 'influenzaA',
                label: t('questionary:medical.options.influenzaA'),
              },
              {
                value: 'influenzaB',
                label: t('questionary:medical.options.influenzaB'),
              },
              {
                value: 'covid',
                label: t('questionary:medical.options.covid'),
              },
              {
                value: 'cold',
                label: t('questionary:medical.options.cold'),
              }, 
              {
                value: 'pneumonia',
                label: t('questionary:medical.options.pneumonia'),
              },
              {
                value: 'bronchitis',
                label: t('questionary:medical.options.bronchitis'),
              },
              {
                value: 'tuberculosis',
                label: t('questionary:medical.options.tuberculosis'),
              },
              {
                value: 'copdEmphysema',
                label: t('questionary:medical.options.emphysema'),
              },
              {
                value: 'asthma',
                label: t('questionary:medical.options.asthma'),
              },
              {
                value: 'other',
                label: t('questionary:medical.options.other'),
              },
            ]}
            excludableValues={['none']}
          />
        )}
      />
      {/* Bottom Buttons */}
      <ErrorMessage
        errors={errors}
        name="currentMedicalCondition"
        render={({ message }) => (
          <TextErrorContainer>
            <ExclamationSVG />
            {t(`main:${message}`, 'Please select at least one option')}
          </TextErrorContainer>
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

export default React.memo(Step3);