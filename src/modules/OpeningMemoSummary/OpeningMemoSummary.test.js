import React from 'react';
import { fireEvent, render, waitFor } from 'tests';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom/extend-expect';
import MockDate from 'mockdate';

// app
import * as openingMemoPutActions from 'stores/openingMemo/openingMemo.actions.put';
import OpeningMemoSummary from './OpeningMemoSummary';

jest.mock('stores/openingMemo/openingMemo.actions.put', () => {
  return {
    __esModule: true,
    ...jest.requireActual('stores/openingMemo/openingMemo.actions.put'),
    updateOpeningMemo: jest.fn(),
  };
});

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
}));

describe('MODULES › OpeningMemoSummary', () => {
  const initialState = {
    openingMemo: {
      selected: {
        id: 1234,
        accountHandler: { fullName: 'Jermaine Stephenson' },
        accountHandlerApprovalDate: '2020-02-10',
        isAccountHandlerApproved: false,
        authorisedSignatory: { fullName: 'Mari Dawson' },
        authorisedSignatoryApprovalDate: '2020-12-10',
        isAuthorisedSignatoryApproved: true,
        status: 'APPROVED',
      },
    },
    user: { departmentSelected: 333 },
    referenceData: { departments: [{ id: 333, name: 'bar', users: [{ role: 'BROKER', fullName: 'Jermaine Stephenson' }] }] },
  };

  beforeEach(() => {
    MockDate.set('2019');
    jest.clearAllMocks();
  });

  afterEach(() => {
    MockDate.reset();
    fetchMock.restore();
  });

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      render(<OpeningMemoSummary />);
    });
    it('renders with the correct status', () => {
      // arrange
      const { getByText } = render(<OpeningMemoSummary />, { initialState });

      // assert
      expect(getByText('status.approved')).toBeInTheDocument();
    });
    it('renders Approval components with correct users', () => {
      // arrange
      const { getByText } = render(<OpeningMemoSummary />, { initialState });

      // assert
      expect(getByText('placement.openingMemo.approvers.accountHandler')).toBeInTheDocument();
      expect(getByText('Jermaine Stephenson')).toBeInTheDocument();
      expect(getByText('app.approve')).toBeInTheDocument();
      expect(getByText('placement.openingMemo.approvers.authorisedSignatory')).toBeInTheDocument();
      expect(getByText('Mari Dawson')).toBeInTheDocument();
      expect(getByText('app.approved: format.date(2020-12-10)')).toBeInTheDocument();
    });
    it('renders message `selectHandlerFirst` if handler not selected', () => {
      // arrange
      const state = {
        ...initialState,
        openingMemo: {
          selected: {
            id: 1234,
            accountHandler: null,
            accountHandlerApprovalDate: null,
            isAccountHandlerApproved: false,
            authorisedSignatory: { fullName: 'Mari Dawson' },
            authorisedSignatoryApprovalDate: null,
            isAuthorisedSignatoryApproved: false,
            status: 'AWAITING APPROVED',
          },
        },
      };
      const { getByText, queryByText } = render(<OpeningMemoSummary />, { initialState: state });

      // assert
      expect(getByText('openingMemo.selectHandlerFirst')).toBeInTheDocument();
      expect(queryByText('openingMemo.selectSignatoryFirst')).not.toBeInTheDocument();
      expect(queryByText('openingMemo.saveBeforeApproving')).not.toBeInTheDocument();
    });
    it('renders message `selectSignatoryFirst` if signatory not selected', () => {
      // arrange
      const state = {
        ...initialState,
        openingMemo: {
          selected: {
            id: 1234,
            accountHandler: { fullName: 'Mari Dawson' },
            accountHandlerApprovalDate: null,
            isAccountHandlerApproved: false,
            authorisedSignatory: null,
            authorisedSignatoryApprovalDate: null,
            isAuthorisedSignatoryApproved: false,
            status: 'AWAITING APPROVED',
          },
        },
      };
      const { getByText, queryByText } = render(<OpeningMemoSummary />, { initialState: state });

      // assert
      expect(queryByText('openingMemo.selectHandlerFirst')).not.toBeInTheDocument();
      expect(getByText('openingMemo.selectSignatoryFirst')).toBeInTheDocument();
      expect(queryByText('openingMemo.saveBeforeApproving')).not.toBeInTheDocument();
    });
    it('renders message if opening memo has not been saved', () => {
      // arrange
      const state = {
        ...initialState,
        openingMemo: {
          dirty: true,
          selected: {
            id: 1234,
            accountHandler: { fullName: 'Mari Dawson' },
            accountHandlerApprovalDate: null,
            isAccountHandlerApproved: false,
            authorisedSignatory: null,
            authorisedSignatoryApprovalDate: null,
            isAuthorisedSignatoryApproved: false,
            status: 'AWAITING APPROVED',
          },
        },
      };
      const { getByText, queryByText } = render(<OpeningMemoSummary />, { initialState: state });

      // assert
      expect(queryByText('openingMemo.selectHandlerFirst')).not.toBeInTheDocument();
      expect(queryByText('openingMemo.selectSignatoryFirst')).not.toBeInTheDocument();
      expect(getByText('openingMemo.saveBeforeApproving')).toBeInTheDocument();
    });
  });

  describe('@actions', () => {
    it('should save data from the form', async () => {
      // arrange
      fetchMock.put('*', { body: { status: 'success', data: {} } });
      const { getByText } = render(<OpeningMemoSummary />, { initialState });
      const spyUpdateOpeningMemo = jest.spyOn(openingMemoPutActions, 'updateOpeningMemo');

      // act
      await waitFor(() => getByText('app.approve'));
      fireEvent.click(getByText('app.approve'));

      // assert
      expect(spyUpdateOpeningMemo).toHaveBeenCalledWith(
        {
          isAccountHandlerApproved: true,
          accountHandlerApprovalDate: new Date(),
        },
        1234
      );
    });
  });
});
