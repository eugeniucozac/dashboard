import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import toNumber from 'lodash/toNumber';

// app
import { ModellingTableView } from './ModellingTable.view';
import * as utils from 'utils';

ModellingTable.propTypes = {
  popoverActions: PropTypes.array,
  modellingList: PropTypes.array.isRequired,
  handleDoubleClickRow: PropTypes.func,
  sort: PropTypes.shape({
    by: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    direction: PropTypes.string.isRequired,
  }),
};

ModellingTable.defaultProps = {
  popoverActions: [],
};

export function ModellingTable({ popoverActions, modellingList, sort }) {
  const [selectedId, setSelectedId] = useState();
  const document = useSelector((state) => state.document.selected);

  useEffect(() => {
    setSelectedId(toNumber(document.modellingId));
  }, [document]);

  const cols = [
    { id: 'id', label: utils.string.t('placement.modelling.id') },
    { id: 'insured', label: utils.string.t('placement.modelling.insured') },
    { id: 'dueDate', label: utils.string.t('placement.modelling.dueDate') },
    { id: 'notes', label: utils.string.t('placement.modelling.notes') },
    { id: 'status', label: utils.string.t('app.status') },
    ...(popoverActions.length > 0 ? [{ id: 'actions' }] : []),
  ];

  const handleClickRow = (id) => {
    setSelectedId(id);
  };

  return (
    <ModellingTableView
      modellingList={modellingList}
      sort={sort}
      selectedId={selectedId}
      handleClickRow={handleClickRow}
      cols={cols}
      popoverActions={popoverActions}
    />
  );
}

export default ModellingTable;
