import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './LossAction.styles';
import { TableFilters, TableToolbar } from 'components';
import LossActionTable from '../LossActionTable/LossActionTable';
import * as utils from 'utils';

// mui
import { makeStyles, Box } from '@material-ui/core';

LossActionView.propTypes = {
  items: PropTypes.object.isRequired,
  columnsArray: PropTypes.array.isRequired,
  columnProps: PropTypes.func.isRequired,
  tableFilterFields: PropTypes.array.isRequired,
  isFetchingFilters: PropTypes.bool,
  handlers: PropTypes.shape({
    search: PropTypes.func,
    resetFilter: PropTypes.func,
    searchFilter: PropTypes.func,
    resetSearch: PropTypes.func,
  }),
  searchTerm: PropTypes.string,
};

export function LossActionView({ items, columnsArray, columnProps, tableFilterFields, isFetchingFilters, handlers }) {
  const classes = makeStyles(styles, { name: 'LossAction' })();

  return (
    <Box mt={3} data-testid="loss-action">
      <TableToolbar>
        <TableFilters
          search
          searchPlaceholder={utils.string.t('claims.lossClaimsTasksDashboard.searchActionsTabBarPlaceholder')}
          searchMinChars={3}
          nestedClasses={{ searchMaxWidth: classes.searchMaxWidth }}
          filtersArray={tableFilterFields}
          isFetchingFilters={isFetchingFilters}
          handlers={{
            onSearch: handlers.search,
            onFilter: (values) => handlers.filter(values),
            onResetSearch: handlers.resetSearch,
            onResetFilter: handlers.resetFilter,
          }}
        />
      </TableToolbar>
      <LossActionTable lossActions={items} cols={columnsArray} columnProps={columnProps} />
    </Box>
  );
}
