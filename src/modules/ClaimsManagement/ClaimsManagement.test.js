import React from 'react';
import { render, screen, waitFor, getFormAutocompleteMui } from 'tests';
import ClaimsManagement from './ClaimsManagement';
import userEvent from '@testing-library/user-event';
import { MultiSelect, TableFilters } from 'components';
import * as utils from 'utils';

const renderClaimsManagement = () => {
  return render(<ClaimsManagement />);
};

describe('MODULES › ClaimsManagement', () => {
  const userWithAccess = {
    id: 1,
    privilege: {
      claimsFNOL: {
        myClaims: ['read', 'create', 'update'],
        myTeamClaims: ['read', 'create', 'update'],
        allClaims: ['read', 'create', 'update'],
      },
    },
  };

  const userWithLimitedAccess = {
    id: 1,
    privilege: {
      claimsFNOL: {
        myClaims: ['read', 'create', 'update'],
        myTeamClaims: [],
        allClaims: [],
      },
    },
  };

  it('renders without crashing', () => {
    // arrange
    renderClaimsManagement();

    // assert
    expect(screen.getByTestId('claims-management')).toBeInTheDocument();
  });

  it('renders table', () => {
    // arrange
    renderClaimsManagement();

    // assert
    expect(screen.getByTestId('claims-processing-table')).toBeInTheDocument();
  });

  it('after typing value with less than 4 chars in the search field', () => {
    // arrange
    const { container } = renderClaimsManagement();
    userEvent.type(container.querySelector('input[name=query]'), 'Te');

    // assert
    expect(container.querySelector('input[name=query]')).toHaveValue('Te');
    expect(screen.getByTestId('search-button-go')).not.toBeEnabled();
  });

  it('after typing value with more than 4 chars in the search field', () => {
    // arrange
    const { container } = renderClaimsManagement();
    userEvent.type(container.querySelector('input[name=query]'), 'Ramesh2');

    // assert
    expect(container.querySelector('input[name=query]')).toHaveValue('Ramesh2');
    expect(screen.getByTestId('search-button-go')).toBeEnabled();
  });

  it('renders wrapper and filter', () => {
    // arrange
    renderClaimsManagement();

    // assert
    expect(screen.getByTestId('claims-management')).toBeInTheDocument();
  });

  it('renders view radio buttons for full access users', () => {
    //arrange
    const { queryByText } = render(<ClaimsManagement />, { initialState: { user: userWithAccess } });

    //assert
    expect(queryByText(utils.string.t('claims.processing.myClaims'))).toBeInTheDocument();
    expect(queryByText(utils.string.t('claims.processing.myTeamClaims'))).toBeInTheDocument();
    expect(queryByText(utils.string.t('claims.processing.allClaims'))).toBeInTheDocument();
  });

  it('renders view radio buttons for limited access users', () => {
    //arrange
    const { queryByText } = render(<ClaimsManagement />, { initialState: { user: userWithLimitedAccess } });

    //assert
    expect(queryByText(utils.string.t('claims.processing.myClaims'))).toBeInTheDocument();
    expect(queryByText(utils.string.t('claims.processing.myTeamClaims'))).not.toBeInTheDocument();
    expect(queryByText(utils.string.t('claims.processing.allClaims'))).not.toBeInTheDocument();
  });

  it('renders search select buttons', () => {
    //arrange
    const { container } = renderClaimsManagement();

    //assert
    expect(container.querySelector(getFormAutocompleteMui('searchBy'))).toBeInTheDocument();
    expect(container.querySelectorAll(getFormAutocompleteMui('searchBy'))).toHaveLength(1);
  });

  it('renders table header', () => {
    //arrange
    const { queryByText } = renderClaimsManagement();

    //assert
    expect(queryByText(utils.string.t('claims.columns.claimsManagement.ref'))).toBeInTheDocument();
    expect(queryByText(utils.string.t('claims.columns.claimsManagement.lossRef'))).toBeInTheDocument();
    expect(queryByText(utils.string.t('claims.columns.claimsManagement.insured'))).toBeInTheDocument();
    expect(queryByText(utils.string.t('claims.columns.claimsManagement.policyRef'))).toBeInTheDocument();
    expect(queryByText(utils.string.t('claims.columns.claimsManagement.ucr'))).toBeInTheDocument();
    expect(queryByText(utils.string.t('claims.columns.claimsManagement.assignedTo'))).toBeInTheDocument();
    expect(queryByText(utils.string.t('claims.columns.claimsManagement.team'))).toBeInTheDocument();
  });
});

describe('MODULES › ClaimsManagement › toggle filters', () => {
  const originalWarn = console.warn;
  afterEach(() => (console.warn = originalWarn));

  const mockedWarn = () => {};
  beforeEach(() => (console.warn = mockedWarn));

  const claimLossFilterDropDown = {
    data: {
      dateAndTimeCreated: null,
      team: [
        { id: 'xXaId', name: 'xXa' },
        { id: 'swdId', name: 'swd' },
        { id: 'Ramesh2Id', name: 'Ramesh2' },
        { id: 'HeatwaveId', name: 'Heatwave' },
      ],
      assignedTo: [
        { id: '1', name: 'John Doe' },
        { id: '2', name: 'Mr Pepper' },
        { id: '3', name: 'Test Test' },
      ],
      priority: [
        { id: 'highId', name: 'High' },
        { id: 'lowId', name: 'Low' },
        { id: 'mediumId', name: 'Medium' },
      ],
      processState: [
        { id: 'submittedId', name: 'Submitted' },
        { id: 'draftId', name: 'DRAFT' },
      ],
      complexity: [
        { id: 'complex', name: 'Complex' },
        { id: 'nonComplex', name: 'nonComplex' },
      ],
    },
  };

  const tableFilterFields = [
    {
      id: 'dateAndTimeCreated',
      type: 'multiSelect',
      label: utils.string.t('claims.columns.claimsList.dateAndTimeCreated'),
      value: [],
      options: claimLossFilterDropDown.data.dateAndTimeCreated,
      content: <MultiSelect id="dateAndTimeCreated" search options={claimLossFilterDropDown.data.dateAndTimeCreated} />,
    },
    {
      id: 'team',
      type: 'multiSelect',
      label: utils.string.t('claims.columns.claimsList.team'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: [],
      options: claimLossFilterDropDown.data.team,
      content: <MultiSelect id="team" search options={claimLossFilterDropDown.data.team} />,
    },
    {
      id: 'assignedTo',
      type: 'multiSelect',
      label: utils.string.t('claims.columns.claimsList.assignedTo'),
      value: [],
      options: claimLossFilterDropDown.data.assignedTo,
      content: <MultiSelect id="assignedTo" search options={claimLossFilterDropDown.data.assignedTo} />,
    },
    {
      id: 'priority',
      type: 'multiSelect',
      label: utils.string.t('claims.claimInformation.priority'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: [],
      options: claimLossFilterDropDown.data.priority,
      content: <MultiSelect id="priority" search options={claimLossFilterDropDown.data.priority} />,
    },
  ];

  const columns = [
    {
      id: 'claimRef',
      label: utils.string.t('claims.columns.claimsManagement.ref'),
      sort: { type: 'lexical', direction: 'asc' },
      narrow: true,
      nowrap: true,
      visible: true,
      mandatory: true,
    },
    {
      id: 'lossRef',
      label: utils.string.t('claims.columns.claimsManagement.lossRef'),
      sort: { type: 'lexical', direction: 'asc' },
      narrow: true,
      nowrap: true,
      visible: true,
      mandatory: true,
    },
    {
      id: 'insured',
      label: utils.string.t('claims.columns.claimsManagement.insured'),
      sort: { type: 'lexical', direction: 'asc' },
      ellipsis: true,
      visible: true,
      mandatory: true,
    },
    {
      id: 'policyRef',
      label: utils.string.t('claims.columns.claimsManagement.policyRef'),
      sort: { type: 'lexical', direction: 'asc' },
      nowrap: true,
      visible: true,
      mandatory: true,
    },
    {
      id: 'ucr',
      label: utils.string.t('claims.columns.claimsManagement.ucr'),
      sort: { type: 'lexical', direction: 'asc' },
      nowrap: true,
      visible: true,
    },
    {
      id: 'assignedTo',
      label: utils.string.t('claims.columns.claimsManagement.assignedTo'),
      sort: { type: 'lexical', direction: 'asc' },
      visible: true,
    },
    {
      id: 'team',
      label: utils.string.t('claims.columns.claimsManagement.team'),
      sort: { type: 'lexical', direction: 'asc' },
      visible: true,
    },
    {
      id: 'complexity',
      label: utils.string.t('claims.columns.claimsManagement.complexity'),
      sort: { type: 'lexical', direction: 'asc' },
      visible: true,
    },
    {
      id: 'dateAndTimeCreated',
      label: utils.string.t('claims.columns.claimsManagement.lastUpdated'),
      sort: { type: 'date', direction: 'asc' },
    },
    {
      id: 'priority',
      label: utils.string.t('claims.columns.claimsManagement.priority'),
      sort: { type: 'lexical', direction: 'asc' },
      nowrap: true,
    },
    {
      id: 'processState',
      label: utils.string.t('claims.columns.claimsManagement.status'),
      sort: { type: 'lexical', direction: 'asc' },
      nowrap: true,
    },
    {
      id: 'division',
      label: utils.string.t('claims.columns.claimsManagement.division'),
      sort: { type: 'lexical', direction: 'asc' },
      nowrap: true,
    },
    {
      id: 'lossFromDate',
      label: utils.string.t('claims.columns.claimsManagement.lossDateFrom'),
      sort: { type: 'date', direction: 'asc' },
      nowrap: true,
    },
    {
      id: 'lossToDate',
      label: utils.string.t('claims.columns.claimsManagement.lossDateTo'),
      sort: { type: 'date', direction: 'asc' },
      nowrap: true,
    },
    {
      id: 'lossDetailID',
      label: utils.string.t('claims.columns.claimsManagement.lossDetailID'),
      sort: { type: 'numeric', direction: 'desc' },
      nowrap: true,
    },
    {
      id: 'catCodesID',
      label: utils.string.t('claims.columns.claimsManagement.catCode'),
      sort: { type: 'lexical', direction: 'asc' },
      nowrap: true,
    },
    {
      id: 'claimantName',
      label: utils.string.t('claims.columns.claimsManagement.claimant'),
      sort: { type: 'lexical', direction: 'asc' },
    },
    {
      id: 'policyType',
      label: utils.string.t('claims.columns.claimsManagement.policyType'),
      sort: { type: 'lexical', direction: 'asc' },
    },
    {
      id: 'company',
      label: utils.string.t('claims.columns.claimsManagement.company'),
      sort: { type: 'lexical', direction: 'asc' },
    },
    {
      id: 'client',
      label: utils.string.t('claims.columns.claimsManagement.company'),
      sort: { type: 'lexical', direction: 'asc' },
    },
    { id: 'actions', menu: true },
  ];

  it('validating the filter icon', () => {
    // arrange
    renderClaimsManagement();

    //assert
    // expect(screen.getByTestId('filters-button-toggle')).toBeInTheDocument();
  });

  it('renders filters content if defined in filtersArray', () => {
    //arrange
    const { queryByText } = render(
      <ClaimsManagement>
        <TableFilters filtersArray={tableFilterFields} />
      </ClaimsManagement>
    );

    //assert
    expect(queryByText(utils.string.t('claims.columns.claimsList.dateAndTimeCreated'))).toBeInTheDocument();
    expect(queryByText(utils.string.t('claims.columns.claimsList.team'))).toBeInTheDocument();
    expect(queryByText(utils.string.t('claims.columns.claimsList.assignedTo'))).toBeInTheDocument();
    expect(queryByText(utils.string.t('claims.claimInformation.priority'))).toBeInTheDocument();
  });

  it('toggles the manage columns popover on column icon button click', async () => {
    const { queryByText } = render(
      <ClaimsManagement>
        <TableFilters columns columnsArray={columns} />
      </ClaimsManagement>
    );

    // action
    userEvent.click(screen.getByTestId('columns-button-toggle'));
    await waitFor(() => expect(queryByText('filters.columns.title')).toBeInTheDocument());

    // assert
    /*expect(utils.app.getElement('#columns-checkbox-list-label-lossName')).toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-lossDetailID')).toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-lossFromDate')).toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-lossToDate')).toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-catCodesID')).toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-ucr')).toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-team')).toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-complexity')).toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-priority')).toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-claimantName')).toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-assignedTo')).toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-claimID')).toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-policyRef')).toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-insured')).toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-division')).toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-company')).toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-client')).toBeInTheDocument();
    */
    // action
    userEvent.click(screen.getByTestId('columns-button-toggle'));
    await waitFor(() => expect(queryByText('filters.columns.title')).not.toBeInTheDocument());

    // assert
    /*
    expect(utils.app.getElement('#columns-checkbox-list-label-lossName')).not.toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-lossDetailID')).not.toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-lossFromDate')).not.toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-lossToDate')).not.toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-catCodesID')).not.toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-ucr')).not.toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-team')).not.toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-complexity')).not.toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-priority')).not.toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-claimantName')).not.toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-claimReference')).not.toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-assignedTo')).not.toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-claimID')).not.toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-policyRef')).not.toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-insured')).not.toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-division')).not.toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-company')).not.toBeInTheDocument();
    expect(utils.app.getElement('#columns-checkbox-list-label-client')).not.toBeInTheDocument();
    */
  });
});
