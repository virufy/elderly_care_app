import React from 'react';
import ReactDatePicker from 'react-datepicker';
import { endOfDay } from 'date-fns';

// Images
import calendarSvg from 'assets/icons/calendar.svg';
import chevronSvg from 'assets/icons/chevron.svg';

// Styles
import {
  DatePickerContainer,
  // Label,
  LabelValueContainer,
  StyledReactDatePickerContainer,
  Value,
} from './style';

interface DatePickerProps {
  value: Date | null | undefined;
  locale: string;
  onChange(date: Date | [Date, Date] | null, event: React.SyntheticEvent<any, Event> | undefined): void
}

interface DatePickerInputProps {
  value?: Date | null | undefined;
  onClick?: ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void) | undefined
}

const DatePickerInput = React.forwardRef((
  { value, onClick }: DatePickerInputProps,
  ref: React.Ref<HTMLDivElement>,
) => (
  // Use a div instead of a button to prevent form submission
  <DatePickerContainer ref={ref} onClick={onClick} role="button">
    <img alt="calendar" src={calendarSvg} />
    <LabelValueContainer>
      <Value>{value ? value.toString() : 'Please select the date'}</Value>
    </LabelValueContainer>
    <img alt="chevron" src={chevronSvg} />
  </DatePickerContainer>
));

DatePickerInput.displayName = 'DatePickerInput';

const DatePicker = ({
  value, locale, onChange,
}: DatePickerProps) => {
  const today = React.useMemo(() => endOfDay(new Date()), []);

  return (
    <StyledReactDatePickerContainer>
      <ReactDatePicker
        selected={value}
        customInput={<DatePickerInput value={value} />}
        onChange={onChange}
        dateFormat="EEE, MMM d, yyyy"
        locale={locale}
        maxDate={today}
        placeholderText="Please select the date"
      />
    </StyledReactDatePickerContainer>
  );
};

export default React.memo(DatePicker);
