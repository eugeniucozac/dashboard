import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';

import { ConfirmRFISubmissionView } from './ConfirmRFISubmission.view';
import * as utils from 'utils';
import { selectCreateRfiInfo, selectPriorities, selectCreateRFIDocs, selectClaimsAssignedToUsers } from 'stores';
import config from 'config';
import { REMINDER_VALUES } from 'consts';

export default function ConfirmRFISubmission(props) {
  const createRfiInfo = useSelector(selectCreateRfiInfo);
  const priorities = useSelector(selectPriorities).find(({ id }) => id.toString() === createRfiInfo.priority)?.description;
  const rfiDocs = useSelector(selectCreateRFIDocs);
  const selectAssignees = useSelector(selectClaimsAssignedToUsers);
  const selectedUserFullName = selectAssignees?.items?.filter((user) => user?.email === createRfiInfo?.sendToUser)[0]?.fullName;

  const reminder = REMINDER_VALUES.find(({ id }) => id === createRfiInfo.reminderDate)?.name;
  const rfiInfo = [
    { title: utils.string.t('claims.processing.taskDetailsLabels.claimRef'), value: createRfiInfo.claimRef },
    { title: utils.string.t('claims.columns.createRFIColumns.queryCode'), value: createRfiInfo.queryCodeDescription },
    { title: utils.string.t('claims.columns.createRFIColumns.priority'), value: priorities },
    { title: utils.string.t('claims.columns.createRFIColumns.sendTo'), value: selectedUserFullName },
    { title: utils.string.t('claims.processing.taskDetailsLabels.taskRef'), value: createRfiInfo.taskRef },
    { title: utils.string.t('claims.processing.taskDetailsLabels.description'), value: createRfiInfo.description, fullWidth: true },
  ];
  const diariseInfo = [
    {
      title: utils.string.t('claims.processing.taskDetailsLabels.targetDueDate'),
      value: new moment(createRfiInfo.targetDueDate).format(config.ui.format.date.text),
    },
    { title: utils.string.t('claims.processing.taskDetailsLabels.reminder'), value: reminder },
  ];
  return <ConfirmRFISubmissionView {...props} rfiInfo={rfiInfo} diariseInfo={diariseInfo} rfiDocs={rfiDocs} />;
}
