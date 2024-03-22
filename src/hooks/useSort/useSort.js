import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// app
import config from 'config';
import * as utils from 'utils';

useSort.propTypes = {
  cols: PropTypes.array.isRequired,
  sort: PropTypes.shape({
    by: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['date', 'numeric', 'boolean', 'lexical']).isRequired,
    direction: PropTypes.oneOf(['asc', 'desc']).isRequired,
  }).isRequired,
  handleSort: PropTypes.func,
};

export default function useSort(cols = [], sort = {}, handleSort) {
  const [stateSort, setStateSort] = useState({});

  useEffect(() => {
    setStateSort({
      by: sort.by,
      type: sort.type,
      direction: sort.direction,
    });
  }, [sort.by, sort.type, sort.direction]);

  const updateSort = (by, type, dir) => (event) => {
    const defaultDir = dir || config.ui.sort.direction.default;
    const toggleDir = stateSort.direction === 'asc' ? 'desc' : 'asc';
    const currentDir = stateSort.by === by ? toggleDir : defaultDir;

    if (utils.generic.isFunction(handleSort)) {
      handleSort(by, currentDir, type);
    }

    setStateSort({
      by,
      type,
      direction: currentDir,
    });
  };

  const getCols = (cols) => {
    return cols.map((col) => {
      if (col.sort) {
        col.sort.by = col.id;
        col.sort.handler = updateSort;
      }

      return col;
    });
  };

  return {
    cols: getCols(cols),
    sort: stateSort,
  };
}
