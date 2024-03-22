import { React, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';

//app
import config from 'config';
import * as utils from 'utils';
import * as constants from 'consts';
import PremiumProcessingCaseIssueDocumentsView from './PremiumProcessingCaseIssueDocuments.view';

PremiumProcessingCaseIssueDocuments.propTypes = {
  taskId: PropTypes.string.isRequired,
  tab: PropTypes.string.isRequired,
  caseDetailsObject: PropTypes.object,
  handlers: PropTypes.shape({
    confirmNavigation: PropTypes.func.isRequired,
    setIsPageDirty: PropTypes.func.isRequired,
  }),
  isPageDirty: PropTypes.bool.isRequired,
};

function PremiumProcessingCaseIssueDocuments({ taskId, tab, caseDetailsObject = {}, handlers, isPageDirty }) {
  const history = useHistory();
  const subTabs = [
    { value: constants.PREMIUM_PROCESSING_TAB_NON_BUREAU, label: utils.string.t('premiumProcessing.subTabs.nonBureau') },
    { value: constants.PREMIUM_PROCESSING_TAB_BUREAU, label: utils.string.t('premiumProcessing.subTabs.bureau') },
    { value: constants.PREMIUM_PROCESSING_TAB_CLIENT, label: utils.string.t('premiumProcessing.subTabs.client') },
  ];

  const pathNameArr = history?.location?.pathname?.split('/');
  const subTabStr = pathNameArr[pathNameArr.length - 1];
  const isValidTab = subTabs.map((item) => item.value).includes(subTabStr);
  const [selectedTab, setSelectedTab] = useState(isValidTab ? subTabStr : constants.PREMIUM_PROCESSING_TAB_NON_BUREAU);
  const isNotMyTaskView = caseDetailsObject.taskView !== constants.WORKLIST;
  const switchTab = (subTab) => {
    setSelectedTab(subTab);
    if (taskId && subTab) {
      if (subTab === constants.PREMIUM_PROCESSING_TAB_BUREAU) {
        handlers.setIsPageDirty(false);
      } else if (isPageDirty) {
        handlers.setIsPageDirty(false);
      }
      history.replace(`${config.routes.premiumProcessing.case}/${taskId}/${constants.PREMIUM_PROCESSING_TAB_ISSUE_DOCUMENTS}/${subTab}`);
    } else {
      if (isPageDirty) {
        handlers.setIsPageDirty(false);
      }
      history.replace(`${config.routes.premiumProcessing}`);
    }
  };

  const handleSelectTab = (subTab) => {
    if (isPageDirty && subTab !== constants.PREMIUM_PROCESSING_TAB_BUREAU) {
      handlers.confirmNavigation(
        () => {
          switchTab(subTab);
          return;
        },
        () => {
          setSelectedTab(constants.PREMIUM_PROCESSING_TAB_BUREAU);
          return;
        }
      );
      return;
    } else {
      switchTab(subTab);
    }
  };

  return (
    <PremiumProcessingCaseIssueDocumentsView
      taskId={taskId}
      subTabs={subTabs}
      selectedTab={selectedTab}
      caseDetailsObject={caseDetailsObject}
      handlers={{ handleSelectTab, ...handlers }}
      isPageDirty={isPageDirty}
      isNotMyTaskView={isNotMyTaskView}
    />
  );
}

export default PremiumProcessingCaseIssueDocuments;
