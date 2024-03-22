import React from 'react';
import { useParams } from 'react-router';
import fetchMock from 'fetch-mock';
import {
  fireEvent,
  render,
  waitFor,
  act,
  mockIntersectionObserver,
  getFormRadio,
  getFormCheckbox,
  getFormText,
  getFormTextarea,
} from 'tests';
import * as openingMemoPutActions from 'stores/openingMemo/openingMemo.actions.put';
import OpeningMemoContent from './OpeningMemoContent';

const mockLineItems = {
  accountExecutive: null,
  attachedTo: '',
  clientContactName: '',
  clientEmail: '',
  departmentId: 333,
  eocInvoiceContactName: '',
  eocInvoiceEmail: '',
  expiryDate: null,
  inceptionDate: null,
  invoicingClient: '',
  lineItems: {
    atlas: { accountHandler: '', isAuthorised: false },
    bars: { accountHandler: '', isAuthorised: false },
    demandsNeeds: { accountHandler: '', isAuthorised: false },
    dutyOfDisclosure: { accountHandler: '', isAuthorised: false, itemDate: undefined },
    evidence: { accountHandler: '', isAuthorised: false, itemDate: undefined },
    quotesPutUp: { accountHandler: '', isAuthorised: true, itemDate: undefined },
    slipsSigned: { accountHandler: '', isAuthorised: false },
    allMarketsApproved: { accountHandler: '', isAuthorised: false },
    allUnderwriter: { accountHandler: '', isAuthorised: false },
    allWrittenLines: { accountHandler: '', isAuthorised: false },
    confirmSanctioned: { accountHandler: '', isAuthorised: false },
    contractCertainty: { accountHandler: '', isAuthorised: false },
    fees: { accountHandler: '', isAuthorised: false },
    grossPremium: { accountHandler: '', isAuthorised: false },
    informationClearlyStated: { accountHandler: '', isAuthorised: false },
    marketSheet: { accountHandler: '', isAuthorised: false },
    otherDeductions: { accountHandler: '', isAuthorised: false },
    paymentBasis: { accountHandler: '', isAuthorised: false },
    paymentTerms: { accountHandler: '', isAuthorised: false },
    ppwPPC: { itemDate: undefined, accountHandler: '', isAuthorised: false },
    premiumTax: { accountHandler: '', isAuthorised: false },
    riskCodes: { accountHandler: '', isAuthorised: false },
    settlementCurrency: { isAuthorised: false },
    signedLines: { accountHandler: '', isAuthorised: false },
    slipOrder: { accountHandler: '', isAuthorised: false },
    subscriptionAgreement: { accountHandler: '', isAuthorised: false },
    thirdParty: { accountHandler: '', isAuthorised: false },
    totalBrokerage: { accountHandler: '', isAuthorised: false },
    totalClientDiscount: { accountHandler: '', isAuthorised: false },
    totalPfInternal: { accountHandler: '', isAuthorised: false },
    totalRetainedBrokerage: { accountHandler: '', isAuthorised: false },
    totalThirdParty: { accountHandler: '', isAuthorised: false },
    retainedBrokerageAmount: { premiumCurrency: 'USD' },
  },
  listOfRisks: '',
  newRenewalBusinessId: '',
  notes: '',
  originator: null,
  placementType: 'OPEN_MARKET',
  placingBroker: null,
  producingBroker: null,
  reInsured: '',
};

jest.mock('stores/openingMemo/openingMemo.actions.put', () => {
  return {
    __esModule: true,
    ...jest.requireActual('stores/openingMemo/openingMemo.actions.put'),
    updateOpeningMemo: jest.fn(),
  };
});

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useParams: jest.fn(),
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
}));

describe('MODULES › OpeningMemoContent', () => {
  beforeEach(() => {
    mockIntersectionObserver();
    jest.clearAllMocks();
    useParams.mockReturnValue({ openingMemoId: '1234' });
  });

  afterEach(() => {
    fetchMock.restore();
  });

  const initialState = {
    openingMemo: {
      selected: {
        id: 111,
        departmentId: 333,
        uniqueMarketReference: 112,
        status: 'APPROVED',
      },
    },
    users: [{ id: 1, fullName: 'Joe Smith', role: 'BROKER' }],
    referenceData: { departments: [{ id: 333, name: 'Bar' }], newRenewalBusinesses: [{ id: 1, description: 'one' }] },
  };

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<OpeningMemoContent />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('save/cancel button should not be in the document on load', async () => {
      // arrange
      const { queryByText } = render(<OpeningMemoContent />, { initialState });

      // assert
      expect(queryByText('save')).not.toBeInTheDocument();
      expect(queryByText('cancel')).not.toBeInTheDocument();
    });
  });

  describe('@actions', () => {
    it('should show the save bar when editing the form', async () => {
      // arrange
      const { getByText, getByLabelText } = render(<OpeningMemoContent />, { initialState });
      const checkbox = document.querySelector(getFormCheckbox('lineItems.quotesPutUp.isAuthorised'));
      const email = document.querySelector(getFormText('clientEmail'));
      const notes = document.querySelector(getFormTextarea('notes'));

      // act
      // fireEvent.change(email, { target: { value: 'email mock' } });
      // fireEvent.change(notes, { target: { value: 'notes mock' } });
      // fireEvent.click(checkbox);
      //  await waitFor(() => getByText('app.save'));
      // await waitFor(() => getByText('app.cancel'));

      // assert
      /* expect(getByLabelText('placement.openingMemo.summary.rows.clientEmail.label')).toHaveValue('email mock');
      expect(getByLabelText('placement.openingMemo.specialInstructions.notes.label')).toHaveValue('notes mock');
      expect(checkbox.checked).toEqual(true);
      expect(getByText('app.save')).toBeInTheDocument();
      expect(getByText('app.cancel')).toBeInTheDocument(); */
    }, 10000);

    it('should reset the form on clicking cancel', async () => {
      // arrange
      const { getByText, getByLabelText } = render(<OpeningMemoContent />, { initialState });
      const checkbox = document.querySelector(getFormCheckbox('lineItems.quotesPutUp.isAuthorised'));
      const email = document.querySelector(getFormText('clientEmail'));
      const notes = document.querySelector(getFormTextarea('notes'));

      // act
      fireEvent.change(email, { target: { value: 'email mock' } });
      fireEvent.change(notes, { target: { value: 'notes mock' } });
      fireEvent.click(checkbox);
      await waitFor(() => getByText('app.cancel'));
      fireEvent.click(getByText('app.cancel'));

      // assert
      expect(getByLabelText('placement.openingMemo.summary.rows.clientEmail.label')).toHaveValue('');
      expect(getByLabelText('placement.openingMemo.specialInstructions.notes.label')).toHaveValue('');
      expect(checkbox.checked).toEqual(false);
    }, 10000);

    it("should NOT save data if the form validation didn't pass", async () => {
      // arrange
      fetchMock.put('*', { body: { status: 'success', data: {} } });
      const { getByText, container } = render(<OpeningMemoContent />, { initialState });
      const checkbox = document.querySelector(getFormCheckbox('lineItems.quotesPutUp.isAuthorised'));
      const spyUpdateOpeningMemo = jest.spyOn(openingMemoPutActions, 'updateOpeningMemo');

      // act
      //    fireEvent.click(checkbox);
      //  await waitFor(() => getByText('app.save'));
      //  await act(async () => fireEvent.submit(container.querySelector('form')));

      // assert
      //  expect(checkbox.checked).toEqual(true);
      //  expect(spyUpdateOpeningMemo).not.toHaveBeenCalledWith();
    }, 10000);

    it('should save data from the form', async () => {
      // arrange
      /* fetchMock.put('*', { body: { status: 'success', data: {} } });
      const { getByText, container } = render(<OpeningMemoContent />, { initialState });
      const radio = document.querySelector(getFormRadio('placementType', 'OPEN_MARKET'));
      const checkbox = document.querySelector(getFormCheckbox('lineItems.quotesPutUp.isAuthorised'));
      const spyUpdateOpeningMemo = jest.spyOn(openingMemoPutActions, 'updateOpeningMemo');

      // act
      fireEvent.click(radio); // this field is required
      fireEvent.click(checkbox);
      await waitFor(() => getByText('app.save'));
      await act(async () => fireEvent.submit(container.querySelector('form')));

      // assert
      expect(checkbox.checked).toEqual(true);
      expect(spyUpdateOpeningMemo).toHaveBeenCalledWith(mockLineItems, '1234'); */
    }, 10000);
  });
});
