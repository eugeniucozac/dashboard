import React from 'react';
import {
  render,
  getFormSelect,
  getFormCheckbox,
  getFormNumber,
  getFormDatepicker,
  getFormHidden,
  getFormText,
  getFormTextarea,
} from 'tests';
import EditQuote from './EditQuote';

describe('FORMS › EditQuote', () => {
  const props = {
    handleClose: () => {},
  };

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<EditQuote {...props} />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders the form', () => {
      // arrange
      const { getByTestId } = render(<EditQuote {...props} />);

      // assert
      expect(getByTestId('form-editQuote')).toBeInTheDocument();
    });

    it('renders the form buttons', () => {
      // arrange
      const { queryByText } = render(<EditQuote {...props} />);

      // assert
      expect(queryByText('app.cancel')).toBeInTheDocument();
      expect(queryByText('app.submit')).toBeInTheDocument();
    });

    it('renders the form inputs', () => {
      // arrange
      const { container, getByText, getByLabelText } = render(<EditQuote {...props} />);

      // assert
      expect(getByText('placement.form.status.label')).toBeInTheDocument();
      expect(container.querySelector(getFormSelect('statusId'))).toBeInTheDocument();
      expect(getByLabelText('placement.form.lead.label')).toBeInTheDocument();
      expect(container.querySelector(getFormCheckbox('isLeader'))).toBeInTheDocument();
      expect(getByLabelText('placement.form.lineToStand.label')).toBeInTheDocument();
      expect(container.querySelector(getFormCheckbox('lineToStand'))).toBeInTheDocument();
      expect(getByLabelText('placement.form.currency.label')).toBeInTheDocument();
      expect(container.querySelector(getFormText('currency'))).toBeInTheDocument();
      expect(getByLabelText('placement.form.premium.label')).toBeInTheDocument();
      expect(container.querySelector(getFormNumber('premium'))).toBeInTheDocument();
      expect(getByLabelText('placement.form.written.label')).toBeInTheDocument();
      expect(container.querySelector(getFormNumber('writtenLinePercentage'))).toBeInTheDocument();
      expect(getByLabelText('placement.form.subjectivities.label')).toBeInTheDocument();
      expect(container.querySelector(getFormTextarea('subjectivities'))).toBeInTheDocument();
      expect(getByLabelText('placement.form.dateFrom.label')).toBeInTheDocument();
      expect(container.querySelector(getFormDatepicker('quoteDate'))).toBeInTheDocument();
      expect(getByLabelText('placement.form.dateExpiry.label')).toBeInTheDocument();
      expect(container.querySelector(getFormDatepicker('validUntilDate'))).toBeInTheDocument();
      expect(container.querySelector(getFormHidden('policyMarketId'))).toBeInTheDocument();
    });
  });
});
