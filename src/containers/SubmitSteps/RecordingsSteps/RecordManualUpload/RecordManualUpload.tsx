import React, { useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import usePortal from 'react-useportal';
import { useTranslation } from 'react-i18next';

// Form
import { Controller, useForm } from 'react-hook-form';
import { useStateMachine } from 'little-state-machine';
import { yupResolver } from '@hookform/resolvers';
import Yup from 'utils/yup';

// Components
import WizardButtons from 'components/WizardButtons';
import { TitleBlack } from 'components/Texts';

// Modals
import RecordErrorModal from 'modals/RecordErrorModal';

// Hooks
import useHeaderContext from 'hooks/useHeaderContext';
import { useModal } from 'hooks/useModal';

// Utils
import { updateAction } from 'utils/wizard';
import { scrollToTop } from 'helper/scrollHelper';
import { setAudioBase64 } from 'helper/audioCache'; // 👈 NEW

// Styles
import {
  MainContainer,
  UploadContainer,
  UploadInput,
  UploadButton,
  CloudsSVG,
  ArrowUp,
} from './style';

const audioMaxSizeInMb = 5;
const audioMinLength: CommonJSON<number> = {
  recordYourBreath: 5,
  recordYourSpeech: 5,
  recordYourCough: 3,
}; // in seconds

const audioMaxLengthInSeconds = 15; // same max as recorder

const mimeTypes = 'audio/wav,audio/wave,audio/wav,audio/x-wav,audio/x-pn-wav,audio/mp3,audio/ogg';

// same TS fix as before
const schema = Yup.object({
  uploadedFile: (Yup.mixed() as any)
    .required('ERROR.FILE_REQUIRED')
    .validateAudioSize(audioMaxSizeInMb)
    .when('$_currentLogic', (value: string, _schema: any) => _schema.validateAudioLength(audioMinLength[value] || 5)),
}).defined();

// helper to get base64, same as in Record.tsx
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

const RecordManualUpload = ({
  storeKey,
  previousStep,
  nextStep,
  metadata,
}: Wizard.StepProps) => {
  // Hooks
  const { Portal } = usePortal({
    bindTo: document && document.getElementById('wizard-buttons') as HTMLDivElement,
  });
  const {
    setDoGoBack, setTitle, setSubtitle, setType,
  } = useHeaderContext();
  const history = useHistory();
  const { state, action } = useStateMachine(updateAction(storeKey));
  const { isOpen, openModal, closeModal } = useModal();
  const inputUpload = useRef<HTMLInputElement>(null);
  const {
    control,
  } = useForm({
    mode: 'onChange',
    defaultValues: state?.[storeKey]?.[metadata?.currentLogic],
    context: {
      _currentLogic: metadata?.currentLogic,
    },
    resolver: yupResolver(schema),
  });
  const { t } = useTranslation();
  const location = useLocation<{ isShortAudioCollection: boolean }>();
  const isShortAudioCollection = location?.state?.isShortAudioCollection || false;

  // States
  const [activeStep, setActiveStep] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState('');

  // 👇 when upload is valid, convert to base64, cache, and store only small info in state
  const handleNext = React.useCallback(async (file: File) => {
    if (!file) return;

    const base64 = await toBase64(file);
    if (base64 && metadata?.currentLogic) {
      setAudioBase64(metadata.currentLogic, base64);
    }

    if (nextStep) {
      action({
        [metadata?.currentLogic]: {
          recordingFile: null, // 👈 ensure mutual exclusion
          recordingUrl: null,
          uploadedFile: file,
        },
      });
      setActiveStep(false);
      history.push(nextStep, { from: 'step-manual-upload', isShortAudioCollection });
    }
  }, [nextStep, action, metadata, history, isShortAudioCollection]);

  const handleDoBack = React.useCallback(() => {
    setActiveStep(false);
    if (previousStep) {
      history.push(previousStep, { isShortAudioCollection });
    } else {
      history.goBack();
    }
  }, [history, previousStep, isShortAudioCollection]);

  // validate size + duration 5–15s, then call handleNext(file)
  const handleUpload = React.useCallback((file?: File) => {
    if (!file) {
      setErrorMsg(t('recordingsRecordManual:fileRequired'));
      openModal();
      return;
    }

    schema
      .validate(
        { uploadedFile: file },
        { context: { _currentLogic: metadata?.currentLogic } },
      )
      .then(() => {
        const objectUrl = URL.createObjectURL(file);
        const audio = new Audio();
        audio.preload = 'metadata';
        audio.onloadedmetadata = () => {
          window.URL.revokeObjectURL(objectUrl);
          const { duration } = audio;

          const minLength = audioMinLength[metadata?.currentLogic] || 5;

          if (duration < minLength) {
            setErrorMsg(t('recordingsRecordManual:fileDurationTooShort'));
            openModal();
            return;
          }

          if (duration > audioMaxLengthInSeconds) {
            setErrorMsg(t('recordingsRecordManual:fileDurationTooLong'));
            openModal();
            return;
          }

          // ✅ everything good – proceed
          handleNext(file);
        };
        audio.onerror = () => {
          window.URL.revokeObjectURL(objectUrl);
          setErrorMsg(t('recordingsRecordManual:fileRequired'));
          openModal();
        };
        audio.src = objectUrl;
      })
      .catch(err => {
        if (err.errors && err.errors[0] === 'ERROR.FILE_SIZE') {
          setErrorMsg(t('recordingsRecordManual:fileSizeTooBig'));
        } else if (err.errors && err.errors[0] === 'ERROR.FILE_REQUIRED') {
          setErrorMsg(t('recordingsRecordManual:fileRequired'));
        } else {
          setErrorMsg(t('recordingsRecordManual:fileDurationTooShort'));
        }
        openModal();
      });
  }, [handleNext, t, openModal, metadata]);

  // Effects
  useEffect(() => {
    scrollToTop();
    setTitle(t('recordingsRecordManual:header'));
    setType('primary');
    setSubtitle('');
    setDoGoBack(() => handleDoBack);
  }, [handleDoBack, setDoGoBack, setTitle, setType, setSubtitle, t]);

  return (
    <>
      <MainContainer>
        <TitleBlack>
          {t('recordingsRecordManual:micError')}
        </TitleBlack>
        <CloudsSVG />
        <Controller
          control={control}
          name="uploadedFile"
          render={({ name }) => (
            <UploadContainer>
              <UploadButton htmlFor="uploaded-file" />
              <ArrowUp />
              <UploadInput
                ref={inputUpload}
                id="uploaded-file"
                type="file"
                name={name}
                accept={mimeTypes}
                onChange={e => handleUpload(e.currentTarget.files?.[0])}
              />
            </UploadContainer>
          )}
        />
      </MainContainer>
      <RecordErrorModal
        isOpen={isOpen}
        modalTitle="Oops."
        onConfirm={closeModal}
      >
        {errorMsg}
      </RecordErrorModal>
      {/* Bottom Buttons */}
      {activeStep && (
        <Portal>
          <WizardButtons
            invert
            leftLabel={t('recordingsRecordManual:uploadFile')}
            leftHandler={() => inputUpload.current?.click()}
          />
        </Portal>
      )}
    </>
  );
};

export default React.memo(RecordManualUpload);
