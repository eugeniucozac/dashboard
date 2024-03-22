import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LazyLoadingList } from 'components';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';
import { Box } from '@material-ui/core';

export default {
    title: 'LazyLoadingList',
    component: LazyLoadingList,
    decorators: [withKnobs],
};

export const Default = () => {
    const [pageNumber, setPageNumber] = useState(1)
    const [searchQueryValue, setSearchQueryValue] = useState('')
    const observer = useRef()
    const [values, setValues] = useState([]);

    const [loading, setLoading] = useState(true)
    const [hasMore, setHasMore] = useState(false)
    let totalRecords = text('Total Records', 100)
    let height = number('Box Height', 300);
    let rowPerPage = text('Rows Per Page', 10)
    const options = Array(totalRecords)
        .fill()
        .map((val, idx) => {
            return {
                id: idx, name: idx.toString()
            }
        });
    const [lazyListOptions, setlazyListOptions] = useState([])
    const paginateData = (items, current_page, per_page_items) => {
        let page = current_page || 1,
            per_page = per_page_items || 10,
            offset = (page - 1) * per_page,

            paginatedItems = items.slice(offset).slice(0, per_page_items),
            total_pages = Math.ceil(items.length / per_page);

        return {
            page: page,
            per_page: per_page,
            pre_page: page - 1 ? page - 1 : null,
            next_page: (total_pages > page) ? page + 1 : null,
            total: items.length,
            total_pages: total_pages,
            data: paginatedItems
        };
    }

    useEffect(() => {
        const getLazyList = (query, pageNum) => {
            setLoading(true)
            setTimeout(() => {
                const resp = paginateData(options, pageNum, rowPerPage)
                if (query) {
                    setlazyListOptions(resp?.data)
                } else {
                    setlazyListOptions(prev => {
                        return [...prev, ...resp?.data]
                    })
                }
                setHasMore(resp.total_pages > resp.page)
                setLoading(false)
            }, 2000);
        }
        getLazyList(searchQueryValue, pageNumber)
    }, [pageNumber, searchQueryValue])


    const lastElementReference = useCallback(element => {
        if (loading) return
        if (observer.current) {
            observer.current.disconnect()
        }
        observer.current = new IntersectionObserver(entry => {
            if (entry[0]?.isIntersecting && hasMore) {
                setPageNumber(prevPage => prevPage + 1)
                console.log('Visiable')
            }
        })
        if (element) observer?.current?.observe(element)
    }, [loading, hasMore])

    const itemsSelected = (field, value) => {
        if (value) {
            const isValueAlreadySelected = values.some((i) => i.id === value.id);
            setValues(isValueAlreadySelected ? values.filter((i) => i.id !== value.id) : [...values, value]);
        }
    };
    const onSearchQuery = (value) => {
        setSearchQueryValue(value)
    }
    const clearSearchQuery = () => {
        setSearchQueryValue('')
    }

    return <Box height={height} width={'100%'}>
        <LazyLoadingList
            id="lazy-list-storie"
            isSearch={boolean('Search', true)}
            options={lazyListOptions}
            isDataLoading={loading}
            isDataLoadingError={false}
            values={values}
            placeholder={'Select Items'}
            lastElementReference={lastElementReference}
            searchQueryValue={searchQueryValue}
            handlers={{
                toggleOption: itemsSelected,
                onSearchQuery: onSearchQuery,
                clearSearchQuery: clearSearchQuery
            }} />
    </Box>
};
