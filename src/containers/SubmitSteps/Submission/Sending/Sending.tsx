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

import { ImageProcessing, TextErrorContainer} from '../style';

interface StructuredData {
  patientId: string;
  location: string;
  facility: string;
  ageGroup: string;
  biologicalSex: string;
  currentSymptoms: string[];
  currentMedicalCondition: string[];
}

const apiUrl = process.env.REACT_APP_API_URL!;

// Helper function to convert file to Base64
const toBase64 = (file: Blob): Promise<string> => 
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);  // Get the Base64 part only
    reader.onerror = (error) => reject(error);
});

const Sending = (p: Wizard.StepProps) => { 
  const [, setActiveStep] = useState(true);
  const { setDoGoBack, setTitle, setType } = useHeaderContext();
  const { state } = useStateMachine();
  const history = useHistory();
  const [error, setError] = React.useState<string | null>(null);

  const sendDataToBackend = useCallback(async (): Promise<void> => {
    try {
      const structuredData: StructuredData = {
        patientId: state['welcome']?.patientId,
        location: state['welcome']?.location,
        facility: state['welcome']?.facility,
        ageGroup: state['submit-steps']?.ageGroup,
        biologicalSex: state['submit-steps']?.biologicalSex,
        currentSymptoms: state['submit-steps']?.currentSymptoms,
        currentMedicalCondition: state['submit-steps']?.currentMedicalCondition,
      };
    
      // Retrieve files from the state (either recorded or uploaded)
      const coughFile = state['submit-steps']?.recordYourCough?.recordingFile || state['submit-steps']?.recordYourCough?.uploadedFile;
      // const breathFile = state['submit-steps']?.recordYourBreath?.recordingFile || state['submit-steps']?.recordYourBreath?.uploadedFile;
      
      if ((coughFile instanceof Blob)) {
        const coughBase64 = await toBase64(coughFile);
        console.log(JSON.stringify({
          structuredData: structuredData,
          coughFile: coughBase64,
        }));
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            structuredData: structuredData,
            coughFile: coughBase64,
          }),
        });

        const result = await response.json();
        console.log('Response:', result);
        if (p.nextStep)
          history.push(p.nextStep)
      } else {
        console.error('Files not found.');
      }
    } catch {
      console.error('Error sending data: Failed to send data.');
      setError('Failed to send data.');
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

  const mocksendDataToBackend = useCallback(() => {
    console.log('MOCK: sending to backend');
    console.log('State Info:', state);
    setTimeout(() => {
      if (p.nextStep) {
        history.push(p.nextStep);
      }
    }, 2000);
  }, [state, history, p.nextStep]);

  useEffect(() => {
    scrollToTop();
    setTitle('');
    setType('tertiary');
    setDoGoBack(null);
    sendDataToBackend(); 
    // mocksendDataToBackend();
  }, [handleDoBack, setDoGoBack, setTitle, setType, sendDataToBackend, mocksendDataToBackend]);

  return (
    <>
      <h1 style={{ marginTop: '50px', marginLeft:'auto', marginRight:'auto'}}>送信中...</h1>
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
