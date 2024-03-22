import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import uniq from 'lodash/uniq';

// app
import { ChangeComplexityPriorityAssignmentView } from './ChangeComplexityPriorityAssignment.view';
import { Loader } from 'components';
import {
  getClaimsBasicInformation,
  getComplexityTypes,
  getComplexityValues,
  getPriorityLevels,
  getUsersByOrg,
  resetComplexityBasisValues,
  selectClaimsAssignedToUsers,
  selectComplexityTypes,
  selectComplexityTypesLoaded,
  selectComplexityValues,
  selectComplexityValuesLoaded,
  selectPriorities,
  selectPrioritiesLoaded,
  selectUserOrganisation,
  selectClaimsInformation,
  hideModal,
  showModal,
  enqueueNotification,
  updateClaim,
} from 'stores';
import { useFormActions } from 'hooks';
import * as constants from 'consts';
import * as utils from 'utils';

// mui
import { Box } from '@material-ui/core';

ChangeComplexityPriorityAssignment.propTypes = {
  claims: PropTypes.array.isRequired,
  setIsDirty: PropTypes.func,
  handleClose: PropTypes.func.isRequired,
};

export default function ChangeComplexityPriorityAssignment({ claims, setIsDirty, handleClose }) {
  const dispatch = useDispatch();

  const userOrganisation = useSelector(selectUserOrganisation);
  const complexitiesBasisValues = useSelector(selectComplexityValues) || [];
  const complexitiesBasisValuesLoaded = useSelector(selectComplexityValuesLoaded);
  const complexityTypes = useSelector(selectComplexityTypes) || [];
  const complexityTypesLoaded = useSelector(selectComplexityTypesLoaded);
  const assignToUsersObj = useSelector(selectClaimsAssignedToUsers);
  const priorities = useSelector(selectPriorities);
  const prioritiesLoaded = useSelector(selectPrioritiesLoaded);
  const singleClaimDetails = useSelector(selectClaimsInformation);

  const teams = Object.values(constants.ORGANIZATIONS) || [];
  const assignToUsersItems = assignToUsersObj?.items || [];
  const assignToUsersLoaded = assignToUsersObj?.loaded;
  const isMissingComplexitiesBasis = complexitiesBasisValuesLoaded && utils.generic.isInvalidOrEmptyArray(complexitiesBasisValues);
  const isAllClaimsComplexityUnsure = claims.every((claim) => claim.complexity === constants.CLAIM_COMPLEXITY_UNSURE);
  const isSingleClaim = claims?.length === 1;

  const [isSameTeamAssignTo, setSameTeamAssignTo] = useState(false);
  const isCrossTeamAssignTo = !isSameTeamAssignTo;
  const [isComplexityBasisAvailable, setIsComplexityBasisAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBasicDetailLoaded, setIsBasicDetailLoaded] = useState(!isSingleClaim);

  const singleClaim = {
    ...claims?.[0],
    complexityValueID: singleClaimDetails?.complexityValueID,
    complexityBasis: singleClaimDetails?.complexityBasis,
  };

  const getAssignedUser = () => {
    return (
      assignToUsersItems.find((user) => {
        return claims.every((claim) => user.fullName === claim?.assignedTo);
      }) || null
    );
  };

  const getComplexity = () => {
    return (
      complexityTypes.find((type) => {
        return claims.every((claim) => type.complextityType === claim?.complexity);
      }) || null
    );
  };

  const getComplexityBasis = () => {
    if (isSingleClaim) {
      return (
        complexitiesBasisValues?.find(({ complexityRulesID }) => {
          return complexityRulesID === singleClaim.complexityValueID;
        }) || null
      );
    } else {
      return null;
    }
  };

  const getPriority = () => {
    return (
      priorities?.find((priority) => {
        return claims.every((claim) => priority?.description === claim?.priority);
      }) || null
    );
  };

  const getTeam = () => {
    return (
      teams.find((team) => {
        return claims.every((claim) => team.label === claim?.team);
      }) || null
    );
  };

  const getTeamBy = (prop, label) => {
    return teams?.find((team) => team[prop] === label) || null;
  };

  const usersFetchRequired = Boolean(getTeam()?.label);

  const isComplexityBasisValid = Boolean(
    complexitiesBasisValuesLoaded && complexitiesBasisValues.find((v) => v.complexityRulesValue === singleClaim.complexityBasis)
  );
  const showComplexityBasisInvalidValue = Boolean(isSingleClaim && !isComplexityBasisValid);

  const fields = [
    {
      name: 'complexity',
      type: 'select',
      label: `${utils.string.t('claims.processing.bulkAssign.fields.complexityType.label')} *`,
      value: getComplexity()?.complextityType || '',
      options: isAllClaimsComplexityUnsure
        ? complexityTypes.map((item) => ({
            ...item,
            disabled: item.complextityType === constants.CLAIM_COMPLEXITY_UNSURE,
          }))
        : complexityTypes.filter((item) => item.complextityType !== constants.CLAIM_COMPLEXITY_UNSURE),
      optionKey: 'complextityType',
      optionLabel: 'complextityType',
      validation: Yup.string()
        .required(utils.string.t('validation.required'))
        .test('complexity', utils.string.t('validation.required'), function () {
          return isAllClaimsComplexityUnsure ? this.options.parent.complexity !== constants.CLAIM_COMPLEXITY_UNSURE : true;
        }),
      handleUpdate: (name, value) => {
        const complexityObj = complexityTypes.find((c) => c.complextityType === value);
        setValue('team', getTeamBy('label', complexityObj?.organizationName)?.label || '');
        setValue('assignTo', null);
        setIsComplexityBasisAvailable(complexityObj?.complextityType === constants.ORGANIZATIONS.ardonagh.complexity);
        setSameTeamAssignTo(complexityObj?.organizationName === userOrganisation?.name);
      },
    },
    {
      name: 'complexityBasis',
      type: 'autocompletemui',
      label: `${utils.string.t('claims.processing.bulkAssign.fields.complexity.label')} *`,
      value: getComplexityBasis(),
      options: isComplexityBasisAvailable && isMissingComplexitiesBasis ? [] : complexitiesBasisValues,
      optionKey: 'complexityRulesID',
      optionLabel: 'complexityRulesValue',
      placeholder: isMissingComplexitiesBasis
        ? utils.string.t('app.notAvailable')
        : showComplexityBasisInvalidValue
        ? singleClaim.complexityBasis
        : undefined,
      disabled: isMissingComplexitiesBasis,
      validation:
        isComplexityBasisAvailable &&
        Yup.object()
          .nullable()
          .required(
            utils.string.t(
              isMissingComplexitiesBasis ? 'claims.processing.bulkAssign.fields.complexity.optionsNotAvailable' : 'validation.required'
            )
          ),
    },
    {
      name: 'priority',
      type: 'select',
      label: `${utils.string.t('claims.processing.bulkAssign.fields.priority.label')} *`,
      value: getPriority()?.description || '',
      options: priorities,
      optionKey: 'description',
      optionLabel: 'description',
      validation: Yup.string().required(utils.string.t('validation.required')),
    },
    {
      name: 'priorityId',
      type: 'hidden',
      value: getPriority()?.id || '',
    },
    {
      name: 'team',
      type: 'select',
      label: `${utils.string.t('claims.processing.bulkAssign.fields.team.label')} *`,
      value: getTeam()?.label || '',
      options: teams,
      optionKey: 'label',
      optionLabel: 'label',
      validation: Yup.string().required(utils.string.t('validation.required')),
      handleUpdate: (name, value) => {
        const teamObj = getTeamBy('label', value);
        setSameTeamAssignTo(teamObj?.label === userOrganisation?.name);
      },
    },
    {
      name: 'teamId',
      type: 'hidden',
      value: getTeam()?.id || '',
    },
    {
      name: 'assignTo',
      type: 'autocompletemui',
      label: `${utils.string.t('claims.processing.bulkAssign.fields.assignTo.label')}${isSameTeamAssignTo ? ' *' : ''}`,
      value: getAssignedUser(),
      options: assignToUsersItems,
      optionKey: 'id',
      optionLabel: 'fullName',
      validation:
        isSameTeamAssignTo && Yup.object().nullable().required(utils.string.t('claims.processing.bulkAssign.validation.chooseAssignee')),
    },
    {
      name: 'notes',
      type: 'textarea',
      label: `${utils.string.t('claims.processing.bulkAssign.fields.notes.label')}${isCrossTeamAssignTo ? ' *' : ''}`,
      value: '',
      muiComponentProps: {
        multiline: true,
        minRows: 3,
        maxRows: 6,
      },
      validation:
        isCrossTeamAssignTo &&
        Yup.string()
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

  const isDataReady = () => {
    // complexity basis is handled differently
    // we display a warning next to the form field
    const complexityBasisReady = complexitiesBasisValuesLoaded;

    const complexityReady = complexityTypesLoaded && utils.generic.isValidArray(complexityTypes, true);
    const priorityReady = prioritiesLoaded && utils.generic.isValidArray(priorities, true);
    const userReady = usersFetchRequired ? assignToUsersLoaded && utils.generic.isValidArray(assignToUsersItems, true) : true;

    return isBasicDetailLoaded && priorityReady && userReady && complexityReady && complexityBasisReady;
  };

  const isDataMissing = () => {
    const allDataLoaded =
      complexityTypesLoaded && complexitiesBasisValuesLoaded && prioritiesLoaded && (usersFetchRequired ? assignToUsersLoaded : true);

    const missingComplexities = complexityTypesLoaded && utils.generic.isInvalidOrEmptyArray(complexityTypes);
    const missingPriorities = prioritiesLoaded && utils.generic.isInvalidOrEmptyArray(priorities);
    const missingUsers = usersFetchRequired ? assignToUsersLoaded && utils.generic.isInvalidOrEmptyArray(assignToUsersItems) : false;

    return allDataLoaded && (missingPriorities || missingUsers || missingComplexities);
  };

  const dataReady = isDataReady();
  const dataMissing = isDataMissing();

  const setComplexityBasisAvailability = () => {
    setIsComplexityBasisAvailable(getComplexity()?.complextityType === constants.ORGANIZATIONS.ardonagh.complexity);
  };

  const onSubmit = (values) => {
    dispatch(updateClaim(claims, values));
  };

  useEffect(() => {
    dispatch(getPriorityLevels());
    dispatch(getComplexityTypes());
    dispatch(resetComplexityBasisValues());

    if (isSingleClaim) {
      dispatch(
        getClaimsBasicInformation(singleClaim.claimId, singleClaim.claimReference, singleClaim.sourceId, singleClaim.divisionId)
      ).then(() => {
        setIsBasicDetailLoaded(true);
      });
      dispatch(getComplexityValues(singleClaim.divisionId, singleClaim.sourceId, false));
    } else {
      dispatch(
        getComplexityValues(
          null,
          null,
          false,
          uniq(
            claims.reduce((acc, { sourceId, divisionId }) => {
              return sourceId && divisionId ? [...acc, `${sourceId}-${divisionId}`] : acc;
            }, [])
          )
        )
      );
    }

    setComplexityBasisAvailability();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // fetch list of users when team is changed
  useEffect(() => {
    const teamName = formValues?.team;

    if (teamName) {
      setIsLoading(true);
      setValue('assignTo', null);

      // fetch users
      dispatch(getUsersByOrg(teamName, claims, 'bulkAssignClaims', false)).then(() => {
        setIsLoading(false);
      });
    }
  }, [formValues?.team]); // eslint-disable-line react-hooks/exhaustive-deps

  // make the form dirty if any values are changed
  useEffect(() => {
    setIsDirty(formIsDirty);
  }, [formValues]); // eslint-disable-line react-hooks/exhaustive-deps

  // populate form values when all data is ready
  useEffect(() => {
    const complexity = getComplexity();
    const team = getTeam();

    if (dataReady) {
      setComplexityBasisAvailability();
      setValue('assignTo', getAssignedUser());
      setValue('complexity', complexity?.complextityType || '');
      setValue('complexityBasis', getComplexityBasis());
      setValue('priority', getPriority()?.description || '');
      setSameTeamAssignTo(team?.label === userOrganisation?.name);
    }
  }, [dataReady]); // eslint-disable-line react-hooks/exhaustive-deps

  // hide modal and show warning if necessary data is missing
  useEffect(() => {
    if (dataMissing) {
      dispatch(hideModal());
      dispatch(enqueueNotification(utils.string.t('claims.processing.bulkAssign.notifications.data.failure'), 'warning'));
    }
  }, [dataMissing]); // eslint-disable-line react-hooks/exhaustive-deps

  // data is still loading...
  if (!dataReady) {
    return (
      <Box height="300px">
        <Loader visible absolute />
      </Box>
    );
  }

  return (
    <ChangeComplexityPriorityAssignmentView
      fields={fields}
      buttons={{ cancel, submit }}
      formProps={{ control, errors, handleSubmit, formState }}
      isComplexityBasisAvailable={isComplexityBasisAvailable}
      isLoading={isLoading}
    />
  );
}
