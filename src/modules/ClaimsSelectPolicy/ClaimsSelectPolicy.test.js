import React from 'react';

// app
import ClaimsSelectPolicy from './ClaimsSelectPolicy';
import { render, waitFor, within } from 'tests';

describe('MODULES › ClaimsSelectPolicy', () => {
  const initialState = {
    claims: {
      policies: {
        items: [
          {
            policyNumber: 'ZB0000120',
            policyType: 'Third Party Binder',
            xbPolicyID: 15,
            xbInstanceID: 5,
            insured: 'OBF Insurance Group Ltd',
            claimant: 'OBF Insurance Group Ltd',
            riskDetails: 'Household Binder',
            inceptionDate: '01/01/2020',
            expiryDate: '31/12/2020',
            company: 'XB_Europe',
            division: 'BIB Binder Management',
            divisionID: 34,
          },
          {
            policyNumber: 'YY15570401',
            policyType: 'Facultative',
            xbPolicyID: 46687,
            xbInstanceID: 1,
            insured: 'Mirant Corporation',
            claimant: 'Malayan Insurance Company Inc',
            riskDetails: 'Real and Personal property',
            inceptionDate: '01/11/2004',
            expiryDate: '01/11/2005',
            company: 'XB_London',
            division: 'Power and Utilities',
            divisionID: 11,
          },
        ],
      },
    },
  };

  describe('@renders', () => {
    it('renders ClaimsSelectPolicy without crashing', () => {
      const { container } = render(<ClaimsSelectPolicy />);

      expect(container).toBeInTheDocument();
    });

    it('renders search filter and manage column elements', () => {
      // arrange
      const { getByText, getByTestId } = render(<ClaimsSelectPolicy />);

      //assert
      expect(getByText('claims.searchPolicy.newClaim')).toBeInTheDocument();
      expect(getByTestId('search-field')).toBeInTheDocument();
      expect(getByTestId('search-button-go')).toBeInTheDocument();
      expect(getByTestId('filters-button-toggle')).toBeInTheDocument();
      expect(getByTestId('columns-button-toggle')).toBeInTheDocument();
    });

    it('renders the no match found text when there is no table data', () => {
      // arrange
      const { getByText } = render(<ClaimsSelectPolicy />);

      //assert
      expect(getByText('claims.noMatchFound')).toBeInTheDocument();
      expect(getByText('claims.noMatchDetails')).toBeInTheDocument();
    });

    it('renders the table column headers when the table data exist', async () => {
      // arrange
      const { getByTestId } = render(<ClaimsSelectPolicy />, { initialState });
      await waitFor(() => expect(getByTestId('claims-policy-search-table')).toBeInTheDocument());

      const gridElem = getByTestId('claims-policy-search-table');
      const labelPath = 'claims.searchPolicy.columns';

      // assert
      expect(within(gridElem.querySelector('th:nth-child(1)')).getByText(`${labelPath}.contractPolicyRef`)).toBeInTheDocument();
      expect(within(gridElem.querySelector('th:nth-child(2)')).getByText(`${labelPath}.coverHolder`)).toBeInTheDocument();
      expect(within(gridElem.querySelector('th:nth-child(3)')).getByText(`${labelPath}.policyStatus`)).toBeInTheDocument();
      expect(within(gridElem.querySelector('th:nth-child(4)')).getByText(`${labelPath}.policyType`)).toBeInTheDocument();
      expect(within(gridElem.querySelector('th:nth-child(5)')).getByText(`${labelPath}.insured`)).toBeInTheDocument();
      expect(within(gridElem.querySelector('th:nth-child(6)')).getByText(`${labelPath}.reinsured`)).toBeInTheDocument();
      expect(within(gridElem.querySelector('th:nth-child(7)')).getByText(`${labelPath}.client`)).toBeInTheDocument();
      expect(within(gridElem.querySelector('th:nth-child(8)')).getByText(`${labelPath}.riskDetails`)).toBeInTheDocument();
      expect(within(gridElem.querySelector('th:nth-child(9)')).getByText(`${labelPath}.inceptionDate`)).toBeInTheDocument();
      expect(within(gridElem.querySelector('th:nth-child(10)')).getByText(`${labelPath}.expiryDate`)).toBeInTheDocument();
      expect(within(gridElem.querySelector('th:nth-child(11)')).getByText(`${labelPath}.company`)).toBeInTheDocument();
      expect(within(gridElem.querySelector('th:nth-child(12)')).getByText(`${labelPath}.division`)).toBeInTheDocument();
    });
  });
});
