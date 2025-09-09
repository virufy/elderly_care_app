import React from 'react';
import ReactDatePicker from 'react-datepicker';
import { endOfDay } from 'date-fns';

// Images
import calendarSvg from 'assets/icons/calendar.svg';
import chevronSvg from 'assets/icons/chevron.svg';

// Styles
import {
  DatePickerContainer,
  Label,
  LabelValueContainer,
  StyledReactDatePickerContainer,
  Value,
} from './style';

interface DatePickerProps {
  label: string;
  value: Date | null | undefined;
  locale: string;
  onChange(date: Date | [Date, Date] | null, event: React.SyntheticEvent<any, Event> | undefined): void
}

interface DatePickerInputProps {
  label: string;
  value?: Date | null | undefined;
  onClick?: ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void) | undefined
}

const DatePickerInput = React.forwardRef((
  { label, value, onClick }: DatePickerInputProps,
  ref: React.Ref<HTMLDivElement>,
) => (
  // Use a div instead of a button to prevent form submission
  <DatePickerContainer ref={ref} onClick={onClick} role="button">
    <img alt="calendar" src={calendarSvg} />
    <LabelValueContainer>
      <Label>{label}</Label>
      <Value>{value ? value.toString() : ''}</Value>
    </LabelValueContainer>
    <img alt="chevron" src={chevronSvg} />
  </DatePickerContainer>
));

DatePickerInput.displayName = 'DatePickerInput';

const DatePicker = ({
  label, value, locale, onChange,
}: DatePickerProps) => {
  const today = React.useMemo(() => endOfDay(new Date()), []);

  return (
    <StyledReactDatePickerContainer>
      <ReactDatePicker
        selected={value}
        customInput={<DatePickerInput label={label} value={value} />}
        onChange={onChange}
        dateFormat="EEE, MMM d, yyyy"
        locale={locale}
        maxDate={today}
      />
    </StyledReactDatePickerContainer>
  );
};

export default React.memo(DatePicker);
