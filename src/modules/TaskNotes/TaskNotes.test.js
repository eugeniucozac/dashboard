import React from 'react';
import { render, screen, within } from 'tests';
import TaskNotes from './TaskNotes';
import fetchMock from 'fetch-mock';
import { FormDate, MultiSelect, TableFilters } from 'components';
import * as utils from 'utils';

const claim = { taskId: 'ea7e6188-155f-11ec-8c81-0242ac100e02' };

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
    id: 863,
    name: 'Arun Arumugam',
  },
  {
    id: 773,
    name: 'Bhavanasi Meghana',
  },
  {
    id: 771,
    name: 'Brijesh Jora',
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
    id: 'lastUpdatedBy',
    type: 'multiSelect',
    label: utils.string.t('claims.notes.columns.updatedBy'),
    value: [],
    options: users,
    content: <MultiSelect id="lastUpdatedBy" search options={users} />,
  },
];

const responseDataNotes = [
  {
    id: 1,
    notesDescription: 'note number 1',
    createdDate: '2021-01-01T01:00:00',
    createdByName: 'Alex The Great',
    updatedDate: '2021-01-02T12:00:00',
    updatedByName: 'Alice in Wonderland',
  },
  {
    id: 2,
    notesDescription: 'note number 2',
    createdDate: '2021-02-03T03:00:00',
    createdByName: 'Bob the Builder',
    updatedDate: '2021-02-04T14:00:00',
    updatedByName: 'Barbara',
  },
  {
    id: 3,
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

describe('MODULES › TaskNotes', () => {
  describe('@render', () => {
    beforeEach(() => {
      fetchMock.post('glob:*/notes/task/*/search', { body: { status: 'OK', data: responseDataNotes } });
      fetchMock.get('glob:*/api/users*', { body: { status: 'OK', data: responseDataUsers } });
    });

    afterEach(() => {
      jest.clearAllMocks();
      fetchMock.restore();
    });

    it('renders filters toggle button', () => {
      // arrange
      render(
        <TaskNotes taskObj={claim}>
          <TableFilters filtersArray={filtersArray} />
        </TaskNotes>
      );

      // assert
      expect(screen.queryByText(utils.string.t('claims.notes.tableFilters.dateCreated'))).toBeInTheDocument();
      expect(screen.queryByText(utils.string.t('claims.notes.tableFilters.lastUpdatedDate'))).toBeInTheDocument();
    });

    it('renders table columns', () => {
      // arrange
      render(<TaskNotes taskObj={claim} />);
      const tableHead = screen.getByTestId('claim-task-notes-table').querySelector('thead');

      // assert
      expect(within(tableHead).getByText('claims.notes.columns.dateCreated')).toBeInTheDocument();
      expect(within(tableHead).getByText('claims.notes.columns.createdBy')).toBeInTheDocument();
      expect(within(tableHead).getByText('claims.notes.columns.detail')).toBeInTheDocument();
      expect(within(tableHead).getByText('claims.notes.columns.dateUpdated')).toBeInTheDocument();
      expect(within(tableHead).getByText('claims.notes.columns.updatedBy')).toBeInTheDocument();
    });

    it('renders table pagination', () => {
      // arrange
      render(<TaskNotes taskObj={claim} />);

      // assert
      expect(screen.getByTestId('pagination-claim-task-notes')).toBeInTheDocument();
    });

    it('renders table search field', () => {
      // arrange
      render(<TaskNotes taskObj={claim} />);

      // assert
      expect(screen.getByTestId('form-search')).toBeInTheDocument();
      expect(screen.getByTestId('search-button-go')).toBeInTheDocument();
    });
  });
});
