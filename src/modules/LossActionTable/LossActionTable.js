import React from 'react';
import PropTypes from 'prop-types';

// app
import { LossActionTableView } from './LossActionTable.view';

LossActionTable.prototypes = {
  lossActions: PropTypes.object.isRequired,
  cols: PropTypes.array.isRequired,
  columnProps: PropTypes.array.isRequired,
};

export default function LossActionTable({ lossActions = { items: [] }, cols: colsArr, columnProps }) {
  return <LossActionTableView rows={lossActions?.items || []} cols={colsArr} columnProps={columnProps} />;
}
