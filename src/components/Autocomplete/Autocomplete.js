import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import Select from 'react-select';
import AsyncSelect from 'react-select/lib/Async';
import CreatableSelect from 'react-select/lib/Creatable';
import AsyncCreatableSelect from 'react-select/lib/AsyncCreatable';
import get from 'lodash/get';
import debounce from 'lodash/debounce';
import omit from 'lodash/omit';

// app
import { FilterChip } from 'components';
import styles from './Autocomplete.styles';
import AutocompleteControl from './Autocomplete.control';
import AutocompleteClearIcon from './Autocomplete.clearIcon';
import AutocompleteDropdownIcon from './Autocomplete.dropdownIcon';
import AutocompleteLoadingIndicator from './Autocomplete.loadingIndicator';
import AutocompleteLoadingMessage from './Autocomplete.loadingMessage';
import AutocompleteMenu from './Autocomplete.menu';
import AutocompleteNoOptions from './Autocomplete.noOptions';
import AutocompleteOption from './Autocomplete.option';
import AutocompletePlaceholder from './Autocomplete.placeholder';
import AutocompleteSingleValue from './Autocomplete.singleValue';
import AutocompleteValueContainer from './Autocomplete.valueContainer';
import config from 'config';

import { withStyles, NoSsr } from '@material-ui/core';

export class Autocomplete extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.object]),
    label: PropTypes.string,
    error: PropTypes.shape({
      message: PropTypes.string,
      type: PropTypes.string,
    }),
    helperText: PropTypes.string,
    placeholder: PropTypes.string,
    suggestions: PropTypes.arrayOf(PropTypes.object),
    optionKey: PropTypes.string.isRequired,
    optionLabel: PropTypes.string.isRequired,
    handleUpdate: PropTypes.func.isRequired,
    muiComponentProps: PropTypes.object,
    innerComponentProps: PropTypes.shape({
      async: PropTypes.shape({
        handler: PropTypes.func.isRequired,
        type: PropTypes.string.isRequired,
        limit: PropTypes.number,
        filter: PropTypes.func,
      }),
    }),
  };

  static defaultProps = {
    placeholder: '',
    muiComponentProps: {},
    innerComponentProps: {},
  };

  inputComponent = ({ inputRef, ...props }) => {
    return <div ref={inputRef} {...props} />;
  };

  ControlWithRef = (props) => {
    return <AutocompleteControl {...props} inputComponentRef={this.inputComponent} />;
  };

  components = {
    Control: this.ControlWithRef,
    ClearIndicator: AutocompleteClearIcon,
    DropdownIndicator: AutocompleteDropdownIcon,
    LoadingIndicator: AutocompleteLoadingIndicator,
    LoadingMessage: AutocompleteLoadingMessage,
    Menu: AutocompleteMenu,
    MultiValue: FilterChip,
    NoOptionsMessage: AutocompleteNoOptions,
    Option: AutocompleteOption,
    Placeholder: AutocompletePlaceholder,
    SingleValue: AutocompleteSingleValue,
    ValueContainer: AutocompleteValueContainer,
  };

  getNewOptionData = (optionKey, optionLabel) => (newInputValue, newOptionLabel) => {
    // there's a bug in React Select where custom value/label are not working for created options
    // as a workaround, we return an created object with custom keys for value/label
    // and we add the React Select default "value" and "label" so that they are picked up
    // https://github.com/JedWatson/react-select/pull/3004

    return {
      [optionKey]: newInputValue,
      [optionLabel]: newOptionLabel,
      value: newInputValue,
      label: newOptionLabel,
      __isNew__: true,
    };
  };

  handleChange = (values) => {
    const { handleUpdate, id } = this.props;
    const isValueFalsy = values === null || values === undefined || values === false;

    // if we clear the autocomplete, React-Select updates the value to be "null"
    // this would make the value become [null]
    // this causes RHF to create an error nested within an array, which is wrong
    // instead, if "values" is null/undefined/false, we update to an empty array
    handleUpdate(id, Array.isArray(values) ? values : isValueFalsy ? [] : [values]);
  };

  debouncedFetch = debounce((searchTerm, callback) => {
    const asyncHandler = get(this.props, 'innerComponentProps.async.handler');
    const asyncSearch = get(this.props, 'innerComponentProps.async.type');
    const asyncFilter = get(this.props, 'innerComponentProps.async.filter');

    if (asyncHandler) {
      asyncHandler(asyncSearch, searchTerm)
        .then((results) => {
          // if API didn't return an array (ex: endpoint returns error object)
          // we return an empty array to avoid errors
          if (!Array.isArray(results)) return callback([]);

          // if there's no filtering, return all results
          // if (!asyncFilter || isEmpty(asyncFilter)) return callback(results);
          if (!asyncFilter) return callback(results);

          // if we have a filter method, run the values through the function
          return callback(asyncFilter(results));
        })
        .catch((error) => callback(null));
    }
  }, config.ui.autocomplete.delay);

  render() {
    const {
      id,
      value,
      label,
      error,
      helperText,
      placeholder,
      suggestions,
      optionKey,
      optionLabel,
      muiComponentProps,
      innerComponentProps,
      classes,
    } = this.props;

    const allowEmpty = get(this.props, 'innerComponentProps.allowEmpty');
    const errorMsg = error && error.message;
    const hasSuggestions = suggestions && suggestions.length > 0;
    const isEmptyAllowed = hasSuggestions ? true : allowEmpty !== undefined && allowEmpty;
    const isUpArrowIcon = get(this.props, 'innerComponentProps.displayUpArowIcon');

    if (!hasSuggestions && !isEmptyAllowed) {
      return null;
    }

    const asyncHandler = get(this.props, 'innerComponentProps.async.handler');
    const isAsync = !!asyncHandler;
    const isCreatable = get(innerComponentProps, 'isCreatable');

    let SelectComponent = Select;

    if (isAsync) SelectComponent = AsyncSelect;
    if (isCreatable) SelectComponent = CreatableSelect;
    if (isAsync && isCreatable) SelectComponent = AsyncCreatableSelect;

    return (
      <div className={classes.root}>
        <NoSsr>
          <SelectComponent
            loadOptions={isAsync && asyncHandler && this.debouncedFetch}
            value={value}
            options={!isAsync && suggestions}
            getOptionKey={optionKey && ((option) => option[optionKey])}
            getOptionValue={optionKey && ((option) => get(option, `[${optionKey}]`))}
            getOptionLabel={optionLabel && ((option) => get(option, `[${optionLabel}]`))}
            isClearable={true}
            menuPosition={'fixed'} // makes the dropdown flow over components below when clicked
            classes={classes}
            textFieldProps={{
              ...omit(muiComponentProps, ['autoFocus']),
              label,
              id: id,
              name: id,
              error: !!errorMsg,
              helperText: !!errorMsg ? errorMsg : helperText || '',
              'data-form-type': 'autocomplete',
            }}
            getNewOptionData={this.getNewOptionData(optionKey, optionLabel)}
            autoFocus={muiComponentProps.autoFocus}
            {...innerComponentProps}
            components={isUpArrowIcon === false ? { ...this.components, DropdownIndicator: null } : this.components}
            onChange={this.handleChange}
            placeholder={placeholder}
          />
        </NoSsr>
      </div>
    );
  }
}

export default compose(withStyles(styles))(Autocomplete);
