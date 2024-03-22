import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import sortBy from 'lodash/sortBy';

// app
import { TableFiltersView } from './TableFilters.view';
import { PopoverFilter } from 'components';
import * as utils from 'utils';

TableFilters.propTypes = {
  clearFilterKey: PropTypes.string,
  searchBy: PropTypes.node,
  search: PropTypes.bool,
  searchAdvanced: PropTypes.node,
  searchAdvancedExpanded: PropTypes.object,
  searchMinChars: PropTypes.number,
  searchPlaceholder: PropTypes.string,
  isFetchingFilters: PropTypes.bool,
  filters: PropTypes.bool,
  filtersDisabled: PropTypes.bool,
  filtersExpanded: PropTypes.bool,
  filtersArray: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['multiSelect', 'multiSelectAsync', 'datepicker']).isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.any,
      text: PropTypes.shape({
        label: PropTypes.string.isRequired,
        count: PropTypes.number,
      }),
      placeholder: PropTypes.string,
      content: PropTypes.node.isRequired,
      maxHeight: PropTypes.number,
    })
  ),
  columns: PropTypes.bool,
  columnsArray: PropTypes.array,
  handlers: PropTypes.shape({
    onSearch: PropTypes.func,
    onFilter: PropTypes.func,
    onResetFilter: PropTypes.func,
    onToggleColumn: PropTypes.func,
    onResetSearch: PropTypes.func,
    onFilterExpand: PropTypes.func,
  }),
  nestedClasses: PropTypes.shape({
    root: PropTypes.string,
    searchMaxWidth: PropTypes.string,
    searchLeft: PropTypes.string,
    searchBox: PropTypes.string,
  }),
  searchTerm: PropTypes.string,
  searchByTerm: PropTypes.string,
};

TableFilters.defaultProps = {
  search: true,
  filters: true,
  isFetchingFilters: false,
  columns: false,
  handlers: {},
  nestedClasses: {},
  searchMinChars: 1,
  searchTerm: '',
};

export function TableFilters({
  isFetchingFilters,
  filtersArray = [],
  clearFilterKey,
  columnsArray,
  handlers,
  searchAdvanced,
  searchAdvancedExpanded,
  searchPlaceholder,
  searchTerm,
  searchByTerm,
  ...props
}) {
  const isMounted = useRef(false);
  const previousFilters = useRef(false);

  const getFiltersObject = (filtersFieldsArray) => {
    return filtersFieldsArray.reduce((acc, cur) => {
      return {
        ...acc,
        [cur.id]: cur.value,
      };
    }, {});
  };

  const [resetKey, setResetKey] = useState();
  const [search, setSearch] = useState('');
  const [searchByChanged, setSearchByChanged] = useState(false); // when search & searchBy combination has changed after search submit
  const [advancedSearchExpanded, setAdvancedSearchExpanded] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [filtersFieldsObject, setFiltersFieldsObject] = useState(getFiltersObject(filtersArray));
  const [columnsExpanded, setColumnsExpanded] = useState(false);

  // save the original filters
  useEffect(() => {
    previousFilters.current = getFiltersObject(filtersArray);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // when the search (string) state has changed, we call the onSearch handler (to trigger API fetch)
  useEffect(() => {
    if (isMounted.current) {
      triggerNewSearch();
    } else {
      isMounted.current = true;
    }
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (searchByChanged) {
      triggerNewSearch();
    }
  }, [searchByChanged]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setSearch(searchTerm);
    setSearchByChanged(false);
  }, [searchTerm]);

  useEffect(() => {
    if (searchAdvancedExpanded?.isOpen !== advancedSearchExpanded) {
      setAdvancedSearchExpanded(searchAdvancedExpanded?.isOpen);
    }
  }, [searchAdvancedExpanded]); // eslint-disable-line react-hooks/exhaustive-deps

  const triggerNewSearch = () => {
    if (utils.generic.isFunction(handlers?.onSearch)) {
      handlers.onSearch({ search, searchBy: searchByTerm, filters: filtersFieldsObject });
      setSearchByChanged(false);
    }
  };

  const toggleMultiSelectOption = (field, value) => {
    const fieldObj = filtersArray.find((f) => f.id === field);

    if (field && value) {
      const currentField = filtersFieldsObject?.[field] || [];
      const isValueAlreadySelected = currentField.some((i) => i.id === value.id);
      const newFilters = {
        ...filtersFieldsObject,
        [field]: isValueAlreadySelected ? currentField.filter((i) => i.id !== value.id) : [...currentField, value],
      };

      setFiltersFieldsObject(newFilters);

      if (utils.generic.isFunction(fieldObj?.content?.props?.handlers?.toggleOption)) {
        fieldObj.content.props.handlers.toggleOption(field, value);
      }
    }
  };

  const selectedDatePicker = (field, value) => {
    const fieldObj = filtersArray.find((f) => f.id === field);
    if (field && value) {
      const newFilters = {
        ...filtersFieldsObject,
        [field]: value,
      };
      setFiltersFieldsObject(newFilters);
      if (utils.generic.isFunction(fieldObj?.content?.props?.handlers?.toggelDatePicker)) {
        fieldObj.content.props.handlers.toggelDatePicker(field, value);
      }
    }
  };

  const toggleFilters = () => {
    setFiltersExpanded(!filtersExpanded);
    if (utils.generic.isFunction(handlers?.onFilterExpand)) {
      handlers?.onFilterExpand(!filtersExpanded);
    }
  };

  // when the filters have changed, we call the onFilter handler (to trigger API fetch)
  const submitFilters = () => {
    if (utils.generic.isFunction(handlers?.onFilter)) {
      previousFilters.current = filtersFieldsObject;
      handlers.onFilter({ search, filters: filtersFieldsObject });
    }
  };

  const clearFilters = () => {
    const newFieldsObject = Object.keys(filtersFieldsObject).reduce((acc, key) => {
      let returnObject = {};
      returnObject = Array.isArray(filtersFieldsObject[key]) ? { ...acc, [key]: [] } : { ...acc, [key]: '' };
      return returnObject;
    }, {});

    setFiltersFieldsObject(newFieldsObject);
    previousFilters.current = newFieldsObject;
  };

  const resetFilters = () => {
    clearFilters();
    if (utils.generic.isFunction(handlers?.onResetFilter)) {
      handlers.onResetFilter();
    }
  };

  useEffect(() => {
    if (clearFilterKey) clearFilters();
  }, [clearFilterKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const isFiltersModified = () => {
    const previous = previousFilters.current;
    const current = filtersFieldsObject;

    return isEqual(
      Object.entries(previous || {}).reduce((acc, [name, value]) => {
        return { ...acc, [name]: sortBy(value, 'id') };
      }, {}),
      Object.entries(current).reduce((acc, [name, value]) => {
        return { ...acc, [name]: sortBy(value, 'id') };
      }, {})
    );
  };

  const fields = filtersArray.map((field) => {
    return {
      ...field,
      ...(field.type === 'multiSelect' && { value: filtersFieldsObject[field.id] }),
      ...(field.type === 'multiSelectAsync' && { value: filtersFieldsObject[field.id] }),
      ...(field.type === 'datepicker' && { value: filtersFieldsObject[field.id] }),
      handlers: {
        ...field.handlers,
        ...field.content?.props?.handlers,
        ...(field.type === 'multiSelect' && { toggleOption: toggleMultiSelectOption }),
        ...(field.type === 'multiSelectAsync' && { toggleOption: toggleMultiSelectOption }),
        ...(field.type === 'datepicker' && { toggelDatePicker: selectedDatePicker }),
      },
    };
  });

  const toggleColumns = (column) => {
    handlers.onToggleColumn(column);
  };

  const toggleColumnsExpanded = () => {
    setColumnsExpanded(!columnsExpanded);
  };

  const columnsFiltered = (columns) => {
    if (utils.generic.isInvalidOrEmptyArray(columns)) return [];

    // remove columns which should not be part of the flexi column list
    return columns.filter((col) => {
      return !col.menu;
    });
  };

  // when the search form is submitted, we update the internal state which will trigger a useEffect re-render
  const submitSearch = (queryTerm, queryByTerm) => {
    setSearch(queryTerm);
    if (queryByTerm) setSearchByChanged(true);
  };

  // resetKey is used to reset the <Search /> submit button which sometimes remains active
  const resetSearch = () => {
    setSearch('');
    setSearchByChanged(false);
    setResetKey(new Date().getTime());
    if (utils.generic.isFunction(handlers?.onResetSearch)) {
      handlers.onResetSearch();
    }
  };

  const toggleAdvancedSearch = (isOpen) => {
    setAdvancedSearchExpanded(typeof isOpen === 'boolean' ? isOpen : !advancedSearchExpanded);
  };

  return (
    <TableFiltersView
      {...props}
      resetKey={resetKey}
      search={searchAdvanced ? false : props.search}
      searchQuery={search}
      searchPlaceholder={searchPlaceholder}
      searchByTerm={searchByTerm ? searchByTerm : !props?.searchBy ? '' : null}
      searchAdvanced={searchAdvanced}
      searchAdvancedExpanded={advancedSearchExpanded}
      isFetchingFilters={isFetchingFilters}
      filtersExpanded={filtersExpanded}
      filtersSubmitDisabled={isFiltersModified()}
      filtersArray={fields}
      columnsArray={columnsFiltered(columnsArray)}
      columnsExpanded={columnsExpanded}
      handlers={{
        toggleFilters,
        resetFilters,
        submitFilters,
        toggleColumns,
        toggleColumnsExpanded,
        toggleAdvancedSearch,
        submitSearch,
        resetSearch,
      }}
    >
      {utils.generic.isValidArray(fields, true)
        ? fields.map((field) => {
            return (
              <PopoverFilter
                key={field.id}
                {...field}
                disabled={
                  field.disabled ||
                  !field.content ||
                  (field.type === 'multiSelect' && utils.generic.isInvalidOrEmptyArray(field.options)) ||
                  (field.type === 'multiSelectAsync' && !field.content?.props?.handlers?.fetch)
                }
              />
            );
          })
        : null}
    </TableFiltersView>
  );
}

export default TableFilters;
