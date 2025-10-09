import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import usePortal from 'react-useportal';
import { useTranslation } from 'react-i18next';

// Form
import { useForm, Controller } from 'react-hook-form';
import { useStateMachine } from 'little-state-machine';
import { yupResolver } from '@hookform/resolvers';
import { ErrorMessage } from '@hookform/error-message';
import * as Yup from 'yup';

// Update Action
import { updateAction } from 'utils/wizard';

// Header Control
import useHeaderContext from 'hooks/useHeaderContext';

// Utils
import { scrollToTop } from 'helper/scrollHelper';

// Components
import ProgressIndicator from 'components/ProgressIndicator';
import WizardButtons from 'components/WizardButtons';
import OptionList from 'components/OptionList';

// Icons
import { ReactComponent as ExclamationSVG } from 'assets/icons/exclamationCircle.svg';

// Styles
import { TextErrorContainer } from 'containers/Welcome/style';
import {
  QuestionText, MainContainer, QuestionInput, QuestionNote,
} from '../style';

const schema = Yup.object({
  biologicalSex: Yup.string().required('biologicalSexRequired'),
  educationLevel: Yup.string().required('educationLevel'),
  ethnicity: Yup.string().required('ethnicity'),
  smoked: Yup.string().required('smoked'),
  smokeHistory: Yup.string().required('smokeHistory'),
  race: Yup.array().of(Yup.string()),
  dementia: Yup.string().required('dementia'),
  primaryDisgnosis: Yup.string().required('primaryDisgnosis'),
  hospitalized: Yup.string().required('hospitalized'),
  emergency: Yup.string().required('emergency'),
  primaryCare: Yup.string().required('primaryCare'),
  ageGroup: Yup.string().required('ageGroupRequired').test('age-invalid', '', value => {
    let result = true;
    if (value && !value.match(/^[0-9]+$/)) {
      result = false;
    }
    return result;
  }),
  yearOfBirth: Yup.string().required('yearOfBirthrequired').test('yob-invalid', '', value => {
    let result = true;
    if (value && !value.match(/^[0-9]+$/)) {
      result = false;
    }
    return result;
  }),
  cigCount: Yup.string().required('cigCount').test('cc-invalid', '', value => {
    let result = true;
    if (value && !value.match(/^[0-9]+$/)) {
      result = false;
    }
    return result;
  }),
  cigYear: Yup.string().required('cigYear').test('cy-invalid', '', value => {
    let result = true;
    if (value && !value.match(/^[0-9]+$/)) {
      result = false;
    }
    return result;
  }),
  pastCig: Yup.string().required('pastCig').test('pcc-invalid', '', value => {
    let result = true;
    if (value && !value.match(/^[0-9]+$/)) {
      result = false;
    }
    return result;
  }),
  dementiaYear: Yup.string().required('dementiaYear').test('dy-invalid', '', value => {
    let result = true;
    if (value && !value.match(/^[0-9]+$/)) {
      result = false;
    }
    return result;
  }),

  oxygenSaturation: Yup.string().required('oxygenSaturation').test('os-invalid', '', value => {
    let result = true;
    if (value && !value.match(/^[0-9]+$/)) {
      result = false;
    }
    return result;
  }),
  heartRate: Yup.string().required('heartRate').test('hr-invalid', '', value => {
    let result = true;
    if (value && !value.match(/^[0-9]+$/)) {
      result = false;
    }
    return result;
  }),
  respiratoryRate: Yup.string().required('respiratoryRate').test('rrr-invalid', '', value => {
    let result = true;
    if (value && !value.match(/^[0-9]+$/)) {
      result = false;
    }
    return result;
  }),

}).defined();

type Step1Type = Yup.InferType<typeof schema>;

const Step1 = ({
  previousStep,
  nextStep,
  storeKey,
  metadata,
}: Wizard.StepProps) => {
  // Hooks
  const { Portal } = usePortal({
    bindTo: document && document.getElementById('wizard-buttons') as HTMLDivElement,
  });
  const {
    setDoGoBack, setTitle, setType, setSubtitle,
  } = useHeaderContext();
  const history = useHistory();
  const { t } = useTranslation();
  const { state, action } = useStateMachine(updateAction(storeKey));

  // States
  const [activeStep, setActiveStep] = React.useState(true);

  // Form
  const {
    control, handleSubmit, formState,
  } = useForm({
    mode: 'onChange',
    defaultValues: state?.[storeKey],
    resolver: yupResolver(schema),
  });
  const { errors } = formState;

  const handleDoBack = React.useCallback(() => {
    setActiveStep(false);
    if (previousStep) {
      history.push(previousStep);
    } else {
      history.goBack();
    }
  }, [history, previousStep]);

  const {
    isValid,
  } = formState;

  useEffect(() => {
    scrollToTop();
    setTitle('Information');
    setSubtitle(t(''));
    setType('primary');
    setDoGoBack(() => handleDoBack);
  }, [handleDoBack, setDoGoBack, setTitle, setType, setSubtitle, metadata, t]);

  // Handlers
  const onSubmit = async (values: Step1Type) => {
    if (values) {
      action(values);

      const {
        selectedRate,
      } = (values as any);

      action(values);

      const covidSymptoms = ['americanIndianAlaskaNative', 'asian', 'blackOrAfrican',
        'nativeHawaiianOrPacific', 'white', 'multiRacial', 'other'];

      let output = false;
      // eslint-disable-next-line no-plusplus
      for (let index = 0; !output && index < selectedRate?.length; index++) {
        output = covidSymptoms.includes(selectedRate[index]);
      }

      if (nextStep) {
        setActiveStep(false);
        history.push(nextStep);
        console.log(state);
      }
    }
  };

  return (
    <MainContainer>
      <ProgressIndicator
        currentStep={metadata?.current}
        totalSteps={metadata?.total}
        progressBar
      />
      <QuestionText first hasNote>
        {t('questionary:biologicalSex.question')}
      </QuestionText>
      <QuestionNote>{t('questionary:biologicalSex.note')}</QuestionNote>
      <Controller
        control={control}
        name="biologicalSex"
        defaultValue=""
        render={({ onChange, value }) => (
          <OptionList
            singleSelection
            value={{ selected: value ? [value] : [] }}
            onChange={v => onChange(v.selected[0])}
            items={[
              {
                value: 'female',
                label: t('questionary:biologicalSex.options.female'),
              },
              {
                value: 'male',
                label: t('questionary:biologicalSex.options.male'),
              },

              {
                value: 'other',
                label: t('questionary:biologicalSex.options.other'),
              },
            ]}
          />
        )}
      />
      {/* Bottom Buttons */}
      <ErrorMessage
        errors={errors}
        name="biologicalSex"
        render={({ message }) => (
          <TextErrorContainer>
            <ExclamationSVG />
            {t(`main:${message}`, 'Please select an option')}
          </TextErrorContainer>
        )}
      />

      <QuestionText extraSpace>{t('questionary:ageGroup')}</QuestionText>

      <Controller
        control={control}
        name="ageGroup"
        defaultValue=""
        render={({ onChange, value, name }) => (
          <QuestionInput
            name={name}
            value={value}
            onChange={onChange}
            type="number"
            placeholder="Please enter your age"
            autoComplete="Off"
          />
        )}
      />
      {/* Bottom Buttons */}
      <ErrorMessage
        errors={errors}
        name="ageGroup"
        render={({ message }) => (
          <TextErrorContainer>
            <ExclamationSVG />
            {t(`main:${message}`, 'Please enter your age')}
          </TextErrorContainer>
        )}
      />

      {/* year of birth */}

      <QuestionText extraSpace>{t('questionary:yearOfBirth')}</QuestionText>

      <Controller
        control={control}
        name="yearOfBirth"
        defaultValue=""
        render={({ onChange, value, name }) => (
          <QuestionInput
            name={name}
            value={value}
            onChange={onChange}
            type="number"
            placeholder="Please enter your year of birth"
            autoComplete="Off"
          />
        )}
      />
      {/* Bottom Buttons */}
      <ErrorMessage
        errors={errors}
        name="yearOfBirth"
        render={({ message }) => (
          <TextErrorContainer>
            <ExclamationSVG />
            {t(`main:${message}`, 'Please enter your year of birth')}
          </TextErrorContainer>
        )}
      />

      {/* education level */}

      <QuestionText extraSpace>
        {t('questionary:educationLevel.title')}
      </QuestionText>
      <Controller
        control={control}
        name="educationLevel"
        defaultValue=""
        render={({ onChange, value }) => (
          <OptionList
            singleSelection
            value={{ selected: value ? [value] : [] }}
            onChange={v => onChange(v.selected[0])}
            items={[
              {
                value: 'highSchool',
                label: t('questionary:educationLevel.options.highSchool'),
              },
              {
                value: 'collegeNoDegree',
                label: t('questionary:educationLevel.options.collegeNoDegree'),
              },

              {
                value: 'AssociateDegree',
                label: t('questionary:educationLevel.options.degree'),
              },
              {
                value: 'bachelor',
                label: t('questionary:educationLevel.options.bachelor'),
              },
              {
                value: 'master',
                label: t('questionary:educationLevel.options.master'),
              },

              {
                value: 'phd',
                label: t('questionary:educationLevel.options.phd'),
              },
            ]}
          />
        )}
      />
      {/* Bottom Buttons */}
      <ErrorMessage
        errors={errors}
        name="educationLevel"
        render={({ message }) => (
          <TextErrorContainer>
            <ExclamationSVG />
            {t(`main:${message}`, 'Please select an option')}
          </TextErrorContainer>
        )}
      />

      {/* race */}

      <QuestionText extraSpace>
        {t('questionary:ethnicity.title3')}
        <QuestionNote>{t('questionary:ethnicity.check')}</QuestionNote>
      </QuestionText>
      <Controller
        control={control}
        name="race"
        defaultValue={[]}
        render={({ onChange, value }) => (
          <OptionList
            isCheckbox
            enableOther
            otherPlaceholder="Fill in"
            value={{ selected: value || [] }}
            onChange={v => onChange(v.selected || [])}
            items={[
              {
                value: 'americanIndianAlaskaNative',
                label: t('questionary:ethnicity.options.americanIndianAlaskaNative'),
              },
              {
                value: 'asian',
                label: t('questionary:ethnicity.options.asian'),
              },
              {
                value: 'blackOrAfrican',
                label: t('questionary:ethnicity.options.blackOrAfrican'),
              },
              {
                value: 'nativeHawaiianOrPacific',
                label: t('questionary:ethnicity.options.nativeHawaiianOrPacific'),
              },
              {
                value: 'white',
                label: t('questionary:ethnicity.options.white'),
              },
              {
                value: 'multiRacial',
                label: t('questionary:ethnicity.options.multiRacial'),
              },
              {
                value: 'other',
                label: t('questionary:ethnicity.options.other'),
              },
            ]}
            excludableValues={['none']}
          />
        )}
      />
      {/* Bottom Buttons */}
      <ErrorMessage
        errors={errors}
        name="selectedRate"
        render={({ message }) => (
          <TextErrorContainer>
            <ExclamationSVG />
            {t(`main:${message}`, 'Please select at least one option')}
          </TextErrorContainer>
        )}
      />

      {/* ethnicity */}

      <QuestionText extraSpace>
        {t('questionary:ethnicity.title2')}
      </QuestionText>
      <Controller
        control={control}
        name="ethnicity"
        defaultValue=""
        render={({ onChange, value }) => (
          <OptionList
            singleSelection
            value={{ selected: value ? [value] : [] }}
            onChange={v => onChange(v.selected[0])}
            items={[
              {
                value: 'hispanic',
                label: t('questionary:ethnicity.options.hispanic'),
              },
              {
                value: 'notHispanic',
                label: t('questionary:ethnicity.options.notHispanic'),
              },
            ]}
          />
        )}
      />
      <ErrorMessage
        errors={errors}
        name="ethnicity"
        render={({ message }) => (
          <TextErrorContainer>
            <ExclamationSVG />
            {t(`main:${message}`, 'Please select an option')}
          </TextErrorContainer>
        )}
      />

      {/* smoked */}

      <QuestionText extraSpace>
        {t('questionary:smokeLastSixMonths.question')}
      </QuestionText>
      <Controller
        control={control}
        name="smoked"
        defaultValue=""
        render={({ onChange, value }) => (
          <OptionList
            singleSelection
            value={{ selected: value ? [value] : [] }}
            onChange={v => onChange(v.selected[0])}
            items={[
              {
                value: 'yes',
                label: t('questionary:smokeLastSixMonths.options.yes'),
              },
              {
                value: 'no',
                label: t('questionary:smokeLastSixMonths.options.no'),
              },
              {
                value: 'other',
                label: t('questionary:smokeLastSixMonths.options.other'),
              },
            ]}
          />
        )}
      />
      {/* Bottom Buttons */}
      <ErrorMessage
        errors={errors}
        name="smoked"
        render={({ message }) => (
          <TextErrorContainer>
            <ExclamationSVG />
            {t(`main:${message}`, 'Please select an option')}
          </TextErrorContainer>
        )}
      />

      {/* smoked history */}

      <QuestionText extraSpace>
        {t('questionary:smokeHistory.title')}
      </QuestionText>
      <Controller
        control={control}
        name="smokeHistory"
        defaultValue=""
        render={({ onChange, value }) => (
          <OptionList
            singleSelection
            value={{ selected: value ? [value] : [] }}
            onChange={v => onChange(v.selected[0])}
            items={[
              {
                value: 'daily',
                label: t('questionary:smokeHistory.options.daily'),
              },
              {
                value: 'occasional',
                label: t('questionary:smokeHistory.options.occasional'),
              },
              {
                value: 'former',
                label: t('questionary:smokeHistory.options.former'),
              },
              {
                value: 'never',
                label: t('questionary:smokeHistory.options.never'),
              },
            ]}
          />
        )}
      />
      {/* Bottom Buttons */}
      <ErrorMessage
        errors={errors}
        name="smokeHistory"
        render={({ message }) => (
          <TextErrorContainer>
            <ExclamationSVG />
            {t(`main:${message}`, 'Please select an option')}
          </TextErrorContainer>
        )}
      />

      {/* cigarettes count */}

      <QuestionText extraSpace>{t('questionary:cigCount')}</QuestionText>

      <Controller
        control={control}
        name="cigCount"
        defaultValue=""
        render={({ onChange, value, name }) => (
          <QuestionInput
            name={name}
            value={value}
            onChange={onChange}
            type="number"
            placeholder="Enter a number. Type 0 if you don't smoke"
            autoComplete="Off"
          />
        )}
      />
      {/* Bottom Buttons */}
      <ErrorMessage
        errors={errors}
        name="cigCount"
        render={({ message }) => (
          <TextErrorContainer>
            <ExclamationSVG />
            {t(`main:${message}`, "Enter a number. Type 0 if you don't smoke")}
          </TextErrorContainer>
        )}
      />

      {/* cigarettes cigYear */}

      <QuestionText extraSpace>{t('questionary:cigYear')}</QuestionText>

      <Controller
        control={control}
        name="cigYear"
        defaultValue=""
        render={({ onChange, value, name }) => (
          <QuestionInput
            name={name}
            value={value}
            onChange={onChange}
            type="number"
            placeholder="Enter a number. Type 0 if you don't smoke"
            autoComplete="Off"
          />
        )}
      />
      {/* Bottom Buttons */}
      <ErrorMessage
        errors={errors}
        name="cigYear"
        render={({ message }) => (
          <TextErrorContainer>
            <ExclamationSVG />
            {t(`main:${message}`, "Enter a number. Type 0 if you don't smoke")}
          </TextErrorContainer>
        )}
      />

      {/* cigarettes pastCig */}

      <QuestionText extraSpace>{t('questionary:pastCig')}</QuestionText>

      <Controller
        control={control}
        name="pastCig"
        defaultValue=""
        render={({ onChange, value, name }) => (
          <QuestionInput
            name={name}
            value={value}
            onChange={onChange}
            type="number"
            placeholder="Enter a number. Type 0 if you don't smoke"
            autoComplete="Off"
          />
        )}
      />
      {/* Bottom Buttons */}
      <ErrorMessage
        errors={errors}
        name="pastCig"
        render={({ message }) => (
          <TextErrorContainer>
            <ExclamationSVG />
            {t(`main:${message}`, "Enter a number. Type 0 if you don't smoke")}
          </TextErrorContainer>
        )}
      />

      {/* dementia */}

      <QuestionText extraSpace>
        {t('questionary:dementia.title')}
      </QuestionText>
      <Controller
        control={control}
        name="dementia"
        defaultValue=""
        render={({ onChange, value }) => (
          <OptionList
            singleSelection
            value={{ selected: value ? [value] : [] }}
            onChange={v => onChange(v.selected[0])}
            items={[
              {
                value: 'yes',
                label: t('questionary:dementia.options.yes'),
              },
              {
                value: 'no',
                label: t('questionary:dementia.options.no'),
              },
              {
                value: 'notToSay',
                label: t('questionary:dementia.options.notToSay'),
              },
            ]}
          />
        )}
      />
      {/* Bottom Buttons */}
      <ErrorMessage
        errors={errors}
        name="dementia"
        render={({ message }) => (
          <TextErrorContainer>
            <ExclamationSVG />
            {t(`main:${message}`, 'Please select an option')}
          </TextErrorContainer>
        )}
      />

      {/* primary disgnosis */}

      <QuestionText extraSpace>
        {t('questionary:primaryDisgnosis.title')}
      </QuestionText>
      <Controller
        control={control}
        name="primaryDisgnosis"
        defaultValue=""
        render={({ onChange, value }) => (
          <OptionList
            enableOther
            singleSelection
            otherPlaceholder="Fill in"
            value={{ selected: value ? [value] : [] }}
            onChange={v => onChange(v.selected[0])}
            items={[
              {
                value: 'vascular',
                label: t('questionary:primaryDisgnosis.options.vascular'),
              },
              {
                value: 'lewy',
                label: t('questionary:primaryDisgnosis.options.lewy'),
              },
              {
                value: 'frontotemporal',
                label: t('questionary:primaryDisgnosis.options.frontotemporal'),
              },
              {
                value: 'parkinsons',
                label: t('questionary:primaryDisgnosis.options.parkinsons'),
              },
              {
                value: 'mixed',
                label: t('questionary:primaryDisgnosis.options.mixed'),
              },
              {
                value: 'other',
                label: t('questionary:ethnicity.options.other'),
              },
            ]}
          />
        )}
      />
      {/* Bottom Buttons */}
      <ErrorMessage
        errors={errors}
        name="primaryDisgnosis"
        render={({ message }) => (
          <TextErrorContainer>
            <ExclamationSVG />
            {t(`main:${message}`, 'Please select an option')}
          </TextErrorContainer>
        )}
      />

      {/* Year of initial diagnosis with Dementia */}

      <QuestionText extraSpace>{t('questionary:dementiaYear')}</QuestionText>

      <Controller
        control={control}
        name="dementiaYear"
        defaultValue=""
        render={({ onChange, value, name }) => (
          <QuestionInput
            name={name}
            value={value}
            onChange={onChange}
            type="number"
            placeholder="Enter a number. Type 0 if you don't smoke"
            autoComplete="Off"
          />
        )}
      />
      {/* Bottom Buttons */}
      <ErrorMessage
        errors={errors}
        name="dementiaYear"
        render={({ message }) => (
          <TextErrorContainer>
            <ExclamationSVG />
            {t(`main:${message}`, "Enter a number. Type 0 if you don't smoke")}
          </TextErrorContainer>
        )}
      />

      {/* oxygen saturation */}

      <QuestionText extraSpace>{t('questionary:oxygenSaturation')}</QuestionText>

      <Controller
        control={control}
        name="oxygenSaturation"
        defaultValue=""
        render={({ onChange, value, name }) => (
          <QuestionInput
            name={name}
            value={value}
            onChange={onChange}
            type="number"
            placeholder="Enter a number. Type 0 if you don't smoke"
            autoComplete="Off"
          />
        )}
      />
      {/* Bottom Buttons */}
      <ErrorMessage
        errors={errors}
        name="oxygenSaturation"
        render={({ message }) => (
          <TextErrorContainer>
            <ExclamationSVG />
            {t(`main:${message}`, "Enter a number. Type 0 if you don't smoke")}
          </TextErrorContainer>
        )}
      />

      {/* heart rate */}

      <QuestionText extraSpace>{t('questionary:heartRate')}</QuestionText>

      <Controller
        control={control}
        name="heartRate"
        defaultValue=""
        render={({ onChange, value, name }) => (
          <QuestionInput
            name={name}
            value={value}
            onChange={onChange}
            type="number"
            placeholder="Enter a number. Type 0 if you don't smoke"
            autoComplete="Off"
          />
        )}
      />
      {/* Bottom Buttons */}
      <ErrorMessage
        errors={errors}
        name="heartRate"
        render={({ message }) => (
          <TextErrorContainer>
            <ExclamationSVG />
            {t(`main:${message}`, "Enter a number. Type 0 if you don't smoke")}
          </TextErrorContainer>
        )}
      />

      {/* respiratory Rate */}

      <QuestionText extraSpace>{t('questionary:respiratoryRate')}</QuestionText>

      <Controller
        control={control}
        name="respiratoryRate"
        defaultValue=""
        render={({ onChange, value, name }) => (
          <QuestionInput
            name={name}
            value={value}
            onChange={onChange}
            type="number"
            placeholder="Enter a number. Type 0 if you don't smoke"
            autoComplete="Off"
          />
        )}
      />
      {/* Bottom Buttons */}
      <ErrorMessage
        errors={errors}
        name="respiratoryRate"
        render={({ message }) => (
          <TextErrorContainer>
            <ExclamationSVG />
            {t(`main:${message}`, "Enter a number. Type 0 if you don't smoke")}
          </TextErrorContainer>
        )}
      />

      {/* hospitalized */}

      <QuestionText extraSpace>
        {t('questionary:hospitalized')}
      </QuestionText>
      <Controller
        control={control}
        name="hospitalized"
        defaultValue=""
        render={({ onChange, value }) => (
          <OptionList
            singleSelection
            value={{ selected: value ? [value] : [] }}
            onChange={v => onChange(v.selected[0])}
            items={[
              {
                value: 'yes',
                label: t('questionary:option.yes'),
              },
              {
                value: 'no',
                label: t('questionary:option.no'),
              },
              {
                value: 'notToSay',
                label: t('questionary:option.notToSay'),
              },
            ]}
          />
        )}
      />
      {/* Bottom Buttons */}
      <ErrorMessage
        errors={errors}
        name="hospitalized"
        render={({ message }) => (
          <TextErrorContainer>
            <ExclamationSVG />
            {t(`main:${message}`, 'Please select an option')}
          </TextErrorContainer>
        )}
      />

      {/* emergency */}

      <QuestionText extraSpace>
        {t('questionary:emergency')}
      </QuestionText>
      <Controller
        control={control}
        name="emergency"
        defaultValue=""
        render={({ onChange, value }) => (
          <OptionList
            singleSelection
            value={{ selected: value ? [value] : [] }}
            onChange={v => onChange(v.selected[0])}
            items={[
              {
                value: 'yes',
                label: t('questionary:option.yes'),
              },
              {
                value: 'no',
                label: t('questionary:option.no'),
              },
              {
                value: 'notToSay',
                label: t('questionary:option.notToSay'),
              },
            ]}
          />
        )}
      />
      {/* Bottom Buttons */}
      <ErrorMessage
        errors={errors}
        name="emergency"
        render={({ message }) => (
          <TextErrorContainer>
            <ExclamationSVG />
            {t(`main:${message}`, 'Please select an option')}
          </TextErrorContainer>
        )}
      />

      {/* primary Care */}

      <QuestionText extraSpace>
        {t('questionary:primaryCare')}
      </QuestionText>
      <Controller
        control={control}
        name="primaryCare"
        defaultValue=""
        render={({ onChange, value }) => (
          <OptionList
            singleSelection
            value={{ selected: value ? [value] : [] }}
            onChange={v => onChange(v.selected[0])}
            items={[
              {
                value: 'yes',
                label: t('questionary:option.yes'),
              },
              {
                value: 'no',
                label: t('questionary:option.no'),
              },
              {
                value: 'notToSay',
                label: t('questionary:option.notToSay'),
              },
            ]}
          />
        )}
      />
      {/* Bottom Buttons */}
      <ErrorMessage
        errors={errors}
        name="primaryCare"
        render={({ message }) => (
          <TextErrorContainer>
            <ExclamationSVG />
            {t(`main:${message}`, 'Please select an option')}
          </TextErrorContainer>
        )}
      />

      {/* <QuestionNote style={{marginTop:'30px'}}>※ここでお尋ねする質問は、初回のみにさせていただきます。</QuestionNote> */}

      {activeStep && (
        <Portal>
          <WizardButtons
            leftLabel={t('questionary:nextButton')}
            leftHandler={handleSubmit(onSubmit)}
            leftDisabled={!isValid}
            invert
          />
        </Portal>
      )}
    </MainContainer>
  );
};

export default React.memo(Step1);
