import React from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import get from 'lodash/get';

//app
import PremiumProcessingCaseNotesView from './PremiumProcessingCaseNotes.view';
import * as utils from 'utils';
import styles from './PremiumProcessingCaseNotes.styles';
import * as constants from 'consts';
import { selectCaseTaskTypeView } from 'stores';

// mui
import { makeStyles } from '@material-ui/core';

PremiumProcessingCaseNotes.propTypes = {
  taskId: PropTypes.string.isRequired,
  caseDetailsObject: PropTypes.object,
};

export default function PremiumProcessingCaseNotes({ taskId, caseDetailsObject }) {
  const classes = makeStyles(styles, { name: 'PremiumProcessingCaseNotes' })();
  const caseStages = caseDetailsObject?.caseStageDetails;
  const isUnassignedStage = caseStages?.some((cs) => ['UA'].includes(cs.bpmStageCode) && cs.active);
  const bpmStageName = useSelector((state) => get(state, 'referenceData.bpmStages')) || [];
  const caseTaskTypeView = useSelector(selectCaseTaskTypeView);

  const isMyTeam = caseTaskTypeView === constants.TASK_TEAM_TYPE.myTeam;
  const isTaskHistory = caseTaskTypeView === constants.TASK_TEAM_TYPE.taskHistory;

  if (!taskId) {
    return null;
  }

  const fields = [
    {
      name: 'notesField',
      type: 'textarea',
      value: '',
      validation: Yup.string().required(),
      label: utils.string.t('placement.form.notes.label'),
      fullWidth: true,
      muiComponentProps: {
        multiline: true,
        rows: 3,
        rowsMax: 6,
        disabled: isUnassignedStage || isMyTeam || isTaskHistory,
        classes: {
          root: classes.noteTextWidth,
        },
        inputProps: {
          maxLength: 2000,
        },
      },
    },
  ];

  return (
    <>
      <PremiumProcessingCaseNotesView
        taskId={taskId}
        caseNotesHistory={caseDetailsObject?.caseNotes?.notesHistory}
        fields={fields}
        bpmStageName={bpmStageName}
      />
    </>
  );
}
