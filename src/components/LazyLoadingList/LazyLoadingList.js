import React, { useState } from 'react';
import PropTypes from 'prop-types';

// app
import { LazyLoadingListView } from './LazyLoadingList.view';
import * as utils from 'utils';

LazyLoadingList.propTypes = {
    id: PropTypes.string.isRequired,
    isSearch: PropTypes.bool,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
    values: PropTypes.array,
    placeholder: PropTypes.string,
    handlers: PropTypes.shape({
        toggleOption: PropTypes.func,
    }),
    isDataLoading: PropTypes.bool,
    isDataLoadingError: PropTypes.bool,
    searchQueryValue: PropTypes.string,
}


LazyLoadingList.defaultProps = {
    max: 0,
    options: [],
    values: [],
    labels: {},
    handlers: {},
    nestedClasses: {},
}

export default function LazyLoadingList({ id, options, searchQueryValue, values, placeholder, handlers, ...props }) {

    const field = {
        name: `lazy-select-search-${id}`,
        placeholder: placeholder || '',
        defaultValue: '',
        onChange: (value) => {
            handlers.onSearchQuery(value ? value.trim() : '');
            return value;
        },
        muiComponentProps: {
            autoComplete: 'off',
        },
    };

    const onClear = (reset) => (event) => {
        handlers.clearSearchQuery()
        reset();
    };

    const onToggleOption = (item) => {
        if (utils.generic.isFunction(handlers.toggleOption)) {
            handlers.toggleOption(id, item);
        }
    };

    return <LazyLoadingListView
        id={`lazy-select-${id}`}
        field={field}
        query={searchQueryValue}
        options={options}
        selectedItems={values}
        handlers={{
            onClear,
            onToggleOption,
        }}{...props} />
}