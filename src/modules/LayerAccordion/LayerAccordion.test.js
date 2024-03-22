import React from 'react';
import { render, within } from 'tests';
import LayerAccordion from './LayerAccordion';

describe('MODULES › LayerAccordion', () => {
  describe('@render', () => {
    const initialState = {
      referenceData: {
        departments: [
          {
            id: 10,
            businessTypes: [
              { id: 100, description: 'Foo' },
              { id: 101, description: 'Bar' },
              { id: 102, description: 'Qwe' },
            ],
          },
        ],
        statuses: {
          placement: [{ id: 4, code: 'Bound' }],
          policyMarketQuote: [{ id: 2, code: 'Quoted' }],
        },
      },
    };

    const placement = {
      id: 123,
      departmentId: 10,
      statusId: 4,
      policies: [
        {
          id: 666,
          businessTypeId: 100,
          origin: 'GXB',
          amount: 666666,
          markets: [{ id: 1, statusId: 2, premium: 666, writtenLinePercentage: 66, orderPercentage: 6 }],
        },
      ],
      layers: [
        {
          id: 1,
          businessTypeId: 100,
          isoCurrencyCode: 'USD',
          amount: 10000,
          markets: [{ id: 1, statusId: 2, premium: 1000, writtenLinePercentage: 10, orderPercentage: 5 }],
        },
        {
          id: 2,
          businessTypeId: 100,
          isoCurrencyCode: 'GBP',
          amount: 20000,
          markets: [
            { id: 2, statusId: 2, premium: 2000, writtenLinePercentage: 20 },
            { id: 33, statusId: 2, premium: 3000, writtenLinePercentage: 25 },
          ],
        },
        {
          id: 3,
          businessTypeId: 101,
          isoCurrencyCode: 'CAD',
          excess: 500,
          markets: [{ id: 3, statusId: 2, premium: 3000, writtenLinePercentage: 30 }],
        },
        {
          id: 4,
          businessTypeId: 102,
          isoCurrencyCode: 'EUR',
          amount: 40000,
          excess: 1250,
          markets: [{ id: 4, statusId: 2, premium: 4000, writtenLinePercentage: 40, orderPercentage: 20 }],
        },
      ],
    };
    it('renders nothing if array is missing', () => {
      // arrange
      const { container } = render(<LayerAccordion />);

      // assert
      expect(container).toBeEmptyDOMElement();
    });

    it('renders nothing if array is empty', () => {
      // arrange
      const { container } = render(<LayerAccordion placement={[]} />);

      // assert
      expect(container).toBeEmptyDOMElement();
    });

    it('renders the accordion components', () => {
      // arrange
      const { getByText } = render(<LayerAccordion placement={placement} />, { initialState });

      // assert
      expect(getByText('Foo')).toBeInTheDocument();
    });

    it('renders the table headers', () => {
      // arrange
      const { queryAllByTestId } = render(<LayerAccordion placement={placement} />, { initialState });
      const elem1 = queryAllByTestId('accordion-layer-business-type')[0];

      // assert
      expect(within(elem1).getByText('placement.generic.layer')).toBeInTheDocument();
      expect(within(elem1).getByText('placement.generic.premium')).toBeInTheDocument();
      expect(within(elem1).getByText('placement.generic.written')).toBeInTheDocument();
      expect(within(elem1).getByText('placement.generic.signed')).toBeInTheDocument();
      expect(within(elem1).getByText('placement.generic.status')).toBeInTheDocument();
    });

    it('renders the layer name', () => {
      // arrange
      const { queryAllByTestId } = render(<LayerAccordion placement={placement} />, { initialState });
      const elem1 = queryAllByTestId('accordion-layer-business-type')[0];
      const elem2 = queryAllByTestId('accordion-layer-business-type')[1];
      const elem3 = queryAllByTestId('accordion-layer-business-type')[2];

      // assert
      expect(
        within(elem1.querySelector('tbody tr:nth-child(1)')).getByText('placement.generic.primary FORMAT.NUMBER(20000) GBP')
      ).toBeInTheDocument();
      expect(
        within(elem1.querySelector('tbody tr:nth-child(2)')).getByText('placement.generic.primary FORMAT.NUMBER(10000) USD')
      ).toBeInTheDocument();
      expect(within(elem2.querySelector('tbody tr:nth-child(1)')).getByText('xs FORMAT.NUMBER(500) CAD')).toBeInTheDocument();
      expect(
        within(elem3.querySelector('tbody tr:nth-child(1)')).getByText('FORMAT.NUMBER(40000) xs FORMAT.NUMBER(1250) EUR')
      ).toBeInTheDocument();
    });
  });
});
