import React from 'react';
import usePortal from 'react-useportal';
import { useTranslation } from 'react-i18next';

// Form
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import Yup from 'utils/yup';

// Components
import MicRecorder from 'components/MicRecorder';
import WizardButtons from 'components/WizardButtons';

// Images
import UploadSVG from 'assets/icons/upload.svg';

import { setAudioBase64 } from 'helper/audioCache';

// Styles
import {
  MainContainer,
  UploadContainer,
  UploadImage,
  UploadText,
  MicContainer,
} from './style';

const audioMaxSizeInMb = 5;
const audioMinLength: CommonJSON<number> = {
  recordYourBreath: 5,
  recordYourSpeech: 5,
  recordYourCough: 3,
}; // in seconds

// CHANGE: new max length in seconds
const audioMaxLengthInSeconds = 15; // in seconds

const schema = Yup.object({
  recordingFile: (Yup.mixed() as any)
    .required('ERROR.FILE_REQUIRED')
    .validateAudioSize(audioMaxSizeInMb)
    .when(
      '$_currentLogic',
      (value: string, _schema: any) => _schema.validateAudioLength(audioMinLength[value] || 5),
    ),
}).defined();

type RecordType = {
  recordingFile: File | null;
};

interface RecordProps {
  // isCoughLogic: boolean,
  onNext: (values: RecordType) => void;
  onManualUpload: () => void;
  onSkip: () => void;
  defaultValues: RecordType;
  currentLogic: string;
  action: any;
  isShortAudioCollection?: boolean;
}

// Convert Blob/File to pure base64 (no data: prefix)
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

const Record = ({
  onNext,
  onManualUpload,
  onSkip: _onSkip, // eslint-disable-line @typescript-eslint/no-unused-vars
  defaultValues,
  currentLogic,
  action,
  isShortAudioCollection,
}: RecordProps) => {
  // Hooks
  const { Portal } = usePortal({
    bindTo:
      document && (document.getElementById('wizard-buttons') as HTMLDivElement),
  });

  const {
    handleSubmit, control, formState,
  } = useForm<RecordType>({
    mode: 'onChange',
    defaultValues,
    context: {
      _currentLogic: currentLogic,
    },
    resolver: yupResolver(schema),
  });

  const { t } = useTranslation();

  const { isValid } = formState;

  // Refs
  const micKey = React.useRef<number>(1);

  // CHANGE: manual upload should just navigate to the manual upload step,
  // not try to reuse the mic recording file.
  const onManualUploadWithFile = () => {
    onManualUpload?.();
  };

  const handleNext = async (values: RecordType) => {
    const file = values.recordingFile as File | null;
    const objectUrl = file ? URL.createObjectURL(file) : null;
    const base64 = file ? await toBase64(file) : '';

    if (base64) {
      // store in memory only
      setAudioBase64(currentLogic, base64);
    }

    // 👇 Mutually exclusive: recording present, uploaded cleared
    action({
      [currentLogic]: {
        recordingUrl: objectUrl,
        recordingFile: file || null,
        uploadedFile: null,
      },
    });

    onNext({
      ...values,
      recordingFile: file,
    });
  };

  return (
    <>
      <MainContainer>
        <MicContainer>
          <Controller
            control={control}
            defaultValue={null}
            name="recordingFile"
            render={({ onChange }) => (
              <MicRecorder
                key={micKey.current} // On delete, easy re-mount a new mic recorder
                onNewRecord={onChange}
                recordingFile={defaultValues?.recordingFile}
                minTimeInSeconds={audioMinLength[currentLogic]}
                maxTimeInSeconds={audioMaxLengthInSeconds}
                isShortAudioCollection={isShortAudioCollection}
              />
            )}
          />
        </MicContainer>

        <Portal>
          <WizardButtons
            invert
            leftLabel={t('recordingsRecord:next')}
            leftDisabled={!isValid}
            leftHandler={handleSubmit(handleNext)}
          />
          {/* <div style={{ minWidth: '100%' }}>
            <WizardButtons
              invert
              skip
              leftLabel="Skip"
              leftHandler={onSkip}
            />
          </div> */}
          <UploadContainer onClick={onManualUploadWithFile}>
            <UploadImage src={UploadSVG} />
            <UploadText>{t('recordingsRecord:upload')}</UploadText>
          </UploadContainer>
        </Portal>
      </MainContainer>
    </>
  );
};

export default React.memo(Record);
