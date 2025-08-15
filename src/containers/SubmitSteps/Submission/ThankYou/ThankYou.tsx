import React, { useEffect, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { useStateMachine } from 'little-state-machine';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

// Utils
import usePortal from 'react-useportal';
import { resetStore } from 'utils/wizard';

// Helpers
import { scrollToTop } from 'helper/scrollHelper';

// Hooks
import useHeaderContext from 'hooks/useHeaderContext';

// Components & Styles
import WizardButtons from 'components/WizardButtons';
import {
  BeforeSubmitText,
  SubmissionIdBox,
  ThankYouLayout,
  ThankYouTitle,
} from './style';

const ThankYou = (p: Wizard.StepProps) => {
  const { t } = useTranslation();
  const [, setActiveStep] = useState(true);
  const { setDoGoBack, setTitle, setType } = useHeaderContext();
  const { state, action } = useStateMachine();
  const history = useHistory();
  const { Portal } = usePortal({ bindTo: document && document.getElementById('wizard-buttons') as HTMLDivElement });
  const { handleSubmit } = useForm({ mode: 'onChange' });
  // const { previousStep, nextStep } = p;
  const schema = Yup.object().shape({}).defined();
  type ThankYouType = Yup.InferType<typeof schema>;

  const onSubmit = async (values: ThankYouType, destination: 'previousStep' | 'nextStep') => {
    if (values) {
      action(values);
      if (destination === 'previousStep' && p.previousStep) {
        setActiveStep(false);
        history.push(p.previousStep);
      } else if (destination === 'nextStep' && p.nextStep) {
        setActiveStep(false);
        history.push(p.nextStep);
      }
    }
  };

  // Function to handle resetting the form
  const handleReset = useCallback(() => {
    action(resetStore());
    localStorage.clear();
  }, [action]);

  const handleDoBack = useCallback(() => {
    if (p.previousStep) {
      setActiveStep(false);
      history.push(p.previousStep);
    } else {
      history.goBack();
    }
  }, [p.previousStep, history]);

  useEffect(() => {
    scrollToTop();
    setTitle('');
    setType('tertiary');
    setDoGoBack(null);
  }, [handleDoBack, setDoGoBack, setTitle, setType, handleReset]);

  return (
    <ThankYouLayout>
      <ThankYouTitle>{t('thankyou:title')}</ThankYouTitle>
      <BeforeSubmitText $centered><Trans i18nKey="thankyou:paragraph1" /></BeforeSubmitText>
      {state.welcome?.patientId && (
        <SubmissionIdBox>
          <Trans i18nKey="thankyou:paragraph2" values={{ submissionId: state.welcome?.patientId }}>
            Your unique submission ID:
            <br />
          </Trans>
        </SubmissionIdBox>
)}

      <BeforeSubmitText>
        <Trans i18nKey="thankyou:paragraph3">
          Make sure to safeguard this submission ID, as you will need it to request Virufy to delete your anonymized
          data in future.
          <br /><br />
          If you later develop symptoms such as cough, fever, or shortness of breath, please come
          back to resubmit your
          latest cough sounds.
        </Trans>
      </BeforeSubmitText>

      <Portal>
        <WizardButtons
          invert
          leftLabel="もう一回録音"
          leftHandler={handleSubmit(values => onSubmit(values, 'nextStep'))}
        />
        <WizardButtons
          invert
          leftLabel="ホーム画面に戻る"
          leftHandler={handleSubmit(values => onSubmit(values, 'previousStep'))}
        />
      </Portal>

    </ThankYouLayout>
  );
};

export default React.memo(ThankYou);
