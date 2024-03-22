import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

// app
import { MultiSelectAsyncView } from './MultiSelectAsync.view';
import * as utils from 'utils';

MultiSelectAsync.propTypes = {
  id: PropTypes.string.isRequired,
  values: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ),
  max: PropTypes.number,
  searchMinChars: PropTypes.number,
  placeholder: PropTypes.string,
  labels: PropTypes.shape({
    minChars: PropTypes.string,
    hint: PropTypes.string,
    noResults: PropTypes.string,
  }),
  handlers: PropTypes.shape({
    fetch: PropTypes.func.isRequired,
    toggleOption: PropTypes.func,
  }),
};

MultiSelectAsync.defaultProps = {
  max: 8,
  searchMinChars: 1,
  values: [],
  handlers: {},
  nestedClasses: {},
};

export default function MultiSelectAsync({ id, values, searchMinChars, placeholder, handlers, ...props }) {
  const [query, setQuery] = useState('');
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);

  const onKeyStroke = (value) => {
    setQuery(value);

    if (value && value.length >= searchMinChars) {
      setFetching(true);
    }
  };

  const onClear = (reset) => (event) => {
    setQuery('');
    setOptions([]);
    reset();
  };

  const onToggleOption = (item) => {
    if (utils.generic.isFunction(handlers.toggleOption)) {
      handlers.toggleOption(id, item);
    }
  };

  const fetch = useMemo(
    () =>
      // debounce to prevent too many fetches on every keystrokes
      debounce((request, callback) => {
        setFetching(true);
        handlers.fetch(request.input).then((results) => {
          setFetching(false);
          callback(results);
        });
      }, 250),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    if (query && query.length >= searchMinChars) {
      fetch({ input: query }, (results) => {
        setOptions(results);
      });
    }
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

  const field = {
    name: `multi-select-async-search-${id}`,
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

  return (
    <MultiSelectAsyncView
      id={`multi-select-async-${id}`}
      field={field}
      query={query}
      options={options}
      values={values}
      searchMinChars={searchMinChars}
      fetching={fetching}
      handlers={{
        onClear,
        onToggleOption,
      }}
      {...props}
    />
  );
}
