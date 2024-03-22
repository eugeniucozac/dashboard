import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

// app
import styles from './ClaimsTabTable.styles';
import { ClaimsTabTableRow } from './ClaimsTabTableRow';
import { Button, Empty, FormLabel, FormSwitch, Overflow, Pagination, TableCell, TableHead, Tooltip, Skeleton } from 'components';
import { ReactComponent as IconSearchFile } from '../../assets/svg/line-icon-search-file.svg';
import * as constants from 'consts';
import * as utils from 'utils';

// mui
import { makeStyles, Table, TableBody, Box, TableRow } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

ClaimsTabTableView.prototype = {
  claims: PropTypes.array.isRequired,
  selectedIds: PropTypes.array.isRequired,
  highlightedIds: PropTypes.array.isRequired,
  cols: PropTypes.array.isRequired,
  columnProps: PropTypes.func.isRequired,
  sort: PropTypes.object.isRequired,
  pagination: PropTypes.shape({
    obj: PropTypes.object.isRequired,
    handlers: PropTypes.shape({
      handleChangePage: PropTypes.func.isRequired,
      handleChangeRowsPerPage: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  tabData: PropTypes.object.isRequired,
  multiSelect: PropTypes.bool.isRequired,
  handlers: PropTypes.shape({
    clickClaim: PropTypes.func.isRequired,
    editClaims: PropTypes.func.isRequired,
    selectClaim: PropTypes.func.isRequired,
    sort: PropTypes.func.isRequired,
    toggleMultiSelect: PropTypes.func.isRequired,
  }).isRequired,
};

export function ClaimsTabTableView({
  claims,
  selectedIds,
  highlightedIds,
  cols,
  columnProps,
  sort,
  pagination,
  tabData,
  multiSelect,
  viewFields,
  control,
  handlers,
}) {
  const classes = makeStyles(styles, { name: 'ClaimsTabTable' })();

  const hasNotSearchClaims = !claims;
  const hasClaims = utils.generic.isValidArray(claims, true);
  const isClaimsLoading = tabData?.tableDetails?.isloadingTable;

  const isAnySelectedClaimsDraft =
    hasClaims &&
    claims
      .filter((c) => selectedIds.includes(c.processID))
      .some((c) => utils.string.isEqual(c.status, constants.STATUS_CLAIMS_DRAFT, { caseSensitive: false }));

  return (
    <Box data-testid="claims-tab-table">
      <Overflow>
        <Table size="small">
          <TableHead columns={cols} sorting={sort} />
          <TableBody data-testid="claims-list-body">
            {isClaimsLoading && (
              <TableRow>
                <TableCell colSpan={cols.length}>
                  <Skeleton height={40} animation="wave" displayNumber={10} />
                </TableCell>
              </TableRow>
            )}
            {hasClaims &&
              !isClaimsLoading &&
              claims.map((claim) => {
                return (
                  <ClaimsTabTableRow
                    key={claim?.processID}
                    claim={claim}
                    isSelected={Boolean(selectedIds.includes(claim.processID))}
                    isHighlighted={Boolean(highlightedIds.includes(claim.processID))}
                    isMultiSelect={multiSelect}
                    columnProps={columnProps}
                    handlers={{
                      clickClaim: handlers.clickClaim,
                      clickEllipsis: handlers.clickEllipsis,
                      selectClaim: handlers.selectClaim,
                    }}
                  />
                );
              })}
          </TableBody>
        </Table>
      </Overflow>
      {hasNotSearchClaims ? (
        <Empty title={utils.string.t('claims.searchLossAndClaims')} icon={<IconSearchFile />} padding />
      ) : hasClaims ? (
        <Box mt={1} display="flex" alignItems="flex-start">
          <Box display="flex" alignItems="center" flexGrow={1} style={{ minHeight: 52 }}>
            <Box m={1}>
              <FormLabel label={utils.string.t('claims.claimsTab.multiSelect')} align="left" />
            </Box>
            <FormSwitch
              {...utils.form.getFieldProps(viewFields, 'multiSelect', control)}
              muiComponentProps={{ onChange: handlers.toggleMultiSelect, size: 'small' }}
              nestedClasses={{ root: classes.switch }}
            />
            {multiSelect && utils.generic.isValidArray(selectedIds, true) && (
              <Box m={0.5}>
                <Tooltip title={isAnySelectedClaimsDraft ? utils.string.t('claims.claimsTab.multiSelectTooltipDraft') : ''} placement="top">
                  <Button
                    icon={EditIcon}
                    color="primary"
                    variant="outlined"
                    size="xsmall"
                    text={utils.string.t('claims.processing.summary.buttons.changeComplexityPriorityAssignment')}
                    disabled={isAnySelectedClaimsDraft}
                    onClick={() => handlers.editClaims(claims.filter((c) => selectedIds.includes(c.processID)))}
                  />
                </Tooltip>
              </Box>
            )}
          </Box>
          <Box flexShrink={0}>
            <Pagination
              page={get(pagination, 'obj.page')}
              count={get(pagination, 'obj.rowsTotal')}
              rowsPerPage={get(pagination, 'obj.rowsPerPage')}
              onChangePage={get(pagination, 'handlers.handleChangePage')}
              onChangeRowsPerPage={get(pagination, 'handlers.handleChangeRowsPerPage')}
            />
          </Box>
        </Box>
      ) : (
        !isClaimsLoading && <Empty title={utils.string.t('claims.noMatchFound')} icon={<IconSearchFile />} padding />
      )}
    </Box>
  );
}
