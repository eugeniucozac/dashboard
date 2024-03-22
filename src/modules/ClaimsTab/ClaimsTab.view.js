import React from 'react';
import PropTypes from 'prop-types';

import styles from './ClaimsTab.styles';
import { TableActions, TableFilters, TableToolbar, FormRadio, FormLabel, FormSelect } from 'components';
import { ClaimsTabTable } from './ClaimsTabTable';
import * as utils from 'utils';

// mui
import { makeStyles, Box } from '@material-ui/core';

ClaimsTabView.propTypes = {
  claims: PropTypes.array.isRequired,
  sort: PropTypes.object.isRequired,
  columnsArray: PropTypes.array.isRequired,
  columnProps: PropTypes.func.isRequired,
  viewFields: PropTypes.array.isRequired,
  tableFilterFields: PropTypes.array.isRequired,
  isFetchingFilters: PropTypes.bool,
  resetKey: PropTypes.number,
  control: PropTypes.object.isRequired,
  handlers: PropTypes.shape({
    search: PropTypes.func.isRequired,
    searchFilter: PropTypes.func.isRequired,
    resetFilter: PropTypes.func.isRequired,
    sort: PropTypes.func.isRequired,
    changePage: PropTypes.func.isRequired,
    changeRowsPerPage: PropTypes.func.isRequired,
    toggleColumn: PropTypes.func.isRequired,
    resetSearch: PropTypes.func.isRequired,
    onSelectSearchBy: PropTypes.func.isRequired,
  }).isRequired,
  searchTerm: PropTypes.string,
  searchByTerm: PropTypes.string,
};

export default function ClaimsTabView({
  claims,
  sort,
  columnsArray,
  columnProps,
  viewFields,
  tableFilterFields,
  isFetchingFilters,
  resetKey,
  control,
  handlers,
  searchTerm,
  searchByTerm,
}) {
  const classes = makeStyles(styles, { name: 'ClaimsTab' })();

  return (
    <Box mt={3} data-testid="claims-tab">
      <TableToolbar>
        <TableActions nestedClasses={{ root: classes.radioContainer }}>
          <Box display="flex" alignItems="center">
            <FormLabel label={`${utils.string.t('app.view')}: `} align="left" nestedClasses={{ root: classes.viewLabel }} />
            <FormRadio {...utils.form.getFieldProps(viewFields, 'views')} control={control} />
          </Box>
        </TableActions>
        <TableFilters
          search
          searchBy={
            <Box className={classes.filterBox}>
              <FormSelect
                {...utils.form.getFieldProps(viewFields, 'searchBy')}
                control={control}
                nestedClasses={{ root: classes.selectAutocomplete }}
                handleUpdate={(name, value) => {
                  handlers.onSelectSearchBy(value);
                }}
              />
            </Box>
          }
          searchByTerm={searchByTerm}
          searchMinChars={4}
          searchPlaceholder={utils.string.t('claims.processing.searchPlaceHolder')}
          searchTerm={searchTerm || ''}
          filtersArray={tableFilterFields}
          isFetchingFilters={isFetchingFilters}
          clearFilterKey={resetKey}
          nestedClasses={{
            root: classes.filtersContainer,
            searchBox: classes.searchBox,
          }}
          handlers={{
            onSearch: handlers.search,
            onResetFilter: handlers.resetFilter,
            onFilter: handlers.searchFilter,
            onToggleColumn: handlers.toggleColumn,
            onResetSearch: handlers.resetSearch,
          }}
        />
      </TableToolbar>

      <ClaimsTabTable
        claims={claims}
        cols={columnsArray}
        columnProps={columnProps}
        sort={sort}
        handlers={{
          changePage: handlers.changePage,
          changeRowsPerPage: handlers.changeRowsPerPage,
          sort: handlers.sort,
        }}
        viewFields={viewFields}
        control={control}
      />
    </Box>
  );
}
