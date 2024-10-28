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
  currentMedicalCondition: Yup.object().required('currentMedicalConditionRequired'),
}).defined();

type Step6Type = Yup.InferType<typeof schema>;

const Step6 = ({
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
        currentStep={3}
        totalSteps={3}
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
        defaultValue={{ selected: [], other: '' }}
        render={({ onChange, value }) => (
          <OptionList
            isCheckbox
            value={value}
            onChange={v => onChange(v)}
            items={[
              {
                value: 'none',
                label: t('questionary:medical.options.none'),
              },
              {
                value: 'asthma',
                label: t('questionary:medical.options.asthma'),
              },
              {
                value: 'bronchitis',
                label: t('questionary:medical.options.bronchitis'),
              },
              {
                value: 'copdEmphysema',
                label: t('questionary:medical.options.emphysema'),
              },
              {
                value: 'otherChronic',
                label: t('questionary:medical.options.otherChronic'),
              },
              {
                value: 'pneumonia',
                label: t('questionary:medical.options.pneumonia'),
              },
              {
                value: 'tuberculosis',
                label: t('questionary:medical.options.tuberculosis'),
              },
              {
                value: 'cysticFibrosis',
                label: t('questionary:medical.options.cysticFibrosis'),
              },
              {
                value: 'hivAidsOrImpairedImmuneSystem',
                label: t('questionary:medical.options.hiv'),
              },
              {
                value: 'congestiveHeart',
                label: t('questionary:medical.options.congestiveHeart'),
              },
              {
                value: 'coughCausedByOther',
                label: t('questionary:medical.options.cough'),
              },
              {
                value: 'extremeObesity',
                label: t('questionary:medical.options.obesity'),
              },
              {
                value: 'sinusitis',
                label: t('questionary:medical.options.sinusitis'),
              },
              {
                value: 'pulmonary',
                label: t('questionary:medical.options.pulmonary'),
              },
              {
                value: 'heartValveDisease',
                label: t('questionary:medical.options.heartValveDisease'),
              },
              {
                value: 'pregnancy',
                label: t('questionary:medical.options.pregnancy'),
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

export default React.memo(Step6);