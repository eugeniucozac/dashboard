import React from 'react';
import { render, screen, getFormSelect } from 'tests';
import ClaimsTab from './ClaimsTab';
import userEvent from '@testing-library/user-event';
import { MultiSelect, TableFilters } from 'components';
import * as utils from 'utils';

const renderClaimsTab = () => {
    return render(<ClaimsTab />);
};

describe('MODULES › ClaimsTab', () => {

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
        renderClaimsTab();
    
        // assert
        expect(screen.getByTestId('claims-tab')).toBeInTheDocument();
      });

    it('renders table', () => {
        // arrange
        renderClaimsTab();
    
        // assert
        expect(screen.getByTestId('claims-tab-table')).toBeInTheDocument();
      });

    it('after typing value with less than 4 chars in the search field', () => {
        // arrange
        const { container } = renderClaimsTab();
        userEvent.type(container.querySelector('input[name=query]'), 'ABC');
    
        // assert
        expect(container.querySelector('input[name=query]')).toHaveValue('ABC');
        expect(screen.getByTestId('search-button-go')).not.toBeEnabled();
      });

      it('after typing value with more than 4 chars in the search field', () => {
        // arrange
        const { container } = renderClaimsTab();
        userEvent.type(container.querySelector('input[name=query]'), 'ABCDE');
    
        // assert
        expect(container.querySelector('input[name=query]')).toHaveValue('ABCDE');
        expect(screen.getByTestId('search-button-go')).toBeEnabled();
      });

      it('renders view radio buttons for full access users', () => {
        //arrange
        const { queryByText } = render(<ClaimsTab />,  { initialState: { user: userWithAccess } });
    
        //assert
        expect(queryByText(utils.string.t('claims.claimsTab.myClaims'))).toBeInTheDocument();
        expect(queryByText(utils.string.t('claims.claimsTab.myTeamClaims'))).toBeInTheDocument();
      });

      it('renders view radio buttons for limited access users', () => {
        //arrange
        const { queryByText } = render(<ClaimsTab />, { initialState: { user: userWithLimitedAccess } });
    
        //assert
        expect(queryByText(utils.string.t('claims.claimsTab.myClaims'))).toBeInTheDocument();
        expect(queryByText(utils.string.t('claims.claimsTab.myTeamClaims'))).not.toBeInTheDocument();
      });

      it('renders search select buttons', () => {
        //arrange
        const { container } = renderClaimsTab();
    
        //assert
        expect(container.querySelector(getFormSelect('searchBy'))).toBeInTheDocument();
        expect(container.querySelectorAll(getFormSelect('searchBy'))).toHaveLength(1);
      });

      it('renders table header', () => {
        //arrange
        const { queryByText } = renderClaimsTab();

        //assert
        expect(queryByText(utils.string.t('claims.claimsTab.tablecolumns.claimRef'))).toBeInTheDocument();
        expect(queryByText(utils.string.t('claims.claimsTab.tablecolumns.lossRef'))).toBeInTheDocument();
        expect(queryByText(utils.string.t('claims.claimsTab.tablecolumns.insured'))).toBeInTheDocument();
        expect(queryByText(utils.string.t('claims.claimsTab.tablecolumns.policyRef'))).toBeInTheDocument();
        expect(queryByText(utils.string.t('claims.claimsTab.tablecolumns.division'))).toBeInTheDocument();
        expect(queryByText(utils.string.t('claims.claimsTab.tablecolumns.workflowStatus'))).toBeInTheDocument();
        expect(queryByText(utils.string.t('claims.claimsTab.tablecolumns.claimStage'))).toBeInTheDocument();
        expect(queryByText(utils.string.t('claims.claimsTab.tablecolumns.assignedTo'))).toBeInTheDocument();
        expect(queryByText(utils.string.t('claims.claimsTab.tablecolumns.team'))).toBeInTheDocument();
        expect(queryByText(utils.string.t('claims.claimsTab.tablecolumns.priority'))).toBeInTheDocument();
      });
});

describe('MODULES › ClaimsTab › toggle filters', () => {

  const claimsTabFilterDropDown = {
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
      id: 'claimStage',
      type: 'multiSelect',
      label: utils.string.t('claims.claimsTab.filtercolumns.claimStage'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: [],
      options: claimsTabFilterDropDown?.team,
      content: <MultiSelect id="claimStage" search options={claimsTabFilterDropDown?.team} />,
    },
    {
      id: 'insured',
      type: 'multiSelect',
      label: utils.string.t('claims.claimsTab.filtercolumns.insured'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: [],
      options: claimsTabFilterDropDown?.team,
      content: <MultiSelect id="team" search options={claimsTabFilterDropDown?.team} />,
    },
    {
      id: 'priority',
      type: 'multiSelect',
      label: utils.string.t('claims.claimsTab.filtercolumns.priority'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: [],
      options: claimsTabFilterDropDown?.priority,
      content: <MultiSelect id="priority" search options={claimsTabFilterDropDown?.priority} />,
    },
    {
      id: 'division',
      type: 'multiSelect',
      label: utils.string.t('claims.claimsTab.filtercolumns.division'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: [],
      options: claimsTabFilterDropDown?.processState,
      content: <MultiSelect id="division" search options={claimsTabFilterDropDown?.processState} />,
    }
  ];

  it('validating the filter icon', () => {
    // arrange
    renderClaimsTab();

    //assert
    expect(screen.getByTestId('form-search')).toBeInTheDocument();
  });

  it('renders filters content if defined in filtersArray', () => {
    //arrange
    const { queryByText } = render(
      <ClaimsTab>
        <TableFilters filtersArray={tableFilterFields} />
      </ClaimsTab>
    );

    //assert
    expect(queryByText(utils.string.t('claims.claimsTab.filtercolumns.claimStage'))).toBeInTheDocument();
    expect(queryByText(utils.string.t('claims.claimsTab.filtercolumns.insured'))).toBeInTheDocument();
    expect(queryByText(utils.string.t('claims.claimsTab.filtercolumns.priority'))).toBeInTheDocument();
    expect(queryByText(utils.string.t('claims.claimsTab.filtercolumns.division'))).toBeInTheDocument();
  });

});