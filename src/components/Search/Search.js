import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import { SearchView } from './Search.view';
import styles from './Search.styles';
import * as utils from 'utils';

// mui
import { makeStyles } from '@material-ui/core';

Search.propTypes = {
  text: PropTypes.string,
  placeholder: PropTypes.string,
  submitButton: PropTypes.bool,
  submitButtonProps: PropTypes.object,
  handlers: PropTypes.shape({
    search: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    focus: PropTypes.func,
  }).isRequired,
  nestedClasses: PropTypes.shape({
    root: PropTypes.string,
    btn: PropTypes.string,
    formControlRoot: PropTypes.string,
    inputPropsRoot: PropTypes.string,
  }),
  minChars: PropTypes.number,
  searchByTerm: PropTypes.string,
  isSearchByActive: PropTypes.bool,
};

Search.defaultProps = {
  submitButton: true,
  handlers: {},
  nestedClasses: {},
  minChars: 1,
  searchByTerm: '',
  isSearchByActive: false,
};

export default function Search({
  text,
  minChars,
  placeholder,
  submitButton,
  submitButtonProps,
  searchByTerm,
  isSearchByActive,
  handlers,
  nestedClasses,
}) {
  const classes = makeStyles(styles, { name: 'Search' })();

  const isSearchByNull = isSearchByActive ? !Boolean(searchByTerm) : false;
  const searchByPrevValue = useRef(isSearchByActive ? searchByTerm : null);

  const checkSearchByChanged = () => !isSearchByNull && searchByPrevValue?.current !== searchByTerm;

  const [isSearchByChanged, setIsSearchByChanged] = useState(checkSearchByChanged());

  useEffect(() => {
    if (isSearchByActive && searchByPrevValue?.current !== searchByTerm) {
      setIsSearchByChanged(checkSearchByChanged());
      searchByPrevValue.current = searchByTerm;
    }
  }, [searchByTerm]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClear = (reset) => (event) => {
    reset();

    if (utils.generic.isFunction(handlers.reset)) {
      handlers.reset();
    }
  };

  const handleSubmit = (values = {}) => {
    const { query } = values;

    if (query) {
      if (text !== query) {
        return handlers.search(query?.trim());
      }
      if (text === query && isSearchByActive && isSearchByChanged) {
        setIsSearchByChanged(false);
        return handlers.search(query?.trim(), searchByTerm);
      }
    }
  };

  const fields = [
    {
      name: 'query',
      type: 'text',
      placeholder: placeholder || '',
      defaultValue: submitButton ? text || '' : '',
      onChange: submitButton
        ? undefined
        : (value) => {
            const searchTerm = value ? value.trim() : '';
            handlers.search(searchTerm);

            return value;
          },
      muiComponentProps: {
        autoComplete: 'off',
        ...(utils.generic.isFunction(handlers.focus) && {
          onFocus: () => {
            handlers.focus();
          },
        }),
        classes: {
          root: classnames({
            [classes.input]: true,
            [nestedClasses.formControlRoot]: Boolean(nestedClasses.formControlRoot),
          }),
        },
        InputProps: {
          classes: {
            root: classnames({
              [nestedClasses.inputPropsRoot]: Boolean(nestedClasses.inputPropsRoot),
            }),
          },
        },
        'data-testid': 'search-field',
      },
    },
  ];

  return (
    <SearchView
      query={text}
      fields={fields}
      submitButton={submitButton}
      submitButtonProps={submitButtonProps}
      minChars={minChars}
      isSearchByNull={isSearchByNull}
      isSearchByChanged={isSearchByChanged}
      handlers={{
        clear: handleClear,
        search: handleSubmit,
      }}
      nestedClasses={nestedClasses}
    />
  );
}
