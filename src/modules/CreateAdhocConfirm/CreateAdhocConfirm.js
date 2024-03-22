import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';

//app
import CreateAdhocConfirmView from './CreateAdhocConfirm.view';
import {
  hideModal,
  condirmAdHocTask,
  selectAdhocTaskDocuments,
  selectAdhocTaskData,
  selectPriorities,
  selectClaimsAssignedToUsers,
} from 'stores';
import config from 'config';
import * as utils from 'utils';

CreateAdhocConfirm.propTypes = {
  reminderList: PropTypes.array.isRequired,
  claim: PropTypes.object.isRequired,
};
CreateAdhocConfirm.defaultProps = {
  reminderList: [],
  claim: {},
};
function CreateAdhocConfirm(props) {
  const dispatch = useDispatch();

  const taskDetails = useSelector(selectAdhocTaskData);
  const priorities = useSelector(selectPriorities);
  const users = useSelector(selectClaimsAssignedToUsers);
  const adhocDocuments = useSelector(selectAdhocTaskDocuments);

  const { reminderList, claim } = props;

  const assignedTo = users?.items?.find(({ email }) => email?.toLowerCase() === taskDetails?.sendToUser?.toLowerCase())?.fullName;
  const adHocTaskInfo = {
    rowOne: [
      {
        title: utils.string.t('claims.processing.taskDetailsLabels.claimRef'),
        value: claim?.claimReference,
      },
      {
        title: utils.string.t('claims.processing.taskDetailsLabels.taskRef'),
        value: taskDetails?.taskRef,
      },
      {
        title: utils.string.t('claims.processing.taskDetailsLabels.taskName'),
        value: taskDetails?.name,
      },
      {
        title: utils.string.t('claims.processing.taskDetailsLabels.priority'),
        value: priorities?.find(({ id }) => id === taskDetails?.priority)?.description,
      },
    ],
    rowTwo: [
      {
        title: utils.string.t('claims.processing.taskDetailsLabels.team'),
        value: taskDetails?.sendToTeam,
      },
      {
        title: utils.string.t('claims.processing.taskDetailsLabels.assignedTo'),
        value: assignedTo,
      },
    ],
    rowThree: [
      {
        title: utils.string.t('claims.processing.taskDetailsLabels.description'),
        value: taskDetails?.description,
      },
    ],
    rowDiarise: [
      {
        title: utils.string.t('claims.processing.taskDetailsLabels.targetDueDate'),
        value: taskDetails?.dueDate ? moment(taskDetails?.dueDate).utcOffset(0).format(config.ui.format.date.text) : '',
      },
      {
        title: utils.string.t('claims.processing.taskDetailsLabels.reminder'),
        value: reminderList?.find(({ id }) => taskDetails?.reminder === id)?.name,
      },
    ],
  };

  const submitTask = () => {
    const confirmActionPayload = {
      bpmProcessId: taskDetails?.processInstanceId,
      sendToTeam: taskDetails?.sendToTeam,
      sendToUser: taskDetails?.sendToUser,
    };
    dispatch(condirmAdHocTask(confirmActionPayload, taskDetails?.id)).then((response) => {
      if (response?.status === 'OK') {
        dispatch(hideModal());
      }
    });
  };

  return <CreateAdhocConfirmView {...props} adHocTaskInfo={adHocTaskInfo} submitTask={submitTask} adhocDocuments={adhocDocuments} />;
}

export default CreateAdhocConfirm;
