import React from 'react';
import PropTypes from 'prop-types';

//app
import styles from './ClaimsEditComplexityRulesValue.styles';
import { ClaimsEditComplexityRulesValueFormView } from './ClaimsEditComplexityRulesValueForm.view';
import { ClaimsSelectMatrix } from 'modules';
import { Empty } from 'components';
import * as utils from 'utils';
import { ReactComponent as IconSearchFile } from '../../assets/svg/line-icon-search-file.svg';

//mui
import { makeStyles, Box, Grid, Typography } from '@material-ui/core';

ClaimsEditComplexityRulesValueView.prototypes = {
  isComplexityActive: PropTypes.bool.isRequired,
  canLoadMatrix: PropTypes.bool.isRequired,
  constructMatrixProps: PropTypes.object.isRequired,
  handleEditValues: PropTypes.func.isRequired,
};
export function ClaimsEditComplexityRulesValueView({ isComplexityActive, canLoadMatrix, constructMatrixProps, handleEditValues }) {
  const classes = makeStyles(styles, { name: 'ClaimsEditComplexityRulesValue' })();

  return (
    <Box className={classes.wrapper}>
      <Grid container justify="space-between" alignItems="center">
        <Grid item>
          <Grid container direction="row">
            <Grid item>
              <Typography variant="body2" className={classes.title}>
                {isComplexityActive
                  ? utils.string.t('claims.complexityRulesManagementDetails.editComplexityValue')
                  : utils.string.t('claims.complexityRulesManagementDetails.editReferralValue')}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <ClaimsEditComplexityRulesValueFormView isComplexityActive={isComplexityActive} handleEditValues={handleEditValues} />
      <Grid container>
        <Grid item xs={12}>
          {canLoadMatrix ? (
            <ClaimsSelectMatrix {...constructMatrixProps} />
          ) : (
            <Empty title={utils.string.t('claims.complexityRulesManagementDetails.divisionEmpty')} icon={<IconSearchFile />} padding />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
