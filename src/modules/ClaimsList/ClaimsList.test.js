import React from 'react';
import { render, screen, waitFor } from 'tests';
import ClaimsList from './ClaimsList';
import userEvent from '@testing-library/user-event';
import { MultiSelect, TableFilters, Translate } from 'components';
import * as utils from 'utils';

const renderClaims = () => {
  return render(<ClaimsList />);
};

describe('MODULES › ClaimsList', () => {
  it('renders without crashing', () => {
    // arrange
    renderClaims();

    // assert
    expect(screen.getByTestId('claim-module')).toBeInTheDocument();
  });

  it('renders table', () => {
    // arrange
    renderClaims();

    // assert
    expect(screen.getByTestId('claims-search-table')).toBeInTheDocument();
  });
});

describe('MODULES › ClaimsList › toggle filters', () => {
  const originalWarn = console.warn;
  afterEach(() => (console.warn = originalWarn));

  const mockedWarn = () => {};
  beforeEach(() => (console.warn = mockedWarn));

  const optionsData = {
    data: {
      lossName: [
        { id: 'xXaId', name: 'xXa' },
        { id: 'swdId', name: 'swd' },
        { id: 'Ramesh2Id', name: 'Ramesh2' },
        { id: 'HeatwaveId', name: 'Heatwave' },
      ],
      lossDateFrom: null,
      lossDateTo: null,
      insured: [
        { id: 'LottPropertyPartnersLtdId', name: 'Lott Property Partners, Ltd' },
        { id: 'HazpropEnviromentalLtdId', name: 'Hazprop Enviromental Ltd' },
        { id: 'McGregorId', name: 'McGregor & Associates Insurance Administration Inc' },
        { id: 'JohnHuntId', name: 'John Hunt' },
        { id: 'ErosGroupId', name: 'Eros Group' },
        { id: 'AltecIncId', name: 'Altec Inc.' },
      ],
      claimant: [
        { id: 'ShermanId', name: 'Sherman Old CIty Hall, LLC' },
        { id: 'LakeId', name: 'Lake Oswego Corporation' },
        { id: 'VillageId', name: 'Village of Freeburg, Illinois' },
        { id: 'CommunityId', name: 'Community at Carnegie Building LLC' },
      ],
      claimStatus: [
        { id: 'submittedId', name: 'Submitted' },
        { id: 'draftId', name: 'DRAFT' },
      ],
      priority: [
        { id: 'highId', name: 'High' },
        { id: 'lowId', name: 'Low' },
        { id: 'mediumId', name: 'Medium' },
      ],
    },
  };

  const tableFilterFields = [
    {
      id: 'lossname',
      type: 'multiSelect',
      label: utils.string.t('claims.lossInformation.name'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: [],
      options: optionsData.data.lossName,
      content: <MultiSelect id="lossname" search options={optionsData.data.lossName} />,
      maxHeight: 200,
    },
    {
      id: 'lossDateFrom',
      type: 'multiSelect',
      label: utils.string.t('claims.lossInformation.fromDate'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: [],
      options: [],
      content: <MultiSelect id="lossDateFrom" search options={[]} />,
    },
    {
      id: 'lossDateTo',
      type: 'multiSelect',
      label: utils.string.t('claims.lossInformation.toDate'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      options: [],
      content: <MultiSelect id="lossDateTo" search options={[]} />,
    },
    {
      id: 'insured',
      type: 'multiSelect',
      label: utils.string.t('claims.insured'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      options: optionsData.data.insured,
      content: <MultiSelect id="insured" search options={optionsData.data.insured} />,
    },
    {
      id: 'claimant',
      type: 'multiSelect',
      label: utils.string.t('claims.claimInformation.claimant'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      options: optionsData.data.claimant,
      content: <MultiSelect id="claimant" search options={optionsData.data.claimant} />,
    },
    {
      id: 'claimStatus',
      type: 'multiSelect',
      label: utils.string.t('claims.claimInformation.status'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      options: optionsData.data.claimStatus,
      content: <MultiSelect id="claimStatus" search options={optionsData.data.claimStatus} />,
    },
  ];

  it('Validating the Filter Icon Existence', () => {
    // arrange
    renderClaims();

    //assert
    expect(screen.getByTestId('filters-button-toggle')).toBeInTheDocument();
  });

  it('renders filters toggle button by default if filters array is defined', () => {
    //arrange
    const { queryByTestId } = render(
      <ClaimsList>
        <TableFilters filtersArray={tableFilterFields} />
      </ClaimsList>
    );

    //assert
    expect(queryByTestId('filters-button-toggle')).toBeInTheDocument();
  });

  it('renders filters content if defined in filtersArray', () => {
    //arrange
    const { queryByText } = render(
      <ClaimsList>
        <TableFilters filtersArray={tableFilterFields} />
      </ClaimsList>
    );

    //assert
    expect(queryByText(utils.string.t('claims.lossInformation.name'))).toBeInTheDocument();
    expect(queryByText(utils.string.t('claims.lossInformation.fromDate'))).toBeInTheDocument();
    expect(queryByText(utils.string.t('claims.lossInformation.toDate'))).toBeInTheDocument();
    expect(queryByText(utils.string.t('claims.insured'))).toBeInTheDocument();
    expect(queryByText(utils.string.t('claims.claimInformation.claimant'))).toBeInTheDocument();
    expect(queryByText(utils.string.t('claims.claimInformation.status'))).toBeInTheDocument();
  });
});

describe('MODULES › ClaimsList › Manage Columns', () => {
  const originalWarn = console.warn;
  afterEach(() => (console.warn = originalWarn));

  const mockedWarn = () => {};
  beforeEach(() => (console.warn = mockedWarn));

  const columns = [
    {
      id: 'lossName',
      label: 'Loss Name',
      nowrap: true,
      sort: { type: '', direction: 'asc' },
      visible: true,
      columnRequired: true,
    },
    {
      id: 'pasEventID',
      label: utils.string.t('claims.columns.claimsList.pasEventID'),
      sort: { type: '', direction: 'asc' },
      nowrap: true,
    },
    {
      id: 'lossRef',
      label: 'Loss Ref',
      nowrap: true,
      compact: true,
      sort: { type: 'numeric', direction: 'desc' },
      ellipsis: true,
      visible: true,
    },
    {
      id: 'lossFromDate',
      label: <Translate label="Loss Date From" />,
      sort: { type: 'date', direction: 'asc' },
      ellipsis: true,
      visible: true,
    },
    {
      id: 'lossToDate',
      label: <Translate label="Loss Date To" />,
      sort: { type: 'date', direction: 'asc' },
      ellipsis: true,
      visible: true,
    },
    {
      id: 'claimLossFromDate',
      label: utils.string.t('claims.columns.claimsList.claimLossFrom'),
      sort: { type: '', direction: 'asc' },
      nowrap: true,
    },
    {
      id: 'claimLossToDate',
      label: utils.string.t('claims.columns.claimsList.claimLossTo'),
      sort: { type: '', direction: 'asc' },
      nowrap: true,
    },
    {
      id: 'claimReceivedDateTime',
      label: utils.string.t('claims.columns.claimsList.claimReceivedDateTime'),
      sort: { type: '', direction: 'asc' },
      nowrap: true,
    },
    { id: 'catCodesID', label: <Translate label="Cat Code" />, nowrap: true, sort: { type: '', direction: 'asc' } },
    { id: 'ucr', label: <Translate label="UCR" />, sort: { type: '', direction: 'asc' } },
    { id: 'team', label: <Translate label="team" />, sort: { type: '', direction: 'asc' } },
    { id: 'priority', label: <Translate label="Priority" />, sort: { type: '', direction: 'asc' } },
    { id: 'claimantName', label: <Translate label="Claimant" />, nowrap: true, sort: { type: '', direction: 'asc' } },
    { id: 'assignedTo', label: <Translate label="Assigned To" />, nowrap: true, sort: { type: '', direction: 'asc' } },
    {
      id: 'claimID',
      label: <Translate label="Claim Ref" />,
      sort: { type: '', direction: 'asc' },
      ellipsis: true,
      visible: true,
      isColumnHidden: false,
      columnRequired: true,
    },
    {
      id: 'policyRef',
      label: <Translate label="Policy Ref" />,
      sort: { type: '', direction: 'asc' },
      ellipsis: true,
      visible: true,
      isColumnHidden: false,
      columnRequired: true,
    },
    { id: 'insured', label: <Translate label="Insured" />, sort: { type: '', direction: 'asc' }, ellipsis: true, visible: true },
    { id: 'division', label: <Translate label="Division" />, sort: { type: '', direction: 'asc' }, ellipsis: true, visible: true },
    { id: 'company', label: <Translate label="Company" />, sort: { type: '', direction: 'asc' } },
    { id: 'client', label: <Translate label="Client" />, sort: { type: '', direction: 'asc' } },
    { id: 'actions', menu: true },
  ];

  it('Validate the Manage Column Existence', () => {
    // arrange
    render(
      <ClaimsList>
        <TableFilters columns columnsArray={columns} />
      </ClaimsList>
    );

    //assert
    expect(screen.getByTestId('columns-button-toggle')).toBeInTheDocument();
  });

  it('toggles the Manage Columns popover on column icon button click', async () => {
    const { queryByText } = render(
      <ClaimsList>
        <TableFilters columns columnsArray={columns} />
      </ClaimsList>
    );

    // action
    userEvent.click(screen.getByTestId('columns-button-toggle'));
    await waitFor(() => expect(queryByText('filters.columns.title')).toBeInTheDocument());

    // assert
    expect(utils.app.getElement('#columns-checkbox-list-label-lossName')).toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-lossRef')).toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-lossFromDate')).toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-lossToDate')).toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-catCodeDescription')).toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-ucr')).toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-team')).toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-claimantName')).toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-claimID')).toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-policyRef')).toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-insured')).toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-division')).toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-company')).toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-client')).toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-pasEventID')).toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-claimLossFromDate')).toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-claimLossToDate')).toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-claimReceivedDateTime')).toBeInTheDocument();

    // action
    userEvent.click(screen.getByTestId('columns-button-toggle'));
    await waitFor(() => expect(queryByText('filters.columns.title')).not.toBeInTheDocument());

    // assert
    expect(utils.app.getElement('#columns-checkbox-list-label-lossName')).not.toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-lossRef')).not.toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-lossFromDate')).not.toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-lossToDate')).not.toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-catCodesID')).not.toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-ucr')).not.toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-team')).not.toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-claimantName')).not.toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-claimReference')).not.toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-assignedTo')).not.toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-claimID')).not.toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-policyRef')).not.toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-insured')).not.toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-division')).not.toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-company')).not.toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-client')).not.toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-pasEventID')).not.toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-claimLossFromDate')).not.toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-claimLossToDate')).not.toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-claimReceivedDateTime')).not.toBeInTheDocument();
  });
});
