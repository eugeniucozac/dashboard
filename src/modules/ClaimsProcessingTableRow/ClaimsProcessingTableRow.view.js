import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import styles from './ClaimsProcessingTableRow.styles';
import { FormCheckbox, Link, TableCell, PopoverMenu } from 'components';
import * as utils from 'utils';
import config from 'config';

// mui
import { makeStyles, Box, TableRow } from '@material-ui/core';

ClaimsProcessingTableRowView.prototype = {
  claim: PropTypes.object.isRequired,
  isSelected: PropTypes.bool,
  columnProps: PropTypes.object.isRequired,
  rowActions: PropTypes.array.isRequired,
  handlers: PropTypes.shape({
    selectClaim: PropTypes.func.isRequired,
    clickClaim: PropTypes.func.isRequired,
  }).isRequired,
};

export function ClaimsProcessingTableRowView({ claim, isSelected, columnProps, rowActions, handlers }) {
  const classes = makeStyles(styles, { name: 'ClaimsProcessingTableRow' })();

  const classesRow = {
    [classes.row]: true,
    [classes.rowSelected]: isSelected,
  };

  return (
    <TableRow hover onClick={handlers.selectClaim(claim)} className={classnames(classesRow)}>
      <TableCell {...columnProps('claimRef')}>
        <Box display="flex" alignItems="center">
          <FormCheckbox name={`checkbox-${claim.claimRef}`} type="checkbox" value={isSelected} nestedClasses={{ root: classes.checkbox }} />
          <Link text={claim.claimRef?.toString() || ''} color="secondary" onClick={handlers.clickClaim(claim)} />
        </Box>
      </TableCell>
      <TableCell {...columnProps('lossRef')}>{claim.lossRef}</TableCell>
      <TableCell {...columnProps('catCodesID')} title={claim?.catCode}>
        {claim?.catCode}
      </TableCell>
      <TableCell {...columnProps('claimReceivedDateTime')}>
        {utils.string.t('format.date', {
          value: { date: claim?.claimReceivedDate, format: config.ui.format.date.textTime },
        })}
      </TableCell>
      <TableCell {...columnProps('createdDate')}>
        {utils.string.t('format.date', { value: { date: claim?.createdDate, format: config.ui.format.date.textTime } })}
      </TableCell>
      <TableCell {...columnProps('processState')}>{claim.processState}</TableCell>
      <TableCell {...columnProps('closedDate')}>
        {utils.string.t('format.date', { value: { date: claim?.closedDate, format: config.ui.format.date.text } })}
      </TableCell>
      <TableCell {...columnProps('complexity')}>{claim?.complexity}</TableCell>
      <TableCell {...columnProps('team')}>{claim.team}</TableCell>
      <TableCell {...columnProps('assignedTo')}>{claim.assignedTo}</TableCell>
      <TableCell {...columnProps('priority')}>{claim?.priority}</TableCell>
      <TableCell {...columnProps('ucr')}>{claim.ucr}</TableCell>
      <TableCell {...columnProps('policyRef')}>{claim.policyRef}</TableCell>
      <TableCell {...columnProps('policyType')}>{claim?.policyType}</TableCell>
      <TableCell {...columnProps('claimantName')}>{claim?.claimantName}</TableCell>
      <TableCell {...columnProps('assured')} title={claim.assured}>
        {claim.assured}
      </TableCell>
      <TableCell {...columnProps('reinsured')}>{claim?.reinsured}</TableCell>
      <TableCell {...columnProps('client')}>{claim?.client}</TableCell>

      <TableCell {...columnProps('interest')}>{claim?.policyInterest}</TableCell>
      <TableCell {...columnProps('createdBy')}>{claim?.createdBy}</TableCell>
      <TableCell {...columnProps('company')}>{claim?.company}</TableCell>
      <TableCell {...columnProps('division')}>{claim.division}</TableCell>
      <TableCell {...columnProps('coverholder')}>{claim?.coverholder}</TableCell>
      <TableCell {...columnProps('lossFromDate')}>
        {utils.string.t('format.date', { value: { date: claim.lossFromDate, format: config.ui.format.date.text } })}
      </TableCell>
      <TableCell {...columnProps('lossToDate')}>
        {utils.string.t('format.date', { value: { date: claim?.lossToDate, format: config.ui.format.date.text } })}
      </TableCell>
      <TableCell {...columnProps('lossDateQualifier')}>{claim?.lossQualifierName}</TableCell>
      <TableCell {...columnProps('lossDetails')}>{claim?.lossDetails}</TableCell>
      <TableCell {...columnProps('pasClaimRef')}>{claim?.pasClaimRef}</TableCell>
      <TableCell {...columnProps('pasStatus')}>{claim?.pasStatus}</TableCell>
      <TableCell {...columnProps('actions')}>
        <PopoverMenu id="search-menu-list" items={rowActions} />
      </TableCell>
    </TableRow>
  );
}
