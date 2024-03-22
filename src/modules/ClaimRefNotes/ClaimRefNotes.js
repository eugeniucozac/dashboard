import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

// app
import ClaimRefNotesView from './ClaimRefNotes.view';
import { MultiSelect, FormDate } from 'components';
import {
  getClaimNotes,
  resetClaimNotes,
  selectClaimNotes,
  selectClaimNotesFilters,
  selectClaimNotesQuery,
  selectClaimNotesPagination,
  selectClaimNotesSort,
  showModal,
} from 'stores';
import { useFlexiColumns, usePagination, useSort } from 'hooks';
import * as utils from 'utils';

ClaimRefNotes.propTypes = {
  claim: PropTypes.object.isRequired,
};

export default function ClaimRefNotes({ claim }) {
  const dispatch = useDispatch();
  const { claimId, processState } = claim;
  const claimNotes = useSelector(selectClaimNotes);
  const users = useSelector(selectClaimNotesFilters);
  const claimNotesQuery = useSelector(selectClaimNotesQuery);
  const claimNotesPagination = useSelector(selectClaimNotesPagination);
  const claimNotesSort = useSelector(selectClaimNotesSort);

  const [searchText, setSearchText] = useState('');
  const [resetKey, setResetKey] = useState();

  useEffect(() => {
    if (claimId) {
      dispatch(getClaimNotes({ claimId }));
    }

    // cleanup
    return () => {
      dispatch(resetClaimNotes());
    };
  }, [claimId]); // eslint-disable-line react-hooks/exhaustive-deps

  const addNote = () => {
    dispatch(
      showModal({
        component: 'ADD_EDIT_CLAIM_REF_NOTES',
        props: {
          title: utils.string.t('claims.notes.addNote'),
          fullWidth: true,
          maxWidth: 'sm',
          disableAutoFocus: true,
          componentProps: { claim },
        },
      })
    );
  };

  const editNote = (note) => {
    dispatch(
      showModal({
        component: 'EDIT_CLAIMREF_NOTES_ROW',
        props: {
          title: utils.string.t('claims.notes.editNote'),
          fullWidth: true,
          hideCompOnBlur: false,
          maxWidth: 'sm',
          disableAutoFocus: true,
          componentProps: { note, claim },
        },
      })
    );
  };

  const searchSubmit = ({ search }) => {
    setResetKey(new Date().getTime());
    reset();
    setSearchText(search);
    dispatch(getClaimNotes({ claimId, query: search }));
  };

  const handleSearchFilter = ({ filters }) => {
    dispatch(getClaimNotes({ claimId, query: searchText, filters }));
  };

  const resetSubmit = () => {
    dispatch(getClaimNotes({ claimId, filters: {} }));
    reset();
  };

  const sortColumn = (by, dir) => {
    dispatch(getClaimNotes({ claimId, sortBy: by, direction: dir, query: searchText }));
  };

  const changePage = (newPage) => {
    dispatch(getClaimNotes({ claimId, page: newPage, query: searchText }));
  };

  const changeRowsPerPage = (rowsPerPage) => {
    dispatch(getClaimNotes({ claimId, size: rowsPerPage, query: searchText }));
  };

  const cols = [
    {
      id: 'createdDate',
      sort: { type: 'date', direction: 'desc' },
      visible: true,
      label: utils.string.t('claims.notes.columns.dateCreated'),
    },
    {
      id: 'createdBy',
      sort: { type: 'lexical', direction: 'asc' },
      visible: true,
      label: utils.string.t('claims.notes.columns.createdBy'),
    },
    {
      id: 'notesDescription',
      sort: { type: 'lexical', direction: 'asc' },
      visible: true,
      label: utils.string.t('claims.notes.columns.detail'),
    },
    {
      id: 'updatedDate',
      sort: { type: 'date', direction: 'asc' },
      visible: true,
      label: utils.string.t('claims.notes.columns.dateUpdated'),
    },
    {
      id: 'updatedBy',
      sort: { type: 'lexical', direction: 'asc' },
      visible: true,
      label: utils.string.t('claims.notes.columns.updatedBy'),
    },
    { id: 'menu', menu: true, visible: true },
  ];

  const dateFields = [
    {
      name: 'createdDate',
      type: 'datepicker',
      value: null,
    },
    {
      name: 'updatedDate',
      type: 'datepicker',
      value: null,
    },
  ];

  const defaultValues = utils.form.getInitialValues(dateFields);
  const { control, reset } = useForm({ defaultValues });

  const filtersArray = [
    {
      id: 'createdDate',
      type: 'datepicker',
      label: utils.string.t('claims.notes.tableFilters.dateCreated'),
      value: '',
      content: (
        <FormDate
          control={control}
          {...utils.form.getFieldProps(dateFields, 'createdDate')}
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
    {
      id: 'createdBy',
      type: 'multiSelect',
      label: utils.string.t('claims.notes.columns.createdBy'),
      value: [],
      options: users?.createdBy,
      content: <MultiSelect id="createdBy" search options={users?.createdBy} />,
    },
    {
      id: 'updatedDate',
      type: 'datepicker',
      label: utils.string.t('claims.notes.tableFilters.lastUpdatedDate'),
      value: '',
      content: (
        <FormDate
          control={control}
          {...utils.form.getFieldProps(dateFields, 'updatedDate')}
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
    {
      id: 'updatedBy',
      type: 'multiSelect',
      label: utils.string.t('claims.notes.columns.updatedBy'),
      value: [],
      options: users?.updatedBy,
      content: <MultiSelect id="updatedBy" search options={users?.updatedBy} />,
    },
  ];

  const { columns: columnsArray, columnProps } = useFlexiColumns(cols);
  const { cols: colsSorted, sort } = useSort(columnsArray, claimNotesSort, sortColumn);
  const pagination = usePagination(claimNotes, claimNotesPagination, changePage, changeRowsPerPage);

  return (
    <ClaimRefNotesView
      notes={claimNotes}
      cols={colsSorted}
      columnProps={columnProps}
      filtersArray={filtersArray}
      sort={sort}
      pagination={pagination}
      query={claimNotesQuery}
      claimStatus={processState}
      resetKey={resetKey}
      handlers={{
        addNote,
        editNote,
        searchSubmit,
        resetSubmit,
        handleSearchFilter,
      }}
    />
  );
}
