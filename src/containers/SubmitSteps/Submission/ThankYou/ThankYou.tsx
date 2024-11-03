import React, { useEffect, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { useStateMachine } from 'little-state-machine';

// Utils
import { resetStore } from 'utils/wizard';

// Helper
import { scrollToTop } from 'helper/scrollHelper';

// Hooks
import useHeaderContext from 'hooks/useHeaderContext';

import {
  BeforeSubmitText,
  SubmissionIdBox,
  ThankYouLayout,
  ThankYouTitle,
  CardLink 
} from './style';

const ThankYou = (p: Wizard.StepProps) => {
  const { t } = useTranslation();
  const [, setActiveStep] = useState(true);
  const { setDoGoBack, setTitle, setType } = useHeaderContext();
  const { state, action } = useStateMachine();
  const history = useHistory();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      {state['welcome']?.patientId && <SubmissionIdBox>
        <Trans i18nKey="thankyou:paragraph2" values={{ submissionId: state['welcome']?.patientId }}> 
          Your unique submission ID:
          <br />
        </Trans>
      </SubmissionIdBox>}

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

      <CardLink
        href="https://virufy.org/ja/"
        target="_self"
        onClick={(e) => {
          e.preventDefault();  // Prevents the default link action momentarily
          handleReset();  // Calls your reset function
          window.location.href = "https://virufy.org/ja/";  // Redirects to the link after reset
        }}
      >
        アプリを閉じる
      </CardLink>

    </ThankYouLayout>
  );
};

export default React.memo(ThankYou);
