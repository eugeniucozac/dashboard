import React, { useState } from 'react';
import PropTypes from 'prop-types';

// app
import * as utils from 'utils';
import styles from './SingleSelect.styles';
import { SingleSelectView } from './SingleSelect.view';

//mui
import CachedIcon from '@material-ui/icons/Cached';
import { makeStyles, Typography } from '@material-ui/core';

SingleSelect.defaultProps = {
  id: PropTypes.string.isRequired,
  value: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
  }),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      toolTipTitle: PropTypes.string,
    })
  ).isRequired,
  placeholder: PropTypes.string,
  handlers: PropTypes.shape({
    onClear: PropTypes.func.isRequired,
    onToggleOption: PropTypes.func.isRequired,
  }),
};

export default function SingleSelect({ id, options, value, placeholder, handlers, ...props }) {
  const classes = makeStyles(styles, { name: 'SingleSelect' })();
  const [query, setQuery] = useState('');

  /** Triggers on key press for searching the list */
  const onKeyStroke = (value) => {
    setQuery(value);
  };

  /** Clear the typed characters on the search textbox value */
  const onClear = (reset) => (event) => {
    setQuery('');
    reset();
  };

  /** Triggering the handler function  to pass selected value from the list to parent component */
  const onToggleOption = (item) => {
    if (utils.generic.isFunction(handlers.onToggleOption)) {
      handlers.onToggleOption(item);
    }
  };

  const field = {
    name: `single-select-search-drp-${id}`,
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
  if (utils.generic.isInvalidOrEmptyArray(options))
    return (
      <Typography variant="body2" className={classes.loading}>
        {utils.string.t('app.loading')}
        <CachedIcon className={classes.loadingIcon} />
      </Typography>
    );

  const optionsFiltered = options.filter((value) => {
    const name = (value?.name || '').toLowerCase();
    return query ? name.includes(query.toLowerCase()) : true;
  });
  return (
    <SingleSelectView
      id={`single-select-drp-${id}`}
      field={field}
      query={query}
      options={optionsFiltered}
      selectedValue={value ? value : null}
      handlers={{
        onClear,
        onToggleOption,
      }}
      {...props}
    />
  );
}
