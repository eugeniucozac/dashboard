import React from 'react';
import { render, fireEvent, within } from 'tests';
import MarketSheet from './MarketSheet';

describe('MODULES › MarketSheet', () => {
  const placementEmpty = { selected: { id: 1, departmentId: 1 } };

  const placementWithoutValidPolicies = {
    selected: {
      id: 1,
      departmentId: 1,
      policies: [
        { id: 2, businessTypeId: 1 },
        { id: 3, origin: 'GXB', businessTypeId: 2 },
      ],
    },
  };

  const placementWithPolicies = {
    selected: {
      id: 1,
      departmentId: 1,
      policies: [
        {
          id: 1000,
          businessTypeId: 1,
          statusId: 1,
          origin: 'OMS',
          amount: 100,
          markets: [
            { id: 4, statusId: 1 },
            { id: 5, statusId: 2, writtenLinePercentage: 10, orderPercentage: 20 },
            { id: 6, statusId: 1, writtenLinePercentage: 10, orderPercentage: 20, market: { id: 555, capacityTypeId: 1 } },
            { id: 7, statusId: 1, writtenLinePercentage: 20, orderPercentage: 30, market: { id: 555, capacityTypeId: 1 } },
          ],
        },
        {
          id: 2000,
          businessTypeId: 2,
          statusId: 1,
          origin: 'OMS',
          amount: 200,
          markets: [{ id: 7, statusId: 1, writtenLinePercentage: 20, orderPercentage: 30, market: { id: 555, capacityTypeId: 1 } }],
        },
        {
          id: 3000,
          businessTypeId: 3,
        },
      ],
    },
  };

  const placementWithMixedPolicies = {
    selected: {
      id: 1,
      departmentId: 1,
      policies: [
        {
          id: 1000,
          businessTypeId: 1,
          statusId: 1,
          origin: 'OMS',
          amount: 100,
          markets: [
            { id: 4, statusId: 1 },
            { id: 5, statusId: 2, writtenLinePercentage: 10, orderPercentage: 20 },
            { id: 6, statusId: 1, writtenLinePercentage: 10, orderPercentage: 20, market: { id: 555, capacityTypeId: 1 } },
            { id: 7, statusId: 1, writtenLinePercentage: 20, orderPercentage: 30, market: { id: 555, capacityTypeId: 1 } },
          ],
        },
        {
          id: 2000,
          businessTypeId: 2,
          statusId: 1,
          origin: 'GXB',
          amount: 200,
          markets: [{ id: 7, statusId: 1, writtenLinePercentage: 20, orderPercentage: 30, market: { id: 555, capacityTypeId: 1 } }],
        },
        {
          id: 3000,
          businessTypeId: 2,
          statusId: 1,
          origin: 'GXB',
          amount: 300,
          markets: [{ id: 7, statusId: 1, writtenLinePercentage: 20, orderPercentage: 30, market: { id: 555, capacityTypeId: 1 } }],
        },
        {
          id: 4000,
          businessTypeId: 3,
          statusId: 1,
          origin: 'GXB',
          amount: 400,
          markets: [{ id: 7, statusId: 1, writtenLinePercentage: 20, orderPercentage: 30, market: { id: 555, capacityTypeId: 1 } }],
        },
      ],
    },
  };

  // reasons for a policy to be invalid:
  //   - policy doesn't have amount value
  //   - policy origin isn't OMS
  //   - markets are not status QUOTED
  const placementWithoutMudmap = {
    selected: {
      id: 1,
      departmentId: 1,
      policies: [
        {
          id: 3,
          businessTypeId: 2,
          statusId: 1,
          origin: 'OMS',
          amount: 0, // no amount value
          markets: [{ id: 1, statusId: 1, writtenLinePercentage: 10, orderPercentage: 20 }],
        },
        {
          id: 4,
          businessTypeId: 3,
          statusId: 1,
          origin: 'OMS',
          amount: 100,
          markets: [
            { id: 1, statusId: 2, writtenLinePercentage: 10, orderPercentage: 20 }, // status not quoted
          ],
        },
        {
          id: 5,
          businessTypeId: 3,
          statusId: 1,
          origin: 'GXB', // not OMS/EGDE
          amount: 100,
          markets: [{ id: 1, statusId: 1, writtenLinePercentage: 10, orderPercentage: 20 }],
        },
      ],
    },
  };

  const referenceData = {
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
      policy: [
        { id: 1, code: 'Pending' },
        { id: 2, code: 'Not Taken Up' },
      ],
      policyMarketQuote: [
        { id: 1, code: 'Quoted' },
        { id: 2, code: 'Declined' },
      ],
    },
    capacityTypes: [
      { id: 1, name: 'London', color: 'red' },
      { id: 2, name: 'Europe', color: 'green' },
      { id: 3, name: 'Bermuda', color: 'blue' },
    ],
  };

  const user = {
    id: 'joe',
    role: 'BROKER',
  };

  describe('@render', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    describe('basic', () => {
      it('renders without crashing', () => {
        // arrange
        render(<MarketSheet />);
      });

      it('renders nothing if not passed a placement or policies', () => {
        // arrange
        const { container } = render(<MarketSheet />, { initialState: { referenceData, user } });

        // expect
        expect(container).toBeEmptyDOMElement();
      });

      it("renders nothing if refData state doesn't have departments", () => {
        // arrange
        const { container } = render(<MarketSheet />, {
          initialState: {
            placement: placementEmpty,
            referenceData: { statuses: referenceData.statuses, capacityTypes: referenceData.capacityTypes },
            user,
          },
        });

        // expect
        expect(container).toBeEmptyDOMElement();
      });

      it("renders nothing if refData state doesn't have capacity types", () => {
        // arrange
        const { container } = render(<MarketSheet />, {
          initialState: {
            placement: placementEmpty,
            referenceData: { statuses: referenceData.statuses, departments: referenceData.departments },
            user,
          },
        });

        // expect
        expect(container).toBeEmptyDOMElement();
      });
    });

    describe('layout', () => {
      it('renders page title', () => {
        // arrange
        const { getByText } = render(<MarketSheet />, {
          initialState: {
            placement: placementEmpty,
            referenceData,
          },
        });

        // expect
        expect(getByText('placement.sheet.title')).toBeInTheDocument();
      });

      it('renders the main add layer button if user is BROKER', () => {
        // arrange
        const { getByText } = render(<MarketSheet />, {
          initialState: {
            placement: placementEmpty,
            referenceData,
            user: { role: 'BROKER' },
          },
        });
        const btn = getByText('app.actions');
        fireEvent.click(btn);

        // expect
        expect(getByText('placement.sheet.addLayer')).toBeInTheDocument();
      });
    });

    describe('tabs', () => {
      it('renders business classes tabs', () => {
        // arrange
        const { getByText, queryByText } = render(<MarketSheet />, {
          initialState: {
            placement: placementWithPolicies,
            referenceData,
          },
        });

        // expect
        expect(getByText('All Risk')).toBeInTheDocument();
        expect(getByText('Earthquake')).toBeInTheDocument();
        expect(queryByText('Wind & Fire')).not.toBeInTheDocument();
      });

      it("doesn't render tabs which don't have EDGE policies", () => {
        // arrange
        const { getByText, queryByText } = render(<MarketSheet />, {
          initialState: {
            placement: placementWithMixedPolicies,
            referenceData,
          },
        });

        // expect
        expect(getByText('All Risk')).toBeInTheDocument();
        expect(queryByText('Earthquake')).not.toBeInTheDocument();
        expect(queryByText('Wind & Fire')).not.toBeInTheDocument();
      });

      it("doesn't render tabs if policies don't match any business types", () => {
        // arrange
        const { queryByText } = render(<MarketSheet />, {
          initialState: {
            placement: placementWithPolicies,
            referenceData: {
              departments: [
                {
                  id: 1,
                  name: 'Property',
                  businessTypes: [
                    { id: 7, description: 'Foo' },
                    { id: 8, description: 'Bar' },
                  ],
                },
              ],
            },
          },
        });

        // expect
        expect(queryByText('All Risk')).not.toBeInTheDocument();
        expect(queryByText('Earthquake')).not.toBeInTheDocument();
        expect(queryByText('Wind & Fire')).not.toBeInTheDocument();
        expect(queryByText('Foo')).not.toBeInTheDocument();
        expect(queryByText('Bar')).not.toBeInTheDocument();
      });
    });

    describe('mudmap', () => {
      it('renders mudmap if it has valid policies/markets', () => {
        // arrange
        const { getByTestId } = render(<MarketSheet />, {
          initialState: {
            placement: placementWithPolicies,
            referenceData,
            user,
          },
        });

        // expect
        expect(getByTestId('mudmap')).toBeInTheDocument();
      });

      it("doesn't render mudmap if it doesn't have valid policies", () => {
        // arrange
        const { queryByTestId } = render(<MarketSheet />, { initialState: { placement: placementWithoutValidPolicies } });

        // expect
        expect(queryByTestId('mudmap')).not.toBeInTheDocument();
      });

      it("doesn't render mudmap if it doesn't have valid markets", () => {
        // arrange
        const { queryByTestId } = render(<MarketSheet />, { initialState: { placement: placementWithoutMudmap } });

        // expect
        expect(queryByTestId('mudmap')).not.toBeInTheDocument();
      });

      it("doesn't render the mudmap for COBROKER by default", () => {
        // arrange
        const { queryByTestId } = render(<MarketSheet />, {
          initialState: {
            placement: placementWithPolicies,
            referenceData,
            user: {
              role: 'COBROKER',
            },
          },
        });

        // expect
        expect(queryByTestId('mudmap')).not.toBeInTheDocument();
      });

      it("doesn't render the mudmap for UNDERWRITER by default", () => {
        // arrange
        const { queryByTestId } = render(<MarketSheet />, {
          initialState: {
            placement: placementWithPolicies,
            referenceData,
            user: {
              role: 'UNDERWRITER',
            },
          },
        });

        // expect
        expect(queryByTestId('mudmap')).not.toBeInTheDocument();
      });

      it('renders mudmap visible by default if localStorage preference is not saved', () => {
        // arrange
        const { getByTestId } = render(<MarketSheet />, {
          initialState: {
            placement: placementWithPolicies,
            referenceData,
            user,
          },
        });

        // expect
        expect(getByTestId('mudmap')).toBeInTheDocument();
        expect(getByTestId('mudmap-container')).toHaveClass('MuiCollapse-entered');
      });

      it('renders mudmap visible if localStorage preference is set to "true"', () => {
        // arrange
        localStorage.setItem('edge-mudmap-expanded', 'true');
        const { getByTestId } = render(<MarketSheet />, {
          initialState: {
            placement: placementWithPolicies,
            referenceData,
            user,
          },
        });

        // expect
        expect(getByTestId('mudmap')).toBeInTheDocument();
        expect(getByTestId('mudmap-container')).toHaveClass('MuiCollapse-entered');
      });

      it('renders mudmap hidden if localStorage preference is set to "false"', () => {
        // arrange
        localStorage.setItem('edge-mudmap-expanded', 'false');
        const { getByTestId } = render(<MarketSheet />, {
          initialState: {
            placement: placementWithPolicies,
            referenceData,
            user,
          },
        });

        // expect
        expect(getByTestId('mudmap')).toBeInTheDocument();
        expect(getByTestId('mudmap-container')).toHaveClass('MuiCollapse-hidden');
      });

      it('renders "hide mudmap" button if mudmap is shown', () => {
        // arrange
        localStorage.setItem('edge-mudmap-expanded', 'true');
        const { queryByText, getByText } = render(<MarketSheet />, {
          initialState: {
            placement: placementWithPolicies,
            referenceData,
            user,
          },
        });

        // expect
        expect(queryByText('placement.sheet.mudmap.show')).not.toBeInTheDocument();
        expect(getByText('placement.sheet.mudmap.hide')).toBeInTheDocument();
      });

      it('renders "show mudmap" button if mudmap is hidden', () => {
        // arrange
        localStorage.setItem('edge-mudmap-expanded', 'false');
        const { queryByText, getByText } = render(<MarketSheet />, {
          initialState: {
            placement: placementWithPolicies,
            referenceData,
            user,
          },
        });

        // expect
        expect(getByText('placement.sheet.mudmap.show')).toBeInTheDocument();
        expect(queryByText('placement.sheet.mudmap.hide')).not.toBeInTheDocument();
      });

      it("doesn't render mudmap toggle button if no mudmap is present", () => {
        // arrange
        const { queryByText } = render(<MarketSheet />, {
          initialState: {
            placement: placementEmpty,
            referenceData,
            user,
          },
        });

        // expect
        expect(queryByText('placement.sheet.mudmap.hide')).not.toBeInTheDocument();
        expect(queryByText('placement.sheet.mudmap.show')).not.toBeInTheDocument();
      });
    });

    describe('capacity types', () => {
      it('renders capacity types component', () => {
        // arrange
        const { getByTestId } = render(<MarketSheet />, {
          initialState: {
            placement: placementWithPolicies,
            referenceData,
            user,
          },
        });

        // expect
        expect(getByTestId('chartkey-capacity-types')).toBeInTheDocument();
      });

      it('renders capacity types data from refData', () => {
        // arrange
        const { getByTestId } = render(<MarketSheet />, {
          initialState: {
            placement: placementWithPolicies,
            referenceData,
            user,
          },
        });

        // expect
        expect(within(getByTestId('chartkey-capacity-types')).getByText('London')).toBeInTheDocument();
        expect(within(getByTestId('chartkey-capacity-types')).getByText('Europe')).toBeInTheDocument();
        expect(within(getByTestId('chartkey-capacity-types')).getByText('Bermuda')).toBeInTheDocument();
        expect(within(getByTestId('chartkey-capacity-types')).queryByText('Other')).not.toBeInTheDocument();
      });

      it('renders capacity types data from placement config if available', () => {
        // arrange
        const placement = Object.assign({}, placementWithPolicies);
        placement.selected.config = {
          capacity: [
            { id: 1, color: 'yellow', name: 'New York' },
            { id: 2, color: 'lime', name: 'Los Angeles' },
          ],
        };

        const { getByTestId } = render(<MarketSheet />, {
          initialState: {
            placement: placement,
            referenceData,
            user,
          },
        });

        // expect
        expect(within(getByTestId('chartkey-capacity-types')).getByText('New York')).toBeInTheDocument();
        expect(within(getByTestId('chartkey-capacity-types')).getByText('Los Angeles')).toBeInTheDocument();
        expect(within(getByTestId('chartkey-capacity-types')).queryByText('London')).not.toBeInTheDocument();
        expect(within(getByTestId('chartkey-capacity-types')).queryByText('Europe')).not.toBeInTheDocument();
        expect(within(getByTestId('chartkey-capacity-types')).queryByText('Bermuda')).not.toBeInTheDocument();
      });

      it("doesn't render capacity types widget if not available", () => {
        // arrange
        const refDataWithoutCapacityTypes = { ...referenceData };
        refDataWithoutCapacityTypes.capacityTypes = [];

        const { queryByTestId } = render(<MarketSheet />, {
          initialState: {
            placement: placementWithPolicies,
            referenceData: refDataWithoutCapacityTypes,
            user,
          },
        });

        // expect
        expect(queryByTestId('chartkey-capacity-types')).not.toBeInTheDocument();
      });
    });

    describe('table', () => {
      it('renders market sheet table', () => {
        // arrange
        const { getByTestId } = render(<MarketSheet />, {
          initialState: {
            placement: placementWithPolicies,
            referenceData,
            user,
          },
        });

        // expect
        expect(getByTestId('market-sheet-table')).toBeInTheDocument();
      });

      it('renders the restricted action buttons by default if user is BROKER', () => {
        // arrange
        const { getByText, getAllByText } = render(<MarketSheet />, {
          initialState: {
            placement: placementWithPolicies,
            referenceData,
            user,
          },
        });

        // expect
        expect(getAllByText('placement.sheet.addLayer')).toHaveLength(1);
        expect(getByText('placement.sheet.editItems')).toBeInTheDocument();
      });

      it("doesn't render the restricted action buttons if user is not BROKER", () => {
        // arrange
        const { queryByText } = render(<MarketSheet />, {
          initialState: {
            placement: placementWithPolicies,
            referenceData,
            user: { role: 'FOO' },
          },
        });

        // expect
        expect(queryByText('placement.sheet.addLayer')).not.toBeInTheDocument();
        expect(queryByText('placement.sheet.editItems')).not.toBeInTheDocument();
      });

      it('renders the bulk edit button with the correct label if bulk editing policies', () => {
        // arrange
        const { queryByText, getByText } = render(<MarketSheet />, {
          initialState: {
            placement: {
              ...placementWithPolicies,
              bulk: { type: 'policy' },
            },
            referenceData,
            user,
          },
        });

        // expect
        expect(queryByText('placement.sheet.editItems')).not.toBeInTheDocument();
        expect(getByText('placement.sheet.editNumPolicies')).toBeInTheDocument();
        expect(queryByText('placement.sheet.editNumMarkets')).not.toBeInTheDocument();
      });

      it('renders the bulk edit button with the correct label if bulk editing policy markets', () => {
        // arrange
        const { queryByText, getByText } = render(<MarketSheet />, {
          initialState: {
            placement: {
              ...placementWithPolicies,
              bulk: { type: 'policyMarket' },
            },
            referenceData,
            user,
          },
        });

        // expect
        expect(queryByText('placement.sheet.editItems')).not.toBeInTheDocument();
        expect(queryByText('placement.sheet.editNumPolicies')).not.toBeInTheDocument();
        expect(getByText('placement.sheet.editNumMarkets')).toBeInTheDocument();
      });
    });
  });

  describe('@actions', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('renders "hide mudmap" button after toggling the mudmap visible', () => {
      // arrange
      const { getByText, queryByText } = render(<MarketSheet />, {
        initialState: {
          placement: placementWithPolicies,
          referenceData,
          user,
        },
      });

      // expect
      expect(getByText('placement.sheet.mudmap.hide')).toBeInTheDocument();
      expect(queryByText('placement.sheet.mudmap.show')).not.toBeInTheDocument();

      // act
      fireEvent.click(getByText('placement.sheet.mudmap.hide'));

      // expect
      expect(queryByText('placement.sheet.mudmap.hide')).not.toBeInTheDocument();
      expect(getByText('placement.sheet.mudmap.show')).toBeInTheDocument();

      // act
      fireEvent.click(getByText('placement.sheet.mudmap.show'));

      // expect
      expect(getByText('placement.sheet.mudmap.hide')).toBeInTheDocument();
      expect(queryByText('placement.sheet.mudmap.show')).not.toBeInTheDocument();
    });

    it('saves the mudmap state to local storage', () => {
      // arrange
      const { getByText, queryByText } = render(<MarketSheet />, {
        initialState: {
          placement: placementWithPolicies,
          referenceData,
          user,
        },
      });

      // expect
      expect(localStorage.getItem('edge-mudmap-expanded')).toBeNull();
      expect(getByText('placement.sheet.mudmap.hide')).toBeInTheDocument();
      expect(queryByText('placement.sheet.mudmap.show')).not.toBeInTheDocument();

      // act
      fireEvent.click(getByText('placement.sheet.mudmap.hide'));

      // expect
      expect(localStorage.getItem('edge-mudmap-expanded')).toBe('false');
      expect(queryByText('placement.sheet.mudmap.hide')).not.toBeInTheDocument();
      expect(getByText('placement.sheet.mudmap.show')).toBeInTheDocument();

      // act
      fireEvent.click(getByText('placement.sheet.mudmap.show'));

      // expect
      expect(localStorage.getItem('edge-mudmap-expanded')).toBe('true');
      expect(getByText('placement.sheet.mudmap.hide')).toBeInTheDocument();
      expect(queryByText('placement.sheet.mudmap.show')).not.toBeInTheDocument();
    });
  });
});
