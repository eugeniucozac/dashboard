import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// app
import styles from './PremiumProcessingTasks.styles';
import { Layout, SectionHeader, Translate, Summary, Warning } from 'components';
import { PremiumProcessingSummary, TasksManagement } from 'modules';
import { selectCasesListType, selectPremiumProcessingCasesSelected, selectCaseTaskTypeView } from 'stores';
import * as constants from 'consts';
import * as utils from 'utils';

// mui
import { makeStyles, Box } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';

PremiumProcessingTasksView.propTypes = {
  technicians: PropTypes.array,
  technicianAssigning: PropTypes.bool,
  userRoleDetails: PropTypes.array.isRequired,
  handleAssignedUserToCase: PropTypes.func,
};

export function PremiumProcessingTasksView({ handleAssignedUserToCase }) {
  const classes = makeStyles(styles, { name: 'PremiumProcessingTasks' })();

  const tabViewType = useSelector(selectCasesListType);
  const caseTaskTypeView = useSelector(selectCaseTaskTypeView);
  let type =
    caseTaskTypeView === 'myTask'
      ? constants.WORKLIST
      : caseTaskTypeView === 'myTeam'
      ? constants.WORKBASKET
      : caseTaskTypeView === 'taskHistory'
      ? constants.ALL_CASES
      : tabViewType;

  const premiumProcessSelectedTaskList = useSelector(selectPremiumProcessingCasesSelected);

  const saveAssignee = (data) => {
    handleAssignedUserToCase(data);
  };

  return (
    <Layout extensiveScreen hideScrollBar showDesktopControls testid="premium-processing">
      <Layout main>
        <SectionHeader
          nestedClasses={{ root: classes.header }}
          title={<Translate label="Premium Processing" />}
          icon={StarIcon}
          testid="premium-processing"
        />
        <Box pt={4}>
          <TasksManagement isPremiumProcessing premiumProcessingSaveAssigneeDetails={saveAssignee} />
        </Box>
      </Layout>

      <Layout sidebar padding={false}>
        {premiumProcessSelectedTaskList?.length === 1 ? (
          <PremiumProcessingSummary type={type} />
        ) : premiumProcessSelectedTaskList?.length === 0 ? (
          <Summary title={utils.string.t('premiumProcessing.cases')} testid="case-empty">
            <Box p={5}>
              <Warning type="info" text={utils.string.t('premiumProcessing.noCaseSelected')} size="large" icon />
            </Box>
          </Summary>
        ) : (
          <Summary title={utils.string.t('premiumProcessing.cases')} testid="case-empty">
            <Box p={5}>
              <Warning type="info" text={utils.string.t('premiumProcessing.casesMultiple')} size="large" icon />
            </Box>
          </Summary>
        )}
      </Layout>
    </Layout>
  );
}
