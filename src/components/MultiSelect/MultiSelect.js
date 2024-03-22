import React, { useState } from 'react';
import PropTypes from 'prop-types';

// app
import { MultiSelectView } from './MultiSelect.view';
import * as utils from 'utils';

MultiSelect.propTypes = {
  id: PropTypes.string.isRequired,
  search: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  values: PropTypes.array,
  placeholder: PropTypes.string,
  max: PropTypes.number,
  labels: PropTypes.shape({
    maxReached: PropTypes.string,
  }),
  handlers: PropTypes.shape({
    toggleOption: PropTypes.func,
  }),
};

MultiSelect.defaultProps = {
  max: 0,
  options: [],
  values: [],
  labels: {},
  handlers: {},
  nestedClasses: {},
};

export default function MultiSelect({ id, options, values, placeholder, handlers, ...props }) {
  const [query, setQuery] = useState('');

  const onKeyStroke = (value) => {
    setQuery(value);
  };

  const onClear = (reset) => (event) => {
    setQuery('');
    reset();
  };

  const onToggleOption = (item) => {
    if (utils.generic.isFunction(handlers.toggleOption)) {
      handlers.toggleOption(id, item);
    }
  };

  const field = {
    name: `multi-select-search-${id}`,
    placeholder: placeholder || '',
    defaultValue: '',
    onChange: (value) => {
      onKeyStroke(value ? value.trim() : '');
      return value;
    },
    muiComponentProps: {
      autoComplete: 'off',
    },
  };

  // abort
  if (utils.generic.isInvalidOrEmptyArray(options)) return null;

  const optionsFiltered = options.filter((value) => {
    const name = (value?.name || '').toLowerCase();
    return query ? name.includes(query.toLowerCase()) : true;
  });

  return (
    <MultiSelectView
      id={`multi-select-${id}`}
      field={field}
      query={query}
      options={optionsFiltered}
      selectedItems={values}
      handlers={{
        onClear,
        onToggleOption,
      }}
      {...props}
    />
  );
}
