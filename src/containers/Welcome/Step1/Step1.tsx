import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useStateMachine } from 'little-state-machine';
import usePortal from 'react-useportal';

// Form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import * as Yup from 'yup';

// Icons
import HeaderSplash from 'assets/images/baseLogoSplash.png';
import { ReactComponent as ExclamationSVG } from 'assets/icons/exclamationCircle.svg';

// Update Action
import { updateAction, resetStore } from 'utils/wizard';

// Header Control
import useHeaderContext from 'hooks/useHeaderContext';

// Helper
import { scrollToTop } from 'helper/scrollHelper';

// Styles
import WizardButtons from 'components/WizardButtons';
import {
  WelcomeContent, WelcomeStyledForm, QuestionInput,
  WelcomeItemListItem, WelcomeItemList,
  BoldBlackText, WelcomeSelect, TextErrorContainer,
  HeaderImageContainer,
  HeaderImage,
  LogoWhiteBG,
} from '../style';

const facilityList = ['Fukuoka Sun Smile Tohara', 'Fukuoka Fujinomi Association', 'Fukui Laugh Day', 'Fukuoka City Hall', 'others'];

const facilityOptions = facilityList.map(facility => ({ label: facility, value: facility }));

const schema = Yup.object().shape({
  patientId: Yup.number().typeError('Patient ID must be a number').required('Patient ID is required'),
  facility: Yup.string().required('Facility is required'),
  location: Yup.string().default(''),
}).defined();

type Step1Type = Yup.InferType<typeof schema>;

const Step1 = (p: Wizard.StepProps) => {
  const [activeStep, setActiveStep] = React.useState(true);
  const { Portal } = usePortal({ bindTo: document && document.getElementById('wizard-buttons') as HTMLDivElement });
  const { setType, setDoGoBack, setLogoSize } = useHeaderContext();
  const resetExecuted = React.useRef(false);

  const { state, actions } = useStateMachine({ update: updateAction(p.storeKey), reset: resetStore() });
  const store = state?.[p.storeKey];

  const {
    control, formState, handleSubmit, reset,
  } = useForm({
    defaultValues: store,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const history = useHistory();
  const { isValid, errors } = formState;

  useEffect(() => {
    actions.reset({
      [p.storeKey]: {
        patientId: '',
        facility: '',
        location: '',
      },
    });
    // do one-time init here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (resetExecuted.current) {
      resetExecuted.current = false;
      reset(store);
    }
  }, [store, reset]);

  const onSubmit = async (values: Step1Type) => {
    if (values) {
      actions.update(values);
      if (p.nextStep) {
        setActiveStep(false);
        history.push(p.nextStep);
      }
    }
  };

  useEffect(() => {
    scrollToTop();
    // Hide back arrow in header if neccesary
    setDoGoBack(null);
    setType('tertiary');
    setLogoSize('big');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <WelcomeStyledForm>
        <HeaderImageContainer>
          <HeaderImage
            src={HeaderSplash}
          />
          <LogoWhiteBG />
        </HeaderImageContainer>
        <WelcomeContent mt={4}>

          <BoldBlackText>
            Participant ID
          </BoldBlackText>
          {/* Patient ID */}
          <Controller
            control={control}
            name="patientId"
            defaultValue=""
            render={({ onChange, value }) => (
              <QuestionInput
                type="number"
                placeholder="Please enter your participant ID"
                className="question-input"
                value={value || ''}
                onChange={e => onChange(e.target.value)}
                autoComplete="off"
              />
            )}
          />
          {errors.patientId && (
            <TextErrorContainer>
              <ExclamationSVG />
              {errors.patientId.message}
            </TextErrorContainer>
          )}

          <BoldBlackText>
            Facility
          </BoldBlackText>
          {/* Facility Dropdown */}
          <Controller
            control={control}
            name="facility"
            defaultValue="" // {facilityOptions[0].value}
            render={({ onChange, value: valueController }) => (
              <WelcomeSelect
                placeholder="Please select a facility"
                options={facilityOptions}
                onChange={(e: any) => { onChange(e?.value); }}
                value={facilityOptions.find(option => option.value === valueController)}
                className="custom-select"
                classNamePrefix="custom-select"
              />
            )}
          />
          {errors.facility && (
            <TextErrorContainer>
              <ExclamationSVG />
              {errors.facility.message}
            </TextErrorContainer>
          )}

          <BoldBlackText>To ensure your safety, we recommend the following:</BoldBlackText>
          <WelcomeItemList>
            <WelcomeItemListItem>If you have any underlying medical conditions
              that increase your risk of coughing,
              check with your healthcare provider before participating.
            </WelcomeItemListItem>
            <WelcomeItemListItem>If you feel that your symptoms are getting worse,
              please consult your local medical institution.
            </WelcomeItemListItem>
            <WelcomeItemListItem>Please confirm that you agree to participate
              in the demonstration experiment.
            </WelcomeItemListItem>
          </WelcomeItemList>

          {
            activeStep && (
              <Portal>
                <WizardButtons
                  invert
                  leftLabel="Next"
                  leftHandler={handleSubmit(onSubmit)}
                  leftDisabled={!isValid}
                />
              </Portal>
            )
          }
        </WelcomeContent>
        {/* <FooterInstallAsApp /> */}

      </WelcomeStyledForm>
    </>
  );
};

export default React.memo(Step1);
