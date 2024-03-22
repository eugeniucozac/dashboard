import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import styles from './TableFilters.style';
import { Button, Search, Loader } from 'components';
import * as utils from 'utils';

// mui
import {
  Box,
  Checkbox,
  Collapse,
  Fade,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Popover,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ViewCompactOutlinedIcon from '@material-ui/icons/ViewCompactOutlined';
import FilterListIcon from '@material-ui/icons/FilterList';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';

TableFiltersView.propTypes = {
  searchBy: PropTypes.node,
  searchByTerm: PropTypes.string,
  search: PropTypes.bool,
  searchQuery: PropTypes.string,
  searchMinChars: PropTypes.number,
  searchPlaceholder: PropTypes.string,
  searchAdvanced: PropTypes.node,
  searchAdvancedExpanded: PropTypes.bool,
  isFetchingFilters: PropTypes.bool,
  filters: PropTypes.bool,
  filtersSubmitDisabled: PropTypes.bool,
  filtersExpanded: PropTypes.bool,
  filtersArray: PropTypes.array,
  columns: PropTypes.bool,
  columnsArray: PropTypes.array,
  columnsExpanded: PropTypes.bool,
  excelExport: PropTypes.node,
  handlers: PropTypes.shape({
    toggleFilters: PropTypes.func.isRequired,
    submitFilters: PropTypes.func.isRequired,
    resetFilters: PropTypes.func.isRequired,
    toggleColumns: PropTypes.func.isRequired,
    toggleColumnsExpanded: PropTypes.func.isRequired,
    toggleAdvancedSearch: PropTypes.func.isRequired,
    resetSearch: PropTypes.func.isRequired,
    submitSearch: PropTypes.func.isRequired,
  }).isRequired,
  nestedClasses: PropTypes.shape({
    root: PropTypes.string,
    searchMaxWidth: PropTypes.string,
    searchLeft: PropTypes.string,
    searchBox: PropTypes.string,
  }),
};

TableFiltersView.defaultProps = {
  nestedClasses: {},
};

export function TableFiltersView({
  resetKey,
  searchBy,
  searchByTerm,
  search,
  searchQuery,
  searchMinChars,
  searchPlaceholder,
  searchAdvanced,
  searchAdvancedExpanded,
  isFetchingFilters,
  filters,
  filtersSubmitDisabled,
  filtersExpanded,
  filtersArray,
  columns,
  excelExport,
  columnsArray,
  columnsExpanded,
  handlers,
  nestedClasses,
  children,
}) {
  const classes = makeStyles(styles, { name: 'TableFilters' })({ filtersExpanded });
  const refBtnColumns = useRef(null);
  const refBtnAdvancedExpanded = useRef(null);

  const hasSearch = Boolean(search);
  const hasAdvancedSearch = Boolean(searchAdvanced);
  const hasFilters = Boolean(filters && children);
  const hasColumns = Boolean(columns && utils.generic.isValidArray(columnsArray, true));

  return (
    <>
      <div
        className={classnames({
          [classes.root]: true,
          [nestedClasses.root]: Boolean(nestedClasses.root),
          [nestedClasses.searchMaxWidth]: Boolean(nestedClasses.searchMaxWidth),
        })}
      >
        {searchBy}
        {hasSearch && (
          <Search
            key={resetKey}
            text={searchQuery || ''}
            placeholder={searchPlaceholder || utils.string.t('app.search')}
            submitButtonProps={{ size: 'small' }}
            minChars={searchMinChars}
            searchByTerm={searchByTerm}
            isSearchByActive={Boolean(searchByTerm && searchBy)}
            nestedClasses={{
              root: classnames({
                [classes.search]: true,
                [nestedClasses.searchMaxWidth]: Boolean(nestedClasses.searchMaxWidth),
                [nestedClasses.searchLeft]: Boolean(nestedClasses.searchLeft),
                [nestedClasses.searchBox]: Boolean(nestedClasses.searchBox),
              }),
              inputPropsRoot: classes.inputPropsRoot,
            }}
            handlers={{
              search: (queryTerm, queryByTerm) => {
                handlers.submitSearch(queryTerm, queryByTerm);
              },
              reset: () => {
                handlers.resetSearch();
              },
            }}
          />
        )}
        {hasAdvancedSearch && (
          <Box>
            <Button
              refProp={refBtnAdvancedExpanded}
              size="small"
              variant="text"
              icon={SearchIcon}
              onClick={handlers.toggleAdvancedSearch}
              data-testid="advanced-search-button-toggle"
            />
            <Popover
              id="advanced-search-popover"
              anchorEl={refBtnAdvancedExpanded.current}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(searchAdvancedExpanded && refBtnAdvancedExpanded.current)}
              onClose={handlers.toggleAdvancedSearch}
              classes={{ paper: classes.advancedSearchPopover }}
            >
              <Box position="relative">
                <Button
                  icon={CloseIcon}
                  variant="text"
                  onClick={handlers.toggleAdvancedSearch}
                  nestedClasses={{
                    btn: classes.advancedSearchClose,
                  }}
                />

                {searchAdvanced}
              </Box>
            </Popover>
          </Box>
        )}

        {isFetchingFilters ? (
          <Box m={1} ml={1}>
            <Loader visible={isFetchingFilters} inline />
          </Box>
        ) : (
          hasFilters && (
            <Button
              size="small"
              disabled={utils.generic.isInvalidOrEmptyArray(filtersArray)}
              variant="text"
              icon={FilterListIcon}
              onClick={handlers.toggleFilters}
              style={{ marginLeft: hasSearch ? 4 : 'auto' }}
              data-testid="filters-button-toggle"
            />
          )
        )}

        {hasColumns && (
          <Box ml={hasSearch || hasFilters ? 0.5 : 'auto'}>
            <Button
              refProp={refBtnColumns}
              size="small"
              variant="text"
              icon={ViewCompactOutlinedIcon}
              onClick={handlers.toggleColumnsExpanded}
              data-testid="columns-button-toggle"
            />
            <Popover
              id="columns-popover"
              anchorEl={refBtnColumns.current}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(columnsExpanded && refBtnColumns.current)}
              onClose={handlers.toggleColumnsExpanded}
              classes={{ paper: classes.columnsPopover }}
            >
              <Typography variant="body1">{utils.string.t('filters.columns.title')}</Typography>

              <List dense className={classes.columnsList}>
                {columnsArray.map((column) => {
                  const labelId = `columns-checkbox-list-label-${column.id}`;

                  return (
                    <ListItem
                      key={column.id}
                      button
                      onClick={() => {
                        // Checking 'mandatory' property, if it is mandatory, not doing anything on that columns in Managing Columns list.
                        if (!Boolean(column?.mandatory)) handlers.toggleColumns(column);
                      }}
                      classes={{ root: classes.columnsListItem }}
                    >
                      {/* Disabling the checkbox, if the column is mandatory */}
                      <ListItemIcon classes={{ root: classes.columnsListItemIcon }}>
                        <Checkbox
                          checked={Boolean(column.visible)}
                          color="primary"
                          tabIndex={-1}
                          disabled={Boolean(column?.mandatory) ? true : false}
                          disableRipple
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </ListItemIcon>
                      <ListItemText id={labelId} primary={column.label} />
                    </ListItem>
                  );
                })}
              </List>
            </Popover>
          </Box>
        )}
        {excelExport}
      </div>

      {hasFilters && (
        <div className={classes.filtersContainer} data-testid="filters-content">
          <Collapse in={filtersExpanded}>
            <Fade in={filtersExpanded}>
              <Box className={classes.filters}>
                <Box className={classes.filtersContent}>{children}</Box>
                <Box className={classes.filtersButtons}>
                  <Box mb={0.5} textAlign="right">
                    <Button
                      size="xsmall"
                      color="primary"
                      variant="outlined"
                      text={utils.string.t('app.clear')}
                      onClick={handlers.resetFilters}
                    />
                  </Box>
                  <Box mb={1} textAlign="right">
                    <Button
                      size="xsmall"
                      color="primary"
                      text={utils.string.t('app.apply')}
                      type="submit"
                      disabled={filtersSubmitDisabled}
                      onClick={handlers.submitFilters}
                    />
                  </Box>
                </Box>
              </Box>
            </Fade>
          </Collapse>
        </div>
      )}
    </>
  );
}
