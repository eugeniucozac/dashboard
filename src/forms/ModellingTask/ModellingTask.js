import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import isEmpty from 'lodash/isEmpty';

// app
import { ModellingTaskView } from './ModellingTask.view';
import {
  createModellingTask,
  updateModellingTask,
  getReferenceDataByType,
  resetCreateModellingFlag,
  selectModellingCreateFlag,
  selectModellingTask,
} from 'stores';
import * as utils from 'utils';
import * as constants from 'consts';

export default function ModellingTask({ handleClose, insureds = [], modellingTask = {}, displayAutocomplete = false }) {
  const isNew = isEmpty(modellingTask);
  const [modellingTypeValue, setModellingTypeValue] = useState(modellingTask?.type || '');
  const createdModellingTask = useSelector(selectModellingTask);
  const createdModellingTaskFlag = useSelector(selectModellingCreateFlag);
  const dispatch = useDispatch();
  const selectedTypes = !isNew && modellingTask?.modellingAttachmentTypes;

  useEffect(
    () => {
      return () => dispatch(resetCreateModellingFlag());
    },
    [createdModellingTaskFlag] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const validateFileType = (modellingTypeValue, fileTypeValue) => {
    if (!isEmpty(modellingTypeValue)) {
      if (!isNew && selectedTypes && selectedTypes.length !== 2) {
        if (fileTypeValue && utils.placement.checkAllTruthyValues(fileTypeValue)) {
          return false;
        }
        return true;
      }
      if (!isNew && fileTypeValue && !utils.placement.checkAllTruthyValues(fileTypeValue)) {
        return true;
      }
      if (isNew && (!fileTypeValue || !utils.placement.checkAllTruthyValues(fileTypeValue))) {
        return true;
      }
    }
    return false;
  };

  const handleCancel = () => {
    if (utils.generic.isFunction(handleClose)) {
      handleClose();
    }
  };
  const handleRadioChange = (event) => {
    setModellingTypeValue(event.target.value);
  };

  const handleSubmit = async (changes) => {
    const modellingTypes = [];
    for (const key in changes?.fileType) {
      if (changes?.fileType[key] === true) {
        modellingTypes.push({
          modellingAttachmentTypeKey: key,
        });
      }
    }
    const task = { ...modellingTask, ...changes, modellingAttachmentTypes: modellingTypes };

    if (task.id) {
      return dispatch(updateModellingTask(task));
    } else {
      return dispatch(createModellingTask(task));
    }
  };

  const autoComplete = {
    value: modellingTask && modellingTask.insured ? [modellingTask.insured] : [],
    type: 'autocomplete',
    options: [],
    innerComponentProps: {
      allowEmpty: true,
      isClearable: true,
      maxMenuHeight: 200,
      isCreatable: true,
      async: {
        handler: (type, term) => dispatch(getReferenceDataByType(type, term)),
        type: 'insured',
      },
    },
  };

  const fields = [
    ...(isNew
      ? [
          {
            gridSize: { xs: 6 },
            type: 'hidden',
            name: 'status',
            value: 'PENDING',
          },
        ]
      : [
          {
            gridSize: { xs: 6 },
            type: 'select',
            name: 'status',
            value: modellingTask.status || '',
            options: [
              { id: 'PENDING', label: utils.string.t('status.pending') },
              { id: 'IN PROGRESS', label: utils.string.t('status.inprogress') },
              { id: 'DONE', label: utils.string.t('status.done') },
            ],
            label: utils.string.t('app.status'),
            optionKey: 'id',
            optionLabel: 'label',
            muiComponentProps: {
              fullWidth: true,
            },
            validation: Yup.string().required(utils.string.t('form.status.required')),
          },
        ]),
    {
      type: 'autocomplete',
      name: 'insured',
      value: insureds?.length && modellingTask?.insured ? [modellingTask.insured] : insureds?.length === 1 ? [insureds[0]] : [],
      options: insureds,
      label: utils.string.t('placement.modelling.insured'),
      optionKey: 'id',
      optionLabel: 'name',
      muiComponentProps: {
        fullWidth: true,
      },
      validation: Yup.array().min(1, utils.string.t('form.insured.required')),
      ...(displayAutocomplete && autoComplete),
    },

    {
      name: 'modellingType',
      type: 'radio',
      title: utils.string.t('placement.modelling.modellingType.title'),
      value: modellingTask.type || '',
      validation: Yup.string().nullable().required(utils.string.t('validation.required')),
      options: [
        {
          label: utils.string.t('placement.modelling.modellingType.typeQuoting'),
          value: constants.MODELLING_QUOTING,
        },
        {
          label: utils.string.t('placement.modelling.modellingType.typeBound'),
          value: constants.MODELLING_BOUND,
        },
      ],
      muiComponentProps: {
        size: 'small',
        onChange: handleRadioChange,
      },
    },
    {
      type: 'datepicker',
      name: 'dueDate',
      label: utils.string.t('placement.modelling.dueDate'),
      value: modellingTask.dueDate || null,
      muiComponentProps: {
        fullWidth: true,
      },
      validation: Yup.string().nullable().required(utils.string.t('form.date.required')),
    },
    {
      name: 'fileType',
      type: 'checkbox',
      value: modellingTask.fileType || false,
      options: utils.placement.renderFileTypeOptions(modellingTypeValue, isNew, isNew ? [] : modellingTask?.modellingAttachmentTypes),
    },

    {
      type: 'textarea',
      name: 'notes',
      label: utils.string.t('placement.modelling.notes'),
      value: modellingTask.notes || '',
      muiComponentProps: {
        multiline: true,
        minRows: 3,
        maxRows: 6,
      },
    },
  ];

  const actions = [
    {
      name: 'submit',
      label: modellingTask.id ? utils.string.t('app.save') : utils.string.t('app.create'),
      handler: handleSubmit,
    },
    {
      name: 'cancel',
      label: utils.string.t('app.cancel'),
      handler: handleCancel,
    },
  ];

  return (
    <ModellingTaskView
      createdModellingTask={createdModellingTask}
      actions={actions}
      fields={fields}
      isNew={isNew}
      validateFileType={validateFileType}
    />
  );
}
