import React from 'react';
import PropTypes from 'prop-types';

//app
import { Empty } from 'components';
import { ClaimsSelectMatrix } from 'modules';
import * as utils from 'utils';
import { ReactComponent as IconSearchFile } from '../../assets/svg/line-icon-search-file.svg';

//mui
import { Grid } from '@material-ui/core';

ClaimsComplexityDivisionView.prototypes = {
  initMatrixData: PropTypes.array.isRequired,
};
export function ClaimsComplexityDivisionView({ initMatrixData, ...props }) {
  return (
    <Grid container>
      <Grid item xs={12}>
        {utils.generic.isValidArray(initMatrixData, true) ? (
          <ClaimsSelectMatrix initMatrixData={initMatrixData} {...props} />
        ) : (
          <Empty title={utils.string.t('claims.complexityRulesManagementDetails.divisionEmpty')} icon={<IconSearchFile />} padding />
        )}
      </Grid>
    </Grid>
  );
}
