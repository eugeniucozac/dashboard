import moment from 'moment';
import * as utils from 'utils';

const utilsFilters = {
  // return only the rows (and their parents) which match the search criteria
  items: (items = [], query, columns, filterableColumns, nestedKey, filters = {}) => {
    return items.reduce((acc, item) => {
      const options = item[nestedKey] || [];

      if (utilsFilters.hasMatch(item, columns, filterableColumns, query, filters)) {
        return [...acc, item];
      } else {
        if (utilsFilters.hasMatchDeep(options, query, columns, filterableColumns, nestedKey, filters)) {
          return [...acc, { ...item, [nestedKey]: utilsFilters.items(options, query, columns, filterableColumns, nestedKey, filters) }];
        } else {
          return acc;
        }
      }
    }, []);
  },

  hasFilters: (currentFiltersApplied) => (filter) => {
    return (
      (filter.type === 'array' && utils.generic.isValidArray(currentFiltersApplied?.[filter.name], true)) ||
      (filter.type === 'date' && Boolean(currentFiltersApplied?.[filter.name]))
    );
  },

  // check if there is a match for the filters AND search query on any of the searchable columns
  hasMatch: (obj, columns = [], filterableColumns = [], query = '', filters = {}) => {
    const values = Object.entries(obj).reduce((acc, [key, value]) => {
      return columns.includes(key) ? [...acc, value] : acc;
    }, []);

    const isTask = Boolean(obj.taskId);
    const activeFilters = filterableColumns.filter(utilsFilters.hasFilters(filters));
    const hasActiveFilters = activeFilters?.length > 0;
    const hasSearchQuery = query?.length > 0;

    // don't search/filter on loss and claims (ONLY on tasks)
    if (!isTask) {
      return false;
    }

    // check search ONLY
    if (hasSearchQuery && !hasActiveFilters) {
      return utilsFilters.matchQuery(values, query);
    }

    // check search AND filters
    if (hasSearchQuery && hasActiveFilters) {
      return utilsFilters.matchQuery(values, query) && utilsFilters.matchFilters(activeFilters, filters, obj);
    }

    // check filters ONLY
    if (!hasSearchQuery && hasActiveFilters) {
      return utilsFilters.matchFilters(activeFilters, filters, obj);
    }
  },

  // check if any of the nested items have a match with the search query
  hasMatchDeep: (items, query, columns, filterableColumns, nestedKey, filters = {}) => {
    return items.reduce((acc, cur) => {
      const options = cur[nestedKey] || [];

      if (utilsFilters.hasMatch(cur, columns, filterableColumns, query, filters)) {
        return true;
      } else {
        return acc || utilsFilters.hasMatchDeep(options, query, columns, filterableColumns, nestedKey, filters);
      }
    }, false);
  },

  // check if any of the values matches the search query
  matchQuery: (values, query) => {
    return Boolean(query && values.some((value) => value?.toLowerCase().includes(query?.toLowerCase())));
  },

  // check if all the filters enabled match at least on one option
  matchFilters: (filtersEnabled, filters, row) => {
    return filtersEnabled.reduce((acc, { name, type }) => {
      const isArray = type === 'array';
      const isDate = type === 'date';
      const filterValue = filters?.[name];

      const isFilterMatch =
        (isArray && filterValue?.some((filterObjValue) => row?.[name]?.includes(filterObjValue?.name))) ||
        (isDate && moment(filterValue).isSame(row?.[name], 'day'));

      return acc && isFilterMatch;
    }, true);
  },
};

export default utilsFilters;
