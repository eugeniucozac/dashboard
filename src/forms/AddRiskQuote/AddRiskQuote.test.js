import React from 'react';
import AddRiskQuote from './AddRiskQuote';
import { render, getFormSelect, getFormHidden, getFormNumber, getFormDatepicker, screen } from 'tests';

const quote = {
  acceptedDate: '2021-02-23T16:33:42.829',
  carrierId: '5f845d8acc6d0f02b8eb1d91',
  createdAt: '2021-02-23T16:30:49.994',
  facilityId: '602b8a065675787b2cf7f9d4',
  facility: {
    carrierId: '5f845d8acc6d0f02b8eb1d91',
    clientId: '5f3e3262d77a52662e7447a5',
    id: '602b8a065675787b2cf7f9d4',
    liveFrom: '2021-02-16T00:00:00',
    liveTo: '2022-02-21T00:00:00',
    name: 'Chubb Aviation Facility',
    pricerCode: 'CHUBB_AVIATION_V1',
    productCode: 'AVIATION_FIXED_WING',
  },
  hasTemplate: true,
  id: '60352dba40eae5016a00680f',
  riskId: '60352c6434178c40dc54e196',
  status: 'QUOTED',
};

const inputValue = JSON.stringify({
  facilityId: quote.facility.id,
  carrierId: quote.facility.carrierId,
});

describe('FORMS › AddRiskQuote', () => {
  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<AddRiskQuote risk={{ id: 1 }} />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it("renders nothing if there's no risk ID", () => {
      // arrange
      const { container } = render(<AddRiskQuote risk={{ foo: 1 }} />);

      // assert
      expect(container).toBeEmptyDOMElement();
    });

    it("renders nothing if there's no quote facility", () => {
      // arrange
      const { container } = render(<AddRiskQuote risk={{ id: 1 }} quote={{}} />);

      // assert
      expect(container).toBeEmptyDOMElement();
    });
    it('renders the form inputs', () => {
      // arrange
      const { container } = render(<AddRiskQuote risk={{ id: 1 }} quote={quote} />);

      // assert
      expect(screen.getByTestId('form-add-risk-quote')).toBeInTheDocument();
      expect(screen.queryByText('app.cancel')).toBeInTheDocument();
      expect(screen.queryByText('app.submit')).toBeInTheDocument();

      expect(screen.getByText('app.facility', { selector: 'label' })).toBeInTheDocument();
      expect(container.querySelector(getFormSelect('facility'))).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Chubb Aviation Facility/i })).toHaveAttribute('aria-disabled');
      expect(container.querySelector(getFormSelect('facility')).value).toBe(inputValue);

      expect(screen.getByLabelText('risks.netPremium')).toBeInTheDocument();
      expect(container.querySelector(getFormNumber('premium'))).toBeInTheDocument();

      expect(screen.getByLabelText('form.dateValidUntil.label')).toBeInTheDocument();
      expect(container.querySelector(getFormDatepicker('validUntil'))).toBeInTheDocument();

      expect(container.querySelector(getFormHidden('riskId'))).toBeInTheDocument();
    });
  });
});
