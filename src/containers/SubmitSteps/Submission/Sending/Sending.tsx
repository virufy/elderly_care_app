import React, { useEffect, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useStateMachine } from 'little-state-machine';
import { ErrorMessage } from '@hookform/error-message';

// Icons
import { ReactComponent as ExclamationSVG } from 'assets/icons/exclamationCircle.svg';

// Helper
import { scrollToTop } from 'helper/scrollHelper';

// Hooks
import useHeaderContext from 'hooks/useHeaderContext';

import { ImageProcessing, TextErrorContainer } from '../style';

// const apiUrl = process.env.REACT_APP_API_URL!;
const apiUrl = 'https://palcg6uyya.execute-api.us-east-1.amazonaws.com/dev/submit';

type StepBucket = 'recordCough1' | 'recordCough2' | 'recordCough3';

const getBase64FromState = (bucket: StepBucket, submitSteps: any): string | null => {
  const entry = submitSteps?.[bucket] ?? {};
  const b64 = typeof entry.base64 === 'string' ? entry.base64 : '';
  return b64 || null;
};

const Sending = (p: Wizard.StepProps) => {
  const [, setActiveStep] = useState(true);
  const { setDoGoBack, setTitle, setType } = useHeaderContext();
  const { state } = useStateMachine();
  const history = useHistory();
  const [error, setError] = React.useState<string | null>(null);

  const sendDataToBackend = useCallback(async (): Promise<void> => {
    try {
      // CHANGE: Read the three base64 strings directly from state
      const b1 = getBase64FromState('recordCough1', state['submit-steps']);
      const b2 = getBase64FromState('recordCough2', state['submit-steps']);
      const b3 = getBase64FromState('recordCough3', state['submit-steps']);

      // CHANGE: Build payload in the shape your Lambda expects
      const payload = {
        patientId: String(state.welcome?.patientId ?? ''),
        facility: state.welcome?.facility ?? '',
        agreedAgeConsentTerms: !!state.welcome?.agreedAgeConsentTerms,
        agreedPolicyTerms: !!state.welcome?.agreedPolicyTerms,
        agreedConsentTerms: !!state.welcome?.agreedConsentTerms,
        agreedAIConsentTerms: !!state.welcome?.agreedAIConsentTerms,
        agreedPrivacyTerms: !!state.welcome?.agreedPrivacyTerms,
        dateOfConsent: state.welcome?.dateOfConsent ?? '',
        recordings: [
          { data: b1 || '' },
          { data: b2 || '' },
          { data: b3 || '' },
        ],
      };

      // CHANGE: Validate all three recordings exist
      if (payload.recordings.some(r => !r.data)) {
        throw new Error('All three recordings are required.');
      }

      // Send to backend
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(`Server error (${response.status}): ${text || 'No body'}`);
      }

      console.log(response);
      const result = await response.json().catch(() => ({}));
      console.log('Response:', result);

      // if (p.nextStep) history.push(p.nextStep);
      // thank-you

      let redirectTo = '/thank-you'; // default

      if (result && typeof result.redirectPath === 'string' && result.redirectPath.length > 0) {
        // Backend told us exactly where to go
        redirectTo = result.redirectPath;
      } else if (p.nextStep) {
        // Fallback to wizard next step
        redirectTo = p.nextStep;
      }

      history.replace(redirectTo);
    } catch (e) {
      // CHANGE: No nested ternaries; eslint-friendly error handling
      let message = 'Failed to send data.';

      if (e instanceof Error && e.message) {
        message = e.message;
      } else if (typeof e === 'string') {
        message = e;
      } else {
        try {
          message = JSON.stringify(e);
        } catch {
          // keep default
        }
      }

      console.error('Error sending data:', e);
      setError(message || 'Failed to send data.');
    }
  }, [state, history, p.nextStep]);

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
    sendDataToBackend();
  }, [handleDoBack, setDoGoBack, setTitle, setType, sendDataToBackend]);

  return (
    <>
      <h1 style={{ marginTop: '50px', marginLeft: 'auto', marginRight: 'auto' }}>Sending...</h1>
      <ImageProcessing />
      {error && (
        <ErrorMessage
          errors={{ error }}
          name="error"
          render={() => (
            <TextErrorContainer>
              <ExclamationSVG />
              {error}
            </TextErrorContainer>
          )}
        />
      )}
    </>
  );
};

export default React.memo(Sending);
