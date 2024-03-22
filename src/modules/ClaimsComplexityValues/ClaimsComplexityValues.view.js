import React from 'react';
import PropTypes from 'prop-types';

//app
import styles from './ClaimsComplexityValues.styles';
import { Empty, Button } from 'components';
import { ClaimsComplexityBasisTable, ClaimsEditComplexityRulesValue } from 'modules';
import * as utils from 'utils';
import { ReactComponent as IconSearchFile } from '../../assets/svg/line-icon-search-file.svg';

//mui
import { Box, makeStyles, Grid } from '@material-ui/core';

ClaimsComplexityValuesView.prototypes = {
  canLoadTable: PropTypes.bool.isRequired,
  canLoadEditMatrix: PropTypes.bool.isRequired,
  canDeleteRule: PropTypes.bool.isRequired,
  constructMatrixProps: PropTypes.object.isRequired,
  complexityBasisValueData: PropTypes.object.isRequired,
  handleAddComplexityValues: PropTypes.func.isRequired,
  handleRemoveComplexityValues: PropTypes.func.isRequired,
  handleEditComplexityRule: PropTypes.func.isRequired,
  handleUpdateComplexityRuleValue: PropTypes.func.isRequired,
};
export function ClaimsComplexityValuesView({
  canLoadTable,
  canLoadEditMatrix,
  canDeleteRule,
  constructMatrixProps,
  complexityBasisValueData,
  handleAddComplexityValues,
  handleRemoveComplexityValues,
  handleEditComplexityRule,
  handleUpdateComplexityRuleValue,
}) {
  const classes = makeStyles(styles, { name: 'ClaimsComplexityValues' })();

  return (
    <Grid container>
      <Grid item xs={12}>
        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button
            text={utils.string.t('app.add')}
            onClick={() => handleAddComplexityValues()}
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
            <ClaimsComplexityBasisTable
              complexityBasisValueData={complexityBasisValueData}
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
                title={utils.string.t('claims.complexityRulesManagementDetails.complexityValuesDivisionSelectPrompt')}
                icon={<IconSearchFile />}
                padding
              />
            </Grid>
          )}
        </>
      )}
      {!canLoadTable && (
        <Grid item xs={12}>
          <Empty
            title={utils.string.t('claims.complexityRulesManagementDetails.complexityValuesEmpty')}
            icon={<IconSearchFile />}
            padding
          />
        </Grid>
      )}
    </Grid>
  );
}
