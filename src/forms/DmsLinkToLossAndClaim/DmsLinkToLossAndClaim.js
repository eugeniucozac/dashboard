import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';

// app
import DmsLinkToLossAndClaimView from './DmsLinkToLossAndClaim.view';
import { linkMultipleDmsDocuments, hideModal } from 'stores';
import * as constants from 'consts';
import * as utils from 'utils';

DmsLinkToLossAndClaim.propTypes = {
  docData: PropTypes.array.isRequired,
  resetToDefaultValues: PropTypes.func.isRequired,
  canLinkToTask: PropTypes.bool,
  parentRefs: PropTypes.object.isRequired
};

export default function DmsLinkToLossAndClaim({ docData, resetToDefaultValues, canLinkToTask, parentRefs }) {
  const dispatch = useDispatch();

  const confirmDocumentlink = (docs, formValues = '') => {
    const requestParams = [];
    if (formValues?.linkToLoss) {
      const lossParams = docs?.map((d) => {
        return {
          documentId: d.documentId,
          referenceId: parentRefs?.lossRef,
          sectionType: constants.DMS_CONTEXT_LOSS,
        };
      });
      requestParams?.push(...lossParams);
    }
    if (formValues?.linkToClaim) {
      const claimParams = docs?.map((d) => {
        return {
          documentId: d.documentId,
          referenceId: parentRefs?.claimRef,
          sectionType: constants.DMS_CONTEXT_CLAIM,
        };
      });
      requestParams?.push(...claimParams);
    }
    if (formValues?.linkToTask) {
      const taskParams = docs?.map((d) => {
        return {
          documentId: d.documentId,
          referenceId: parentRefs?.taskId,
          sectionType: constants.DMS_CONTEXT_TASK,
        };
      });
      requestParams?.push(...taskParams);
    }

    if (!utils.generic.isInvalidOrEmptyArray(requestParams)) {
      dispatch(linkMultipleDmsDocuments(requestParams)).then((response) => {
        if (response?.status === constants.API_RESPONSE_OK) {
          resetToDefaultValues();
          dispatch(hideModal('DMS_LINK_TO_LOSS_AND_CLAIM'));
        }
      });
    }
  };

  const handleLinkTo = (formValues) => {
    if (docData?.isLinked) {
      return;
    }
    confirmDocumentlink(docData, formValues);
  };

  const fields = [
    {
      name: 'linkToLoss',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'linkToClaim',
      type: 'checkbox',
      defaultValue: false,
    },
    ...(canLinkToTask ? [{
      name: 'linkToTask',
      type: 'checkbox',
      defaultValue: false,
    }] : []),
  ];

  const actions = [
    {
      name: 'secondary',
      label: utils.string.t('app.cancel'),
      handler: () => {
        dispatch(hideModal('DMS_LINK_TO_LOSS_AND_CLAIM'));
      },
    },
    {
      name: 'submit',
      label: utils.string.t('app.link'),
      handler: (values) => {
        handleLinkTo(values);
      },
    },
  ];

  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);
  const { control, reset, handleSubmit, formState } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  return (
    <DmsLinkToLossAndClaimView
      fields={fields}
      control={control}
      actions={actions}
      reset={reset}
      handleSubmit={handleSubmit}
      formState={formState}
      canLinkToTask={canLinkToTask}
    />
  );
}
