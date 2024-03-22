import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// app
import { SingleAssignClaimView } from './SingleAssignClaim.view';
import { Loader } from 'components';
import {
  getClaimsProcessing,
  getComplexityTypes,
  getComplexityValues,
  singleAssignClaim,
  getUsersByOrg,
  resetClaimsAssignedToUsers,
  resetComplexityBasisValues,
  selectComplexityBasisValues,
  selectComplexityTypes,
  selectClaimsAssignedToUsers,
  selectClaimsProcessingPagination,
  selectUserOrganisation,
  selectComplexityValues,
  showModal,
} from 'stores';
import { useFormActions } from 'hooks';
import * as constants from 'consts';
import * as utils from 'utils';

// mui
import { Box } from '@material-ui/core';

SingleAssignClaim.propTypes = {
  claimsProcessingSelected: PropTypes.array.isRequired,
  claimsType: PropTypes.string,
  setIsDirty: PropTypes.func,
  handleClose: PropTypes.func.isRequired,
};

export default function SingleAssignClaim({ claimsProcessingSelected: claims, claimsType, setIsDirty, handleClose }) {
  const dispatch = useDispatch();

  const userOrganisation = useSelector(selectUserOrganisation);
  const userIsMphasis = userOrganisation?.id === constants.ORGANIZATIONS.mphasis.id;
  const userIsArdonagh = userOrganisation?.id === constants.ORGANIZATIONS.ardonagh.id;
  const complexitiesValues = useSelector(selectComplexityValues) || [];
  const complexityTypes = useSelector(selectComplexityTypes) || [];
  const complexitiesValuesType = useSelector(selectComplexityBasisValues)?.type;
  const claimsPagination = useSelector(selectClaimsProcessingPagination);
  const assignToUsersObj = useSelector(selectClaimsAssignedToUsers);
  const assignToUsersType = assignToUsersObj?.type;
  const assignToUsersItems = assignToUsersObj?.items || [];
  const assignToUsersLoaded = assignToUsersObj?.loaded;
  const [isAssignToDisabled, setIsAssignToDisabled] = useState(false);
  const [isComplexityAvailable, setIsComplexityAvailable] = useState(false);

  // if single claim, find the assigned user
  // if multiple claims (bulk), find the assigned user if it's the same user for all claims
  const assignedUser = (users) => {
    return users.find((user) => user.fullName === claims?.[0].assignedTo) || null;
  };

  // find the assigned complexity
  const assignedComplexity = (complexity) => {
    return complexity.find((complex) => complex.complextityType === claims?.[0]?.complexity) || null;
  };

  const assignedComplexityBasis = (complexitiesValues) =>
    complexitiesValues?.find((item) => item?.complexityRulesID === claims?.[0]?.complexityValueID) || null;

  const fields = [
    {
      name: 'complexity',
      type: 'autocompletemui',
      label: `${utils.string.t('claims.processing.bulkAssign.fields.complexityType.label')} *`,
      value: assignedComplexity(complexityTypes),
      options: claims?.[0]?.complexity !== 'Unsure' ? complexityTypes.filter((item) => item.complextityType !== 'Unsure') : complexityTypes,
      optionKey: 'complextityType',
      optionLabel: 'complextityType',
      validation: Yup.object().nullable().required(utils.string.t('validation.required')),
      callback: (event, value) => {
        setValue('team', value?.organizationName);
        setIsAssignToDisabled(
          (userIsArdonagh && value?.complextityType === constants.ORGANIZATIONS.mphasis.complexity) ||
            (userIsMphasis && value?.complextityType === constants.ORGANIZATIONS.ardonagh.complexity)
        );
        setIsComplexityAvailable(value?.complextityType === constants.ORGANIZATIONS.ardonagh.complexity);
      },
    },
    {
      name: 'complexityBasis',
      type: 'autocompletemui',
      label: `${utils.string.t('claims.processing.bulkAssign.fields.complexity.label')} *`,
      value: assignedComplexityBasis(complexitiesValues),
      options: complexitiesValues,
      optionKey: 'complexityRulesID',
      optionLabel: 'complexityRulesValue',
      validation: isComplexityAvailable && Yup.object().nullable().required(utils.string.t('validation.required')),
    },
    {
      name: 'team',
      type: 'text',
      label: `${utils.string.t('claims.processing.bulkAssign.fields.team.label')} *`,
      value: claims?.[0]?.team || '',
      muiComponentProps: {
        disabled: true,
      },
    },
    {
      name: 'assignTo',
      type: 'autocompletemui',
      label: `${utils.string.t('claims.processing.bulkAssign.fields.assignTo.label')} *`,
      value: assignedUser(assignToUsersItems),
      options: assignToUsersItems,
      optionKey: 'id',
      optionLabel: 'fullName',
      validation: Yup.object()
        .nullable()
        .when('assignToUnassigned', {
          is: (val) => val,
          then: Yup.object().nullable(),
          otherwise: Yup.object().nullable().required(utils.string.t('validation.required')),
        })
        .test('assignTo', utils.string.t('claims.processing.bulkAssign.validation.newAssignee'), function () {
          return isAssignToDisabled ? true : defaultValues.assignTo?.id !== this.options.parent.assignTo?.id;
        }),
    },
    {
      name: 'assignToUnassigned',
      type: 'text',
      label: `${utils.string.t('claims.processing.bulkAssign.fields.assignTo.label')} *`,
      value: utils.string.t('claims.processing.bulkAssign.unassigned'),
      muiComponentProps: {
        disabled: true,
      },
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

  const { control, watch, errors, setValue, handleSubmit, formState } = useForm({
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
    if (assignToUsersType !== 'bulkAssignClaims') {
      dispatch(resetClaimsAssignedToUsers());

      dispatch(getUsersByOrg(userOrganisation.name, claims, 'bulkAssignClaims', false));
      dispatch(getComplexityTypes());
    }

    // reset previously loaded partial list of complexity values
    // then fetch all the values using "size" 1000 because we want all the options
    if (
      complexitiesValuesType !== 'bulkAssignClaims' ||
      (complexitiesValuesType === 'bulkAssignClaims' && utils.generic.isInvalidOrEmptyArray(complexitiesValues))
    ) {
      dispatch(resetComplexityBasisValues());

      dispatch(getComplexityValues(claims?.[0].divisionID, claims?.[0].sourceId, false));
    }
    setIsAssignToDisabled(
      (userIsArdonagh && claims?.[0]?.team === constants.ORGANIZATIONS.mphasis.label) ||
        (userIsMphasis && claims?.[0]?.team === constants.ORGANIZATIONS.ardonagh.label)
    );
    setIsComplexityAvailable(claims?.[0]?.complexity === constants.ORGANIZATIONS.ardonagh.complexity);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setIsDirty(formIsDirty);
  }, [formValues]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setValue('assignTo', assignedUser(assignToUsersItems));
    setValue('complexity', assignedComplexity(complexityTypes));
    setValue('complexityBasis', assignedComplexityBasis(complexitiesValues));
  }, [assignToUsersItems, complexityTypes, complexitiesValues]); // eslint-disable-line react-hooks/exhaustive-deps

  const isDataReady = () => {
    return assignToUsersLoaded && utils.generic.isValidArray(assignToUsersItems);
  };

  const onSubmit = (values) => {
    dispatch(singleAssignClaim(claims, values)).then(() => {
      // fetch the claims list again to remove the re-assigned claims
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
    <SingleAssignClaimView
      fields={fields}
      buttons={{ cancel, submit }}
      formProps={{ control, errors, handleSubmit, formState }}
      isAssignToDisabled={isAssignToDisabled}
      isComplexityAvailable={isComplexityAvailable}
    />
  );
}
