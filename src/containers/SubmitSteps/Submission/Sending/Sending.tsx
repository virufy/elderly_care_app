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

import { getAudioBase64, setAudioBase64 } from 'helper/audioCache';
import { ImageProcessing, TextErrorContainer } from '../style';

// const apiUrl = process.env.REACT_APP_API_URL!;
const apiUrl = 'https://palcg6uyya.execute-api.us-east-1.amazonaws.com/dev/submit';

const toBase64 = (file: Blob): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = reject;
  reader.onload = () => {
    const s = String(reader.result || '');
    const base64 = s.includes(',') ? s.split(',')[1] : s;
    resolve(base64 || '');
  };
  reader.readAsDataURL(file);
});

type StepBucket = 'recordCough1' | 'recordCough2' | 'recordCough3';

const getOrBuildBase64 = async (bucket: StepBucket, submitSteps: any): Promise<string> => {
  const fromCache = getAudioBase64(bucket);
  if (fromCache) return fromCache;

  const entry = submitSteps?.[bucket] ?? {};

  if (typeof entry.base64 === 'string' && entry.base64) {
    setAudioBase64(bucket, entry.base64);
    return entry.base64;
  }

  const file: File | null = entry.recordingFile || entry.uploadedFile || null;
  if (file) {
    const base64 = await toBase64(file);
    if (base64) {
      setAudioBase64(bucket, base64);
      return base64;
    }
  }

  return '';
};

const Sending = (p: Wizard.StepProps) => {
  const [, setActiveStep] = useState(true);
  const { setDoGoBack, setTitle, setType } = useHeaderContext();
  const { state } = useStateMachine();
  const history = useHistory();
  const [error, setError] = React.useState<string | null>(null);

  const sendDataToBackend = useCallback(async (): Promise<void> => {
    try {
      const submitSteps = state['submit-steps'] || {};

      // ✅ IMPORTANT: await the async function, or use Promise.all
      const [b1, b2, b3] = await Promise.all([
        getOrBuildBase64('recordCough1', submitSteps),
        getOrBuildBase64('recordCough2', submitSteps),
        getOrBuildBase64('recordCough3', submitSteps),
      ]);

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

      // Only error if we REALLY have missing audio
      if (payload.recordings.some(r => !r.data)) {
        throw new Error('All three recordings are required.');
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(`Server error (${response.status}): ${text || 'No body'}`);
      }

      const result = await response.json().catch(() => ({}));

      let redirectTo = '/thank-you';

      if (result && typeof result.redirectPath === 'string' && result.redirectPath.length > 0) {
        redirectTo = result.redirectPath;
      } else if (p.nextStep) {
        redirectTo = p.nextStep;
      }

      history.replace(redirectTo);
    } catch (e) {
      let message = 'Failed to send data.';

      if (e instanceof Error && e.message) {
        message = e.message;
      } else if (typeof e === 'string') {
        message = e;
      } else {
        try {
          message = JSON.stringify(e);
        } catch {
          // ignore
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
