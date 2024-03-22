import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

// app
import ClaimRefAuditTrailView from './ClaimRefAuditTrail.view';
import { FormDate } from 'components';
import {
  getClaimAudits,
  resetClaimAuditsFilters,
  resetClaimAuditsItems,
  resetClaimAuditsSearch,
  selectClaimAudits,
  selectClaimAuditsPagination,
  selectClaimAuditsSort,
} from 'stores';
import { useFlexiColumns, usePagination, useSort } from 'hooks';
import * as utils from 'utils';

ClaimRefAuditTrail.propTypes = {
  claim: PropTypes.object.isRequired,
};

export default function ClaimRefAuditTrail({ claim }) {
  const dispatch = useDispatch();

  const claimAudits = useSelector(selectClaimAudits);
  const claimAuditsSort = useSelector(selectClaimAuditsSort);
  const claimAuditsPagination = useSelector(selectClaimAuditsPagination);

  const [searchText, setSearchText] = useState('');
  const [filterData, setFilterData] = useState([]);

  const { claimId } = claim;

  useEffect(() => {
    // cleanup
    return () => {
      dispatch(resetClaimAuditsSearch());
      dispatch(resetClaimAuditsFilters());
      dispatch(resetClaimAuditsItems());
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (claimId) {
      dispatch(getClaimAudits({ claimId }));
    }
  }, [claimId]); // eslint-disable-line react-hooks/exhaustive-deps

  const searchSubmit = ({ search }) => {
    setSearchText(search);
    dispatch(getClaimAudits({ claimId, query: search, filterTerm: filterData }));
  };

  const onResetFilter = () => {
    dispatch(getClaimAudits({ claimId, query: searchText, filterTerm: {} }));
    setFilterData([]);
    reset();
  };

  const onResetSearch = () => {
    dispatch(getClaimAudits({ claimId, filterTerm: filterData }));
  };

  const handleSearchFilter = ({ search, filters }) => {
    setFilterData(filters);
    dispatch(getClaimAudits({ claimId, query: search, filterTerm: filters }));
  };

  const sortColumn = (by, dir) => {
    dispatch(getClaimAudits({ claimId, sortBy: by, direction: dir, query: searchText }));
  };

  const changePage = (newPage) => {
    dispatch(getClaimAudits({ claimId, page: newPage, query: searchText }));
  };

  const changeRowsPerPage = (rowsPerPage) => {
    dispatch(getClaimAudits({ claimId, size: rowsPerPage, query: searchText }));
  };

  const cols = [
    {
      id: 'createdDate',
      sort: { type: 'date', direction: 'desc' },
      visible: true,
      label: utils.string.t('claims.audits.columns.changedDateTime'),
    },
    {
      id: 'eventName',
      sort: { type: 'lexical', direction: 'asc' },
      visible: true,
      label: utils.string.t('claims.audits.columns.event'),
    },
    {
      id: 'createdBy',
      sort: { type: 'lexical', direction: 'asc' },
      visible: true,
      label: utils.string.t('claims.audits.columns.changedBy'),
    },
    {
      id: 'oldValue',
      sort: { type: 'lexical', direction: 'asc' },
      visible: true,
      label: utils.string.t('claims.audits.columns.oldValue'),
    },
    {
      id: 'newValue',
      sort: { type: 'date', direction: 'asc' },
      visible: true,
      label: utils.string.t('claims.audits.columns.newValue'),
    },
  ];

  const defaultFormFields = [
    {
      name: 'createdDate',
      type: 'datepicker',
      value: null,
    },
  ];

  const defaultValues = utils.form.getInitialValues(defaultFormFields);
  const { control, reset } = useForm({ defaultValues });

  const filtersArray = [
    {
      id: 'createdDate',
      type: 'datepicker',
      label: utils.string.t('claims.audits.columns.changedDateTime'),
      value: '',
      content: (
        <FormDate
          control={control}
          {...utils.form.getFieldProps(defaultFormFields, 'createdDate')}
          id="datepicker"
          label={''}
          plainText
          plainTextIcon
          placeholder={utils.string.t('app.selectDate')}
          muiComponentProps={{
            fullWidth: false,
            margin: 'dense',
          }}
          muiPickerProps={{
            clearable: false,
            variant: 'inline',
            format: 'DD-MM-YYYY',
          }}
        />
      ),
    },
  ];

  const { columns: columnsArray, columnProps } = useFlexiColumns(cols);
  const { cols: colsSorted, sort } = useSort(columnsArray, claimAuditsSort, sortColumn);
  const pagination = usePagination(claimAudits, claimAuditsPagination, changePage, changeRowsPerPage);

  return (
    <ClaimRefAuditTrailView
      audits={claimAudits}
      cols={colsSorted}
      columnProps={columnProps}
      filtersArray={filtersArray}
      sort={sort}
      pagination={pagination}
      handlers={{
        searchSubmit,
        onResetSearch,
        onResetFilter,
        handleSearchFilter,
      }}
    />
  );
}
