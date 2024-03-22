import React from 'react';
import { render, getFormText, getFormSelect } from 'tests';
import CreateInWhitespace from './CreateInWhitespace';

describe('FORMS › CreateInWhitespace', () => {
  const props = {
    handleClose: () => {},
    policy: {},
  };

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<CreateInWhitespace {...props} />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders the form', () => {
      // arrange
      const { getByTestId } = render(<CreateInWhitespace {...props} />);

      // assert
      expect(getByTestId('form-create-in-whitespace')).toBeInTheDocument();
    });

    it('renders the form buttons', () => {
      // arrange
      const { queryByText } = render(<CreateInWhitespace {...props} />);

      // assert
      expect(queryByText('app.cancel')).toBeInTheDocument();
      expect(queryByText('app.create')).toBeInTheDocument();
    });

    it('renders the form inputs', () => {
      // arrange
      const { getByText, getByLabelText, container } = render(<CreateInWhitespace {...props} />);

      // assert
      expect(getByText('whitespace.template', { selector: 'label' })).toBeInTheDocument();
      expect(container.querySelector(getFormSelect('productType'))).toBeInTheDocument();

      expect(getByLabelText('whitespace.reference')).toBeInTheDocument();
      expect(container.querySelector(getFormText('umrId'))).toBeInTheDocument();
    });
  });
});
