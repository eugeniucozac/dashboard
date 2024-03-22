import React from 'react';
import PropTypes from 'prop-types';

// app
import { ClaimActionTableView } from './ClaimActionTable.view';

ClaimActionTable.prototypes = {
  lossActions: PropTypes.object.isRequired,
  cols: PropTypes.array.isRequired,
  columnProps: PropTypes.array.isRequired,
};

export default function ClaimActionTable({ lossActions = { items: [] }, cols: colsArr, columnProps, handlers }) {
  return <ClaimActionTableView rows={lossActions?.items || []} cols={colsArr} columnProps={columnProps} handlers={handlers} />;
}
