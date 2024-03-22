import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

// app
import TaskNotesView from './TaskNotes.view';
import { MultiSelect, FormDate } from 'components';
import {
  getClaimTaskNotes,
  selectClaimTaskNotes,
  selectClaimTaskNotesPagination,
  selectClaimTaskNotesSort,
  selectClaimTaskNotesFilters,
  hideModal,
  showModal,
} from 'stores';
import { useFlexiColumns, usePagination, useSort } from 'hooks';
import * as utils from 'utils';

TaskNotes.propTypes = {
  taskObj: PropTypes.object.isRequired,
  breadcrumbs: PropTypes.array.isRequired,
};

export default function TaskNotes({ taskObj, breadcrumbs }) {
  const dispatch = useDispatch();

  const users = useSelector(selectClaimTaskNotesFilters);
  const claimTaskNotes = useSelector(selectClaimTaskNotes);
  const claimTaskNotesPagination = useSelector(selectClaimTaskNotesPagination);
  const claimTaskNotesSort = useSelector(selectClaimTaskNotesSort);

  const isAddNoteDirtyRef = useRef(false);
  const [searchText, setSearchText] = useState('');

  const { taskId } = taskObj;

  useEffect(() => {
    if (taskId) {
      dispatch(getClaimTaskNotes({ taskId }));
    }
  }, [taskId]); // eslint-disable-line react-hooks/exhaustive-deps

  const searchSubmit = ({ search, filters }) => {
    setSearchText(search);
    dispatch(getClaimTaskNotes({ taskId, query: search, filters }));
  };

  const resetSubmit = () => {
    dispatch(getClaimTaskNotes({ taskId, filters: {} }));
    reset();
  };

  const sortColumn = (by, dir) => {
    dispatch(getClaimTaskNotes({ taskId, sortBy: by, direction: dir, query: searchText }));
  };

  const changePage = (newPage) => {
    dispatch(getClaimTaskNotes({ taskId, page: newPage, query: searchText }));
  };

  const changeRowsPerPage = (rowsPerPage) => {
    dispatch(getClaimTaskNotes({ taskId, size: rowsPerPage, query: searchText }));
  };

  const setIsAddNoteFormDirty = (isDirty) => {
    isAddNoteDirtyRef.current = isDirty;
  };

  const cancelNoteConfirm = (modalType) => {
    if (isAddNoteDirtyRef.current) {
      dispatch(
        showModal({
          component: 'CONFIRM',
          props: {
            title: utils.string.t('navigation.form.subtitle'),
            hint: utils.string.t('navigation.form.title'),
            fullWidth: true,
            maxWidth: 'xs',
            componentProps: {
              cancelLabel: utils.string.t('app.no'),
              confirmLabel: utils.string.t('app.yes'),
              submitHandler: () => {
                dispatch(hideModal(modalType));
              },
            },
          },
        })
      );
    } else {
      dispatch(hideModal(modalType));
    }
  };

  const addNote = () => {
    dispatch(
      showModal({
        component: 'ADD_CLAIM_TASK_NOTE',
        props: {
          fullWidth: true,
          maxWidth: 'sm',
          title: 'claims.notes.addNote',
          componentProps: {
            taskObj,
            breadcrumbs,
            setIsDirty: setIsAddNoteFormDirty,
            confirmHandler: () => cancelNoteConfirm('ADD_CLAIM_TASK_NOTE'),
            clickXHandler: () => {
              cancelNoteConfirm();
            },
            clickOutSideHandler: () => {
              cancelNoteConfirm();
            },
            cancelHandler: () => {
              cancelNoteConfirm();
            },
          },
        },
      })
    );
  };

  const editNote = (noteObj) => {
    dispatch(
      showModal({
        component: 'EDIT_CLAIM_TASK_NOTE',
        props: {
          fullWidth: true,
          maxWidth: 'sm',
          title: 'claims.notes.editNote',
          componentProps: {
            noteObj,
            breadcrumbs,
            setIsDirty: setIsAddNoteFormDirty,
            confirmHandler: () => cancelNoteConfirm('EDIT_CLAIM_TASK_NOTE'),
            clickXHandler: () => {
              cancelNoteConfirm();
            },
            clickOutSideHandler: () => {
              cancelNoteConfirm();
            },
            cancelHandler: () => {
              cancelNoteConfirm();
            },
          },
        },
      })
    );
  };

  const cols = [
    {
      id: 'createdDate',
      sort: { type: 'date', direction: 'desc' },
      visible: true,
      label: utils.string.t('claims.notes.columns.dateCreated'),
    },
    {
      id: 'createdByName',
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
      id: 'updatedByName',
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
          id="updatedDate"
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
      id: 'lastUpdatedBy',
      type: 'multiSelect',
      label: utils.string.t('claims.notes.columns.updatedBy'),
      value: [],
      options: users?.updatedBy,
      content: <MultiSelect id="lastUpdatedBy" search options={users?.updatedBy} />,
    },
  ];

  const { columns: columnsArray, columnProps } = useFlexiColumns(cols);
  const { cols: colsSorted, sort } = useSort(columnsArray, claimTaskNotesSort, sortColumn);
  const pagination = usePagination(claimTaskNotes, claimTaskNotesPagination, changePage, changeRowsPerPage);

  return (
    <TaskNotesView
      notes={claimTaskNotes}
      cols={colsSorted}
      columnProps={columnProps}
      filtersArray={filtersArray}
      sort={sort}
      pagination={pagination}
      handlers={{
        addNote,
        editNote,
        searchSubmit,
        resetSubmit,
      }}
    />
  );
}
