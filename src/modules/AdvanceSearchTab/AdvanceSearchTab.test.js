import React from 'react';
import { render, screen, getFormSelect } from 'tests';
import AdvanceSearchTab from './AdvanceSearchTab';
import userEvent from '@testing-library/user-event';
import * as utils from 'utils';

const renderClaimsTab = () => {
  return render(<AdvanceSearchTab />);
};

describe('MODULES › AdvanceSearchTab', () => {
  it('renders without crashing', () => {
    renderClaimsTab();
    // assert
    expect(screen.getByTestId('AdvanceSearchTab')).toBeInTheDocument();
  });
  it('renders table without crashing', () => {
    renderClaimsTab();
    // assert
    expect(screen.getByTestId('Advance-search-table-grid')).toBeInTheDocument();
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
  it('renders search select buttons', () => {
    //arrange
    const { container } = renderClaimsTab();

    //assert
    expect(container.querySelector(getFormSelect('searchBy'))).toBeInTheDocument();
    expect(container.querySelectorAll(getFormSelect('searchBy'))).toHaveLength(1);
  });
  it('renders table header', () => {
    //arrange
    const { queryAllByText } = renderClaimsTab();

    //assert
    expect(queryAllByText(utils.string.t('claims.columns.claimsList.lossRef')).length).toBeGreaterThan(0);
    expect(queryAllByText(utils.string.t('claims.columns.claimsList.lossName')).length).toBeGreaterThan(0);
    expect(queryAllByText(utils.string.t('claims.columns.claimsList.lossFromDate')).length).toBeGreaterThan(0);
    expect(queryAllByText(utils.string.t('claims.columns.claimsList.lossToDate')).length).toBeGreaterThan(0);
    expect(queryAllByText(utils.string.t('claims.columns.claimsList.claimID')).length).toBeGreaterThan(0);
    expect(queryAllByText(utils.string.t('claims.columns.claimsList.claimStatusName')).length).toBeGreaterThan(0);
    expect(queryAllByText(utils.string.t('claims.columns.claimsList.policyRef')).length).toBeGreaterThan(0);
    expect(queryAllByText(utils.string.t('claims.columns.claimsList.insured')).length).toBeGreaterThan(0);
    expect(queryAllByText(utils.string.t('claims.columns.claimsList.company')).length).toBeGreaterThan(0);
    expect(queryAllByText(utils.string.t('claims.columns.claimsList.division')).length).toBeGreaterThan(0);
    expect(queryAllByText(utils.string.t('claims.columns.claimsManagement.createdBy')).length).toBeGreaterThan(0);
  });
});
