import React from 'react';
import Placement from './Placement';
import { render, waitFor, within } from 'tests';
import { useParams } from 'react-router';
import fetchMock from 'fetch-mock';
import merge from 'lodash/merge';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useParams: jest.fn(),
}));

describe('PAGES › Placement', () => {
  const initialState = {
    placement: {
      selected: {
        id: 100,
        departmentId: 21,
        statusId: 4,
        locations: [],
      },
    },
    referenceData: {
      capacityTypes: [{ id: 1, name: 'Capacity Type 1' }],
      departments: [
        { id: 1, name: 'Dept 1' },
        { id: 21, name: 'Dept 21' },
        { id: 999, name: 'Dept 999 NOT Physical Loss' },
      ],
      statuses: {
        placement: [
          { id: 1, code: 'Open' },
          { id: 4, code: 'Bound' },
        ],
      },
      loaded: true,
    },
  };

  const initialStateBroker = merge({}, initialState, {
    user: {
      role: 'BROKER',
    },
  });

  const initialStateNonPhysicalLoss = merge({}, initialState, {
    placement: {
      selected: {
        departmentId: 999,
      },
    },
  });

  const initialStatePlacementNotLoaded = merge({}, initialState, {
    placement: {
      selected: {},
    },
  });

  const initialStateRefDataNotLoaded = merge({}, initialState, {
    referenceData: {
      loaded: false,
    },
  });

  const route = ['/placement/overview/100'];

  const underwriters = [
    { id: 1, firstName: 'John', lastName: 'Johnson', emailId: 'jj@abc.com' },
    { id: 2, firstName: 'Steve', lastName: 'Stevenson', emailId: 'ss@abc.com' },
    { id: 3, firstName: 'Mark', lastName: '', emailId: 'm@abc.com' },
    { id: 4, firstName: 'Frank', lastName: 'Frankenson', emailId: 'ff@abc.com' },
  ];

  const marketsData = [
    { id: 1, statusId: 1, market: { id: 10, edgeName: 'market10', statusId: 1, capacityTypeId: 1 }, underwriter: null },
    { id: 2, statusId: 2, market: { id: 20, edgeName: 'market20', statusId: 2, capacityTypeId: 1 }, underwriter: underwriters[1] },
    { id: 3, statusId: 3, market: { id: 30, edgeName: 'market30', statusId: 3, capacityTypeId: 2 }, underwriter: underwriters[2] },
    { id: 4, statusId: null, market: { id: 40, edgeName: 'market40', statusId: null, capacityTypeId: 2 }, underwriter: underwriters[3] },
    { id: 5, statusId: null, market: { id: 50, edgeName: 'market50', capacityTypeId: null }, underwriters: null },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useParams.mockReturnValue({ id: 100 });
    fetchMock.get('glob:*/api/departmentMarket/department/*', { body: { status: 'success', data: [] } });
    fetchMock.get('glob:*/api/placementMarket/placement/*', { body: { status: 'success', data: marketsData } });
    fetchMock.get('glob:*/api/modelling/placement/*', { body: { status: 'success', data: {} } });
    fetchMock.get('glob:*/api/analytics/placement/*', { body: { status: 'success', data: {} } });
    fetchMock.get('glob:*/api/placement/*', { body: { status: 'success', data: initialState.placement.selected } });
    fetchMock.get('glob:*/api/placements/*', { body: { status: 'success', data: {} } });
    fetchMock.get('glob:*/api/document/*', { body: { status: 'success', data: {} } });
    fetchMock.get('glob:*/api/locations/*', { body: { status: 'success', data: [] } });
  });

  afterEach(() => {
    fetchMock.restore();
  });

  describe('@render', () => {
    it('renders nothing until selected placement is loaded', () => {
      // arrange
      const { container } = render(<Placement />, { initialStatePlacementNotLoaded, route });

      // assert
      expect(container).toBeEmptyDOMElement();
    });

    it('renders nothing until refData is loaded', () => {
      // arrange
      const { container } = render(<Placement />, { initialStateRefDataNotLoaded, route });

      // assert
      expect(container).toBeEmptyDOMElement();
    });

    it('renders the page title', async () => {
      // arrange
      render(<Placement />, { initialState });

      // assert
      await waitFor(() => expect(document.title).toContain('app.placement'));
    });

    it('renders the Overview component by default', async () => {
      // arrange
      const { getByTestId } = render(<Placement />, { initialState, route: ['/placement/overview/100'] });

      // assert
      await waitFor(() => expect(getByTestId('page-header-placement-overview')).toBeInTheDocument());
    });

    it('renders the Market Sheet component', async () => {
      // arrange
      const { getByTestId } = render(<Placement />, { initialState, route: ['/placement/market-sheet/100'] });

      // assert
      await waitFor(() => expect(getByTestId('page-header-placement-market-sheet-title')).toBeInTheDocument());
    });

    it('renders the Modelling List component for BROKER only', async () => {
      // arrange
      const { getByTestId } = render(<Placement />, { initialState: initialStateBroker, route: ['/placement/modelling/100'] });

      // assert
      await waitFor(() => expect(getByTestId('page-header-placement-modelling-title')).toBeInTheDocument());
    });

    it("doesn't render the Modelling List component for non-BROKER user", async () => {
      // arrange
      const { getByTestId, queryByTestId } = render(<Placement />, { initialState, route: ['/placement/modelling/100'] });

      // assert
      await waitFor(() => expect(getByTestId('breadcrumb')).toBeInTheDocument());
      expect(queryByTestId('page-header-placement-modelling-title')).not.toBeInTheDocument();
    });
    //

    it('renders the Opening Memo component for BROKER only', async () => {
      // arrange
      const { getByTestId } = render(<Placement />, { initialState: initialStateBroker, route: ['/placement/checklist/100'] });

      // assert
      await waitFor(() => expect(getByTestId('page-header-opening-memo-title')).toBeInTheDocument());
    });

    it("doesn't render the Opening Memo component for non-BROKER user", async () => {
      // arrange
      const { getByTestId, queryByTestId } = render(<Placement />, { initialState, route: ['/placement/checklist/100'] });

      // assert
      await waitFor(() => expect(getByTestId('breadcrumb')).toBeInTheDocument());
      expect(queryByTestId('page-header-opening-memo-title')).not.toBeInTheDocument();
    });
    //
    it('renders the Bound component', async () => {
      // arrange
      const { getByTestId } = render(<Placement />, { initialState, route: ['/placement/bound/100'] });

      // assert
      await waitFor(() => expect(getByTestId('page-header-placement-bound-title')).toBeInTheDocument());
    });

    it('renders the Documents component', async () => {
      // arrange
      const { getByTestId } = render(<Placement />, { initialState, route: ['/placement/documents/100'] });

      // assert
      await waitFor(() => expect(getByTestId('page-header-placement-documents-title')).toBeInTheDocument());
    });
  });

  describe('Breadcrumb', () => {
    describe('@render', () => {
      it('should render as expected for non-BROKER user with physical loss placement', () => {
        // arrange
        const { getByTestId } = render(<Placement />, { initialState, route });

        // assert
        expect(within(getByTestId('breadcrumb')).getByText('placement.overview.title')).toBeInTheDocument();
        expect(within(getByTestId('breadcrumb')).getByText('placement.marketing.title')).toBeInTheDocument();
        expect(within(getByTestId('breadcrumb')).queryByText('placement.modelling.title')).not.toBeInTheDocument();
        expect(within(getByTestId('breadcrumb')).queryByText('placement.openingMemo.title')).not.toBeInTheDocument();
        expect(within(getByTestId('breadcrumb')).getByText('placement.bound.title')).toBeInTheDocument();
        expect(within(getByTestId('breadcrumb')).getByText('placement.document.title')).toBeInTheDocument();
      });

      it('should render as expected for BROKER user', () => {
        // arrange
        const { getByTestId } = render(<Placement />, { initialState: initialStateBroker, route });

        // assert
        expect(within(getByTestId('breadcrumb')).getByText('placement.overview.title')).toBeInTheDocument();
        expect(within(getByTestId('breadcrumb')).getByText('placement.marketing.title')).toBeInTheDocument();
        expect(within(getByTestId('breadcrumb')).getByText('placement.modelling.title')).toBeInTheDocument();
        expect(within(getByTestId('breadcrumb')).getByText('placement.openingMemo.title')).toBeInTheDocument();
        expect(within(getByTestId('breadcrumb')).getByText('placement.bound.title')).toBeInTheDocument();
        expect(within(getByTestId('breadcrumb')).getByText('placement.document.title')).toBeInTheDocument();
      });

      it('should render as expected for a non physical loss department', () => {
        // arrange
        const { getByTestId } = render(<Placement />, { initialState: initialStateNonPhysicalLoss, route });

        // assert
        expect(within(getByTestId('breadcrumb')).queryByText('placement.overview.title')).not.toBeInTheDocument();
        expect(within(getByTestId('breadcrumb')).getByText('placement.marketing.title')).toBeInTheDocument();
        expect(within(getByTestId('breadcrumb')).getByText('placement.bound.title')).toBeInTheDocument();
        expect(within(getByTestId('breadcrumb')).getByText('placement.document.title')).toBeInTheDocument();
      });
    });
  });
});
