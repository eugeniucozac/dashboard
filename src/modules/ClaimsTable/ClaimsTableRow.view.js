import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

//app
import styles from './ClaimsTable.styles';
import { TableCell, PopoverMenu } from 'components';
import {
  showModal,
  getLossInformation,
  selectClaimsStatuses,
  hideModal,
  getStatuses,
  getCatCodes,
  selectCatCodes,
  selectClaimStatusObj,
} from 'stores';
import * as utils from 'utils';
import config from 'config';
import { GXB_LOSS_ID_IDENTIFIER } from 'consts';

//mui
import { makeStyles, TableRow, Link, Typography } from '@material-ui/core';

export function ClaimsTableRowView({ data, handleViewClaimClick, columnProps, handleCreateClaim, handleEditClaim }) {
  const classes = makeStyles(styles, { name: 'ClaimsTableRow' })();
  const dispatch = useDispatch();
  const statuses = useSelector(selectClaimsStatuses);
  const catCodes = useSelector(selectCatCodes);
  const claimsStatusObj = useSelector(selectClaimStatusObj);

  const handleEditLossClick = async (data) => {
    await dispatch(getLossInformation(data.lossDetailID, data.sourceID));
    if (utils.generic.isInvalidOrEmptyArray(catCodes)) {
      await dispatch(getCatCodes());
    }
    await dispatch(
      showModal({
        component: 'EDIT_LOSS_INFORMATION',
        props: {
          title: utils.string.t('claims.lossInformation.title'),
          hideCompOnBlur: false,
          fullWidth: true,
          maxWidth: 'xl',
          disableAutoFocus: true,
          componentProps: {
            clickOutSideHandler: () => clickOutSideHandler(),
          },
        },
      })
    );
  };

  const handleUpdateStatusClick = (data) => {
    dispatch(
      showModal({
        component: 'UPDATE_STATUS',
        props: {
          title: utils.string.t('claims.updateStatus.title'),
          fullWidth: true,
          maxWidth: 'sm',
          hideCompOnBlur: false,
          disableAutoFocus: true,
          componentProps: {
            ...data,
            clickOutSideHandler: () => clickOutSideHandler(),
          },
        },
      })
    );
  };

  const clickOutSideHandler = () => {
    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          title: utils.string.t('status.alert'),
          hint: utils.string.t('navigation.title'),
          fullWidth: true,
          maxWidth: 'xs',
          componentProps: {
            cancelLabel: utils.string.t('app.no'),
            confirmLabel: utils.string.t('app.yes'),
            submitHandler: () => {
              dispatch(hideModal());
            },
            cancelHandler: () => { },
          },
        },
      })
    );
  };

  useEffect(() => {
    if (utils.generic.isInvalidOrEmptyArray(statuses)) dispatch(getStatuses());
  }, [statuses]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <TableRow key={data.claimID} data-testid={`search-row-${data.lossRef}`} hover>
      <TableCell {...columnProps('lossRef')} data-testid={`row-col-${data.lossRef}`}>
        {data.lossRef}
      </TableCell>
      <TableCell {...columnProps('pasEventID')} data-testid={`row-col-${data.pasEventID}`}>
        {data.pasEventID}
      </TableCell>
      <TableCell {...columnProps('lossName')} data-testid={`row-col-${data.lossName}`}>
        {data.lossName}
      </TableCell>
      <TableCell {...columnProps('lossFromDate')} data-testid={`row-col-${data.lossFromDate}`}>
        {utils.string.t('format.date', {
          value: { date: data?.lossFromDate, format: config.ui.format.date.text },
        })}
      </TableCell>
      <TableCell {...columnProps('lossToDate')} data-testid={`row-col-${data.lossToDate}`}>
        {utils.string.t('format.date', {
          value: { date: data?.lossToDate, format: config.ui.format.date.text },
        })}
      </TableCell>
      <TableCell {...columnProps('claimReference')} data-testid={`row-col-${data.claimReference}`}>
        <Link color="secondary" onClick={() => handleViewClaimClick(data)}>
          {data.claimReference}
        </Link>
      </TableCell>
      <TableCell {...columnProps('claimLossFromDate')} data-testid={`row-col-${data.lossRef}`}>
        {utils.string.t('format.date', {
          value: { date: data?.claimLossFromDate, format: config.ui.format.date.text },
        })}
      </TableCell>
      <TableCell {...columnProps('claimLossToDate')} data-testid={`row-col-${data.lossRef}`}>
        {utils.string.t('format.date', {
          value: { date: data?.claimLossToDate, format: config.ui.format.date.text },
        })}
      </TableCell>
      <TableCell {...columnProps('claimReceivedDateTime')} data-testid={`row-col-${data.lossRef}`}>
        {data.claimReceivedDate && moment(data?.claimReceivedDate).format(config.ui.format.date.textTime)}
      </TableCell>
      <TableCell {...columnProps('claimStatusName')} data-testid={`row-col-${data.claimStatusName}`}>
        {data.claimStatusID && statuses.find((status) => status.id.toString() === data.claimStatusID.toString())?.name}
      </TableCell>
      <TableCell {...columnProps('catCodeDescription')} data-testid={`row-col-${data.catCodeDescription}`}>
        <Typography title={data.catCodeDescription} className={classes.catCodeDescription}>
          {data.catCodeDescription}
        </Typography>
      </TableCell>
      <TableCell {...columnProps('ucr')} data-testid={`row-col-${data.ucr}`}>
        {data.ucr}
      </TableCell>
      <TableCell {...columnProps('claimantName')} data-testid={`row-col-${data.claimantName}`} title={data.claimantName}>
        {data.claimantName}
      </TableCell>
      <TableCell {...columnProps('beAdjuster')} data-testid={`row-col-${data.beadjusterID}`}>
        <Typography title={data?.beAdjusterID} className={classes.catCodeDescription}>
          {data?.beAdjusterID}
        </Typography>
      </TableCell>
      <TableCell {...columnProps('policyRef')} data-testid={`row-col-${data.policyRef}`}>
        {data.policyRef}
      </TableCell>
      <TableCell {...columnProps('policyType')} data-testid={`row-col-${data.policyType}`}>
        {data.policyType}
      </TableCell>
      <TableCell {...columnProps('insured')} data-testid={`row-col-${data.insured}`} title={data.insured}>
        {data.insured}
      </TableCell>
      <TableCell {...columnProps('client')} data-testid={`row-col-${data.client}`}>
        {data.client}
      </TableCell>
      <TableCell {...columnProps('company')} data-testid={`row-col-${data.company}`}>
        {data.company}
      </TableCell>
      <TableCell {...columnProps('division')} data-testid={`row-col-${data.division}`}>
        {data.division}
      </TableCell>
      <TableCell {...columnProps('team')} data-testid={`row-col-${data.team}`}>
        {data.team}
      </TableCell>
      <TableCell {...columnProps('createdBy')} data-testid={`row-col-${data.createdBy}`}>
        {data.createdBy}
      </TableCell>
      <TableCell {...columnProps('priority')} data-testid={`row-col-${data.priority}`}>
        {data.priority}
      </TableCell>
      {data?.lossRef !== GXB_LOSS_ID_IDENTIFIER && (
        <TableCell menu data-testid={`row-col-ellipsis-menu`}>
          <PopoverMenu
            id="search-menu-list"
            data={{
              placement: data,
              title: utils.placement.getInsureds(data),
            }}
            items={[
              {
                id: 'editLoss',
                label: utils.string.t('claims.editLoss'),
                callback: () => handleEditLossClick(data),
              },
              {
                id: 'createClaims',
                label: utils.string.t('claims.createClaim'),
                callback: () => handleCreateClaim(data),
              },
              ...(data?.claimStatusID?.toString() === claimsStatusObj.DRAFT || data?.claimStatusID?.toString() === claimsStatusObj.Failed
                ? [
                  {
                    id: 'editClaim',
                    label: utils.string.t('claims.editClaim'),
                    callback: () => handleEditClaim(data),
                  },
                ]
                : []),
              ...(data?.claimStatusID?.toString() === claimsStatusObj.DRAFT ||
                data?.claimStatusID?.toString() === claimsStatusObj.Failed ||
                data?.claimStatusID?.toString() === claimsStatusObj.Cancel
                ? [
                  {
                    id: 'updateStatus',
                    label: utils.string.t('claims.updateStatus.title'),
                    callback: () => handleUpdateStatusClick(data),
                  },
                ]
                : []),
            ]}
          />
        </TableCell>
      )}
    </TableRow>
  );
}
