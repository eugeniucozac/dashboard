import React from 'react';
import PropTypes from 'prop-types';

//app
import styles from './ClaimsComplexityReferralValues.styles';
import * as utils from 'utils';
import { Empty, Button } from 'components';
import { ClaimsComplexityReferralValuesTable, ClaimsEditComplexityRulesValue } from 'modules';
import { ReactComponent as IconSearchFile } from '../../assets/svg/line-icon-search-file.svg';

//mui
import { Box, makeStyles, Grid } from '@material-ui/core';

ClaimsComplexityReferralValuesView.prototypes = {
  canDeleteRule: PropTypes.bool.isRequired,
  constructMatrixProps: PropTypes.object.isRequired,
  complexityReferralValues: PropTypes.object.isRequired,
  handleAddReferralValue: PropTypes.func.isRequired,
  handleRemoveComplexityValues: PropTypes.func.isRequired,
  handleEditComplexityRule: PropTypes.func.isRequired,
  handleUpdateComplexityRuleValue: PropTypes.func.isRequired,
};
export function ClaimsComplexityReferralValuesView({
  canDeleteRule,
  constructMatrixProps,
  complexityReferralValues,
  handleAddReferralValue,
  handleRemoveComplexityValues,
  handleEditComplexityRule,
  handleUpdateComplexityRuleValue,
}) {
  const classes = makeStyles(styles, { name: 'ClaimsComplexityReferralValues' })();
  const canLoadTable = complexityReferralValues?.itemsTotal > 0;
  const canLoadEditMatrix = constructMatrixProps?.initComplexityMatrixData?.length > 0;

  return (
    <Grid container>
      <Grid item xs={12}>
        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button
            text={utils.string.t('app.add')}
            onClick={handleAddReferralValue}
            color="primary"
            size="medium"
            nestedClasses={{ btn: classes.actionButton }}
          />
          <Button
            text={utils.string.t('app.remove')}
            onClick={() => handleRemoveComplexityValues()}
            disabled={canDeleteRule}
            size="medium"
            nestedClasses={{ btn: classes.actionButton }}
          />
        </Box>
      </Grid>
      {canLoadTable && (
        <>
          <Grid item xs={12}>
            <ClaimsComplexityReferralValuesTable
              complexityReferralValues={complexityReferralValues}
              handleEditComplexityRule={handleEditComplexityRule}
            />
          </Grid>
          {canLoadEditMatrix ? (
            <Grid item xs={12}>
              <ClaimsEditComplexityRulesValue
                canLoadMatrix={canLoadEditMatrix}
                {...constructMatrixProps}
                handleUpdateComplexityRuleValue={handleUpdateComplexityRuleValue}
              />
            </Grid>
          ) : (
            <Grid item xs={12}>
              <Empty
                title={utils.string.t('claims.complexityRulesManagementDetails.referralValuesDivisionSelectPrompt')}
                icon={<IconSearchFile />}
                padding
              />
            </Grid>
          )}
        </>
      )}
      {!canLoadTable && (
        <Grid item xs={12}>
          <Empty title={utils.string.t('claims.complexityRulesManagementDetails.referralValuesEmpty')} icon={<IconSearchFile />} padding />
        </Grid>
      )}
    </Grid>
  );
}
