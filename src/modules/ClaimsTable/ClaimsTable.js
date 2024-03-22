import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

//app
import { ClaimsTableView } from './ClaimsTable.view';
import { useSort } from 'hooks';
import * as utils from 'utils';
import { showModal, setClaimData, hideModal, setClaimsStepperControl } from 'stores';
import config from 'config';

ClaimsTable.prototypes = {
  claims: PropTypes.object.isRequired,
  cols: PropTypes.array.isRequired,
  columnProps: PropTypes.object.isRequired,
  sort: PropTypes.object.isRequired,
  handleSort: PropTypes.func.isRequired,
  handleChangePage: PropTypes.func.isRequired,
  handleChangeRowsPerPage: PropTypes.func.isRequired,
  handleCreateClaimFromLoss: PropTypes.func.isRequired,
};

export default function ClaimsTable({
  claims = { items: [] },
  cols: colsArr,
  columnProps,
  sort: sortObj,
  handleSort,
  handleChangePage,
  handleChangeRowsPerPage,
  handleCreateClaim,
}) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { cols, sort } = useSort(colsArr, sortObj, handleSort);

  const handleViewClaimClick = (claimObj) => {
    dispatch(
      showModal({
        component: 'VIEW_CLAIM_INFORMATION',
        props: {
          title: `${utils.string.t('claims.modals.viewClaimDetails.title')} - ${claimObj?.claimReference}`,
          fullWidth: true,
          hideCompOnBlur: false,
          maxWidth: 'xl',
          disableAutoFocus: true,
          componentProps: { claimData: claimObj, clickOutSideHandler: () => clickOutSideHandler() },
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
          },
        },
      })
    );
  };

  const handleEditClaim = (data) => {
    async function fetchData() {
      dispatch(
        setClaimData({
          lossId: data.lossDetailID,
          claimId: data.claimID,
          policyRef: data.policyRef,
          policyNumber: data.policyRef,
          xbInstanceID: data.xbInstanceID,
          xbPolicyID: data.xbPolicyID,
          divisionID: data.divisionID,
          sourceID: data.sourceID,
          claimReference: data.claimReference,
        })
      );
      await dispatch(setClaimsStepperControl(2));
      await history.push(config.routes.claimsFNOL.newLoss);
    }
    fetchData();
  };

  return (
    <ClaimsTableView
      rows={claims?.items || []}
      sort={sort}
      pagination={{
        page: claims.page,
        rowsTotal: claims.itemsTotal,
        rowsPerPage: claims.pageSize,
      }}
      cols={cols}
      columnProps={columnProps}
      handleSort={handleSort}
      handleChangePage={handleChangePage}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      handleViewClaimClick={handleViewClaimClick}
      handleCreateClaim={handleCreateClaim}
      handleEditClaim={handleEditClaim}
    />
  );
}
