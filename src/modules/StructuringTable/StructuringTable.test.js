import React from 'react';
import { render, within } from 'tests';
import StructuringTable from './StructuringTable';

describe('MODULES › StructuringTable', () => {
  const initialState = {
    referenceData: {
      departments: [
        {
          id: 1,
          name: 'Property',
          businessTypes: [
            { id: 1, description: 'All Risk' },
            { id: 2, description: 'Earthquake' },
            { id: 3, description: 'Wind & Fire' },
          ],
        },
      ],
      statuses: {
        account: [
          { id: 1, code: 'live' },
          { id: 2, code: 'provisional' },
          { id: 3, code: 'closed' },
        ],
        policy: [
          { id: 1, code: 'Pending' },
          { id: 2, code: 'Not Taken Up' },
        ],
        policyMarketQuote: [
          { id: 1, code: 'Pending' },
          { id: 2, code: 'Quoted' },
          { id: 3, code: 'Declined' },
        ],
      },
    },
  };

  const layers = [
    {
      id: 1,
      amount: 1000,
      excess: 10,
      businessTypeId: 1,
      isoCurrencyCode: 'USD',
      notes: 'layer 1',
      statusId: null,
    },
  ];

  describe('@render', () => {
    it('renders nothing if no layers are available', () => {
      // arrange
      const { container } = render(<StructuringTable layers={[]} />, { initialState });

      // assert
      expect(container).toBeEmptyDOMElement();
    });

    xit('renders the table column headers', () => {
      // arrange
      const { getByTestId } = render(<StructuringTable layers={layers} />);
      const table1 = getByTestId('layer-table-1');
      const tableHeadColumns = table1.querySelectorAll('thead tr th');

      // assert
      expect(within(tableHeadColumns[0]).getByText('FORMAT.NUMBER(1000) xs FORMAT.NUMBER(10)')).toBeInTheDocument();
      expect(within(tableHeadColumns[0]).getByText('layer 1')).toBeInTheDocument();
      expect(within(tableHeadColumns[1]).getByText('placement.generic.umr')).toBeInTheDocument();
      expect(within(tableHeadColumns[2]).getByText('placement.generic.section')).toBeInTheDocument();
      expect(within(tableHeadColumns[3]).getByText('placement.generic.premium')).toBeInTheDocument();
      expect(within(tableHeadColumns[4]).getByText('placement.generic.written')).toBeInTheDocument();
      expect(within(tableHeadColumns[5]).getByText('placement.generic.status')).toBeInTheDocument();
    });
  });
});
