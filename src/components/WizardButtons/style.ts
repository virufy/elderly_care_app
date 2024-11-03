import styled from 'styled-components';

interface WizardButtonsContainerProps {
  skip?: boolean;
}

export const WizardButtonsContainer = styled.div<WizardButtonsContainerProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: ${props => `calc(100% - ${props.theme.layout.generalPaddingAmount * 2}px)`};
  margin: 0 auto;

  button {
    flex: 1;
    min-height: ${props => (props.skip ? '42px' : '50px')}; // Adjust height based on skip prop
    width: ${props => (props.skip ? '100px' : '100%')}; // Adjust width if skip is true
    margin-bottom: 8px;

    // &:first-of-type {
    //   margin-left: 0px !important;
    // }
    
    &:last-of-type {
      ${props => props.skip && 'margin-left: auto;'} // Push the "Skip" button to the right
    }
  }

  @media screen and (${props => props.theme.breakpoints.tablet}){
    max-width: 470px;
  }
`;
