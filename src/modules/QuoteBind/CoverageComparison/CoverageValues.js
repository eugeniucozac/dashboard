import get from 'lodash/get';
import { Box, Typography } from '@material-ui/core';
// app
import { Tooltip } from 'components';
import * as utils from 'utils';

export const CoverageValues = ({ coverageValues, coverageDefinitionFields }) => {
  return (
    <Box
      style={{
        padding: 16,
      }}
    >
      {coverageDefinitionFields.map((field) => {
        const value = coverageValues[field.name];

        const condition = utils.risk.getCondition(field, coverageDefinitionFields);
        const refValueCondition = condition && get(coverageValues, `${condition.name}`);
        const isConditionValid = condition && utils.risk.isConditionValid(condition, refValueCondition);
        const isHidden = utils.risk.isHiddenField(field);
        const displayValue = utils.risk.renderRiskValue(field, value);

        return !isHidden && (condition === undefined || (condition && isConditionValid)) ? (
          <Box key={field.name}>
            <Tooltip title={field.label}>
              <Typography variant="body2">{displayValue}</Typography>
            </Tooltip>
          </Box>
        ) : null;
      })}
    </Box>
  );
};
