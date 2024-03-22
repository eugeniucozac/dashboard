import React from 'react';
import { render, waitFor, within } from 'tests';
import ClaimsComplexityBasisTable from './ClaimsComplexityBasisTable';

describe('MODULES › ClaimsComplexityBasisTable', () => {
  const initialState = {
    claims: {
      complexityBasisValueData: {
        items: [
          {
            complexityRulesID: 1,
            complexityRulesValue: 'TestSanity1',
            forCompany: 'London,Bermuda,Labuan,UAE,Europe',
            forDivision: 'Accident & Health',
          },
          {
            complexityRulesID: 2,
            complexityRulesValue: 'TestSanity2',
            forCompany: 'London,Bermuda,Labuan,UAE,Europe',
            forDivision: 'Accident & Health',
          },
        ],
      },
    },
  };

  describe('@renders', () => {
    it('renders ClaimsComplexityBasisTable without crashing', () => {
      const { container } = render(<ClaimsComplexityBasisTable />);

      expect(container).toBeInTheDocument();
    });

    it('renders the table column headers when the table data exist', async () => {
      // arrange
      const { getByTestId } = render(<ClaimsComplexityBasisTable />, { initialState });
      await waitFor(() => expect(getByTestId('complexity-basis-table')).toBeInTheDocument());

      const gridElem = getByTestId('complexity-basis-table');
      const labelPath = 'claims.complexityRulesManagementDetails.complexityBasisValues';

      // assert
      expect(within(gridElem.querySelector('th:nth-child(1)')).getByText(`${labelPath}.basisValues`)).toBeInTheDocument();
      expect(within(gridElem.querySelector('th:nth-child(2)')).getByText(`${labelPath}.forCompany`)).toBeInTheDocument();
      expect(within(gridElem.querySelector('th:nth-child(3)')).getByText(`${labelPath}.forDivision`)).toBeInTheDocument();
    });
  });
});
