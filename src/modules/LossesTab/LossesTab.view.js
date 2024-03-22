import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

// app
import styles from './LossesTab.styles';
import { LossesTabTableView } from './LossesTabTable.view';
import { TableFilters, TableToolbar, FormSelect } from 'components';
import * as utils from 'utils';
import config from 'config';

// mui
import { makeStyles, Box } from '@material-ui/core';

LossesTabView.propTypes = {
  sort: PropTypes.object.isRequired,
  columnsArray: PropTypes.array.isRequired,
  columnProps: PropTypes.func.isRequired,
  isTableHidden: PropTypes.bool.isRequired,
  handleSearch: PropTypes.func.isRequired,
  handleSort: PropTypes.func.isRequired,
  handleChangePage: PropTypes.func.isRequired,
  handleChangeRowsPerPage: PropTypes.func.isRequired,
  handleSearchFilter: PropTypes.func.isRequired,
  tableFilterFields: PropTypes.array.isRequired,
  onResetFilter: PropTypes.func.isRequired,
  onResetSearch: PropTypes.func.isRequired,
  toggleColumn: PropTypes.func.isRequired,
  searchField: PropTypes.array.isRequired,
  searchByTerm: PropTypes.string,
  searchTerm: PropTypes.string,
  isTblLoader: PropTypes.bool,
  emptyData: PropTypes.bool,
  resetKey: PropTypes.number,
};

export function LossesTabView({
  lossesData,
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
  tableFilterFields,
  onResetFilter,
  onResetSearch,
  toggleColumn,
  searchField,
  searchByTerm,
  searchTerm,
  isTblLoader,
  emptyData,
  resetKey,
}) {
  const classes = makeStyles(styles, { name: 'LossesTab' })();

  const defaultValues = utils.form.getInitialValues(searchField);
  const { control } = useForm({ defaultValues });

  return (
    <Box mt={3} data-testid="losses-tab">
      <TableToolbar>
        <TableFilters
          search
          searchBy={
            <Box className={classes.filterBox}>
              <FormSelect
                {...utils.form.getFieldProps(searchField, 'searchBy')}
                control={control}
                nestedClasses={{ root: classes.selectAutocomplete }}
              />
            </Box>
          }
          searchByTerm={searchByTerm}
          searchMinChars={4}
          searchPlaceholder={utils.string.t('claims.columns.claimsList.searchLosses')}
          searchTerm={searchTerm || ''}
          filtersArray={tableFilterFields}
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
        <LossesTabTableView
          tableData={tableData || []}
          cols={columnsArray}
          columnProps={columnProps}
          sort={sort}
          pagination={{
            page: lossesData?.page || 0,
            rowsTotal: lossesData?.itemsTotal || 0,
            rowsPerPage: lossesData?.pageSize || config.ui.pagination.default,
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
