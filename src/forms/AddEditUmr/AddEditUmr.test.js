import React from 'react';
import { render, getFormText } from 'tests';
import AddEditUmr from './AddEditUmr';

describe('FORMS › AddEditUmr', () => {
  const props = {
    handleClose: () => {},
  };

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<AddEditUmr {...props} />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders the form', () => {
      // arrange
      const { getByTestId } = render(<AddEditUmr {...props} />);

      // assert
      expect(getByTestId('form-addEditUmr')).toBeInTheDocument();
    });

    it('renders the form buttons', () => {
      // arrange
      const { queryByText } = render(<AddEditUmr {...props} />);

      // assert
      expect(queryByText('app.add')).toBeInTheDocument();
      expect(queryByText('app.cancel')).toBeInTheDocument();
      expect(queryByText('app.save')).toBeInTheDocument();
    });

    it('renders the form inputs', () => {
      // arrange
      const { container, getByLabelText } = render(<AddEditUmr {...props} />);

      // assert
      expect(getByLabelText('openingMemo.addEditUmr.label')).toBeInTheDocument();
      expect(container.querySelector(getFormText('umr'))).toBeInTheDocument();
    });

    it('renders the label for the list of current UMRs', () => {
      // arrange
      const { getByText } = render(<AddEditUmr {...props} />);

      // assert
      expect(getByText('openingMemo.addEditUmr.listCurrentUmr')).toBeInTheDocument();
    });

    it('renders chips for each UMR', () => {
      // arrange
      const { getByText, queryByText } = render(<AddEditUmr {...props} openingMemo={{ uniqueMarketReference: 'one,two,three' }} />);

      // assert
      expect(getByText('one')).toBeInTheDocument();
      expect(getByText('two')).toBeInTheDocument();
      expect(getByText('three')).toBeInTheDocument();
      expect(queryByText('four')).not.toBeInTheDocument();
    });
  });
});
