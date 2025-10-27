const baseUrl = '/elderlycare/submit-steps';
const welcomeUrl = '/elderlycare/welcome';

const baseComponentPath = 'SubmitSteps';
const middleComponentPathRecording = 'RecordingsSteps';
const middleComponentPathQuestionary = 'Questionary';
const middleComponentPathSubmission = 'Submission';
const recordYourSpeechLogic = 'recordYourSpeech';

function getCoughSteps(storeKey: string): Wizard.Step[] {
  return [
    // Step 1 - Cough 1
    {
      path: '/step-record/cough1',
      componentPath: `${baseComponentPath}/${middleComponentPathRecording}/Introduction`,
      props: {
        storeKey,
        previousStep: `${welcomeUrl}`,
        nextStep: `${baseUrl}/step-listen/cough1`,
        otherSteps: {
          manualUploadStep: `${baseUrl}/step-manual-upload/cough1`,
          skipStep: `${baseUrl}/step-listen/cough1`,
        },
        metadata: {
          currentLogic: 'recordCough1',
        },
      },
    },
    {
      path: '/step-manual-upload/cough1',
      componentPath: `${baseComponentPath}/${middleComponentPathRecording}/RecordManualUpload`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/step-record/cough1`,
        nextStep: `${baseUrl}/step-listen/cough2`,
        metadata: {
          currentLogic: 'recordCough1',
        },
      },
    },

    {
      path: '/step-listen/cough1',
      componentPath: `${baseComponentPath}/${middleComponentPathRecording}/ListenAudio`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/step-record/cough1`,
        nextStep: `${baseUrl}/step-record/cough2`,
        metadata: {
          currentLogic: 'recordCough1',
        },
      },
    },

    // Step 2 - Cough 2
    {
      path: '/step-record/cough2',
      componentPath: `${baseComponentPath}/${middleComponentPathRecording}/Introduction`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/step-record/cough1`,
        nextStep: `${baseUrl}/step-listen/cough2`,
        otherSteps: {
          manualUploadStep: `${baseUrl}/step-manual-upload/cough2`,
          skipStep: `${baseUrl}/step-listen/cough2`,
        },
        metadata: {
          currentLogic: 'recordCough2',
        },
      },
    },
    {
      path: '/step-manual-upload/cough2',
      componentPath: `${baseComponentPath}/${middleComponentPathRecording}/RecordManualUpload`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/step-record/cough2`,
        nextStep: `${baseUrl}/step-listen/cough2`,
        metadata: {
          currentLogic: 'recordCough2',
        },
      },
    },
    {
      path: '/step-listen/cough2',
      componentPath: `${baseComponentPath}/${middleComponentPathRecording}/ListenAudio`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/step-record/cough2`,
        nextStep: `${baseUrl}/step-record/cough3`,
        metadata: {
          currentLogic: 'recordCough2',
        },
      },
    },

    // Step 3 - Cough 3
    {
      path: '/step-record/cough3',
      componentPath: `${baseComponentPath}/${middleComponentPathRecording}/Introduction`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/step-record/cough2`,
        nextStep: `${baseUrl}/step-listen/cough3`,
        otherSteps: {
          manualUploadStep: `${baseUrl}/step-manual-upload/cough3`,
          skipStep: `${baseUrl}/step-listen/cough3`,
        },
        metadata: {
          currentLogic: 'recordCough3',
        },
      },
    },
    {
      path: '/step-manual-upload/cough3',
      componentPath: `${baseComponentPath}/${middleComponentPathRecording}/RecordManualUpload`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/step-record/cough3`,
        // nextStep: `${baseUrl}/step-record/lung1`,
        // nextStep: `${baseUrl}/thank-you`,
        nextStep: `${baseUrl}/sending`,
        metadata: {
          currentLogic: 'recordCough3',
        },
      },
    },
    {
      path: '/step-listen/cough3',
      componentPath: `${baseComponentPath}/${middleComponentPathRecording}/ListenAudio`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/step-record/cough3`,
        // nextStep: `${baseUrl}/step-record/lung1`,
        // nextStep: `${baseUrl}/thank-you`,
        nextStep: `${baseUrl}/sending`,
        metadata: {
          currentLogic: 'recordCough3',
        },
      },
    },
  ];
}

/** Lung Steps * */

function getLungSteps(storeKey: string): Wizard.Step[] {
  return [
    {
      path: '/step-record/lung1',
      componentPath: `${baseComponentPath}/${middleComponentPathRecording}/Introduction`,
      props: {
        storeKey,
        previousStep: `${baseComponentPath}/${middleComponentPathRecording}/ListenAudio`,
        nextStep: `${baseUrl}/step-listen/lung1`,
        otherSteps: {
          manualUploadStep: `${baseUrl}/step-manual-upload/lung1`,
          skipStep: `${baseUrl}/step-listen/lung1`,
        },
        metadata: {
          currentLogic: 'recordLung1',
        },
      },
    },
    {
      path: '/step-listen/lung1',
      componentPath: `${baseComponentPath}/${middleComponentPathRecording}/ListenAudio`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/step-record/lung1`,
        nextStep: `${baseUrl}/step-record/lung2`,
        metadata: {
          currentLogic: 'recordLung1',
        },
      },
    },
    {
      path: '/step-record/lung2',
      componentPath: `${baseComponentPath}/${middleComponentPathRecording}/Introduction`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/step-listen/lung1`,
        nextStep: `${baseUrl}/step-listen/lung2`,
        otherSteps: {
          manualUploadStep: `${baseUrl}/step-manual-upload/lung2`,
          skipStep: `${baseUrl}/step-listen/lung2`,
        },
        metadata: {
          currentLogic: 'recordLung2',
        },
      },
    },
    {
      path: '/step-listen/lung2',
      componentPath: `${baseComponentPath}/${middleComponentPathRecording}/ListenAudio`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/step-record/lung2`,
        nextStep: `${baseUrl}/step-record/lung3`,
        metadata: {
          currentLogic: 'recordLung2',
        },
      },
    },
    {
      path: '/step-record/lung3',
      componentPath: `${baseComponentPath}/${middleComponentPathRecording}/Introduction`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/step-listen/lung2`,
        nextStep: `${baseUrl}/step-listen/lung3`,
        otherSteps: {
          manualUploadStep: `${baseUrl}/step-manual-upload/lung3`,
          skipStep: `${baseUrl}/step-listen/lung3`,
        },
        metadata: {
          currentLogic: 'recordLung3',
        },
      },
    },
    {
      path: '/step-listen/lung3',
      componentPath: `${baseComponentPath}/${middleComponentPathRecording}/ListenAudio`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/step-record/lung3`,
        nextStep: `${baseUrl}/questionary/step1`,
        metadata: {
          currentLogic: 'recordLung3',
        },
      },
    },
  ];
}

function getSpeechSteps(storeKey: string) {
  return [
    {
      path: '/step-record/speech',
      componentPath: `${baseComponentPath}/${middleComponentPathRecording}/Introduction`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/step-listen/breath`,
        nextStep: `${baseUrl}/step-listen/speech`,
        otherSteps: {
          manualUploadStep: `${baseUrl}/step-manual-upload/speech`,
        },
        metadata: {
          currentLogic: recordYourSpeechLogic,
        },
      },
    },
    {
      path: '/step-manual-upload/speech',
      componentPath: `${baseComponentPath}/${middleComponentPathRecording}/RecordManualUpload`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/step-record/speech`,
        nextStep: `${baseUrl}/step-listen/speech`,
        metadata: {
          currentLogic: recordYourSpeechLogic,
        },
      },
    },
    {
      path: '/step-listen/speech',
      componentPath: `${baseComponentPath}/${middleComponentPathRecording}/ListenAudio`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/step-record/speech`,
        nextStep: `${baseUrl}/questionary/step3`,
        metadata: {
          currentLogic: recordYourSpeechLogic,
        },
      },
    },
  ];
}

function getQuestionarySteps(storeKey: string): Wizard.Step[] {
  const baseMetadata = {
    total: 3,
    progressCurrent: 3,
    progressTotal: 3,
  };
  return [
    {
      path: '/questionary/step1',
      componentPath: `${baseComponentPath}/${middleComponentPathQuestionary}/Step1`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/step-listen/cough`,
        nextStep: `${baseUrl}/questionary/step2`,
        metadata: {
          current: 1,
          ...baseMetadata,
        },
      },
    },
    {
      path: '/questionary/step2',
      componentPath: `${baseComponentPath}/${middleComponentPathQuestionary}/Step2`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/questionary/step1`,
        nextStep: `${baseUrl}/questionary/step3`,
        metadata: {
          current: 2,
          ...baseMetadata,
        },
      },
    },
    {
      path: '/questionary/step3',
      componentPath: `${baseComponentPath}/${middleComponentPathQuestionary}/Step3`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/questionary/step2`,
        nextStep: `${baseUrl}/sending`,
        metadata: {
          current: 3,
          ...baseMetadata,
        },
      },
    },
    {
      path: '/questionary/step4',
      componentPath: `${baseComponentPath}/${middleComponentPathQuestionary}/Step4`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/questionary/step3`,
        nextStep: `${baseUrl}/sending`,
        metadata: {
          ...baseMetadata,
        },
      },
    },
  ];
}

/** Welcome Steps */

export function getWelcomeStepsWithoutDots(storeKey: string): Wizard.Step[] {
  return [
    {
      path: '',
      componentPath: 'Welcome/Step1',
      props: {
        storeKey,
        nextStep: `${welcomeUrl}/step-4`,
        // nextStep: `${baseUrl}/step-record/cough`,
      },
    },
    {
      path: '/step-3',
      componentPath: 'Welcome/Step3',
      props: {
        storeKey,
        previousStep: `${welcomeUrl}`,
        nextStep: `${welcomeUrl}/step-4`,
      },
    },
  ];
}

export function welcomeStepsDefinitions(storeKey: string): Wizard.Step[] {
  return [
    {
      path: '/step-4',
      componentPath: 'Welcome/Step4',
      props: {
        storeKey,
        previousStep: `${welcomeUrl}`,
        // nextStep: `${baseUrl}/questionary/step1`,
        nextStep: `${baseUrl}/step-record/cough1`,
      },
    },
    {
      path: '/step-5',
      componentPath: 'Welcome/Step5',
      props: {
        storeKey,
        previousStep: `${baseUrl}/questionary/step6`,
        nextStep: '/elderlycare/submit-steps/step-record/cough',
      },
    },
  ];
}

export default function stepsDefinition(storeKey: string) {
  const steps: Wizard.Step[] = [
    // Record Your Cough Steps
    ...getCoughSteps(storeKey),
    // Record Your Breath Steps
    ...getLungSteps(storeKey),
    // Record Your Speech Steps
    ...getSpeechSteps(storeKey),
    // Questionary
    ...getQuestionarySteps(storeKey),
    {
      path: '/sending',
      componentPath: `${baseComponentPath}/${middleComponentPathSubmission}/Sending`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/questionary/step3`,
        nextStep: `${baseUrl}/thank-you`,
      },
    },
    {
      path: '/thank-you',
      componentPath: `${baseComponentPath}/${middleComponentPathSubmission}/ThankYou`,
      props: {
        storeKey,
        previousStep: `${welcomeUrl}`,
        nextStep: `${baseUrl}/step-record/cough`,
      },
    },
  ];

  return steps;
}
