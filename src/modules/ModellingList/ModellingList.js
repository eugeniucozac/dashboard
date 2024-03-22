import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import PropTypes from 'prop-types';

// app
import { ModellingListView } from './ModellingList.view';
import { getModellingList, resetModellingList, selectModellingList, showModal, selectModellingTask, selectPlacement } from 'stores';
import { usePagination } from 'hooks';
import * as constants from 'consts';

ModellingList.propTypes = {
  displayAutocomplete: PropTypes.bool,
};

export function ModellingList({ displayAutocomplete }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const modellingTask = useSelector(selectModellingTask) || {};
  const modellingList = useSelector(selectModellingList) || {};
  const selectedPlacement = useSelector(selectPlacement) || {};
  const paginationObj = {
    page: modellingList.page - 1,
    rowsTotal: modellingList.itemsTotal,
    rowsPerPage: modellingList.pageSize,
  };

  useEffect(
    () => {
      dispatch(getModellingList(id));
      return () => dispatch(resetModellingList());
    },
    [modellingTask] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleChangePage = (newPage) => {
    dispatch(getModellingList(id, { page: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (rowsPerPage) => {
    dispatch(getModellingList(id, { size: rowsPerPage }));
  };

  const handleCreateModelTask = () => {
    dispatch(
      showModal({
        component: 'MODELLING_TASK',
        props: {
          title: 'placement.modelling.create',
          maxWidth: 'md',
          fullWidth: true,
          disableAutoFocus: true,
          componentProps: {
            insureds: selectedPlacement.insureds,
            displayAutocomplete,
          },
        },
      })
    );
  };

  const handleUpdateModellingTask = (modellingTask) => {
    dispatch(
      showModal({
        component: 'MODELLING_TASK',
        props: {
          title: 'placement.modelling.update',
          maxWidth: 'md',
          fullWidth: true,
          disableAutoFocus: true,
          componentProps: {
            modellingTask,
            insureds: selectedPlacement.insureds,
            displayAutocomplete,
          },
        },
      })
    );
  };

  const pagination = usePagination(modellingList.items, paginationObj, handleChangePage, handleChangeRowsPerPage);

  const popoverActions = [
    {
      id: 'edit-modelling-task',
      label: 'placement.modelling.editDetails',
      callback: ({ modellingTask }) => handleUpdateModellingTask(modellingTask),
    },
    {
      id: 'add-documents',
      label: 'placement.modelling.addDocument',
      callback: ({ modellingTask }) => handleUploadDocument(modellingTask),
    },
  ];

  const handleUploadDocument = (modellingTask) => {
    dispatch(
      showModal({
        component: 'DOCUMENT_UPLOAD',
        props: {
          title: 'documents.upload.modal.title',
          fullWidth: true,
          maxWidth: 'sm',
          disableAutoFocus: true,
          componentProps: {
            documentType: constants.FOLDER_MODELLING,
            documentTypeId: modellingTask.id,
          },
        },
      })
    );
  };

  return (
    <ModellingListView
      placementId={selectedPlacement.id}
      modellingList={modellingList.items}
      sort={{
        by: modellingList.sortBy,
        type: modellingList.sortType,
        direction: modellingList.sortDirection,
      }}
      popoverActions={popoverActions}
      pagination={pagination.obj}
      handleChangePage={pagination.handlers.handleChangePage}
      handleChangeRowsPerPage={pagination.handlers.handleChangeRowsPerPage}
      handleCreateModelTask={handleCreateModelTask}
    />
  );
}

export default ModellingList;
