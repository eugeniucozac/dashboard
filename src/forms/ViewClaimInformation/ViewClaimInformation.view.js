import React from 'react';
import PropTypes from 'prop-types';

//app
import {
  ClaimsEnterLossCardInformation,
  ClaimsInformationPreview,
  ClaimsEnterPolicyCardInformation,
  ClaimsUploadViewSearchDocs,
} from 'modules';
import * as utils from 'utils';
import { Layout, Button, FormActions } from 'components';
import styles from './ViewClaimInformation.styles';
import * as constants from 'consts';

//mui
import { makeStyles, Divider, Grid, Box } from '@material-ui/core';

ViewClaimInformationView.propTypes = {
  isAllStepsCompleted: PropTypes.bool.isRequired,
  activeStep: PropTypes.number.isRequired,
  lastStep: PropTypes.number.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleFinish: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleNextSubmit: PropTypes.func.isRequired,
};

export function ViewClaimInformationView(props) {
  const { claimInformation, lossInformation, catCodes, lossQualifiers, policyInformation, columns, handleCancel } = props;
  const classes = makeStyles(styles, { name: 'ViewClaimInformation' })();

  return (
    <>
      <div className={classes.wrapper}>
        <Layout main padding>
          <ClaimsEnterLossCardInformation lossInformation={lossInformation} catCodes={catCodes} lossQualifiers={lossQualifiers} />
          <Divider />
          <ClaimsEnterPolicyCardInformation policyInformation={policyInformation} />
          <Divider />
          <ClaimsInformationPreview {...props} claimInformation={claimInformation} columns={columns} />
          <Divider />
          <Box className={classes.docsContainer}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
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
              </Grid>
            </Grid>
          </Box>
        </Layout>
        <FormActions type="dialog">
          <Button text={utils.string.t('app.close')} variant="outlined" size="medium" onClick={handleCancel} />
        </FormActions>
      </div>
    </>
  );
}
