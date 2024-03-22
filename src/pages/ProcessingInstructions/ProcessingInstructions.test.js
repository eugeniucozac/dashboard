import React from 'react';

//app
import { render, waitFor } from 'tests';
import ProcessingInstructions from './ProcessingInstructions';

describe('PAGES › ProcessingInstructions', () => {
  describe('page renders with title and icon', () => {
    it('renders the page title', async () => {
      // given
      const { getByTestId } = render(<ProcessingInstructions />);
      // then
      await waitFor(() => expect(document.title).toContain('processingInstructions.title'));
      expect(getByTestId('page-header-processing-instructions-title')).toBeInTheDocument();
      expect(getByTestId('page-header-processing-instructions-title')).toHaveTextContent('processingInstructions.title');
      expect(getByTestId('page-header-processing-instructions-icon')).toBeInTheDocument();
    });
  });
});
