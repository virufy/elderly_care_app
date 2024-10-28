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

interface ThankYouLocation {
  submissionId: string;
  patientId?: string;
}

const ThankYou = (p: Wizard.StepProps) => {
  const { t } = useTranslation();

  const [, setActiveStep] = useState(true);
  const { setDoGoBack, setTitle, setType } = useHeaderContext();
  // Ryuma Change
  // const { action } = useStateMachine(resetStore());
  const { state, action } = useStateMachine(); // Access state and action from little-state-machine

  const history = useHistory();
  
  // Ryuma Change
  // React.useEffect(() => {
  //   action({});
  // }, [action]);
  // Function to handle resetting the form
  const handleReset = () => {
    action(resetStore()); // This will reset the entire form state
  };

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
  }, [handleDoBack, setDoGoBack, setTitle, setType]);

  return (
    <ThankYouLayout>
      <ThankYouTitle>{t('thankyou:title')}</ThankYouTitle>
      <BeforeSubmitText $centered><Trans i18nKey="thankyou:paragraph1" /></BeforeSubmitText>
      <SubmissionIdBox>
        <Trans i18nKey="thankyou:paragraph2">
          Your unique submission ID:
          <br />
          <strong>{{ submissionId: Math.floor(100000 + Math.random() * 900000) }}</strong>
        </Trans>
      </SubmissionIdBox>

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

      <CardLink href="https://virufy.org/ja/">アプリを閉じる</CardLink> {/* Replace the link and label as necessary */}

      {/* Ryuma Change */}
      <div>
        <h2>Debug: Visualize all collected JSON data:</h2>
        {/* Display the stored data for debugging */}
        <pre>{JSON.stringify(state, null, 2)}</pre>

        {/* Button to reset the store */}
        <button onClick={handleReset}>Reset/Erase Stored Data</button>
      </div>
    </ThankYouLayout>
  );
};

export default React.memo(ThankYou);
