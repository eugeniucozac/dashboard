import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import uniqBy from 'lodash/uniqBy';

// app
import { AddAssigneeView } from './AddAssignee.view';
import {
  hideModal,
  selectClaimsAssignedToUsers,
  getUsersByOrg,
  postSaveTaskProcessingAssignees,
  resetClaimsAssignedToUsers,
  getAssignedToUsersList,
  selectAssignedToUsers,
  postAssignToUser,
} from 'stores';
import * as utils from 'utils';
import { useFormActions } from 'hooks';
import * as constants from 'consts';

AddAssignee.propTypes = {
  taskDetails: PropTypes.array.isRequired,
  submitHandler: PropTypes.func.isRequired,
  isPremiumProcessing: PropTypes.bool,
};

export default function AddAssignee({ isPremiumProcessing, taskDetails, submitHandler }) {
  const dispatch = useDispatch();
  const newTeam = taskDetails[0]?.team || constants.ORGANIZATIONS.mphasis.name;
  const selectAssignees = useSelector(selectClaimsAssignedToUsers);

  const allAssignees = selectAssignees?.items;
  const hasOrgChanged = selectAssignees?.orgName !== newTeam;
  const assignedToUsersList = useSelector(selectAssignedToUsers);
  const isAssignedToUserList = utils.generic.isValidArray(assignedToUsersList, true);
  const [assigneeList, setAssigneeList] = useState(allAssignees);
  const [additionalAssigneeList, setAdditionalAssigneeList] = useState([]);
  const [assigneeResetKey, setAssigneeResetKey] = useState();
  const [resetKey, setResetKey] = useState();
  const additionalAssigneeOptions = [{ id: -1, fullName: '', email: '' }, ...additionalAssigneeList];
  const [ppAssigneUserList, setPPAssigneUserList] = useState([]);

  const [isDefaultAssignee, setIsDefaultAssignee] = useState(false);
  const [isDefaultAddAssignee, setIsDefaultAddAssignee] = useState(false);
  const [isAddAssigneeSelected, setIsAddAssigneeSelected] = useState(false);
  const [addAssigneeDetails, setAddAssigneeDetails] = useState({});

  const getCurrentAssignee = () => {
    if (utils.generic.isValidArray(taskDetails, true) && taskDetails[0]?.assignee 
      && taskDetails[0]?.assigneeFullName && !isDefaultAssignee)
      setIsDefaultAssignee(true);
      return {id: -1, email: taskDetails[0]?.assignee, fullName: taskDetails[0]?.assigneeFullName};
  }

  const getCurrentAdditionalAssignee = () => {
    if (utils.generic.isValidArray(taskDetails, true) && taskDetails[0]?.additionalAssigneeFullName &&
      taskDetails[0]?.additionalAssignee && !isDefaultAddAssignee) {
      setIsDefaultAddAssignee(true);
      return {id: -1, fullName: taskDetails[0]?.additionalAssigneeFullName, email: taskDetails[0]?.additionalAssignee};
    }
    else if (isAddAssigneeSelected && addAssigneeDetails?.email) {
      return {id: addAssigneeDetails?.id, email: addAssigneeDetails?.email, fullName: addAssigneeDetails?.fullName};
    }
  }

  const fields = [
    {
      name: 'addAssignee',
      type: 'autocompletemui',
      optionKey: 'email',
      optionLabel: 'fullName',
      options: isPremiumProcessing && utils.generic.isValidArray(ppAssigneUserList, true) ? ppAssigneUserList : assigneeList || [],
      value: !isPremiumProcessing && !isDefaultAssignee ? getCurrentAssignee() : null,
      validation: Yup.object().nullable().required(utils.string.t('validation.required')),
      callback: (event, data) => {
        setIsAddAssigneeSelected(true);
      }
    },
    ...(!isPremiumProcessing
      ? [
          {
            name: 'addAdditionalAssignee',
            type: 'autocompletemui',
            value: !isPremiumProcessing && !isDefaultAddAssignee ? getCurrentAdditionalAssignee() : null,
            optionKey: 'email',
            optionLabel: 'fullName',
            options: additionalAssigneeOptions,
            callback: (event, data) => {
              setAddAssigneeDetails(data);
            }
          },
        ]
      : []),
  ];

  const actions = [
    {
      name: 'cancel',
      label: utils.string.t('app.cancel'),
      handler: () => hideModal(),
    },
    {
      name: 'submit',
      label: utils.string.t('app.assign'),
      handler: async ({ addAssignee, addAdditionalAssignee }) => {
        if (!isPremiumProcessing) {
          const addAssigneesRequest = taskDetails.map((eachTask) => {
            return {
              additionalAssignee: addAdditionalAssignee?.email,
              assignTo: addAssignee?.email,
              processId: eachTask.processId,
              taskId: eachTask.taskId,
            };
          });
          await dispatch(postSaveTaskProcessingAssignees(addAssigneesRequest));
          if (submitHandler) {
            submitHandler({ addAssignee, addAdditionalAssignee });
          }
        } else {
          if (taskDetails) {
            let assignList =
              utils.generic.isValidArray(ppAssigneUserList, true) &&
              ppAssigneUserList.filter((a) => a.emailId === addAssignee?.emailId && a.fullName === addAssignee?.fullName);
            const response = await dispatch(postAssignToUser({ userDetails: assignList, rowDetails: taskDetails }));
            if (response && response?.status === constants.API_RESPONSE_OK) {
              const premiumProcessingSaveAssigneeResponse = response;
              if (submitHandler) {
                submitHandler({ addAssignee, addAdditionalAssignee, premiumProcessingSaveAssigneeResponse });
              }
            }
          }
        }
      },
    },
  ];

  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);

  const { control, errors, watch, handleSubmit } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  const assigneeField = watch('addAssignee');
  const additionalAssigneeField = watch('addAdditionalAssignee');

  const { cancel, submit } = useFormActions(actions);

  const cancelModal = () => {
     dispatch(hideModal());
  };

  const createEligibleList = (allList, existingAssignees) => {
    const result = utils.generic.isValidArray(existingAssignees, true)
      ? allList.filter(({ email }) => existingAssignees.indexOf(email.toLowerCase()) === -1)
      : allList;
    return result;
  };

  useEffect(() => {
    if (isPremiumProcessing) {
      if (!isAssignedToUserList) {
        dispatch(getAssignedToUsersList());
      }
    } else {
      dispatch(resetClaimsAssignedToUsers());
      if (hasOrgChanged) {
        dispatch(getUsersByOrg(newTeam, taskDetails, 'addAssignee'));
      }
      setAssigneeResetKey(new Date().getTime());
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isAssignedToUserList) {
      if (utils.generic.isValidArray(taskDetails, true)) {
        const usersList = assignedToUsersList.filter(
          (item) => item.xbInstanceId === taskDetails[0]?.xbInstanceId && item.departmentId === taskDetails[0]?.departmentID
        );
        setPPAssigneUserList(uniqBy(usersList, 'userId'));
      }
    }
  }, [taskDetails, isAssignedToUserList]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isPremiumProcessing) {
      const existingAssignees =
        utils.generic.isValidArray(taskDetails, true) && taskDetails.map((eachTask) => eachTask?.assignee?.toLowerCase());
      if (utils.generic.isValidArray(allAssignees, true)) {
        setAssigneeList(allAssignees);
      }
      if (assigneeField?.email) {
        setAdditionalAssigneeList(createEligibleList(allAssignees, [...existingAssignees, assigneeField?.email?.toLowerCase()]));
      }
      setResetKey(new Date().getTime());
    }
  }, [allAssignees, assigneeField]); // eslint-disable-line react-hooks/exhaustive-deps

  const checkAssignBtnStatus = () => {
    if (isPremiumProcessing && !assigneeField?.emailId) {
      return true;
    }
    else if (!isPremiumProcessing) {
      if ((!additionalAssigneeField || !additionalAssigneeField.email) && (assigneeField?.email === taskDetails[0]?.assignee)) {
        return true;
      }
      else if ((!assigneeField && additionalAssigneeField && !additionalAssigneeField?.email) || 
            (!assigneeField && additionalAssigneeField?.email === taskDetails[0]?.additionalAssignee)) {
        return true;
      }
      else if ((assigneeField?.email === taskDetails[0]?.assignee) && 
            (additionalAssigneeField?.email === taskDetails[0]?.additionalAssignee)) {
        return true;
      }
      else if (assigneeField?.email === additionalAssigneeField?.email) {
        return true;
      }
    }
    return false;
  }

  return (
    <AddAssigneeView
      fields={fields}
      assignBtnStatus={checkAssignBtnStatus()}
      control={control}
      errors={errors}
      assigneeResetKey={assigneeResetKey}
      resetKey={resetKey}
      isPremiumProcessing={isPremiumProcessing}
      actions={{
        submit,
        cancel,
      }}
      handlers={{
        submit: handleSubmit,
        cancel: cancelModal,
      }}
    />
  );
}
