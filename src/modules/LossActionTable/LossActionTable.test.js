import React from 'react';
import { render } from 'tests';
import LossActionTable from './LossActionTable';
import LossActionRow from './LossActionRow';
import * as utils from 'utils';
import { MultiSelect, TableFilters } from 'components';

const renderLossActionTable = () => {
  return render(<LossActionTable />);
};

describe('MODULES › LossAction › toggle filters', () => {
  renderLossActionTable();

  const originalWarn = console.warn;
  afterEach(() => (console.warn = originalWarn));

  const mockedWarn = () => {};
  beforeEach(() => (console.warn = mockedWarn));

  const optionsData = {
    data: {
      assignedTo: [
        { id: 'xXaId', name: 'xXa' },
        { id: 'swdId', name: 'swd' },
        { id: 'Ramesh2Id', name: 'Ramesh2' },
        { id: 'HeatwaveId', name: 'Heatwave' },
      ],
      createdDate: null,
      targetDueDate: null,
      priority: [
        { id: 'highId', name: 'High' },
        { id: 'lowId', name: 'Low' },
        { id: 'mediumId', name: 'Medium' },
      ],
      status: [
        { id: 'submittedId', name: 'Submitted' },
        { id: 'draftId', name: 'DRAFT' },
      ],
      division: [
        { id: 'ShermanId', name: 'Sherman Old CIty Hall, LLC' },
        { id: 'LakeId', name: 'Lake Oswego Corporation' },
        { id: 'VillageId', name: 'Village of Freeburg, Illinois' },
        { id: 'CommunityId', name: 'Community at Carnegie Building LLC' },
      ],
      insured: [
        { id: 'LottPropertyPartnersLtdId', name: 'Lott Property Partners, Ltd' },
        { id: 'HazpropEnviromentalLtdId', name: 'Hazprop Enviromental Ltd' },
        { id: 'McGregorId', name: 'McGregor & Associates Insurance Administration Inc' },
        { id: 'JohnHuntId', name: 'John Hunt' },
        { id: 'ErosGroupId', name: 'Eros Group' },
        { id: 'AltecIncId', name: 'Altec Inc.' },
      ],
    },
  };

  const tableFilterFields = [
    {
      id: 'assignedTo',
      type: 'multiSelect',
      label: utils.string.t('claims.columns.claimsList.assignedTo'),
      value: [],
      options: optionsData.data.assignedTo,
      content: <MultiSelect id="assignedTo" search options={optionsData.data.assignedTo} />,
    },
    {
      id: 'createdDate',
      type: 'multiSelect',
      label: utils.string.t('claims.columns.claimsList.dateAndTimeCreated'),
      value: [],
      options: [],
      content: <MultiSelect id="createdDate" search options={[]} />,
    },
    {
      id: 'targetDueDate',
      type: 'multiSelect',
      label: utils.string.t('claims.columns.claimsList.targetDueDate'),
      value: [],
      options: [],
      content: <MultiSelect id="targetDueDate" search options={[]} />,
    },
    {
      id: 'priority',
      type: 'multiSelect',
      label: utils.string.t('claims.claimInformation.priority'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      options: optionsData.data.priority,
      content: <MultiSelect id="priority" search options={optionsData.data.priority} />,
    },
    {
      id: 'status',
      type: 'multiSelect',
      label: utils.string.t('claims.columns.claimsManagement.status'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      options: optionsData.data.status,
      content: <MultiSelect id="status" search options={optionsData.data.status} />,
    },
    {
      id: 'division',
      type: 'multiSelect',
      label: utils.string.t('claims.columns.claimsList.division'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      options: optionsData.data.division,
      content: <MultiSelect id="division" search options={optionsData.data.division} />,
    },
    {
      id: 'insured',
      type: 'multiSelect',
      label: utils.string.t('claims.columns.claimsManagement.insured'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      options: optionsData.data.insured,
      content: <MultiSelect id="insured" search options={optionsData.data.insured} />,
    },
  ];

  it('renders filters toggle button by default if filters array is defined', () => {
    //arrange
    const { queryByTestId } = render(<TableFilters filtersArray={tableFilterFields} />);

    //assert
    expect(queryByTestId('filters-button-toggle')).toBeInTheDocument();
  });

  it('renders filters content if defined in filtersArray', () => {
    //arrange
    const { queryByText } = render(<TableFilters filtersArray={tableFilterFields} />);

    //assert
    expect(queryByText(utils.string.t('claims.columns.claimsList.assignedTo'))).toBeInTheDocument();
    expect(queryByText(utils.string.t('claims.columns.claimsList.dateAndTimeCreated'))).toBeInTheDocument();
    expect(queryByText(utils.string.t('claims.claimInformation.priority'))).toBeInTheDocument();
    expect(queryByText(utils.string.t('claims.columns.claimsList.division'))).toBeInTheDocument();
  });
});

describe('MODULES › LossActionRow › Loss Action Row', () => {

  const originalWarn = console.warn;
  afterEach(() => (console.warn = originalWarn));

  const mockedWarn = () => {};
  beforeEach(() => (console.warn = mockedWarn));

  const defaultProps = {
    data: [],
    columnProps: [],
    onClick: ()=>{},
    isOpen: true,
    level: 1
  };

  const renderLossActionRow = (props={}) => {
    return render(
      <LossActionTable>
        <LossActionRow {...defaultProps} {...props} />
      </LossActionTable>);
  };

  describe('@render', () => {
    it('renders without crashing', () => {
        renderLossActionRow();
    });

    it('renders with Loss Action Table', () => {
      //arrange
      const { queryByTestId } = renderLossActionRow();

      //assert
      expect(queryByTestId('loss-action-table')).toBeInTheDocument();
      expect(queryByTestId('empty-placeholder')).toBeInTheDocument();
    });
  });

});