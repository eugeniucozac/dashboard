import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

// app
import LossNotesView from './LossNotes.view';
import { MultiSelect, FormDate } from 'components';
import {
  getClaimNotes,
  getCaseIncidentDetails,
  resetClaimNotes,
  selectClaimNotes,
  selectClaimNotesFilters,
  selectClaimNotesQuery,
  selectClaimNotesPagination,
  selectClaimNotesSort,
  selectRefDataNewProcessType,
  selectCaseIncidentDetails,
  showModal,
} from 'stores';
import { useFlexiColumns, usePagination, useSort } from 'hooks';
import * as utils from 'utils';
import { CLAIM_LOSS_PROCESS_TYPE_NAME } from 'consts';

LossNotes.propTypes = {
  lossObj: PropTypes.object.isRequired,
};

export default function LossNotes({ lossObj }) {
  const dispatch = useDispatch();
  const { lossDetailId } = lossObj;
  const claimNotes = useSelector(selectClaimNotes);
  const users = useSelector(selectClaimNotesFilters);
  const claimNotesQuery = useSelector(selectClaimNotesQuery);
  const claimNotesPagination = useSelector(selectClaimNotesPagination);
  const claimNotesSort = useSelector(selectClaimNotesSort);
  const processTypes = useSelector(selectRefDataNewProcessType);
  const lossCaseIncidentData = useSelector(selectCaseIncidentDetails);

  const [searchText, setSearchText] = useState('');
  const [resetKey, setResetKey] = useState();
  const processTypeData = processTypes?.find((item) => item?.processTypeDetails === CLAIM_LOSS_PROCESS_TYPE_NAME) || null;

  useEffect(() => {
    if (lossDetailId && processTypeData) {
      dispatch(
        getCaseIncidentDetails({
          processTypeId: processTypeData?.processTypeID,
          referenceId: lossDetailId,
          showError: false,
        })
      ).then((res) => {
        if (res) {
          dispatch(getClaimNotes({ caseIncidentID: res?.caseIncidentID }));
        }
      });
    }

    // cleanup
    return () => {
      dispatch(resetClaimNotes());
    };
  }, [lossDetailId]); // eslint-disable-line react-hooks/exhaustive-deps

  const addNote = () => {
    dispatch(
      showModal({
        component: 'ADD_LOSS_NOTES',
        props: {
          title: utils.string.t('claims.notes.addNote'),
          fullWidth: true,
          maxWidth: 'sm',
          disableAutoFocus: true,
          componentProps: { lossObj, processTypeData },
        },
      })
    );
  };

  const editNote = (note) => {
    dispatch(
      showModal({
        component: 'EDIT_LOSS_NOTES_ROW',
        props: {
          title: utils.string.t('claims.notes.editNote'),
          fullWidth: true,
          hideCompOnBlur: false,
          maxWidth: 'sm',
          disableAutoFocus: true,
          componentProps: { note },
        },
      })
    );
  };

  const searchSubmit = ({ search }) => {
    setResetKey(new Date().getTime());
    reset();
    setSearchText(search);
    dispatch(getClaimNotes({ caseIncidentID: lossCaseIncidentData?.caseIncidentID, query: search }));
  };

  const handleSearchFilter = ({ filters }) => {
    dispatch(getClaimNotes({ caseIncidentID: lossCaseIncidentData?.caseIncidentID, query: searchText, filters }));
  };

  const resetSubmit = () => {
    dispatch(getClaimNotes({ caseIncidentID: lossCaseIncidentData?.caseIncidentID, filters: {} }));
    reset();
  };

  const sortColumn = (by, dir) => {
    dispatch(getClaimNotes({ caseIncidentID: lossCaseIncidentData?.caseIncidentID, sortBy: by, direction: dir, query: searchText }));
  };

  const changePage = (newPage) => {
    dispatch(getClaimNotes({ caseIncidentID: lossCaseIncidentData?.caseIncidentID, page: newPage, query: searchText }));
  };

  const changeRowsPerPage = (rowsPerPage) => {
    dispatch(getClaimNotes({ caseIncidentID: lossCaseIncidentData?.caseIncidentID, size: rowsPerPage, query: searchText }));
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
    <LossNotesView
      notes={claimNotes}
      cols={colsSorted}
      columnProps={columnProps}
      filtersArray={filtersArray}
      sort={sort}
      pagination={pagination}
      query={claimNotesQuery}
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
