import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

//app
import { Breadcrumb, Layout, Tabs, PopoverMenu, SectionHeader } from 'components';
import {
  ClaimsPreviewDashboard,
  ClaimsUploadViewSearchDocs,
  ClaimsProcessingDmsWidget,
  ClaimAction,
  ClaimRefNotes,
  ClaimRefAuditTrail,
} from 'modules';
import * as utils from 'utils';
import { DrawerComponent } from 'components';
import styles from './ClaimDashboard.styles';
import * as constants from 'consts';

//mui
import { Box, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';

ClaimDashboardView.propTypes = {
  tabs: PropTypes.array.isRequired,
  selectedTab: PropTypes.string.isRequired,
  handleSelectTab: PropTypes.func,
  popoverItems: PropTypes.array.isRequired,
  claimObj: PropTypes.object.isRequired,
  claimRefFromLossObj: PropTypes.shape({
    claimID: PropTypes.string,
    claimRef: PropTypes.string,
    lossRef: PropTypes.string,
    sourceId: PropTypes.string,
    policyId: PropTypes.string,
  }),
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    })
  ).isRequired,
  checkRedirectLocation: PropTypes.bool.isRequired,
  isDmsWidgetExpanded: PropTypes.bool.isRequired,
  isInflightClaim: PropTypes.bool,
};
ClaimDashboardView.defaultProps = {
  isInflightClaim: false,
};
export function ClaimDashboardView({
  tabs,
  selectedTab,
  handleSelectTab,
  popoverItems,
  claimObj,
  breadcrumbs,
  checkRedirectLocation,
  claimRefFromLossObj,
  isDmsWidgetExpanded,
  isInflightClaim,
}) {
  const classes = makeStyles(styles, { name: 'ClaimDashboard' })();
  const handlePopoverDisabled = (claimStatus) => {
    return claimStatus === constants.STATUS_CLAIMS_GXBSYNCED || isInflightClaim;
  };
  const refData = { ...claimObj, claimRef: claimObj?.claimReference || claimObj?.claimRef };

  return (
    <>
      <Breadcrumb links={breadcrumbs} />
      <Divider />
      <div
        className={classnames(classes.content, {
          [classes.contentShift]: isDmsWidgetExpanded,
        })}
      >
        <Layout testid="ClaimDashboard">
          <Layout main>
            <SectionHeader title={' '} testid="claim-ref-header">
              <PopoverMenu
                variant="outlined"
                id="claims-functions"
                size="small"
                color="primary"
                text={utils.string.t('claims.claimRef.popOverFunction')}
                isButton
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                items={popoverItems}
                disabled={handlePopoverDisabled(claimObj?.claimStatus)}
              />
            </SectionHeader>

            <Tabs tabs={tabs} value={selectedTab} onChange={(tabName) => handleSelectTab(tabName)} />

            {selectedTab === 'claimRefDetail' && (
              <ClaimsPreviewDashboard claimDataFromRef={!checkRedirectLocation ? claimObj : claimRefFromLossObj} />
            )}

            {selectedTab === 'claimRefDocs' && (
              <Box mt={2}>
                <ClaimsUploadViewSearchDocs
                  refData={refData}
                  refIdName={constants.DMS_CONTEXT_CLAIM_ID}
                  dmsContext={constants.DMS_CONTEXT_CLAIM}
                  documentTypeKey={constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.claim}
                />
              </Box>
            )}
            {selectedTab === 'claimRefActions' && <ClaimAction claim={claimObj} handleSelectTab={handleSelectTab} />}
            {selectedTab === 'claimRefNotes' && <ClaimRefNotes claim={claimObj} />}
            {selectedTab === 'claimRefAuditTrail' && <ClaimRefAuditTrail claim={claimObj} />}
          </Layout>
        </Layout>
      </div>
      <DrawerComponent isDrawerOpen isFromDashboard>
        <ClaimsProcessingDmsWidget />
      </DrawerComponent>
    </>
  );
}
