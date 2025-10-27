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

interface StructuredData {
  patientId: string;
  facility: string;
  agreedAgeConsentTerms: boolean;
  agreedPolicyTerms: boolean;
  agreedConsentTerms: boolean;
  agreedAIConsentTerms: boolean;
  agreedPrivacyTerms: boolean;
  dateOfConsent: string;
}

// const apiUrl = process.env.REACT_APP_API_URL!;

const Sending = (p: Wizard.StepProps) => {
  const [, setActiveStep] = useState(true);
  const { setDoGoBack, setTitle, setType } = useHeaderContext();
  const { state } = useStateMachine();
  const history = useHistory();
  const [error, setError] = React.useState<string | null>(null);

  // Resolves a recording from File/Blob/plain object, or from a blob: URL
  const getFileFromNode = async (node: any, fallbackName: string): Promise<File | null> => {
    if (!node) return null;

    const raw = node?.recordingFile || node?.uploadedFile;

    // If it's already a File
    if (raw instanceof File) return raw;

    // If it's a Blob, wrap it as a File
    if (raw instanceof Blob) {
      const type = raw.type || 'audio/wav';
      return new File([raw], fallbackName, { type });
    }

    // Some recorders store { blob, type, name }
    if (raw?.blob instanceof Blob) {
      const type = raw.type || raw.blob.type || 'audio/wav';
      const name = raw.name || fallbackName;
      return new File([raw.blob], name, { type });
    }

    // If we only have a blob: URL, fetch it and wrap as File
    const url: unknown = node?.recordingUrl;
    if (typeof url === 'string' && url.startsWith('blob:')) {
      const blob = await fetch(url).then(r => r.blob());
      const type = blob.type || 'audio/wav';
      return new File([blob], fallbackName, { type });
    }

    return null;
  };

  const sendDataToBackend = useCallback(async (): Promise<void> => {
    try {
      setError(null);

      const structuredData: StructuredData = {
        patientId: state.welcome?.patientId ?? '',
        facility: state.welcome?.facility ?? '',
        agreedAgeConsentTerms: !!state.welcome?.agreedAgeConsentTerms,
        agreedPolicyTerms: !!state.welcome?.agreedPolicyTerms,
        agreedConsentTerms: !!state.welcome?.agreedConsentTerms,
        agreedAIConsentTerms: !!state.welcome?.agreedAIConsentTerms,
        agreedPrivacyTerms: !!state.welcome?.agreedPrivacyTerms,
        dateOfConsent: state.welcome?.dateOfConsent ?? '',
      };

      // Grab the three cough files (raw .wav) — now using the async helper
      const cough1 = await getFileFromNode(state['submit-steps']?.recordCough1, 'cough1.wav');
      const cough2 = await getFileFromNode(state['submit-steps']?.recordCough2, 'cough2.wav');
      const cough3 = await getFileFromNode(state['submit-steps']?.recordCough3, 'cough3.wav');

      // Optional: basic validation
      if (!(cough1 instanceof File) || !(cough2 instanceof File) || !(cough3 instanceof File)) {
        setError('Missing one or more cough recordings.');
        return;
      }

      console.log(state);

      const form = new FormData();
      // Attach metadata as JSON part
      form.append(
        'metadata',
        new Blob([JSON.stringify(structuredData)], { type: 'application/json' }),
        'metadata.json',
      );
      // Attach audio files as-is (no conversion)
      form.append('recording1', cough1, cough1.name || 'cough1.wav');
      form.append('recording2', cough2, cough2.name || 'cough2.wav');
      form.append('recording3', cough3, cough3.name || 'cough3.wav');

      const response = await fetch('https://palcg6uyya.execute-api.us-east-1.amazonaws.com/dev/submit', {
        method: 'POST',
        body: form,
      });

      console.log(form);
      console.log(response);
      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(text || `Request failed with status ${response.status}`);
      }

      const result = await response.json().catch(() => ({}));
      console.log('Response:', result);

      if (p.nextStep) history.push(p.nextStep);
    } catch (e) {
      console.error('Error sending data:', e);
      const msg = e instanceof Error ? e.message : String(e ?? 'Failed to send data.');
      setError(msg);
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
