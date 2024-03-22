import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import classnames from 'classnames';

// app
import { Breadcrumb, Layout, PopoverMenu, SectionHeader, Tabs, PreventNavigation } from 'components';
import { TaskDetails, TaskNotes, ClaimsUploadViewSearchDocs, ClaimsProcessingDmsWidget } from 'modules';
import * as utils from 'utils';
import * as constants from 'consts';
import { DrawerComponent } from 'components';
import styles from './TaskDashboard.styles';
import { selectDmsWidgetExpanded } from 'stores';

// mui
import { Divider } from '@material-ui/core';
import DescriptionIcon from '@material-ui/icons/Description';
import { makeStyles } from '@material-ui/core';

TaskDashboardView.propTypes = {
  task: PropTypes.object.isRequired,
  tabs: PropTypes.array.isRequired,
  selectedTab: PropTypes.string.isRequired,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      link: PropTypes.string,
    })
  ).isRequired,
  handleSelectTab: PropTypes.func.isRequired,
  popoverActions: PropTypes.array.isRequired,
  handleDirtyCheck: PropTypes.func.isRequired,
  isDirtyRef: PropTypes.bool.isRequired,
  setIsDirty: PropTypes.func.isRequired,
  allowedNavigationUrls: PropTypes.array.isRequired,
};
export function TaskDashboardView({
  task,
  tabs,
  selectedTab,
  breadcrumbs,
  handleSelectTab,
  popoverActions,
  handleDirtyCheck,
  allowedNavigationUrls,
  isDirtyRef,
  setIsDirty,
}) {
  const classes = makeStyles(styles, { name: 'TaskDashboard' })();
  const isDmsWidgetExpanded = useSelector(selectDmsWidgetExpanded);
  return (
    <>
      <Breadcrumb links={breadcrumbs} testid="task-dashboard" />
      <Divider />
      <div
        className={classnames(classes.content, {
          [classes.contentShift]: isDmsWidgetExpanded,
        })}
      >
        <Layout testid="task-dashboard">
          <Layout main>
            <SectionHeader
              title={utils.string.t('claims.processing.task.title', { id: task.taskRef })}
              icon={DescriptionIcon}
              testid="task-ref-header"
            >
              <PopoverMenu
                variant="outlined"
                id="task-functions"
                size="small"
                color="primary"
                text={utils.string.t('claims.processing.taskFunctions')}
                isButton
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                items={popoverActions}
              />
            </SectionHeader>
            <Tabs
              tabs={tabs}
              value={selectedTab}
              onChange={(tabName) => {
                handleSelectTab(tabName);
              }}
            />

            {/* tabs content */}
            {selectedTab === 'taskDetails' && (
              <TaskDetails taskObj={task} isDirtyRef={isDirtyRef} setIsDirty={setIsDirty} handleDirtyCheck={handleDirtyCheck} />
            )}
            {selectedTab === 'viewDocuments' && (
              <ClaimsUploadViewSearchDocs
                refData={task}
                refIdName={constants.DMS_CONTEXT_TASK_ID}
                dmsContext={constants.DMS_CONTEXT_TASK}
                documentTypeKey={constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.claim}
                viewOptions={{ link: true }}
              />
            )}
            {selectedTab === 'notes' && <TaskNotes taskObj={task} breadcrumbs={breadcrumbs} />}
            {isDirtyRef && selectedTab === 'taskDetails' && (
              <PreventNavigation
                dirty={true}
                allowedUrls={allowedNavigationUrls}
                title={'status.alert'}
                subtitle={''}
                hint={'claims.notes.notifications.alertPopup'}
                maxWidth={'xs'}
                confirmLabel={'form.options.yesNoNa.yes'}
                cancelLabel={'form.options.yesNoNa.no'}
              />
            )}
          </Layout>
        </Layout>
      </div>
      <DrawerComponent isDrawerOpen isFromDashboard>
        <ClaimsProcessingDmsWidget />
      </DrawerComponent>
    </>
  );
}
