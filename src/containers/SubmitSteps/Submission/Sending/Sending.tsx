import React, { useEffect, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';

// Helper
import { scrollToTop } from 'helper/scrollHelper';

// Hooks
import useHeaderContext from 'hooks/useHeaderContext';

import { ImageProcessing } from '../style';

const Sending = (p: Wizard.StepProps) => { 
  const [, setActiveStep] = useState(true);
  const { setDoGoBack, setTitle, setType } = useHeaderContext();
  const history = useHistory();

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
    
    // Automatically go to the next page after 3 seconds --> replace with sending JSON to backend and waiting for response.
    const timer = setTimeout(() => {
      if (p.nextStep) {
        history.push(p.nextStep);
      }
    }, 3000);

    // Cleanup the timer if the component is unmounted
    return () => clearTimeout(timer);
  }, [handleDoBack, setDoGoBack, setTitle, setType, p.nextStep, history]);

  return (
    <>
      <h1 style={{ marginTop: '50px' }}>送信中...</h1>
      <ImageProcessing />
    </>
  );
};

export default React.memo(Sending);
