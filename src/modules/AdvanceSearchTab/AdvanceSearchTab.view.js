import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

//app
import { TableFilters, TableToolbar, TableActions, FormLabel, FormSwitch, FormSelect } from 'components';
import * as utils from 'utils';
import styles from './AdvanceSearchTab.styles';
import { AdvanceSearchTabTable } from 'modules';
import config from 'config';

//mui
import { makeStyles, Box } from '@material-ui/core';

AdvanceSearchTabView.propTypes = {
  advanceSearchData: PropTypes.array.isRequired,
  tableData: PropTypes.array.isRequired,
  sort: PropTypes.object.isRequired,
  columnsArray: PropTypes.array.isRequired,
  columnProps: PropTypes.func.isRequired,
  isTableHidden: PropTypes.bool.isRequired,
  handleSearch: PropTypes.func.isRequired,
  handleSort: PropTypes.func.isRequired,
  handleChangePage: PropTypes.func.isRequired,
  handleChangeRowsPerPage: PropTypes.func.isRequired,
  handleSearchFilter: PropTypes.func.isRequired,
  handleClosedClaims: PropTypes.func.isRequired,
  tableFilterFields: PropTypes.array.isRequired,
  onResetFilter: PropTypes.func.isRequired,
  onResetSearch: PropTypes.func.isRequired,
  toggleColumn: PropTypes.func.isRequired,
  searchField: PropTypes.array.isRequired,
  closedClaimField: PropTypes.array.isRequired,
  isSearchByNull: PropTypes.bool.isRequired,
  searchTerm: PropTypes.string,
  isTblLoader: PropTypes.bool,
  isFetchingFilters: PropTypes.bool,
  emptyData: PropTypes.bool,
  resetKey: PropTypes.number,
};

export default function AdvanceSearchTabView({
  advanceSearchData,
  tableData,
  sort,
  columnsArray,
  columnProps,
  isTableHidden,
  handleSearch,
  handleSort,
  handleChangePage,
  handleChangeRowsPerPage,
  handleSearchFilter,
  handleClosedClaims,
  tableFilterFields,
  onResetFilter,
  onResetSearch,
  toggleColumn,
  searchField,
  closedClaimField,
  isSearchByNull,
  searchTerm,
  isTblLoader,
  isFetchingFilters,
  emptyData,
  resetKey,
}) {
  const classes = makeStyles(styles, { name: 'AdvanceSearchTab' })();
  const fields = [...searchField, ...closedClaimField];

  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);

  const { control } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  return (
    <Box mt={3} data-testid="AdvanceSearchTab">
      <TableToolbar>
        <TableActions>
          <Box alignItems="center">
            <Box>
              <FormLabel label={utils.string.t('claims.processing.includeClosedClaims')} align="left" />
            </Box>
            <FormSwitch
              {...utils.form.getFieldProps(fields, 'includeClosedClaims', control)}
              muiComponentProps={{ onChange: handleClosedClaims, size: 'small' }}
              nestedClasses={{ root: classes.switch }}
            />
          </Box>
        </TableActions>
        <TableFilters
          search
          searchBy={
            <Box className={classes.filterBox}>
              <FormSelect
                {...utils.form.getFieldProps(fields, 'searchBy')}
                control={control}
                nestedClasses={{ root: classes.selectAutocomplete }}
              />
            </Box>
          }
          isSearchByNull={isSearchByNull}
          searchMinChars={4}
          searchPlaceholder={utils.string.t('claims.columns.claimsList.searchLosses')}
          searchTerm={searchTerm || ''}
          filtersArray={tableFilterFields}
          isFetchingFilters={isFetchingFilters}
          columns
          columnsArray={columnsArray}
          clearFilterKey={resetKey}
          nestedClasses={{
            root: classes.filtersContainer,
            searchBox: classes.searchBox,
          }}
          handlers={{
            onSearch: handleSearch,
            onResetSearch: onResetSearch,
            onResetFilter: onResetFilter,
            onFilter: handleSearchFilter,
            onToggleColumn: toggleColumn,
          }}
        />
      </TableToolbar>

      {!isTableHidden && (
        <AdvanceSearchTabTable
          tableData={tableData || []}
          cols={columnsArray}
          columnProps={columnProps}
          sort={sort}
          pagination={{
            page: advanceSearchData?.page || 1,
            rowsTotal: advanceSearchData?.itemsTotal || 0,
            rowsPerPage: advanceSearchData?.pageSize || config.ui.pagination.default,
          }}
          handleSort={handleSort}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          isTblLoader={isTblLoader}
          emptyData={emptyData}
        />
      )}
    </Box>
  );
}
