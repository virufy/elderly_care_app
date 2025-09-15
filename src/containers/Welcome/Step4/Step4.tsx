import React, { useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import usePortal from 'react-useportal';
import { isMobile } from 'react-device-detect';

// Form
import { useForm, Controller } from 'react-hook-form';
import { useStateMachine } from 'little-state-machine';
import { yupResolver } from '@hookform/resolvers';
import { ErrorMessage } from '@hookform/error-message';
import * as Yup from 'yup';

// Components
import WizardButtons from 'components/WizardButtons';
// import Link from 'components/Link';
import Checkbox from 'components/Checkbox';
import { BlackText } from 'components/Texts';

// Update Action
import { updateAction } from 'utils/wizard';

// Header Control
import useHeaderContext from 'hooks/useHeaderContext';

// Hooks
import useEmbeddedFile from 'hooks/useEmbeddedFile';

// Utils
import { buildConsentFilePath } from 'helper/consentPathHelper';
import { scrollToTop } from 'helper/scrollHelper';
import { currentCountry } from 'utils/currentCountry';
import DatePicker from 'components/DatePicker';

// Data
import { consentPdf } from 'data/consentPdf';

// Styles
import {
  ContainerShapeDown,
  InnerContainerShapeDown,
  WelcomeContent,
  WelcomeStyledFormAlternative,
  WelcomeConsentForm,
  CheckboxTitle,
  BoldBlackText,
} from '../style';

const schema = Yup.object().shape({
  agreedAgeConsentTerms: Yup.boolean().required().default(false).oneOf([true]),
  agreedPolicyTerms: Yup.boolean().required().default(false).oneOf([true]),
  agreedConsentTerms: Yup.boolean().required().default(false).oneOf([true]),
  agreedAIConsentTerms: Yup.boolean().required().default(false).oneOf([true]),
  agreedPrivacyTerms: Yup.boolean().required().default(false).oneOf([true]),
  dateOfConsent: Yup.date().nullable().required(),
  // participantId: Yup.string().required('Participant ID is required'),

});

type Step3Type = Yup.InferType<typeof schema>;

const Step4 = (p: Wizard.StepProps) => {
  const { Portal } = usePortal({
    bindTo: document && document.getElementById('wizard-buttons') as HTMLDivElement,
  });
  const [activeStep, setActiveStep] = React.useState(true);
  const { setType, setDoGoBack, setSubtitle } = useHeaderContext();

  const { state, action } = useStateMachine(updateAction(p.storeKey));

  const store = state?.[p.storeKey];

  const {
    control, handleSubmit, formState,
  } = useForm({
    defaultValues: store,
    resolver: yupResolver(schema),
    context: {
      country: currentCountry,
    },
    mode: 'onChange',
  });
  const { errors, isValid } = formState;
  const history = useHistory();
  const { isLoadingFile, file: consentFormContent } = useEmbeddedFile(
    buildConsentFilePath(currentCountry, state.welcome.language),
  );

  const onSubmit = async (values: Step3Type) => {
    if (values) {
      action(values);
      if (p.nextStep) {
        setActiveStep(false);
        history.push(p.nextStep);
      }
    }
  };

  const doBack = useCallback(() => {
    if (p.previousStep) {
      setActiveStep(false);
      history.push(p.previousStep);
    } else {
      history.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { t } = useTranslation();

  useEffect(() => {
    scrollToTop();
    setDoGoBack(() => doBack);
    setType('secondary');
    setSubtitle(t('consent:title'));
  }, [doBack, setDoGoBack, setType, setSubtitle, t]);

  return (
    <WelcomeStyledFormAlternative>
      <ContainerShapeDown isMobile={isMobile}>
        <InnerContainerShapeDown>
          <BlackText>
            <Trans i18nKey="consent:paragraph01">
              Virufy cares about your privacy and
              is advised by licensed data privacy experts.
              The information and recordings you provide
              will only be used for the purposes described
              in our
            </Trans>
            <a href={consentPdf[currentCountry]} target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
            <Trans i18nKey="consent:paragraph02">
              and Consent Form.
              Please read the Consent Form:
            </Trans>
          </BlackText>

        </InnerContainerShapeDown>
      </ContainerShapeDown>
      <WelcomeContent>
        <WelcomeConsentForm dangerouslySetInnerHTML={{ __html: isLoadingFile ? 'Loading...' : consentFormContent }} />

        <BlackText>
          <Trans i18nKey="consent:paragraph3">
            By checking the below boxes, you acknowledge
            that you have read and understood the Virufy
            privacy policy, and that you are providing your
            explicit consent to Virufy’s collection and
            processing of the categories of biometric and
            health information enumerated below.
          </Trans>
        </BlackText>
        {/* <Link to={consentPdf[currentCountry]} target="_blank">Consent Form</Link> */}

        <CheckboxTitle>
          {t('consent:pleaseConfirm', 'Please confirm the following:')}
        </CheckboxTitle>

        <Controller
          control={control}
          name="agreedAgeConsentTerms"
          defaultValue={false}
          render={({ onChange, value }) => (
            <Checkbox
              id="Step2-AgeConsentTerms"
              label={(
                <Trans i18nKey="consent:certify">
                  I certify that I am at least 18 years old
                  and agree to the terms of the Consent Form.
                </Trans>
              )}
              name="agreedAgeConsentTerms"
              onChange={e => onChange(e.target.checked)}
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="agreedPolicyTerms"
          defaultValue={false}
          render={({ onChange, value }) => (
            <Checkbox
              id="Step2-PolicyTerms"
              label={(
                <>
                  <Trans i18nKey="consent:agree">
                    I agree to the terms of the Virufy
                  </Trans>
                  <a href={consentPdf[currentCountry]} target="_blank" rel="noopener noreferrer">
                    Privacy Policy.
                  </a>
                </>

              )}
              name="agreedPolicyTerms"
              onChange={e => onChange(e.target.checked)}
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="agreedConsentTerms"
          defaultValue={false}
          render={({ onChange, value }) => (
            <Checkbox
              id="Step2-ConsentTerms"
              label={(
                <Trans i18nKey="consent:agreeConsent">
                  I hereby acknowledge and agree that processing
                  shall be done for the purposes indicated above and,
                  in particular but without limitation, for research
                  and compiling a dataset needed for the development
                  of artificial intelligence algorithms for device-based
                  COPD detection.
                </Trans>
              )}
              name="agreedConsentTerms"
              onChange={e => onChange(e.target.checked)}
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="agreedAIConsentTerms"
          defaultValue={false}
          render={({ onChange, value }) => (
            <Checkbox
              id="Step2-AIConsentTerms"
              label={(
                <Trans i18nKey="consent:agreeAIConsent">
                  I hereby acknowledge and agree that processing
                  shall be done for the purposes indicated above and,
                  in particular but without limitation, for training
                  artificial intelligence algorithms to analyze cough
                  audio recordings to better determine signs of COPD
                </Trans>
              )}
              name="agreedAIConsentTerms"
              onChange={e => onChange(e.target.checked)}
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="agreedPrivacyTerms"
          defaultValue={false}
          render={({ onChange, value }) => (
            <Checkbox
              id="Step2-PrivacyTerms"
              label={(
                <Trans i18nKey="consent:agreePrivacy">
                  I hereby expressly consent to the collection
                  and processing of my personal information,
                  biometric information, and health information.
                </Trans>
              )}
              name="agreedPrivacyTerms"
              onChange={e => onChange(e.target.checked)}
              value={value}
            />
          )}
        />

        {/* <Controller
          control={control}
          name="dateOfConsent"
          defaultValue={null}
          render={({ onChange, value }) => (
            <DatePicker
              label="Date of Consent"
              value={value}
              locale="en"
              onChange={date => onChange(date as Date)}
            />
          )}
        /> */}

        <BoldBlackText>
          Date of Consent
        </BoldBlackText>
        {/* Facility Dropdown */}
        <Controller
          control={control}
          name="dateOfConsent"
          defaultValue=""
          render={({ onChange, value }) => (
            <DatePicker
              value={value}
              locale="en"
              onChange={date => onChange(date as Date)}
            />
          )}
        />

        <p><ErrorMessage errors={errors} name="name" /></p>
        {activeStep && (
          <Portal>
            <WizardButtons
              invert
              leftLabel={t('consent:cooperateButton')}
              leftHandler={handleSubmit(onSubmit)}
              leftDisabled={!isValid}
            />
          </Portal>
        )}
      </WelcomeContent>
    </WelcomeStyledFormAlternative>
  );
};

export default React.memo(Step4);
