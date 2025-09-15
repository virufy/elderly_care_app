import styled from 'styled-components';

export const StyledReactDatePickerContainer = styled.div`
  .react-datepicker-wrapper {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
`;

export const DatePickerContainer = styled.div`
  background-color: rgb(245, 248, 253);
  border: 0px;
  border-radius: 15px;
  color: rgb(57, 57, 57);
  font-family: "Source Sans Pro";
  margin: auto;
  padding: 12px 15px;
  height: 48px;
  max-width: 470px;
  display: flex; /* ✅ flex layout */
  align-items: center; /* ✅ vertically center children */
  justify-content: space-between; /* ✅ spread left (calendar+text) and right (chevron) */
  gap: 10px; /* spacing between items */
`;

export const LabelValueContainer = styled.div`
  flex: 1;
  text-align: left;
  padding-left: 14px;
  height: 100%;
  display: flex;
  align-items: center;
`;

export const Label = styled.div`
  font-family: Source Sans Pro;
  font-size: 12px;
  line-height: 142.69%;
  color: ${props => props.theme.colors.darkGray};
`;

export const Value = styled.div`
  font-family: Source Sans Pro;
  font-size: 14px;
  line-height: 142.69%;
  color: ${props => props.theme.colors.darkBlack};
`;

export const CustomDatePickerContainer = styled.div`
  background-color: rgb(245, 248, 253);
  border: 0px;
  border-radius: 15px;
  color: rgb(57, 57, 57);
  font-family: "Source Sans Pro";
  margin: auto;
  padding: 12px 15px;
  height: 48px;
  width: calc(100% - 40px);
`;
