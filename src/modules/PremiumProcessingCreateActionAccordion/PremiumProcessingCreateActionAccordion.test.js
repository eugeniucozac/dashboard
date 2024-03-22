import React from 'react';
import PremiumProcessingCreateActionAccordion from './PremiumProcessingCreateActionAccordion';
import { render } from 'tests';

describe('MODULES › PremiumProcessingAttachmentsAccordion', () => {
  const defaultProps = {
    title: 'Attachments',
  };
  describe('@render', () => {
    it('renders PremiumProcessingAttachmentsAccordion without crashing', () => {
      // arrange
      render(<PremiumProcessingCreateActionAccordion />);
    });
  });

  // it('renders if commit transaction stage is completed', () => {
  //   // arrange
  //   const { getByText } = render(<PremiumProcessingCreateActionAccordion />);
  //   // assert
  //   expect(getByText('Attachments')).toBeInTheDocument();
  // });
});
