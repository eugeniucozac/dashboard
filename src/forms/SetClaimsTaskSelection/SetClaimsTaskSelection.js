import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import * as constants from 'consts';

//app
import { SetClaimsTaskSelectionView } from './SetClaimsTaskSelection.view';
import {
  hideModal,
  selectReopenTaskList,
  selectPriorities,
  getReOpenTaskLists,
  editReOpenedClaimTask,
  getClaimsProcessing,
  getPriorityLevels,
} from 'stores';
import * as utils from 'utils';

SetClaimsTaskSelection.propTypes = {
  claim: PropTypes.object,
};

export default function SetClaimsTaskSelection({ claim }) {
  const dispatch = useDispatch();
  const tasks = useSelector(selectReopenTaskList) || [];
  const priorities = useSelector(selectPriorities);
  const claimsType = constants.CLAIM_TEAM_TYPE.myClaims;
  const searchBy = constants.CLAIMS_SEARCH_OPTION_CLAIM_REF;

  const fields = [
    {
      name: 'processID',
      type: 'hidden',
      value: claim?.processID,
    },
    {
      name: 'taskSelection',
      type: 'select',
      options: tasks || [],
      defaultValue: tasks?.find((item) => claim?.tasks === item?.taskLabel) || '',
      optionKey: 'taskListID',
      optionLabel: 'taskLabel',
      validation: Yup.string().required(utils.string.t('validation.required')),
    },
  ];

  const actions = [
    {
      name: 'cancel',
      label: utils.string.t('app.exit'),
      handler: () => {
        dispatch(hideModal());
      },
    },
    {
      name: 'submit',
      label: utils.string.t('app.save'),
      handler: (value) => {
        const selectedObj = tasks?.find((item) => item.taskListID === value.taskSelection);
        dispatch(editReOpenedClaimTask(selectedObj, value, priorities)).then((data) => {
          if (data?.response?.status === constants.API_RESPONSE_SUCCESS_STATUS) {
            dispatch(
              getClaimsProcessing({
                requestType: constants.CLAIM_PROCESSING_REQ_TYPES.search,
                claimsType,
                term: '',
                filterTerm: [],
                searchBy,
                pullClosedRecords: 'false',
              })
            );
          }
        });
        dispatch(hideModal());
      },
    },
  ];

  useEffect(
    () => {
      if (utils.generic.isInvalidOrEmptyArray(priorities)) {
        dispatch(getPriorityLevels());
      }
      if (utils.generic.isInvalidOrEmptyArray(tasks)) {
        dispatch(getReOpenTaskLists());
      }
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return <SetClaimsTaskSelectionView actions={actions} fields={fields} />;
}
