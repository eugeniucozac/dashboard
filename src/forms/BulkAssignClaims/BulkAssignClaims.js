import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// app
import { BulkAssignClaimsView } from './BulkAssignClaims.view';
import { Loader } from 'components';
import {
  bulkAssignClaims,
  getClaimsProcessing,
  getUsersByOrg,
  resetClaimsAssignedToUsers,
  selectClaimsAssignedToUsers,
  selectClaimsProcessingPagination,
  selectUserOrganisation,
  showModal,
} from 'stores';
import { useFormActions } from 'hooks';
import * as constants from 'consts';
import * as utils from 'utils';

// mui
import { Box } from '@material-ui/core';

BulkAssignClaims.propTypes = {
  claimsProcessingSelected: PropTypes.array.isRequired,
  claimsType: PropTypes.string,
  setIsDirty: PropTypes.func,
  handleClose: PropTypes.func.isRequired,
};

export default function BulkAssignClaims({ claimsProcessingSelected: claims, claimsType, setIsDirty, handleClose }) {
  const dispatch = useDispatch();

  const userOrganisation = useSelector(selectUserOrganisation);
  const claimsPagination = useSelector(selectClaimsProcessingPagination);
  const assignToUsersObj = useSelector(selectClaimsAssignedToUsers);
  const assignToUsersType = assignToUsersObj?.type;
  const assignToUsersItems = assignToUsersObj?.items || [];
  const assignToUsersLoaded = assignToUsersObj?.loaded;
  const teamOptions = Object.values(constants.ORGANIZATIONS) || [];
  const unassignedUser = { id: 'unassigned', fullName: utils.string.t('claims.processing.bulkAssign.unassigned') };
  const [resetKey, setResetKey] = useState();

  const fields = [
    {
      name: 'team',
      type: 'autocompletemui',
      label: utils.string.t('claims.processing.bulkAssign.fields.team.label'),
      value: teamOptions?.find((team) => team.id === userOrganisation.id) || null,
      options: teamOptions,
      optionKey: 'name',
      disabled: true,
      validation: Yup.object().required(utils.string.t('validation.required')),
    },
    {
      name: 'assignTo',
      type: 'autocompletemui',
      label: `${utils.string.t('claims.processing.bulkAssign.fields.assignTo.label')} *`,
      value: null,
      options: [unassignedUser, ...assignToUsersItems],
      optionKey: 'id',
      optionLabel: 'fullName',
      validation: Yup.object()
        .nullable()
        .required(utils.string.t('validation.required'))
        .test('assignTo', utils.string.t('claims.processing.bulkAssign.validation.newAssignee'), function () {
          return defaultValues.assignTo?.id !== this.options.parent.assignTo?.id;
        }),
    },
    {
      name: 'notes',
      type: 'textarea',
      label: `${utils.string.t('claims.processing.bulkAssign.fields.notes.label')} *`,
      value: '',
      muiComponentProps: {
        multiline: true,
        rows: 3,
        rowsMax: 6,
      },
      validation: Yup.string()
        .min(1, utils.string.t('validation.required'))
        .max(1000, utils.string.t('validation.string.max'))
        .required(utils.string.t('validation.required')),
    },
  ];

  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);

  const { control, watch, errors, handleSubmit, formState } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  const formValues = watch();
  const formIsDirty = formState.isDirty;

  const actions = [
    {
      name: 'cancel',
      label: utils.string.t('app.cancel'),
      handler: () => {
        if (formIsDirty) {
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
                    handleClose();
                  },
                },
              },
            })
          );
        } else {
          handleClose();
        }
      },
    },
    {
      name: 'submit',
      label: utils.string.t('app.assign'),
      handler: (values) => {
        onSubmit(values);
      },
    },
  ];

  const { cancel, submit } = useFormActions(actions);

  useEffect(() => {
    if (
      assignToUsersType !== 'bulkAssignClaims' ||
      (assignToUsersType === 'bulkAssignClaims' && utils.generic.isInvalidOrEmptyArray(assignToUsersItems))
    ) {
      dispatch(resetClaimsAssignedToUsers());

      dispatch(getUsersByOrg(userOrganisation.name, claims, 'bulkAssignClaims', false));
    }
    setResetKey(new Date().getTime());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setIsDirty(formIsDirty);
  }, [formValues]); // eslint-disable-line react-hooks/exhaustive-deps

  const isDataReady = () => {
    return assignToUsersLoaded && utils.generic.isValidArray(assignToUsersObj?.items);
  };

  const onSubmit = (values) => {
    dispatch(bulkAssignClaims(claims, teamOptions, values)).then(() => {
      // fetch the claims list again to update the re-assigned claims
      dispatch(getClaimsProcessing({ requestType: constants.CLAIM_PROCESSING_REQ_TYPES.search, claimsType, page: claimsPagination?.page }));
    });
  };

  // data is still loading...
  if (!isDataReady()) {
    return (
      <Box height="300px">
        <Loader visible absolute />
      </Box>
    );
  }

  // data is ready
  return (
    <BulkAssignClaimsView
      fields={fields}
      buttons={{ cancel, submit }}
      formProps={{ control, errors, handleSubmit, formState }}
      resetKey={resetKey}
    />
  );
}
