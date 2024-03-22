import * as React from 'react';
import { Button, FormGrid } from 'components';

import { Box, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { renderValue } from 'modules/RiskData/RiskData';
import * as utils from 'utils';

export const LocationTooltipCard = ({ tooltip, locationDefinitions, excludeColumns, handleClose }) => {
  return (
    <Box data-testid="location-tooltip-card" style={{ width: 300, padding: 0 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        style={{
          padding: '10px 16px',
          fontWeight: 'bold',
          backgroundColor: '#334762',
          color: 'white',
          textAlign: 'left',
          fontSize: 14,
          maxWidth: '100%',
        }}
      >
        {tooltip.buildingTitle}
        <Button icon={CloseIcon} onClick={handleClose} variant="text" style={{ color: 'white' }} />
      </Box>
      <Box style={{ margin: 16, textAlign: 'left', maxWidth: '100%' }}>
        <FormGrid spacing={1} container>
          {locationDefinitions.arrayItemDef
            .filter((f) => Boolean(f.name))
            .filter((f) => !excludeColumns.find((exclude) => exclude.id === f.name))
            .map((arrayField) => {
              const isHidden = utils.risk.isHiddenField(arrayField);
              const value = tooltip[arrayField?.name];

              return !isHidden ? (
                <React.Fragment key={arrayField?.name}>
                  <FormGrid item xs={6}>
                    <Typography variant="body2" component="span">
                      {arrayField.label}
                    </Typography>
                  </FormGrid>
                  <FormGrid item xs={6}>
                    <Typography variant="body2" component="span" style={{ fontWeight: 'bold' }}>
                      {renderValue(arrayField, value)}
                    </Typography>
                  </FormGrid>
                </React.Fragment>
              ) : null;
            })}
        </FormGrid>
      </Box>
    </Box>
  );
};
