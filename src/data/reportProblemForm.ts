export const reportProblemForm = {
  ja: 'https://forms.gle/q7p98qV5EBPM3s6M6',
};

declare global {
  type ReportProblemLanguage = keyof typeof reportProblemForm;
}
