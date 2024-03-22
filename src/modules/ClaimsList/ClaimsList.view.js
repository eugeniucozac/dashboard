import React from 'react';
import PropTypes from 'prop-types';

//app
import * as utils from 'utils';
import { ClaimsTable } from 'modules';
import { TableFilters, TableToolbar, Button, FormGrid, FormSelect, FormText, FormContainer } from 'components';
import styles from './ClaimsList.styles';
import { useMedia } from 'hooks';
import { useForm } from 'react-hook-form';

//mui
import { makeStyles, Box, Popover, InputAdornment } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

ClaimsListView.propTypes = {
  claims: PropTypes.object.isRequired,
  sort: PropTypes.object.isRequired,
  columnsArray: PropTypes.array.isRequired,
  columnProps: PropTypes.func.isRequired,
  isTableHidden: PropTypes.bool.isRequired,
  handleSearch: PropTypes.func.isRequired,
  handleSort: PropTypes.func.isRequired,
  handleChangePage: PropTypes.func.isRequired,
  handleChangeRowsPerPage: PropTypes.func.isRequired,
  handleSearchFilter: PropTypes.func.isRequired,
  handleCreateClaim: PropTypes.func.isRequired,
  tableFilterFields: PropTypes.array.isRequired,
  onResetFilter: PropTypes.func.isRequired,
  toggleColumn: PropTypes.func.isRequired,
};

export function ClaimsListView({
  claims,
  sort,
  columnsArray,
  columnProps,
  isTableHidden,
  handleSearch,
  handleSort,
  handleChangePage,
  handleChangeRowsPerPage,
  handleSearchFilter,
  handleCreateClaim,
  tableFilterFields,
  onResetFilter,
  toggleColumn,
  searchField,
  anchorEl,
  setAnchorEl,
}) {
  const media = useMedia();
  const classes = makeStyles(styles, { name: 'ClaimsList' })({ isMobile: media.mobile });
  const defaultValues = utils.form.getInitialValues(searchField);
  const { control, formState, handleSubmit, watch } = useForm({ defaultValues });
  const searchValue = watch('search');
  const popover = anchorEl ? 'search-loss-popover' : undefined;

  return (
    <Box mt={3} data-testid="claim-module">
      <Box mt={3}>
        <Box className={classes.searchBox}>
          <Button
            icon={SearchIcon}
            iconPosition="right"
            variant="contained"
            size="xsmall"
            light
            onClick={(event) => setAnchorEl(event.currentTarget)}
            aria-describedby={popover}
          />
          <Popover
            id={popover}
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            classes={{ paper: classes.searchPopoverFrame }}
            anchorOrigin={{
              vertical: 'center',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'center',
              horizontal: 'right',
            }}
          >
            <FormContainer onSubmit={handleSubmit}>
              <FormGrid container nestedClasses={{ root: classes.searchContainer }}>
                <Box pr={1}>
                  <FormSelect {...utils.form.getFieldProps(searchField, 'searchBy', control)} />
                </Box>
                <Box pr={1}>
                  <FormText
                    {...utils.form.getFieldProps(searchField, 'search', control)}
                    placeholder={utils.string.t('app.search')}
                    muiComponentProps={{
                      InputProps: {
                        maxLength: 50,
                        startAdornment: (
                          <InputAdornment position="start" classes={{ root: classes.adornmentStart }}>
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Box>
                <Box alignItems="center" display="flex">
                  <Button
                    text={utils.string.t('app.go')}
                    type="submit"
                    color="primary"
                    size="small"
                    disabled={formState.isSubmitting || searchValue.length < 3}
                    data-testid={`popover-submit-button`}
                    onClick={handleSubmit(handleSearch)}
                  />
                </Box>
              </FormGrid>
            </FormContainer>
          </Popover>
        </Box>
        <TableToolbar nestedClasses={{ root: classes.tableToolbar }}>
          <TableFilters
            search={false}
            filtersArray={tableFilterFields}
            columns
            columnsArray={columnsArray}
            handlers={{
              onSearch: () => {},
              onResetFilter: onResetFilter,
              onFilter: handleSearchFilter,
              onToggleColumn: toggleColumn,
            }}
          />
        </TableToolbar>
      </Box>
      {!isTableHidden && (
        <ClaimsTable
          claims={claims}
          cols={columnsArray}
          columnProps={columnProps}
          sort={sort}
          handleSort={handleSort}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleCreateClaim={handleCreateClaim}
        />
      )}
    </Box>
  );
}
