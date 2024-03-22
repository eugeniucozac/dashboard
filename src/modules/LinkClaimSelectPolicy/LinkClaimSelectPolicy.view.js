import React from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';

// app
import styles from './LinkClaimSelectPolicy.styles';
import * as utils from 'utils';
import config from 'config';
import {
  FormLegend,
  TableCell,
  TableHead,
  Pagination,
  Empty,
  Tooltip,
  TableFilters,
  TableToolbar,
  Skeleton,
  FormSelect,
} from 'components';
import { ReactComponent as IconSearchFile } from '../../assets/svg/line-icon-search-file.svg';
import { usePagination, useSort } from 'hooks';
import { LinkClaimPolicy } from 'modules';

// mui
import { makeStyles, TableContainer, Table, TableRow, TableBody, Typography, Box, RadioGroup, Radio } from '@material-ui/core';

LinkClaimSelectPolicyView.propTypes = {
  columnsArray: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  sort: PropTypes.object.isRequired,
  policyData: PropTypes.object.isRequired,
  selectedPolicy: PropTypes.bool,
  pagination: PropTypes.object.isRequired,
  viewControl: PropTypes.object.isRequired,
  isFetchingFilters: PropTypes.bool,
  searchByTerm: PropTypes.string,
  isTableLoading: PropTypes.bool,
  tableFilterFields: PropTypes.array.isRequired,
  viewFields: PropTypes.array.isRequired,
  handlers: PropTypes.shape({
    handleSort: PropTypes.func.isRequired,
    handleSearch: PropTypes.func.isRequired,
    handleSearchFilter: PropTypes.func.isRequired,
    onResetFilter: PropTypes.func.isRequired,
    onResetSearch: PropTypes.func.isRequired,
    handlePolicyData: PropTypes.func.isRequired,
    handleChangePage: PropTypes.func.isRequired,
    handleChangeRowsPerPage: PropTypes.func.isRequired,
    columnProps: PropTypes.func.isRequired,
    toggleColumn: PropTypes.func.isRequired,
    onSelectSearchBy: PropTypes.func.isRequired,
  }).isRequired,
};

export function LinkClaimSelectPolicyView({
  columnsArray,
  rows = [],
  sort: sortObj,
  policyData,
  selectedPolicyRender,
  setSelectedPolicyRender,
  pagination,
  tableFilterFields,
  handlers,
  viewControl,
  viewFields,
  isFetchingFilters,
  searchByTerm,
  confirm,
  validation,
  setValidation,
  sectionEnabledValidationFlag,
  setActiveStep,
  index,
  isFormsEdited,
  setFormEditedStatus,
  saveStatus,
  policyInformation,
  claimInfo,
  handleFormStatus,
  isTableLoading,
  selectNextPolicy,
  setSelectNextPolicy,
  selectedPolicy,
}) {
  const classes = makeStyles(styles, { name: 'LinkClaimSelectPolicy' })();
  const { cols, sort } = useSort(columnsArray, sortObj, handlers.handleSort);
  const paginationObj = usePagination(rows, pagination, handlers.handleChangePage, handlers.handleChangeRowsPerPage);
  const cellLength = 25;

  return (
    <Box mt={4}>
      <FormLegend text={utils.string.t('claims.searchPolicy.claimRef')} />
      <Box mt={-2.5}>
        <Typography variant="h5">{claimInfo?.claimReference || ''}</Typography>
      </Box>

      <Box mt={4}>
        <FormLegend text={utils.string.t('claims.searchPolicy.searchPolicies')} />
        <Box mt={-2.5}>
          <Typography variant="h5">{utils.string.t('claims.searchPolicy.linkPolicySearchInputLabel')}</Typography>
        </Box>
        <Box mt={4}>
          <TableToolbar>
            <TableFilters
              search
              searchBy={
                <Box className={classes.filterBox}>
                <FormSelect
                  {...utils.form.getFieldProps(viewFields, 'searchBy')}
                  control={viewControl}
                  nestedClasses={{ root: classes.selectAutocomplete }}
                  handleUpdate={(name, value) => {
                    handlers.onSelectSearchBy(value);
                  }}
                />
                </Box>
              }
              searchByTerm={searchByTerm}
              searchPlaceholder={utils.string.t('claims.searchPolicy.minimumCharacters')}
              searchMinChars={4}
              filtersArray={tableFilterFields}
              isFetchingFilters={isFetchingFilters}
              columns
              searchTerm={policyData.searchTerm}
              columnsArray={cols}
              handlers={{
                onSearch: handlers.handleSearch,
                onFilter: handlers.handleSearchFilter,
                onResetFilter: handlers.onResetFilter,
                onResetSearch: handlers.onResetSearch,
                onToggleColumn: handlers.toggleColumn,
              }}
              nestedClasses={{
                root: classes.filtersContainer,
                searchBox: classes.searchBox,
              }}
            />
          </TableToolbar>
        </Box>
      </Box>

      <Box mt={2}>
        {utils.generic.isValidArray(rows) && (
          <>
            <TableContainer>
              <RadioGroup name="policyRef" value={policyData.xbPolicyID} onChange={handlers.handlePolicyData}>
                <Table data-testid="claims-policy-search-table">
                  {utils.generic.isValidArray(rows, true) && <TableHead columns={cols} sorting={sort} />}
                  <TableBody data-testid="claims-list">
                    {isTableLoading ? (
                      <TableRow>
                        <TableCell colSpan={cols?.length}>
                          <Skeleton height={50} animation="wave" displayNumber={5} />
                        </TableCell>
                      </TableRow>
                    ) : (
                      rows?.map((policy) => (
                        <TableRow key={policy.policyNumber} selected={Number(policyData.xbPolicyID) === policy.xbPolicyID}>
                          <TableCell {...handlers.columnProps('policyRef')} data-testid={`row-col-${policy.policyNumber}`}>
                            <Box display="flex" alignItems="center" ml={-0.5}>
                              <Radio
                                checked={Number(policyData.xbPolicyID) === policy.xbPolicyID}
                                onChange={handlers.handlePolicyData}
                                value={policy.xbPolicyID}
                                name="policyRef"
                                color="primary"
                                className={classes.radio}
                              />
                              {policy.policyNumber}
                            </Box>
                          </TableCell>
                          <TableCell {...handlers.columnProps('statusCode')} data-testid={`row-col-${policy.statusCode}`}>
                            {policy.statusCode}
                          </TableCell>
                          <TableCell {...handlers.columnProps('policyType')} data-testid={`row-col-${policy.policyType}`}>
                            {policy.policyType}
                          </TableCell>
                          <TableCell {...handlers.columnProps('umr')} data-testid={`row-col-${policy.umr}`}>
                            {policy.umr}
                          </TableCell>
                          <TableCell {...handlers.columnProps('insured')} data-testid={`row-col-${policy.insured}`}>
                            {policy.insured}
                          </TableCell>
                          <TableCell {...handlers.columnProps('reInsured')} data-testid={`row-col-${policy.reInsured}`}>
                            {policy.reInsured || utils.string.t('app.na')}
                          </TableCell>
                          <TableCell {...handlers.columnProps('coverHolder')} data-testid={`row-col-${policy.coverHolder}`}>
                            {policy.coverHolder}
                          </TableCell>
                          <TableCell {...handlers.columnProps('clientName')} data-testid={`row-col-${policy.clientName}`}>
                            {policy.clientName}
                          </TableCell>
                          <TableCell {...handlers.columnProps('riskDetails')} data-testid={`row-col-${policy.riskDetails}`}>
                            {policy.riskDetails.length > cellLength ? (
                              <Tooltip block title={policy.riskDetails}>
                                {policy.riskDetails.slice(0, cellLength)}...
                              </Tooltip>
                            ) : (
                              policy.riskDetails
                            )}
                          </TableCell>
                          <TableCell {...handlers.columnProps('inceptionDate')} data-testid={`row-col-${policy.inceptionDate}`}>
                            {utils.string.t('format.date', {
                              value: { date: policy?.inceptionDate, format: config.ui.format.date.text },
                            })}
                          </TableCell>
                          <TableCell {...handlers.columnProps('expiryDate')} data-testid={`row-col-${policy.expiryDate}`}>
                            {utils.string.t('format.date', {
                              value: { date: policy?.expiryDate, format: config.ui.format.date.text },
                            })}
                          </TableCell>
                          <TableCell {...handlers.columnProps('company')} data-testid={`row-col-${policy.company}`}>
                            <strong>{policy.company}</strong>
                          </TableCell>
                          <TableCell {...handlers.columnProps('division')} data-testid={`row-col-${policy.division}`}>
                            {policy.division}
                          </TableCell>
                          <TableCell {...handlers.columnProps('businessTypeCode')} data-testid={`row-col-${policy.businessTypeCode}`}>
                            {policy.businessTypeCode}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </RadioGroup>
            </TableContainer>

            {utils.generic.isValidArray(rows, true) && (
              <Pagination
                page={get(paginationObj, 'obj.page')}
                count={get(paginationObj, 'obj.rowsTotal')}
                rowsPerPage={get(paginationObj, 'obj.rowsPerPage')}
                onChangePage={get(paginationObj, 'handlers.handleChangePage')}
                onChangeRowsPerPage={get(paginationObj, 'handlers.handleChangeRowsPerPage')}
              />
            )}
          </>
        )}

        {!isTableLoading && !utils.generic.isValidArray(rows, true) && (
          <Box mt={-2}>
            <Empty
              title={utils.string.t('claims.noMatchFound')}
              text={utils.string.t('claims.noMatchDetails')}
              icon={<IconSearchFile />}
              padding
            />
          </Box>
        )}

        {(confirm || selectedPolicyRender === '') && utils.generic.isValidArray(rows, true) && (
          <Box mt={2}>
            <LinkClaimPolicy
              policyData={policyData}
              selectedPolicyRender={selectedPolicyRender}
              setSelectedPolicyRender={setSelectedPolicyRender}
              validation={validation}
              setValidation={setValidation}
              setActiveStep={setActiveStep}
              index={index}
              isFormsEdited={isFormsEdited}
              setFormEditedStatus={setFormEditedStatus}
              saveStatus={saveStatus}
              sectionEnabledValidationFlag={sectionEnabledValidationFlag}
              policyInformation={policyInformation}
              claimInfo={claimInfo}
              handleFormStatus={handleFormStatus}
              selectNextPolicy={selectNextPolicy}
              setSelectNextPolicy={setSelectNextPolicy}
              selectedPolicy={selectedPolicy}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
