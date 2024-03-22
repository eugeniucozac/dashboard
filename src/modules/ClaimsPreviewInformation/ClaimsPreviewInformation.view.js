import React from 'react';
import PropTypes from 'prop-types';
//app
import {
  ClaimsEnterLossCardInformation,
  ClaimsInformationPreview,
  ClaimsEnterPolicyCardInformation,
  ClaimsUploadViewSearchDocs,
} from 'modules';
import ClaimsFixedBottomBar from '../ClaimsFixedBottomBar/ClaimsFixedBottomBar';
import { Layout } from 'components';
import styles from './ClaimsPreviewInformation.styles';
import * as constants from 'consts';

//mui
import { makeStyles, Divider, Grid, Box } from '@material-ui/core';

ClaimsPreviewInformationView.propTypes = {
  isAllStepsCompleted: PropTypes.bool.isRequired,
  activeStep: PropTypes.number.isRequired,
  lastStep: PropTypes.bool.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleFinish: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
  handleClaimSubmit: PropTypes.func.isRequired,
  setCurrentContextActive: PropTypes.func,
  currentContextActive: PropTypes.bool,
};

export function ClaimsPreviewInformationView(props) {
  const {
    claimInformation,
    lossInformation,
    catCodes,
    lossQualifiers,
    policyInformation,
    columns,
    claimPreviewInfo,
    setCurrentContextActive,
    currentContextActive,
  } = props;
  const classes = makeStyles(styles, { name: 'ClaimsPreviewInformation' })();

  return (
    <>
      <div className={classes.wrapper}>
        <Layout main padding>
          <ClaimsEnterLossCardInformation
            lossInformation={lossInformation}
            catCodes={catCodes}
            lossQualifiers={lossQualifiers}
            setCurrentContextActive={setCurrentContextActive}
          />
          <Divider />
          <ClaimsEnterPolicyCardInformation policyInformation={policyInformation} />
          <Divider />
          <ClaimsInformationPreview
            {...props}
            claimPreviewInfo={claimPreviewInfo}
            claimInformation={claimInformation}
            columns={columns}
            isUcrHidden
          />
          <Divider />
          <Box className={classes.docsContainer}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {currentContextActive && (
                  <ClaimsUploadViewSearchDocs
                    refData={claimInformation}
                    refIdName={constants.DMS_CONTEXT_CLAIM_ID}
                    dmsContext={constants.DMS_CONTEXT_CLAIM}
                    viewOptions={{
                      upload: false,
                      unlink: false,
                      delete: false,
                    }}
                    searchOptions={{
                      disabled: true,
                    }}
                  />
                )}
              </Grid>
            </Grid>
          </Box>
        </Layout>
      </div>
      <ClaimsFixedBottomBar {...props} handleNextSubmit={props.handleClaimSubmit} save={true} next={true} cancel={true} />
    </>
  );
}
