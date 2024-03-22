import React from 'react';
import PropTypes from 'prop-types';

// app
import { Layout } from 'components';
import { ClaimsSelectPolicy, ClaimsUploadViewSearchDocs } from 'modules';
import ClaimsFixedBottomBar from '../ClaimsFixedBottomBar/ClaimsFixedBottomBar';
import styles from './ClaimsPolicySearch.styles';
import * as constants from 'consts';

// mui
import { makeStyles, Grid, Box } from '@material-ui/core';

ClaimsPolicySearchView.propTypes = {
  isAllStepsCompleted: PropTypes.bool.isRequired,
  lastStep: PropTypes.bool.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleFinish: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
  handleNextSubmit: PropTypes.func,
  hasPolicyRef: PropTypes.bool.isRequired,
  policyInformation: PropTypes.object.isRequired,
};

export default function ClaimsPolicySearchView(props) {
  const { confirm, setConfirm, handleSearchNext, hasPolicyRef, policyInformation } = props;

  const classes = makeStyles(styles, { name: 'ClaimsPolicySearch' })();

  return (
    <>
      <div className={classes.wrapper}>
        <Layout main padding>
          <Box>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <ClaimsSelectPolicy setConfirm={setConfirm} />
              </Grid>
              <Grid item xs={12}>
                {hasPolicyRef && (
                  <ClaimsUploadViewSearchDocs
                    refData={{ ...policyInformation }}
                    refIdName={constants.DMS_CONTEXT_POLICY_ID}
                    dmsContext={constants.DMS_CONTEXT_POLICY}
                    viewOptions={{
                      upload: false,
                      multiSelect: false,
                    }}
                    defaultTab={constants.DMS_VIEW_TAB_SEARCH}
                    documentTypeKey={constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.claim}
                    isTabView={false}
                    fnolViewOptions={{
                      isClaimsFNOL: true,
                      isDmsDocumentMenuDisabled: true,
                    }}
                  />
                )}
              </Grid>
            </Grid>
          </Box>
        </Layout>
      </div>
      <ClaimsFixedBottomBar {...props} handleNextSubmit={handleSearchNext} next={confirm} save={confirm} />
    </>
  );
}
