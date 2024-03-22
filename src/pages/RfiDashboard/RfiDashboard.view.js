import React from 'react';
import PropTypes from 'prop-types';

// app
import { Breadcrumb, Layout, SectionHeader, Tabs } from 'components';
import { RfiDetails, ClaimsUploadViewSearchDocs } from 'modules';
import * as utils from 'utils';
import * as constants from 'consts';

// mui
import { Divider } from '@material-ui/core';
import DescriptionIcon from '@material-ui/icons/Description';

RfiDashboardView.propTypes = {
  rfiTask: PropTypes.object.isRequired,
  tabs: PropTypes.array.isRequired,
  queryCodeList: PropTypes.array.isRequired,
  rfiHistory: PropTypes.array.isRequired,
  selectedTab: PropTypes.string.isRequired,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      link: PropTypes.string,
    })
  ).isRequired,
  handleSelectTab: PropTypes.func.isRequired,
  rfiLinkedDocs: PropTypes.array,
  dmsDocListParams: PropTypes.array,
};
export function RfiDashboardView({
  rfiTask,
  tabs,
  selectedTab,
  breadcrumbs,
  handleSelectTab,
  queryCodeList,
  rfiHistory,
  rfiLinkedDocs,
  dmsDocListParams,
}) {
  return (
    <>
      <Breadcrumb links={breadcrumbs} testid="rfi-dashboard" />
      <Divider />

      <Layout testid="rfi-dashboard">
        <Layout main>
          <SectionHeader
            title={utils.string.t('claims.rfiDashboard.title', { id: rfiTask?.taskRef })}
            icon={DescriptionIcon}
          ></SectionHeader>
          <Tabs tabs={tabs} value={selectedTab} onChange={(tabName) => handleSelectTab(tabName)} />

          {/* tabs content */}
          {selectedTab === 'rfiDetails' && <RfiDetails rfiTask={rfiTask} queryCodeList={queryCodeList} rfiHistory={rfiHistory} />}
          {selectedTab === 'documents' && (
            <ClaimsUploadViewSearchDocs
              refData={rfiTask}
              refIdName={constants.DMS_CONTEXT_TASK_ID}
              dmsContext={constants.DMS_CONTEXT_TASK}
              documentTypeKey={constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.claim}
              docList={rfiLinkedDocs}
              dmsDocListParams={dmsDocListParams}
            />
          )}
        </Layout>
      </Layout>
    </>
  );
}
