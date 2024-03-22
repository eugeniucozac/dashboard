import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import styles from './ClaimsTabTableRow.styles';
import { FormCheckbox, Link, TableCell, PopoverMenu } from 'components';

// mui
import { makeStyles, Box, TableRow } from '@material-ui/core';

ClaimsTabTableRowView.prototype = {
  claim: PropTypes.object.isRequired,
  isSelected: PropTypes.bool,
  isHighlighted: PropTypes.bool,
  isMultiSelect: PropTypes.bool,
  columnProps: PropTypes.object.isRequired,
  rowActions: PropTypes.array.isRequired,
  handlers: PropTypes.shape({
    selectClaim: PropTypes.func.isRequired,
    clickClaim: PropTypes.func.isRequired,
  }).isRequired,
};

export function ClaimsTabTableRowView({ claim, isSelected, isHighlighted, isMultiSelect, columnProps, rowActions, handlers }) {
  const classes = makeStyles(styles, { name: 'ClaimsTabTableRow' })();

  const classesRow = {
    [classes.row]: true,
    [classes.rowSelected]: isSelected || isHighlighted,
  };

  return (
    <TableRow hover onClick={isMultiSelect ? handlers.selectClaim(claim) : undefined} className={classnames(classesRow)}>
      <TableCell {...columnProps('claimRef')}>
        <Box display="flex" alignItems="center">
          {isMultiSelect && (
            <FormCheckbox
              name={`checkbox-${claim?.claimReference}`}
              type="checkbox"
              value={isSelected}
              nestedClasses={{ root: classes.checkbox }}
            />
          )}
          <Link text={claim?.claimReference?.toString() || ''} color="secondary" onClick={handlers.clickClaim(claim)} />
        </Box>
      </TableCell>
      <TableCell {...columnProps('lossRef')}>{claim?.lossRef}</TableCell>
      <TableCell {...columnProps('insured')}>{claim?.insured}</TableCell>
      <TableCell {...columnProps('policyRef')}>{claim?.policyRef}</TableCell>
      <TableCell {...columnProps('division')}>{claim?.division}</TableCell>
      <TableCell {...columnProps('claimStatus')}>{claim?.status}</TableCell>
      <TableCell {...columnProps('stage')}>{claim?.claimStage}</TableCell>
      <TableCell {...columnProps('assignedTo')}>{claim?.assignedTo}</TableCell>
      <TableCell {...columnProps('team')}>{claim?.team}</TableCell>
      <TableCell {...columnProps('priority')}>{claim?.priority}</TableCell>
      <TableCell {...columnProps('actions')}>
        <PopoverMenu id="search-menu-list" data={claim} items={rowActions} handlers={{ clickEllipsis: handlers.clickEllipsis }} />
      </TableCell>
    </TableRow>
  );
}
