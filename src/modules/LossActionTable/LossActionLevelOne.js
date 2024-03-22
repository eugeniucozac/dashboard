import React from 'react';
import PropTypes from 'prop-types';

//app
import { TableBody } from '@material-ui/core';
import { LossActionLevelTwo } from './LossActionLevelTwo';
LossActionLevelOne.prototype = {
  data: PropTypes.array.isRequired,
  columnProps: PropTypes.array.isRequired,
};

export function LossActionLevelOne({ data, columnProps }) {
  return (
    <TableBody data-testid="loss-action-list">
      <LossActionLevelTwo data={data} columnProps={columnProps} />
    </TableBody>
  );
}
