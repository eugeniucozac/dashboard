import React from 'react';
import {
  render,
  getFormAutocomplete,
  getFormSelect,
  getFormCheckbox,
  getFormText,
  getFormNumber,
  getFormDatepicker,
  getFormTextarea,
} from 'tests';
import AddMarket from './AddMarket';

describe('FORMS › AddMarket', () => {
  const props = {
    handleClose: () => {},
  };

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<AddMarket {...props} />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders the form', () => {
      // arrange
      const { getByTestId } = render(<AddMarket {...props} />);

      // assert
      expect(getByTestId('form-addMarket')).toBeInTheDocument();
    });

    it('renders the form buttons', () => {
      // arrange
      const { queryByText } = render(<AddMarket {...props} />);

      // assert
      expect(queryByText('app.cancel')).toBeInTheDocument();
      expect(queryByText('app.submit')).toBeInTheDocument();
    });

    describe('market', () => {
      it('renders the market legend', () => {
        // arrange
        const { getByText } = render(<AddMarket {...props} />);

        // assert
        expect(getByText('placement.generic.market')).toBeInTheDocument();
      });

      it('renders the form inputs', () => {
        // arrange
        const { container, getByText } = render(<AddMarket {...props} />);

        // assert
        expect(getByText('placement.form.market.label', { selector: 'label' })).toBeInTheDocument();
        expect(container.querySelector(getFormAutocomplete('market'))).toBeInTheDocument();
        expect(getByText('placement.form.underwriter.label', { selector: 'label' })).toBeInTheDocument();
        expect(container.querySelector(getFormAutocomplete('underwriter'))).toBeInTheDocument();
      });

      it('renders the expand quote button', () => {
        // arrange
        const { getByText } = render(<AddMarket {...props} />);

        // assert
        expect(getByText('placement.sheet.addQuote')).toBeInTheDocument();
      });
    });

    describe('quote', () => {
      it('renders the quote legend', () => {
        // arrange
        const { getByText } = render(<AddMarket {...props} />);

        // assert
        expect(getByText('placement.generic.quote')).toBeInTheDocument();
      });

      it('renders the form inputs', () => {
        // arrange
        const initialState = {
          referenceData: {
            businessTypes: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
          },
        };
        const { container, getByText, getByLabelText } = render(<AddMarket {...props} />, { initialState });

        // assert
        expect(getByText('placement.form.status.label', { selector: 'label' })).toBeInTheDocument();
        expect(container.querySelector(getFormSelect('status'))).toBeInTheDocument();

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
      });
    });
  });
});
