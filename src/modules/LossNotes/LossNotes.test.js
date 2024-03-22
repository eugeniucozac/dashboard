import React from 'react';
import { render, screen, waitFor, within } from 'tests';
import LossNotes from './LossNotes';
import fetchMock from 'fetch-mock';
import { FormDate, MultiSelect, TableFilters } from 'components';
import * as utils from 'utils';

const initialState = {
  referenceData: {
    processTypes: [{ processTypeDetails: 'ClaimsLoss' }],
  },
};

const claim = { lossDetailId: 423730 };

const dateFields = [
  {
    name: 'dateCreated',
    type: 'datepicker',
    value: null,
  },
  {
    name: 'lastUpdatedDate',
    type: 'datepicker',
    value: null,
  },
];

const users = [
  {
    id: 700,
    fullName: 'Anitha MM',
    firstName: 'Anitha',
    lastName: 'MM',
    email: 'anitham@mphasis.com',
    contactNumber: '8087988776',
    roleId: '12',
    role: 'Account Executive',
    departments: 'International Energy-XB_Labuan, Property & Casualty-XB_UAE',
    departmentIds: '1-4, 2-3',
    groups: 'Front Office',
    groupIds: '3',
    xbInstances: 'XB_Labuan, XB_UAE',
    xbInstanceIds: '3, 4',
    businessProcesses: 'Claims, Premium Processing',
    businessProcessIds: '1, 3',
    organisationId: '2',
    organisationName: 'Ardonagh',
  },
  {
    id: 531,
    fullName: 'Anitha Moorthy',
    firstName: 'Anitha',
    lastName: 'Moorthy',
    email: 'anithamoorthy@mphasis.com',
    contactNumber: '9876543210',
    roleId: '1',
    role: 'Junior Technician',
    departments: 'International Energy-XB_Labuan, Property & Casualty-XB_UAE',
    departmentIds: '1-4, 2-3',
    groups: 'Back Office, Front Office',
    groupIds: '2, 3',
    xbInstances: 'XB_Labuan, XB_UAE',
    xbInstanceIds: '3, 4',
    businessProcesses: 'Claims, Premium Processing',
    businessProcessIds: '1, 3',
    organisationId: '2',
    organisationName: 'Ardonagh',
  },
  {
    id: 879,
    fullName: 'Arun Agrawal',
    firstName: 'Arun',
    lastName: 'Agrawal',
    email: 'arun.agrawal@Ardonaghspecialty.com',
    contactNumber: '',
    roleId: '14',
    role: 'Super User',
    departments: 'Property & Casualty-XB_London',
    departmentIds: '1-1',
    groups: 'Claim Admin',
    groupIds: '5',
    xbInstances: 'XB_London',
    xbInstanceIds: '1',
    businessProcesses: 'Claims',
    businessProcessIds: '3',
    organisationId: '1',
    organisationName: 'Mphasis',
  },
];

const filtersArray = [
  {
    id: 'dateCreated',
    type: 'datepicker',
    label: utils.string.t('claims.notes.tableFilters.dateCreated'),
    value: '',
    content: (
      <FormDate
        {...utils.form.getFieldProps(dateFields, 'dateCreated')}
        id="datepicker"
        label={''}
        plainText
        plainTextIcon
        placeholder={utils.string.t('app.selectDate')}
        muiComponentProps={{
          fullWidth: false,
          margin: 'dense',
        }}
        muiPickerProps={{
          clearable: false,
          variant: 'inline',
          format: 'DD-MM-YYYY',
        }}
      />
    ),
  },
  {
    id: 'createdBy',
    'data-testid': 'filter-created-by',
    type: 'multiSelect',
    label: utils.string.t('claims.notes.columns.createdBy'),
    value: [],
    options: users,
    content: <MultiSelect id="createdBy" search options={users} />,
  },
  {
    id: 'lastUpdatedDate',
    type: 'datepicker',
    label: utils.string.t('claims.notes.tableFilters.lastUpdatedDate'),
    value: '',
    content: (
      <FormDate
        {...utils.form.getFieldProps(dateFields, 'lastUpdatedDate')}
        id="datepicker"
        label={''}
        plainText
        plainTextIcon
        placeholder={utils.string.t('app.selectDate')}
        muiComponentProps={{
          fullWidth: false,
          margin: 'dense',
        }}
        muiPickerProps={{
          clearable: false,
          variant: 'inline',
          format: 'DD-MM-YYYY',
        }}
      />
    ),
  },
  {
    id: 'updatedBy',
    type: 'multiSelect',
    label: utils.string.t('claims.notes.columns.updatedBy'),
    value: [],
    options: users,
    content: <MultiSelect id="updatedBy" search options={users} />,
  },
];

const responseDataNotes = [
  {
    caseIncidentNotesID: 1,
    notesDescription: 'note number 1',
    createdDate: '2021-01-01T01:00:00',
    createdByName: 'Alex The Great',
    updatedDate: '2021-01-02T12:00:00',
    updatedByName: 'Alice in Wonderland',
  },
  {
    caseIncidentNotesID: 2,
    notesDescription: 'note number 2',
    createdDate: '2021-02-03T03:00:00',
    createdByName: 'Bob the Builder',
    updatedDate: '2021-02-04T14:00:00',
    updatedByName: 'Barbara',
  },
  {
    caseIncidentNotesID: 3,
    notesDescription: 'note number 3',
    createdDate: '2021-03-05T05:00:00',
    createdByName: 'Chris',
    updatedDate: '2021-03-06T16:00:00',
    updatedByName: 'Chrissy',
  },
];

const responseDataUsers = [
  {
    id: 1,
    fullName: 'Jonathan',
  },
  {
    id: 2,
    fullName: 'Henrik',
  },
];

describe('MODULES › LossNotes', () => {
  describe('@render', () => {
    beforeEach(() => {
      fetchMock.get('glob:*/workflow/process/*', { body: { status: 'OK', data: { caseIncidentID: 1 } } });
      fetchMock.post('glob:*/case/bpm/claim/searchNotes', { body: { status: 'OK', data: { searchValue: responseDataNotes } } });
      fetchMock.get('glob:*/api/users*', { body: { status: 'OK', data: responseDataUsers } });
    });

    afterEach(() => {
      jest.clearAllMocks();
      fetchMock.restore();
    });

    it('renders filters toggle button', async () => {
      // arrange
      render(
        <LossNotes lossObj={claim}>
          <TableFilters filtersArray={filtersArray} />
        </LossNotes>,
        { initialState }
      );

      await waitFor(() => expect(screen.queryByText('claims.notes.notFound')).not.toBeInTheDocument());

      // assert
      expect(screen.queryByText(utils.string.t('claims.notes.tableFilters.dateCreated'))).toBeInTheDocument();
      expect(screen.queryByText(utils.string.t('claims.notes.tableFilters.lastUpdatedDate'))).toBeInTheDocument();
    });

    it('renders add notes button', async () => {
      // arrange
      render(<LossNotes lossObj={claim} />, { initialState });

      await waitFor(() => expect(screen.queryByText('claims.notes.notFound')).not.toBeInTheDocument());

      // assert
      expect(screen.getByText('claims.notes.addNote')).toBeInTheDocument();
    });

    it('renders table columns', async () => {
      // arrange
      render(<LossNotes lossObj={claim} />, { initialState });
      const tableHead = screen.getByTestId('claim-notes-table').querySelector('thead');

      await waitFor(() => expect(screen.queryByText('claims.notes.notFound')).not.toBeInTheDocument());

      // assert
      expect(within(tableHead).getByText('claims.notes.columns.dateCreated')).toBeInTheDocument();
      expect(within(tableHead).getByText('claims.notes.columns.createdBy')).toBeInTheDocument();
      expect(within(tableHead).getByText('claims.notes.columns.detail')).toBeInTheDocument();
      expect(within(tableHead).getByText('claims.notes.columns.dateUpdated')).toBeInTheDocument();
      expect(within(tableHead).getByText('claims.notes.columns.updatedBy')).toBeInTheDocument();
    });

    it('renders table pagination', async () => {
      // arrange
      render(<LossNotes lossObj={claim} />, { initialState });

      await waitFor(() => expect(screen.queryByText('claims.notes.notFound')).not.toBeInTheDocument());

      // assert
      expect(screen.getByTestId('pagination-claim-notes')).toBeInTheDocument();
    });

    it('renders table search field', async () => {
      // arrange
      render(<LossNotes lossObj={claim} />, { initialState });

      await waitFor(() => expect(screen.queryByText('claims.notes.notFound')).not.toBeInTheDocument());

      // assert
      expect(screen.getByTestId('form-search')).toBeInTheDocument();
      expect(screen.getByTestId('search-button-go')).toBeInTheDocument();
    });

    it('renders table row data', async () => {
      // arrange
      render(<LossNotes lossObj={claim} />, { initialState });

      await waitFor(() => expect(screen.queryByText('claims.notes.notFound')).not.toBeInTheDocument());

      // arrange
      jest.clearAllMocks();
      fetchMock.restore();
    });
  });
});
