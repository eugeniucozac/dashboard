import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useHistory } from 'react-router';

//app
import { Breadcrumb, Layout, Tabs, PopoverMenu, SectionHeader } from 'components';
import config from 'config';
import { LossDetail, LossAction, LossNotes, ClaimsUploadViewSearchDocs, ClaimsProcessingDmsWidget } from 'modules';
import * as utils from 'utils';
import { DrawerComponent } from 'components';
import styles from './LossDashboard.styles';
import { selectDmsWidgetExpanded } from 'stores';
import * as constants from 'consts';
import { selectClaimAssociateWithLoss, setClaimsStepperControl, showModal, hideModal } from 'stores';

//mui
import { Box, Divider, Typography, makeStyles } from '@material-ui/core';

LossDashboardView.propTypes = {
  tabs: PropTypes.array.isRequired,
  selectedTab: PropTypes.string.isRequired,
  lossSelected: PropTypes.object.isRequired,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    })
  ).isRequired,
  handleSelectTab: PropTypes.func,
  handleCreateRFIModal: PropTypes.func,
};

export function LossDashboardView({ tabs, selectedTab, lossSelected, breadcrumbs, handleSelectTab }) {
  const classes = makeStyles(styles, { name: 'LossDashboard' })();
  const isDmsWidgetExpanded = useSelector(selectDmsWidgetExpanded);
  const dispatch = useDispatch();
  const history = useHistory();
  const claimsAssociateWithLoss = useSelector(selectClaimAssociateWithLoss);
  const { pathname } = history.location;

  const editLossHandler = (lossSelected) => {
    const lossRef = lossSelected?.lossRef;
    const checkClaimStatus = utils.generic.isValidArray(claimsAssociateWithLoss, true)
      ? Boolean(claimsAssociateWithLoss?.find((claim) => claim?.claimStatus !== constants.STATUS_CLAIMS_DRAFT?.toUpperCase()))
      : false;
    dispatch(setClaimsStepperControl(0));
    history.push({
      pathname: `${config.routes.claimsFNOL.newLoss}`,
      state: {
        isNewLoss: true,
        redirectUrl: `${config.routes.claimsFNOL.loss}/${lossRef}`,
        loss: { isNextDiabled: true, isClaimSubmitted: checkClaimStatus },
      },
    });
  };

  const addClaimHandler = (lossSelected) => {
    const lossRef = lossSelected?.lossRef;
    async function addClaim() {
      await dispatch(setClaimsStepperControl(1));
      const checkClaimStatus = utils.generic.isValidArray(claimsAssociateWithLoss, true)
        ? Boolean(claimsAssociateWithLoss?.find((claim) => claim?.claimStatus !== constants.STATUS_CLAIMS_DRAFT?.toUpperCase()))
        : false;
      history.push({
        pathname: `${config.routes.claimsFNOL.newLoss}`,
        state: {
          redirectUrl: `${config.routes.claimsFNOL.loss}/${lossRef}`,
          loss: { isNextDiabled: false, isClaimSubmitted: checkClaimStatus },
        },
      });
    }
    addClaim();
  };

  const handleCreateRFIModal = (claim) => {
    const breadcrumbs = [
      {
        name: 'lossRef',
        label: utils.string.t('claims.loss.text', { lossRef: claim?.lossRef }),
        link: pathname,
        active: true,
      },
    ];

    const TitleWBreadCrumb = () => {
      return (
        <>
          <Breadcrumb links={breadcrumbs} />
          <Typography variant="h2" style={{ paddingLeft: '1.2rem' }}>
            {utils.string.t('claims.processing.taskFunction.createRFI')}
          </Typography>
        </>
      )
    }
    dispatch(
      showModal({
        component: 'CLAIMS_CREATE_RFI_STEPPER',
        props: {
          titleChildren: <TitleWBreadCrumb />,
          hideCompOnBlur: false,
          fullWidth: true,
          maxWidth: 'lg',
          disableAutoFocus: true,
          componentProps: {
            claim,
            type: constants.RFI_ON_LOSS,
            cancelHandler: () => {
              dispatch(hideModal());
            },
          },
        },
      })
    );
  };


  const rowActions = [
    {
      id: 'editLoss',
      label: utils.string.t('claims.loss.popOverFunctionMenusList.editLoss'),
      callback: () => editLossHandler(lossSelected),
    },
    {
      id: 'addClaim',
      label: utils.string.t('claims.loss.popOverFunctionMenusList.addClaim'),
      callback: () => addClaimHandler(lossSelected),
    },
    {
      id: 'createRFI',
      label: utils.string.t('claims.loss.popOverFunctionMenusList.createRFI'),
      callback: () => handleCreateRFIModal(lossSelected),
    },
  ];

  return (
    <>
      <Breadcrumb links={breadcrumbs} />
      <Divider />
      <div
        className={classnames(classes.content, {
          [classes.contentShift]: isDmsWidgetExpanded,
        })}
      >
        <Layout testid="LossDashboard">
          <Layout main>
            <SectionHeader title={' '} testid="claim-ref-header">
              <PopoverMenu
                variant="outlined"
                id="loss-functions"
                size="small"
                color="primary"
                text={utils.string.t('claims.loss.popOverFunction')}
                isButton
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                items={rowActions}
              />
            </SectionHeader>
            <Tabs tabs={tabs} value={selectedTab} onChange={(tabName) => handleSelectTab(tabName)} />
            {selectedTab === 'details' && <LossDetail lossObj={lossSelected} />}
            {selectedTab === 'actions' && <LossAction lossData={lossSelected} />}
            {selectedTab === 'documents' && (
              <Box mt={2}>
                <ClaimsUploadViewSearchDocs
                  refData={lossSelected}
                  refIdName={constants.DMS_CONTEXT_LOSS_ID}
                  dmsContext={constants.DMS_CONTEXT_LOSS}
                  documentTypeKey={constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.claim}
                />
              </Box>
            )}
            {selectedTab === 'notes' && <LossNotes lossObj={lossSelected} />}
          </Layout>
        </Layout>
      </div>
      <DrawerComponent isDrawerOpen isFromDashboard>
        <ClaimsProcessingDmsWidget isLossDashboard />
      </DrawerComponent>
    </>
  );
}
