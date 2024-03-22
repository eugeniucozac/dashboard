import React from 'react';
import { render, fireEvent } from 'tests';
import RfiQueryResponseLogs from './RfiQueryResponseLogs';

describe('FORMS › RfiQueryResponseLogs', () => {
  const props = {
    sections: [
      { value: 'queryId1200', label: 'Query ID 1200', active: false },
      { value: 'queryId1201', label: 'Query ID 1201', active: false },
      { value: 'queryId1202', label: 'Query ID 1202', active: false },
      { value: 'queryId1203', label: 'Query ID 1203', active: false },
      { value: 'queryId1204', label: 'Query ID 1204', active: false },
    ],
    handleSelectSection: () => {},
    fields: [],
    actions: [],
    isLoading: false,
    clickNewRFI: () => {},
  };

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<RfiQueryResponseLogs {...props} />);
      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders the RfiQueryResponseLogs Form', () => {
      // arrange
      const { getByTestId } = render(<RfiQueryResponseLogs {...props} />);
      // assert
      expect(getByTestId('form-rfiQueryResponseLogs')).toBeInTheDocument();
    });

    it('renders the Form elements', () => {
      //arrange
      const { getByTestId } = render(<RfiQueryResponseLogs {...props} />);
      // assert
      expect(getByTestId('form-toggleButtonGroup')).toBeInTheDocument();
      expect(getByTestId('form-elements')).toBeInTheDocument();
    });

    // it('Button click events', () => {
    //     //arrange
    //     const { getByTestId } = render(<RfiQueryResponseLogs {...props} />);
    //     // assert
    //     const resolveButton = getByTestId('resolve-btn');
    //     fireEvent.click(resolveButton);

    //     const newQueryButton = getByTestId('newQuery-btn');
    //     fireEvent.click(newQueryButton);
    // });
  });
});
