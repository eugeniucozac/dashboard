import React from 'react';
import PropTypes from 'prop-types';

// app
import * as utils from 'utils';
import { ClaimsProcessingTable } from 'modules';
import { TableActions, TableFilters, TableToolbar, FormRadio, Button, FormLabel, FormAutocompleteMui, FormSwitch } from 'components';
import styles from './ClaimsManagement.styles';
import { useMedia } from 'hooks';
import * as constants from 'consts';

// mui
import { makeStyles, Box, Grid } from '@material-ui/core';

ClaimsManagementView.propTypes = {
  claims: PropTypes.array.isRequired,
  claimsProcessing: PropTypes.object.isRequired,
  sort: PropTypes.object.isRequired,
  columnsArray: PropTypes.array.isRequired,
  columnProps: PropTypes.func.isRequired,
  viewFields: PropTypes.array.isRequired,
  tableFilterFields: PropTypes.array.isRequired,
  isFetchingFilters: PropTypes.bool,
  isBulkEnabled: PropTypes.bool,
  resetKey: PropTypes.number,
  claimsType: PropTypes.string.isRequired,
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
    bulkAssignClaims: PropTypes.func.isRequired,
    setClaimsType: PropTypes.func.isRequired,
    onSelectSearchBy: PropTypes.func.isRequired,
  }).isRequired,
  searchTerm: PropTypes.string,
};

export function ClaimsManagementView({
  claims,
  claimsProcessing,
  sort,
  columnsArray,
  columnProps,
  viewFields,
  tableFilterFields,
  isFetchingFilters,
  isBulkEnabled,
  claimsType,
  resetKey,
  control,
  handlers,
  searchTerm,
}) {
  const media = useMedia();
  const classes = makeStyles(styles, { name: 'ClaimsManagement' })({ isMobile: media.mobile });
  const columnsData = [...columnsArray];

  return (
    <Box mt={3} data-testid="claims-management">
      <TableToolbar>
        <TableActions>
          <Grid container>
            <Grid item>
              <FormLabel label={`${utils.string.t('app.view')}: `} align="left" nestedClasses={{ root: classes.viewLabel }} />
            </Grid>
            <Grid item>
              <FormRadio {...utils.form.getFieldProps(viewFields, 'views')} control={control} />
            </Grid>
          </Grid>
          {claimsType !== constants.CLAIM_TEAM_TYPE.allClaims && (
            <Grid container>
              <Grid item>
                <FormLabel
                  label={utils.string.t('claims.processing.includeClosedClaims')}
                  align="left"
                  nestedClasses={{ root: classes.viewLabel }}
                />
              </Grid>
              <Grid item>
                <FormSwitch {...utils.form.getFieldProps(viewFields, 'includeClosedClaims', control)} />
              </Grid>
            </Grid>
          )}
        </TableActions>
        <TableFilters
          search
          searchBy={
            <Box className={classes.filterBox}>
              <FormLabel label={`${utils.string.t('claims.searchByClaims.label')}*`} />
              <FormAutocompleteMui
                {...utils.form.getFieldProps(viewFields, 'searchBy')}
                control={control}
                nestedClasses={{ root: classes.selectAutocomplete }}
                callback={(event, obj) => {
                  handlers.onSelectSearchBy(obj?.value, obj?.label);
                }}
              />
            </Box>
          }
          searchPlaceholder={utils.string.t('claims.processing.searchBarPlaceholder')}
          searchMinChars={3}
          nestedClasses={{ searchMaxWidth: classes.searchMaxWidth }}
          filtersArray={tableFilterFields}
          isFetchingFilters={isFetchingFilters}
          columns
          clearFilterKey={resetKey}
          columnsArray={columnsData?.sort((first, second) => first.label?.localeCompare(second.label))}
          handlers={{
            onSearch: handlers.search,
            onResetFilter: handlers.resetFilter,
            onFilter: (values) => handlers.searchFilter(values),
            onToggleColumn: handlers.toggleColumn,
            onResetSearch: handlers.resetSearch,
          }}
          searchTerm={searchTerm}
        />
      </TableToolbar>
      <ClaimsProcessingTable
        claims={claims}
        cols={columnsArray}
        columnProps={columnProps}
        sort={sort}
        handlers={{
          bulkAssignClaims: handlers.bulkAssignClaims,
          changePage: handlers.changePage,
          changeRowsPerPage: handlers.changeRowsPerPage,
          sort: handlers.sort,
        }}
      />
      {claimsProcessing?.items?.length > 0 && (
        <Button
          text={utils.string.t('claims.processing.bulkAssign.button')}
          color="primary"
          variant="outlined"
          disabled={!isBulkEnabled}
          onClick={handlers.bulkAssignClaims}
          data-testid="bulk-button"
        />
      )}
    </Box>
  );
}
