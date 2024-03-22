import React from 'react';
import { render, screen, waitFor, within } from 'tests';
import ClaimRefNotes from './ClaimRefNotes';
import fetchMock from 'fetch-mock';
import { FormDate, MultiSelect, TableFilters } from 'components';
import * as utils from 'utils';

const claim = { claimId: '1004' };

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
  {
    id: 863,
    fullName: 'Arun Arumugam',
    firstName: 'Arun',
    lastName: 'Arumugam',
    email: 'Arun.Arumugam@ArdonaghSpecialty.com',
    contactNumber: '123456789',
    roleId: '14',
    role: 'Super User',
    departments:
      'Accident & Health-XB_Bermuda, Accident & Health-XB_Europe, Accident & Health-XB_Labuan, Accident & Health-XB_London, Accident & Health-XB_UAE, Aviation-XB_Bermuda, Aviation-XB_Europe, Aviation-XB_Labuan, Aviation-XB_London, Aviation-XB_UAE, BIB Binder Management-XB_Europe, BIB Commercial-XB_Europe, BIB Energy-XB_Europe, BIB International Binding Authority-XB_Europe, BIB International Casualty-XB_Europe, BIB Jewellers Block-XB_Europe, BIB Motor Fleet-XB_Europe, BIB North American Division-XB_Europe, BIB Nothern Ireland-XB_Europe, BIB Personal Accident & Contingency & Sports-XB_Europe, BIB Professional Indemnity-XB_Europe, BIB Reinsurance-XB_Europe, BIB UK Offshore & Marine Trades-XB_Europe, Binder Management-XB_BIG, Cargo-XB_Bermuda, Cargo-XB_Europe, Cargo-XB_Labuan, Cargo-XB_London, Cargo-XB_UAE, Cashbook-XB_Bermuda, Cashbook-XB_BIG, Cashbook-XB_Europe, Cashbook-XB_Labuan, Cashbook-XB_London, Cashbook-XB_UAE, Casualty-XB_Bermuda, Casualty-XB_Europe, Casualty-XB_Labuan, Casualty-XB_London, Casualty-XB_UAE, China-XB_Bermuda, China-XB_Europe, China-XB_Labuan, China-XB_London, China-XB_UAE, Commercial-XB_BIG, Construction-XB_Bermuda, Construction-XB_Europe, Construction-XB_Labuan, Construction-XB_London, Construction-XB_UAE, Energy-XB_BIG, Equinox-XB_Bermuda, Equinox-XB_Europe, Equinox-XB_Labuan, Equinox-XB_London, Equinox-XB_UAE, Financial Products-XB_Bermuda, Financial Products-XB_Europe, Financial Products-XB_Labuan, Financial Products-XB_London, Financial Products-XB_UAE, Healthcare-XB_Bermuda, Healthcare-XB_Europe, Healthcare-XB_Labuan, Healthcare-XB_London, Healthcare-XB_UAE, IIS-XB_Bermuda, IIS-XB_Europe, IIS-XB_Labuan, IIS-XB_London, IIS-XB_UAE, International Binding Authority-XB_BIG, International Casualty-XB_BIG, International Energy-XB_Bermuda, International Energy-XB_Europe, International Energy-XB_Labuan, International Energy-XB_London, International Energy-XB_UAE, Jewellers Block-XB_BIG, Life Sciences-XB_Bermuda, Life Sciences-XB_Europe, Life Sciences-XB_Labuan, Life Sciences-XB_London, Life Sciences-XB_UAE, Marine Rest of the World-XB_Bermuda, Marine Rest of the World-XB_Europe, Marine Rest of the World-XB_Labuan, Marine Rest of the World-XB_London, Marine Rest of the World-XB_UAE, Middle East and International-XB_Bermuda, Middle East and International-XB_Europe, Middle East and International-XB_Labuan, Middle East and International-XB_London, Middle East and International-XB_UAE, Mining-XB_Bermuda, Mining-XB_Europe, Mining-XB_Labuan, Mining-XB_London, Mining-XB_UAE, Motor Fleet-XB_BIG, North American Division-XB_BIG, Northern Ireland-XB_BIG, Old Migration-XB_Bermuda, Old Migration-XB_Europe, Old Migration-XB_Labuan, Old Migration-XB_London, Old Migration-XB_UAE, Other Instances-XB_Bermuda, Other Instances-XB_Europe, Other Instances-XB_Labuan, Other Instances-XB_London, Other Instances-XB_UAE, Personal Accident & Contingency & Sports-XB_BIG, Political & Terrorism-XB_Bermuda, Political & Terrorism-XB_Europe, Political & Terrorism-XB_Labuan, Political & Terrorism-XB_London, Political & Terrorism-XB_UAE, Power and Utilities-XB_Bermuda, Power and Utilities-XB_Europe, Power and Utilities-XB_London, Power, Utilities-XB_Labuan, Power, Utilities-XB_UAE, Price Forbes Risk Solutions-XB_Europe, Price Forbes Risk Solutions-XB_London, Professional Indemnity-XB_BIG, Professional Liability-XB_Europe, Professional Liability-XB_London, Programmes-XB_Bermuda, Programmes-XB_Europe, Programmes-XB_Labuan, Programmes-XB_London, Programmes-XB_UAE, Property & Casualty-XB_Bermuda, Property & Casualty-XB_Europe, Property & Casualty-XB_Labuan, Property & Casualty-XB_London, Property & Casualty-XB_UAE, Property-XB_Bermuda, Property-XB_Europe, Property-XB_Labuan, Property-XB_London, Property-XB_UAE, Reinsurance and Products-XB_Bermuda, Reinsurance and Products-XB_Europe, Reinsurance and Products-XB_Labuan, Reinsurance and Products-XB_London, Reinsurance and Products-XB_UAE, Reinsurance-XB_BIG, Reinsurance-XB_Europe, Reinsurance-XB_London, Rob-XB_London, Security Risks-XB_Europe, Security Risks-XB_London, Specie-XB_Bermuda, Specie-XB_Europe, Specie-XB_Labuan, Specie-XB_London, Specie-XB_UAE, Treaty Reinsurance-XB_Bermuda, Treaty Reinsurance-XB_Europe, Treaty Reinsurance-XB_Labuan, Treaty Reinsurance-XB_London, Treaty Reinsurance-XB_UAE, UK Offshore & Marine Trades-XB_BIG, US Energy-XB_Bermuda, US Energy-XB_Europe, US Energy-XB_Labuan, US Energy-XB_London, US Energy-XB_UAE, US Healthcare-XB_Europe, US Healthcare-XB_London, US Marine-XB_Bermuda, US Marine-XB_Europe, US Marine-XB_Labuan, US Marine-XB_London, US Marine-XB_UAE',
    departmentIds:
      '1-1, 1-2, 1-3, 1-4, 1-5, 10-1, 10-2, 10-3, 10-4, 10-5, 11-1, 11-2, 11-3, 11-4, 11-5, 12-1, 12-2, 12-3, 12-4, 12-5, 13-1, 13-2, 13-3, 13-4, 13-5, 14-1, 14-2, 14-3, 14-4, 14-5, 15-1, 15-2, 15-3, 15-4, 15-5, 16-1, 16-2, 16-3, 16-4, 16-5, 17-1, 17-2, 17-3, 17-4, 17-5, 18-1, 18-2, 18-3, 18-4, 18-5, 19-1, 19-2, 19-3, 19-4, 19-5, 2-1, 2-2, 2-3, 2-4, 2-5, 20-1, 20-2, 20-3, 20-4, 20-5, 21-1, 21-2, 21-3, 21-4, 21-5, 22-1, 22-2, 22-3, 22-4, 22-5, 23-1, 23-2, 23-3, 23-4, 23-5, 24-1, 24-2, 24-3, 24-4, 24-5, 24-6, 25-1, 25-2, 25-3, 25-4, 25-5, 26-1, 26-2, 26-3, 26-4, 26-5, 27-1, 27-2, 27-3, 27-4, 27-5, 28-1, 28-2, 28-3, 28-4, 28-5, 29-1, 29-5, 3-1, 3-2, 3-3, 3-4, 3-5, 30-1, 30-5, 31-1, 31-5, 32-1, 32-5, 32-6, 33-1, 33-5, 33-6, 34-1, 34-5, 34-6, 35-5, 35-6, 36-5, 36-6, 37-5, 37-6, 38-5, 38-6, 39-5, 39-6, 4-1, 4-2, 4-3, 4-4, 4-5, 40-5, 40-6, 41-5, 41-6, 42-5, 42-6, 43-5, 43-6, 44-5, 44-6, 45-5, 46-5, 5-1, 5-2, 5-3, 5-4, 5-5, 6-1, 6-2, 6-3, 6-4, 6-5, 7-1, 7-2, 7-3, 7-4, 7-5, 8-1, 8-2, 8-3, 8-4, 8-5, 9-1, 9-2, 9-3, 9-4, 9-5',
    groups: 'Claim Admin',
    groupIds: '5',
    xbInstances: 'XB_Bermuda, XB_BIG, XB_Europe, XB_Labuan, XB_London, XB_UAE',
    xbInstanceIds: '1, 2, 3, 4, 5, 6',
    businessProcesses: 'Claims',
    businessProcessIds: '3',
    organisationId: '1',
    organisationName: 'Mphasis',
  },
  {
    id: 773,
    fullName: 'Bhavanasi Meghana',
    firstName: 'Bhavanasi',
    lastName: 'Meghana',
    email: 'Bhavanasi.Meghana@Ardonaghspecialty.com',
    contactNumber: '9999999999',
    roleId: '1',
    role: 'Junior Technician',
    departments:
      'Accident & Health-XB_London, Aviation-XB_Europe, Aviation-XB_London, Cargo-XB_Labuan, Cargo-XB_London, Cashbook-XB_BIG, Cashbook-XB_London, Casualty-XB_Bermuda, Casualty-XB_London, China-XB_London, Commercial-XB_BIG, Construction-XB_London, Energy-XB_BIG, Equinox-XB_London, Financial Products-XB_London, Healthcare-XB_London, IIS-XB_London, International Energy-XB_Labuan, International Energy-XB_London, Life Sciences-XB_London, Marine Rest of the World-XB_London, Middle East and International-XB_London, Middle East and International-XB_UAE, Mining-XB_London, Old Migration-XB_London, Other Instances-XB_London, Political & Terrorism-XB_London, Power and Utilities-XB_Bermuda, Power and Utilities-XB_Europe, Power and Utilities-XB_London, Price Forbes Risk Solutions-XB_London, Professional Liability-XB_London, Programmes-XB_London, Property & Casualty-XB_Labuan, Property & Casualty-XB_London, Property & Casualty-XB_UAE, Property-XB_London, Reinsurance and Products-XB_Bermuda, Reinsurance and Products-XB_London, Reinsurance-XB_London, Rob-XB_London, Security Risks-XB_London, Specie-XB_London, Treaty Reinsurance-XB_London, US Energy-XB_London, US Healthcare-XB_London, US Marine-XB_London',
    departmentIds:
      '1-1, 1-3, 1-4, 10-1, 10-2, 11-1, 11-2, 11-5, 12-1, 13-1, 13-5, 14-1, 15-1, 16-1, 17-1, 18-1, 18-3, 19-1, 19-2, 2-1, 2-3, 20-1, 21-1, 22-1, 23-1, 24-1, 24-6, 25-1, 26-1, 27-1, 28-1, 29-1, 3-1, 30-1, 31-1, 32-1, 33-1, 33-6, 34-1, 34-6, 4-1, 5-1, 6-1, 6-4, 7-1, 8-1, 9-1',
    groups: 'Back Office',
    groupIds: '2',
    xbInstances: 'XB_Bermuda, XB_BIG, XB_Europe, XB_Labuan, XB_London, XB_UAE',
    xbInstanceIds: '1, 2, 3, 4, 5, 6',
    businessProcesses: 'Claims, Premium Processing',
    businessProcessIds: '1, 3',
    organisationId: '2',
    organisationName: 'Ardonagh',
  },
  {
    id: 771,
    fullName: 'Brijesh Jora',
    firstName: 'Brijesh',
    lastName: 'Jora',
    email: 'brijesh.jora@mphasis.com',
    contactNumber: '9866522112',
    roleId: '5',
    role: 'Technician manager',
    departments:
      'Aviation-XB_Europe, Cargo-XB_Labuan, Cashbook-XB_BIG, Casualty-XB_Bermuda, Commercial-XB_BIG, Energy-XB_BIG, International Energy-XB_Labuan, Middle East and International-XB_UAE, Power and Utilities-XB_Bermuda, Power and Utilities-XB_Europe, Property & Casualty-XB_Labuan, Property & Casualty-XB_UAE, Reinsurance and Products-XB_Bermuda',
    departmentIds: '1-3, 1-4, 10-2, 11-2, 11-5, 13-5, 18-3, 19-2, 2-3, 24-6, 33-6, 34-6, 6-4',
    groups: 'Back Office',
    groupIds: '2',
    xbInstances: 'XB_Bermuda, XB_BIG, XB_Europe, XB_Labuan, XB_UAE',
    xbInstanceIds: '2, 3, 4, 5, 6',
    businessProcesses: 'Claims, Premium Processing',
    businessProcessIds: '1, 3',
    organisationId: '2',
    organisationName: 'Ardonagh',
  },
  {
    id: 886,
    fullName: 'Chandini Satheesh',
    firstName: 'Chandini',
    lastName: 'Satheesh',
    email: 'Chandini.Satheesh@Ardonaghspecialty.com',
    contactNumber: '',
    roleId: '14',
    role: 'Super User',
    departments:
      'Northern Ireland-XB_BIG, Property & Casualty-XB_Bermuda, Property & Casualty-XB_Europe, Property & Casualty-XB_Labuan, Property & Casualty-XB_London, Property & Casualty-XB_UAE',
    departmentIds: '1-1, 1-2, 1-3, 1-4, 1-5, 44-6',
    groups: 'Claim Admin',
    groupIds: '5',
    xbInstances: 'XB_Bermuda, XB_BIG, XB_Europe, XB_Labuan, XB_London, XB_UAE',
    xbInstanceIds: '1, 2, 3, 4, 5, 6',
    businessProcesses: 'Claims',
    businessProcessIds: '3',
    organisationId: '1',
    organisationName: 'Mphasis',
  },
  {
    id: 877,
    fullName: 'Darshan Dinesh',
    firstName: 'Darshan',
    lastName: 'Dinesh',
    email: 'dharshan.dinesh@mphasis.com',
    contactNumber: '',
    roleId: '17',
    role: 'Senior Technician - Mphasis',
    departments: 'Property & Casualty-XB_London',
    departmentIds: '1-1',
    groups: 'Claim - Back Office - Mphasis',
    groupIds: '6',
    xbInstances: 'XB_London',
    xbInstanceIds: '1',
    businessProcesses: 'Claims',
    businessProcessIds: '3',
    organisationId: '1',
    organisationName: 'Mphasis',
  },
  {
    id: 774,
    fullName: 'Deepika Sonali',
    firstName: 'Deepika',
    lastName: 'Sonali',
    email: 'Deepika.Sonali@Ardonaghspecialty.com',
    contactNumber: '88888888888',
    roleId: '1',
    role: 'Junior Technician',
    departments:
      'Cargo-XB_Labuan, Casualty-XB_Bermuda, International Energy-XB_Labuan, Power and Utilities-XB_Bermuda, Property & Casualty-XB_Labuan, Reinsurance and Products-XB_Bermuda',
    departmentIds: '1-3, 10-2, 11-2, 18-3, 19-2, 2-3',
    groups: 'Back Office',
    groupIds: '2',
    xbInstances: 'XB_Bermuda, XB_Labuan',
    xbInstanceIds: '2, 3',
    businessProcesses: 'BE, Claims, IBA, Premium Processing',
    businessProcessIds: '1, 3, 4, 5',
    organisationId: '2',
    organisationName: 'Ardonagh',
  },
  {
    id: 776,
    fullName: 'Dominicrajaseelan P',
    firstName: 'Dominicrajaseelan',
    lastName: 'P',
    email: 'Dominicrajaseelan.P@Ardonaghspecialty.com',
    contactNumber: '989898989',
    roleId: '4',
    role: 'Senior Technician',
    departments:
      'Accident & Health-XB_London, Aviation-XB_Europe, Aviation-XB_Labuan, Aviation-XB_London, Aviation-XB_UAE, Cargo-XB_London, Cashbook-XB_BIG, Casualty-XB_London, China-XB_London, Commercial-XB_BIG, Construction-XB_London, Energy-XB_BIG, Equinox-XB_London, Financial Products-XB_London, Healthcare-XB_Labuan, Healthcare-XB_London, IIS-XB_London, International Energy-XB_Labuan, International Energy-XB_London, International Energy-XB_UAE, Life Sciences-XB_London, Marine Rest of the World-XB_London, Middle East and International-XB_Europe, Middle East and International-XB_London, Middle East and International-XB_UAE, Mining-XB_London, Old Migration-XB_London, Other Instances-XB_London, Political & Terrorism-XB_London, Power and Utilities-XB_Europe, Power and Utilities-XB_London, Price Forbes Risk Solutions-XB_London, Professional Liability-XB_London, Programmes-XB_London, Property & Casualty-XB_Labuan, Property & Casualty-XB_London, Property & Casualty-XB_UAE, Property-XB_London, Reinsurance and Products-XB_London, Reinsurance and Products-XB_UAE, Reinsurance-XB_London, Security Risks-XB_London, Specie-XB_London, Treaty Reinsurance-XB_London, US Energy-XB_London, US Healthcare-XB_London, US Marine-XB_London',
    departmentIds:
      '1-1, 1-3, 1-4, 10-1, 10-4, 11-1, 11-5, 12-1, 13-1, 13-3, 13-4, 13-5, 14-1, 14-3, 15-1, 16-1, 17-1, 18-1, 19-1, 2-1, 2-3, 2-4, 20-1, 21-1, 22-1, 23-1, 24-6, 25-1, 26-1, 27-1, 28-1, 29-1, 3-1, 30-1, 31-1, 32-1, 33-1, 33-6, 34-6, 4-1, 5-1, 6-1, 6-4, 6-5, 7-1, 8-1, 9-1',
    groups: 'Back Office',
    groupIds: '2',
    xbInstances: 'XB_BIG, XB_Europe, XB_Labuan, XB_London, XB_UAE',
    xbInstanceIds: '1, 3, 4, 5, 6',
    businessProcesses: 'Claims, Premium Processing',
    businessProcessIds: '1, 3',
    organisationId: '2',
    organisationName: 'Ardonagh',
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

describe('MODULES › ClaimRefNotes', () => {
  describe('@render', () => {
    beforeEach(() => {
      fetchMock.post('glob:*/case/bpm/claim/searchNotes', { body: { status: 'OK', data: { searchValue: responseDataNotes } } });
      fetchMock.get('glob:*/api/users*', { body: { status: 'OK', data: responseDataUsers } });
    });

    afterEach(() => {
      jest.clearAllMocks();
      fetchMock.restore();
    });

    it('renders filters toggle button', () => {
      // arrange
      render(
        <ClaimRefNotes claim={claim}>
          <TableFilters filtersArray={filtersArray} />
        </ClaimRefNotes>
      );

      // assert
      expect(screen.queryByText(utils.string.t('claims.notes.tableFilters.dateCreated'))).toBeInTheDocument();
      expect(screen.queryByText(utils.string.t('claims.notes.tableFilters.lastUpdatedDate'))).toBeInTheDocument();
    });

    it('renders add notes button', () => {
      // arrange
      render(<ClaimRefNotes claim={claim} />);

      // assert
      expect(screen.getByText('claims.notes.addNote')).toBeInTheDocument();
    });

    it('renders table columns', () => {
      // arrange
      render(<ClaimRefNotes claim={claim} />);
      const tableHead = screen.getByTestId('claim-notes-table').querySelector('thead');

      // assert
      expect(within(tableHead).getByText('claims.notes.columns.dateCreated')).toBeInTheDocument();
      expect(within(tableHead).getByText('claims.notes.columns.createdBy')).toBeInTheDocument();
      expect(within(tableHead).getByText('claims.notes.columns.detail')).toBeInTheDocument();
      expect(within(tableHead).getByText('claims.notes.columns.dateUpdated')).toBeInTheDocument();
      expect(within(tableHead).getByText('claims.notes.columns.updatedBy')).toBeInTheDocument();
    });

    it('renders table pagination', () => {
      // arrange
      render(<ClaimRefNotes claim={claim} />);

      // assert
      expect(screen.getByTestId('pagination-claim-notes')).toBeInTheDocument();
    });

    it('renders table search field', () => {
      // arrange
      render(<ClaimRefNotes claim={claim} />);

      // assert
      expect(screen.getByTestId('form-search')).toBeInTheDocument();
      expect(screen.getByTestId('search-button-go')).toBeInTheDocument();
    });

    it('renders table row data', async () => {
      // arrange
      render(<ClaimRefNotes claim={claim} />);

      await waitFor(() => screen.getByTestId('claim-notes-table-row-1'));

      const row1 = screen.getByTestId('claim-notes-table-row-1');
      const row2 = screen.getByTestId('claim-notes-table-row-2');
      const row3 = screen.getByTestId('claim-notes-table-row-3');

      // assert
      expect(within(row1).getByText('note number 1')).toBeInTheDocument();
      expect(within(row1).getByText('Alex The Great')).toBeInTheDocument();
      expect(within(row1).getByText('Alice in Wonderland')).toBeInTheDocument();
      expect(within(row1).getByText('format.date(2021-01-01T01:00:00)')).toBeInTheDocument();
      expect(within(row1).getByText('format.date(2021-01-02T12:00:00)')).toBeInTheDocument();

      expect(within(row2).getByText('note number 2')).toBeInTheDocument();
      expect(within(row2).getByText('Bob the Builder')).toBeInTheDocument();
      expect(within(row2).getByText('Barbara')).toBeInTheDocument();
      expect(within(row2).getByText('format.date(2021-02-03T03:00:00)')).toBeInTheDocument();
      expect(within(row2).getByText('format.date(2021-02-04T14:00:00)')).toBeInTheDocument();

      expect(within(row3).getByText('note number 3')).toBeInTheDocument();
      expect(within(row3).getByText('Chris')).toBeInTheDocument();
      expect(within(row3).getByText('Chrissy')).toBeInTheDocument();
      expect(within(row3).getByText('format.date(2021-03-05T05:00:00)')).toBeInTheDocument();
      expect(within(row3).getByText('format.date(2021-03-06T16:00:00)')).toBeInTheDocument();

      // arrange
      jest.clearAllMocks();
      fetchMock.restore();
    });
  });
});
