import React from 'react';
import { render, getFormText, getFormAutocomplete } from 'tests';
import AddEditMarkets from './AddEditMarkets';

describe('FORMS › AddEditMarkets', () => {
  const props = {
    handleClose: () => {},
    marketParent: { id: 1, markets: [{ id: 2, edgeName: 'two' }] },
  };

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<AddEditMarkets {...props} />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders the form', () => {
      // arrange
      const { getByTestId } = render(<AddEditMarkets {...props} />);

      // assert
      expect(getByTestId('form-AddEditMarkets')).toBeInTheDocument();
    });

    it('renders the form buttons', () => {
      // arrange
      const { queryByText } = render(<AddEditMarkets {...props} />);

      // assert
      expect(queryByText('app.cancel')).toBeInTheDocument();
      expect(queryByText('app.save')).toBeInTheDocument();
    });

    it('renders the form inputs', () => {
      // arrange
      const { container, getByText, getByLabelText } = render(<AddEditMarkets {...props} />);

      // assert
      expect(getByLabelText('admin.form.marketParent.label')).toBeInTheDocument();
      expect(container.querySelector(getFormText('parent'))).toBeInTheDocument();

      expect(getByText('admin.form.markets.label', { selector: 'label' })).toBeInTheDocument();
      expect(container.querySelector(getFormAutocomplete('markets'))).toBeInTheDocument();
    });
  });
});
