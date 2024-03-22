import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

// app
import { CreateEditUserView } from './CreateEditUser.view';
import { Loader } from 'components';
import {
  getRefDataDepartments,
  getRefDataGroups,
  getRefDataRoles,
  selectAdministrationRefDataDepartments,
  selectAdministrationRefDataGroups,
  selectAdministrationRefDataRoles,
  selectAdministrationRefDataOrganisations,
  selectRefDataXbInstances,
  userCreate,
  userEdit,
  selectRefDataNewBusinessProcess,
  getTeamsData,
} from 'stores';
import * as utils from 'utils';
import * as constants from 'consts';

// mui
import { Box } from '@material-ui/core';

export default function CreateEditUser({ handleClose, user = {} }) {
  const dispatch = useDispatch();

  const refDataGroups = useSelector(selectAdministrationRefDataGroups);
  const refDataRoles = useSelector(selectAdministrationRefDataRoles);
  const refDataXbInstances = useSelector(selectRefDataXbInstances);
  const refDataBusinessProcesses = useSelector(selectRefDataNewBusinessProcess);
  const refDataDepartments = useSelector(selectAdministrationRefDataDepartments);
  const refDataOrganisations = useSelector(selectAdministrationRefDataOrganisations);

  const [departmentsLoaded, setDepartmentsLoaded] = useState(false);
  const [groupsLoaded, setGroupsLoaded] = useState(false);
  const [rolesLoaded, setRolesLoaded] = useState(false);
  const [teamLoaded, setTeamLoaded] = useState(false);
  const [showGroupsBasedOnTeams, setShowGroupsBasedOnTeams] = useState([]);

  const optionsXbInstance = refDataXbInstances.filter((id) => id?.edgeSourceName?.toLowerCase() !== constants.EDGE_XB_INSTANCE?.toLowerCase());

  const isDataReady = () => {
    if (user?.id) {
      return [departmentsLoaded, groupsLoaded, rolesLoaded].every((v) => v === true);
    } else {
      return [groupsLoaded].every((v) => v === true);
    }
  };

  useEffect(
    () => {
      const groupIdsAsInt = user.groupIds?.split(',').map((strId) => parseInt(strId.trim())) || '';

      dispatch(getRefDataGroups()).then((res) => utils.generic.isValidArray(res) && setGroupsLoaded(true));
      dispatch(getRefDataDepartments(user.xbInstanceIds)).then((res) => utils.generic.isValidArray(res) && setDepartmentsLoaded(true));

      if (user?.id) {
        dispatch(getRefDataRoles(groupIdsAsInt)).then((res) => utils.generic.isValidArray(res) && setRolesLoaded(true));
      }

      dispatch(getTeamsData());
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    const claimsGroupItems = [
      utils.string.t('administration.users.create.claimGroupsList.claimsAdmin'),
      utils.string.t('administration.users.create.claimGroupsList.claimsBackOfficeMphasis'),
      utils.string.t('administration.users.create.claimGroupsList.claimsBackOfficeArdonagh'),
    ];

    if (!teamLoaded && !utils.generic.isInvalidOrEmptyArray(refDataGroups)) {
      const getGroupsDataBasedOnSelectionOfTeams = refDataGroups.filter((itm) => {
        return !claimsGroupItems.includes(itm.name);
      });
      setShowGroupsBasedOnTeams(getGroupsDataBasedOnSelectionOfTeams);
    } else {
      setShowGroupsBasedOnTeams([]);
    }
  }, [refDataGroups, teamLoaded]);

  const showClaimGroups = (id, value) => {
    const claimsGroupMphasisItems = [
      utils.string.t('administration.users.create.claimGroupsList.claimsAdmin'),
      utils.string.t('administration.users.create.claimGroupsList.claimsBackOfficeMphasis'),
    ];
    const claimsGroupArdonaghItems = [
      utils.string.t('administration.users.create.claimGroupsList.claimsAdmin'),
      utils.string.t('administration.users.create.claimGroupsList.claimsBackOfficeArdonagh'),
    ];
    if (id === 'team' && value === 1) {
      getClaimsGroupsToShow(claimsGroupMphasisItems);
    } else if (id === 'team' && value === 2) {
      getClaimsGroupsToShow(claimsGroupArdonaghItems);
    }
  };

  const getClaimsGroupsToShow = (items) => {
    const getGroupsDataBasedOnSelectionOfTeams = refDataGroups.filter((itm) => {
      return items.includes(itm.name);
    });
    setShowGroupsBasedOnTeams(getGroupsDataBasedOnSelectionOfTeams);
  };

  const onChangeGroups = (grps) => {
    const groupIds = grps.map((grp) => grp.id);

    if (isDataReady() || utils.generic.isValidArray(groupIds, true)) {
      dispatch(getRefDataRoles(groupIds));
    }
  };

  const onChangeXbInstances = (xbs) => {
    const xbIds = xbs.map((xbs) => xbs.sourceID);

    if (isDataReady() || utils.generic.isValidArray(xbIds, true)) {
      dispatch(getRefDataDepartments(xbIds));
    }
  };

  const onSubmit = (updatedUser, dirtyFields, setError) => {
    if (user.id) {
      return dispatch(userEdit(updatedUser, user.id));
    } else {
      return dispatch(userCreate(updatedUser, setError));
    }
  };

  const onCancel = () => {
    if (utils.generic.isFunction(handleClose)) {
      handleClose();
    }
  };

  const existingUsersGroups = () => {
    if (!user?.groupIds || utils.generic.isInvalidOrEmptyArray(refDataGroups)) return [];
    const userGroups = user.groupIds.split(',').map((id) => id.trim());
    return refDataGroups.filter((it) => userGroups.includes(it.id + '')) || [];
  };

  const existingUsersBusinessProcesses = () => {
    if (!user?.businessProcessIds || utils.generic.isInvalidOrEmptyArray(refDataBusinessProcesses)) return [];
    const userProcesses = user.businessProcessIds.split(',').map((id) => id.trim());
    return refDataBusinessProcesses.filter((it) => userProcesses.includes(it.businessProcessID + '')) || [];
  };

  const existingUsersDepartments = () => {
    if (!user?.departmentIds || utils.generic.isInvalidOrEmptyArray(refDataDepartments)) return [];
    const userDepts = user.departmentIds.split(',').map((id) => id.trim());
    return refDataDepartments.filter((it) => userDepts.includes(it.id + '')) || [];
  };

  const existingUsersXbInstances = () => {
    if (!user?.xbInstanceIds || utils.generic.isInvalidOrEmptyArray(refDataXbInstances)) return [];
    const userXbis = user.xbInstanceIds.split(',').map((id) => id.trim());
    return refDataXbInstances.filter((xbi) => userXbis.includes(xbi.sourceID + '')) || [];
  };

  const existingUserRole = () => {
    let roleId = refDataRoles?.filter((it) => user.roleId === it.id + '')[0]?.id;
    return roleId || '';
  };

  const getFirstname = () => {
    if (!user.fullName) return '';
    return user.fullName.trim().split(/\s+/)[0];
  };

  const getLastname = () => {
    if (!user.fullName) return '';
    // eslint-disable-next-line no-unused-vars
    const [first, ...second] = user.fullName.trim().split(/\s+/);
    return second.join(' ');
  };

  const existingUserTeam = () => {
    return (
      refDataOrganisations?.find((organisation) => {
        const userOrgId = (user?.organisationId || '').toString();
        const orgId = (organisation.id || '').toString();
        return userOrgId === orgId;
      })?.id || ''
    );
  };

  const fields = [
    {
      name: 'firstName',
      label: utils.string.t('administration.users.create.label.firstName'),
      value: getFirstname(),
      type: 'text',
      validation: Yup.string().required(utils.string.t('validation.required')).trim(),
      muiComponentProps: {
        inputProps: {
          maxLength: 30,
        },
      },
    },
    {
      name: 'lastName',
      label: utils.string.t('administration.users.create.label.lastName'),
      value: getLastname(),
      type: 'text',
      validation: Yup.string().required(utils.string.t('validation.required')).trim(),
      muiComponentProps: {
        inputProps: {
          maxLength: 30,
        },
      },
    },
    {
      name: 'emailId',
      label: utils.string.t('administration.users.create.label.email'),
      value: user.email || '',
      type: 'text',
      muiComponentProps: {
        disabled: user?.email !== undefined,
        inputProps: {
          maxLength: 60,
        },
      },
      validation: !user.email && Yup.string().email(utils.string.t('validation.email')).required(utils.string.t('validation.required')),
    },
    {
      name: 'groups',
      label: utils.string.t('administration.users.create.label.groups'),
      type: 'autocomplete',
      value: existingUsersGroups(),
      validation: Yup.array().required(utils.string.t('validation.required')),
      options: showGroupsBasedOnTeams,
      optionKey: 'id',
      optionLabel: 'name',
      muiComponentProps: { 'data-testid': 'groups' },
      innerComponentProps: { allowEmpty: true, isMulti: true, maxMenuHeight: 120 },
    },
    {
      name: 'role',
      label: utils.string.t('admin.form.role.label'),
      value: existingUserRole(),
      type: 'select',
      muiComponentProps: {
        'data-testid': 'role',
        disabled: !refDataRoles || refDataRoles.length === 0,
      },
      options: refDataRoles,
      optionKey: 'id',
      optionLabel: 'name',
      validation: Yup.string().required(utils.string.t('validation.required')),
    },
    {
      name: 'businessProcesses',
      label: utils.string.t('administration.users.create.label.businessProcess'),
      type: 'autocomplete',
      value: existingUsersBusinessProcesses(),
      options: refDataBusinessProcesses,
      optionKey: 'businessProcessID',
      optionLabel: 'businessProcessName',
      validation: Yup.array().required(utils.string.t('validation.required')),
      muiComponentProps: { 'data-testid': 'businessProcesses' },
      innerComponentProps: { allowEmpty: true, isMulti: true, maxMenuHeight: 120 },
    },
    {
      name: 'team',
      label: utils.string.t('administration.users.create.label.team'),
      type: 'select',
      value: existingUserTeam(),
      options: teamLoaded ? refDataOrganisations : [],
      optionKey: 'id',
      optionLabel: 'name',
      muiComponentProps: {
        disabled: !teamLoaded,
      },
      validation: teamLoaded && Yup.string().required(utils.string.t('validation.required')),
    },
    {
      name: 'xbInstances',
      label: utils.string.t('administration.users.create.label.xbInstance'),
      type: 'autocomplete',
      value: existingUsersXbInstances(),
      options: optionsXbInstance,
      optionKey: 'sourceID',
      optionLabel: 'sourceName',
      validation: Yup.array().required(utils.string.t('validation.required')),
      muiComponentProps: { 'data-testid': 'xbInstance' },
      innerComponentProps: { allowEmpty: true, isMulti: true, maxMenuHeight: 120 },
    },
    {
      name: 'departments',
      label: utils.string.t('administration.users.create.label.department'),
      type: 'autocomplete',
      value: existingUsersDepartments(),
      options: refDataDepartments,
      optionKey: 'id',
      optionLabel: 'name',
      validation: Yup.array()
        .required(utils.string.t('validation.required'))
        .test('departments', utils.string.t('administration.users.create.validation.departmentsXbInstances'), function (value) {
          const xbInstances = this?.parent?.xbInstances || [];
          const xbInstancesIds = xbInstances.map((xbi) => xbi.sourceID + '');

          const departments = value || [];
          const departmentsXbInstancesIds = departments
            .map((dept) => {
              const deptId = dept?.id || '';
              const deptIdParts = deptId.split('-') || [];
              return deptIdParts[1];
            })
            .filter(Boolean);

          // if xbInstance hasn't been selected yet, ignore further validation
          if (utils.generic.isInvalidOrEmptyArray(xbInstancesIds)) return true;

          // if departments hasn't been selected yet, form is not valid
          if (utils.generic.isInvalidOrEmptyArray(departmentsXbInstancesIds)) return false;

          // check if all XB Instances have at least one department selected
          return xbInstancesIds.every((xbId) => departmentsXbInstancesIds.includes(xbId));
        }),
      muiComponentProps: {
        disabled: !(refDataDepartments?.length > 0),
        'data-testid': 'department',
      },
      innerComponentProps: { allowEmpty: true, isMulti: true, maxMenuHeight: 120 },
    },
  ];

  const actions = [
    {
      name: 'submit',
      label: user.id ? utils.string.t('app.save') : utils.string.t('app.create'),
      handler: onSubmit,
    },
    {
      name: 'cancel',
      label: utils.string.t('app.cancel'),
      handler: onCancel,
    },
  ];

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
    <CreateEditUserView
      actions={actions}
      fields={fields}
      onChangeGroups={onChangeGroups}
      onChangeXbInstances={onChangeXbInstances}
      setTeamLoaded={setTeamLoaded}
      user={user}
      showClaimGroups={showClaimGroups}
    />
  );
}
