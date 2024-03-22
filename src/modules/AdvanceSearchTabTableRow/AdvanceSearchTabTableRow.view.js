import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';

//app
import { TableCell, Link, Tooltip, Status, PopoverMenu } from 'components';
import {
  selectClaimsStatuses,
  selectLossSelected,
  selectLossItem,
  setClaimsTabSelectedItem,
  getLossInformation,
  getClaimsAssociateWithLoss,
  setClaimsStepperControl,
  getClaimsPreviewInformation,
} from 'stores';
import * as utils from 'utils';
import config from 'config';
import { GXB_LOSS_ID_IDENTIFIER, STATUS_CLAIMS_DRAFT } from 'consts';

// mui
import { Box, TableRow, Typography } from '@material-ui/core';

AdvanceSearchTabTableRowView.propTypes = {
  data: PropTypes.object.isRequired,
  columnProps: PropTypes.func,
};
export default function AdvanceSearchTabTableRowView(props) {
  const { data, columnProps } = props;
  const dispatch = useDispatch();
  const history = useHistory();

  const statuses = useSelector(selectClaimsStatuses);
  const selectedRow = useSelector(selectLossSelected);
  const cellLength = 50;

  const lossRefHandler = (data) => {
    dispatch(
      getLossInformation({
        lossDetailsId: data?.lossDetailID,
        sourceIdParams: data?.sourceID,
        divisionIdParam: data?.divisionID,
        claimRefParam: data?.claimRef,
        viewLoader: false,
      })
    ).then(async (res) => {
      await dispatch(
        selectLossItem({
          firstContactDate: res?.firstContactDate,
          lossName: res?.lossName,
          lossDescription: res?.lossDescription,
          lossRef: res?.lossRef,
          catCodeDescription: data?.catCodeDescription,
          lossStatus: res?.status,
          lossDetailId: res?.lossDetailID,
          isInflighLoss: res?.isInflighLoss,
          catCodeId: res?.catCodesID,
          createdDate: res?.createdDate,
        })
      );
      await history.push(`${config.routes.claimsFNOL.loss}/${data.lossRef}`);
    });
  };

  const claimRefHandler = (data) => {
    dispatch(
      getClaimsPreviewInformation({
        claimId: data?.claimID?.toString(),
        claimRefParams: data?.claimRef,
        sourceIdParams: data?.sourceID,
        divisionIDParams: data?.divisionID,
        viewLoader: true,
      })
    ).then(async (res) => {
      await dispatch(
        setClaimsTabSelectedItem(
          {
            claimId: res?.claimID,
            claimReference: res?.claimReference,
            sourceId: res?.sourceID,
            divisionId: res?.divisionID,
          },
          true
        )
      );
      await history.push(`${config.routes.claimsFNOL.claim}/${data.claimRef}`);
    });
  };

  const handleEditLossAndAddClaim = (data, step, isNextDiabled) => {
    async function routeToEdit(res) {
      let checkClaimStatus = utils.generic.isValidArray(res, true)
        ? Boolean(res?.find((claim) => claim?.claimStatus !== STATUS_CLAIMS_DRAFT?.toUpperCase()))
        : false;
      await dispatch(
        getLossInformation({
          lossDetailsId: data?.lossDetailID,
          sourceIdParams: data?.sourceID,
          divisionIdParam: data?.divisionID,
          claimRefParam: data?.claimRef,
          viewLoader: true,
        })
      );
      await dispatch(setClaimsStepperControl(step));
      await history.push({
        pathname: `${config.routes.claimsFNOL.newLoss}`,
        state: {
          redirectUrl: `${config.routes.claimsFNOL.root}/tab/advanceSearch`,
          loss: { isNextDiabled: isNextDiabled, isClaimSubmitted: checkClaimStatus },
        },
      });
    }
    dispatch(getClaimsAssociateWithLoss(data?.lossDetailID, true)).then(async (res) => {
      routeToEdit(res);
    });
  };

  const handleEditClaim = () => {
    async function editClaim(res) {
      let selectedClaimObj =
        utils.generic.isValidArray(res, true) &&
        res?.find((claim) => claim?.claimStatus === STATUS_CLAIMS_DRAFT?.toUpperCase() && claim?.claimReference === data?.claimRef);

      await dispatch(setClaimsStepperControl(1));
      await history.push({
        pathname: `${config.routes.claimsFNOL.newLoss}`,
        state: {
          linkPolicy: {
            isSearchTerm: '',
            claimObj: selectedClaimObj,
          },
          redirectUrl: `${config.routes.claimsFNOL.root}/tab/advanceSearch`,
        },
      });
    }
    dispatch(getClaimsAssociateWithLoss(data?.lossDetailID, true)).then((res) => {
      editClaim(res);
    });
  };

  return (
    <TableRow
      key={data?.claimID}
      data-testid={`search-row-${data?.lossRef}`}
      hover
      selected={selectedRow?.lossRef ? selectedRow?.lossRef === data?.lossRef : false}
    >
      <TableCell {...columnProps('lossRef')} data-testid={`row-col-${data?.lossRef}`}>
        <Link text={data?.lossRef} color="secondary" onClick={() => lossRefHandler(data)} />
      </TableCell>
      <TableCell {...columnProps('pasEventID')} data-testid={`row-col-${data?.pasEventID}`}>
        {data?.pasEventID}
      </TableCell>
      <TableCell {...columnProps('lossName')} data-testid={`row-col-${data?.lossName}`}>
        {data?.lossName?.length > cellLength ? (
          <Tooltip inlineFlex title={data?.lossName}>
            {data?.lossName?.slice(0, cellLength)}...
          </Tooltip>
        ) : (
          data?.lossName
        )}
        {data?.isInflighLoss === 1 && (
          <Box ml={1} display="inline">
            <Status size="xs" text={utils.string.t('app.migrated')} status="light" />
          </Box>
        )}
      </TableCell>
      <TableCell {...columnProps('lossDetail')} data-testid={`row-col-${data?.lossDetail}`}>
        {data?.lossDetail?.length > cellLength ? (
          <Tooltip block title={data?.lossDetail}>
            {data?.lossDetail?.slice(0, cellLength)}...
          </Tooltip>
        ) : (
          data?.lossDetail
        )}
      </TableCell>
      <TableCell {...columnProps('lossQualifier')} data-testid={`row-col-${data?.lossQualifier}`}>
        {data?.lossQualifier}
      </TableCell>
      <TableCell {...columnProps('lossFromDate')} data-testid={`row-col-${data?.lossFromDate}`}>
        {utils.string.t('format.date', {
          value: { date: data?.lossFromDate, format: config.ui.format.date.text },
        })}
      </TableCell>
      <TableCell {...columnProps('lossToDate')} data-testid={`row-col-${data?.lossToDate}`}>
        {utils.string.t('format.date', {
          value: { date: data?.lossToDate, format: config.ui.format.date.text },
        })}
      </TableCell>
      <TableCell {...columnProps('claimRef')} data-testid={`row-col-${data?.claimRef}`}>
        <Link text={data?.claimRef} color="secondary" onClick={() => claimRefHandler(data)} />
      </TableCell>
      <TableCell {...columnProps('claimLossFromDate')} data-testid={`row-col-${data?.claimLossFromDate}`}>
        {utils.string.t('format.date', {
          value: { date: data?.claimLossFromDate, format: config.ui.format.date.text },
        })}
      </TableCell>
      <TableCell {...columnProps('claimLossToDate')} data-testid={`row-col-${data?.claimLossToDate}`}>
        {utils.string.t('format.date', {
          value: { date: data?.claimLossToDate, format: config.ui.format.date.text },
        })}
      </TableCell>
      <TableCell {...columnProps('claimReceivedDate')} data-testid={`row-col-${data?.claimReceivedDate}`}>
        {data?.claimReceivedDate && moment(data?.claimReceivedDate).format(config.ui.format.date.textTime)}
      </TableCell>
      <TableCell {...columnProps('claimStatusName')} data-testid={`row-col-${data?.claimStatusName}`}>
        {data?.claimStatusID && statuses.find((status) => status.id.toString() === data?.claimStatusID.toString())?.name}
      </TableCell>
      <TableCell {...columnProps('catCodeDescription')} data-testid={`row-col-${data?.catCodeDescription}`}>
        {data?.catCodeDescription?.length > cellLength ? (
          <Tooltip block title={data?.catCodeDescription}>
            {data?.catCodeDescription?.slice(0, cellLength)}...
          </Tooltip>
        ) : (
          data?.catCodeDescription
        )}
      </TableCell>
      <TableCell {...columnProps('ucr')} data-testid={`row-col-${data?.ucr}`}>
        {data?.ucr}
      </TableCell>
      <TableCell {...columnProps('claimantName')} data-testid={`row-col-${data?.claimantName}`} title={data?.claimantName}>
        {data?.claimantName}
      </TableCell>
      <TableCell {...columnProps('beAdjuster')} data-testid={`row-col-${data?.beAdjuster}`}>
        <Typography title={data?.beAdjuster}>{data?.beAdjuster}</Typography>
      </TableCell>
      <TableCell {...columnProps('policyRef')} data-testid={`row-col-${data?.policyRef}`}>
        {data?.policyRef}
      </TableCell>
      <TableCell {...columnProps('umr')} data-testid={`row-col-${data?.umr}`}>
        {data?.umr}
      </TableCell>
      <TableCell {...columnProps('policyType')} data-testid={`row-col-${data?.policyType}`}>
        {data?.policyType}
      </TableCell>
      <TableCell {...columnProps('insured')} data-testid={`row-col-${data?.insured}`} title={data?.insured}>
        {data?.insured}
      </TableCell>
      <TableCell {...columnProps('reInsured')} data-testid={`row-col-${data?.reInsured}`} title={data?.reInsured}>
        {data?.reInsured}
      </TableCell>
      <TableCell {...columnProps('client')} data-testid={`row-col-${data?.client}`}>
        {data?.client}
      </TableCell>
      <TableCell {...columnProps('coverHolder')} data-testid={`row-col-${data?.coverHolder}`}>
        {data?.coverHolder}
      </TableCell>
      <TableCell {...columnProps('company')} data-testid={`row-col-${data?.company}`}>
        {data?.company}
      </TableCell>
      <TableCell {...columnProps('division')} data-testid={`row-col-${data?.division}`}>
        {data?.division}
      </TableCell>
      <TableCell {...columnProps('team')} data-testid={`row-col-${data?.team}`}>
        {data?.team}
      </TableCell>
      <TableCell {...columnProps('createdBy')} data-testid={`row-col-${data?.createdBy}`}>
        {data?.createdBy}
      </TableCell>
      <TableCell {...columnProps('priority')} data-testid={`row-col-${data?.priority}`}>
        {data?.priority}
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
                callback: () => {
                  handleEditLossAndAddClaim(data, 0, true);
                },
              },
              {
                id: 'addClaim',
                label: utils.string.t('claims.addClaim'),
                callback: () => {
                  handleEditLossAndAddClaim(data, 1, false);
                },
              },
              {
                id: 'editClaim',
                label: utils.string.t('claims.editClaim'),
                disabled:
                  statuses.find((status) => status.id.toString() === data?.claimStatusID.toString())?.name !==
                  STATUS_CLAIMS_DRAFT?.toUpperCase(),
                callback: () => {
                  handleEditClaim();
                },
              },
            ]}
          />
        </TableCell>
      )}
    </TableRow>
  );
}
