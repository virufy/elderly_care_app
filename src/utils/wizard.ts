// TODO: Improve types
export function updateAction(storeKey: string): any {
  return (state: any, payload: any) => ({
    ...state,
    [storeKey]: {
      ...state[storeKey],
      ...payload,
    },
  });
}

export function resetStore(): any {
  return (state: any) => ({
    welcome: { language: state.welcome.language },
    'submit-steps': {
      ageGroup: '',
      biologicalSex: '',
      currentMedicalCondition: [],
      currentSymptoms: [],
      recordYourBreath: { recordingFile: null, uploadedFile: null },
      recordYourCough: { recordingFile: null, uploadedFile: null },
      symptomsStartedDate: '',
    },
  });
}
