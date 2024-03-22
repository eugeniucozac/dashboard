import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import { useHistory, useParams } from 'react-router';

// app
import { RfiDashboardView } from './RfiDashboard.view';
import {
  selectRfiHistoryList,
  selectRfiHistoryDocumentList,
  selectTasksTabGridListSelected,
  getMultipleContextDocuments,
  selectorMultipleContextDocs,
  getClaimsTaskDashboardDetail,
  selectRfiDashboardDetails,
  selectIsRfiDashboardDetailsLoading,
  resetRfiDashboardData,
} from 'stores';
import * as utils from 'utils';
import config from 'config';
import * as constants from 'consts';

export default function RfiDashboard() {
  const history = useHistory();
  const params = useParams();
  const dispatch = useDispatch();
  const brand = useSelector((state) => state.ui.brand);

  // Redux management
  const tasksProcessingSelected = useSelector(selectTasksTabGridListSelected);
  const rfiHistory = useSelector(selectRfiHistoryList);
  const rfiHistoryDocList = useSelector(selectRfiHistoryDocumentList);
  const rfiLinkedDocs = useSelector(selectorMultipleContextDocs);
  const rfiDashboardDetails = useSelector(selectRfiDashboardDetails);
  const isRfiDetailsLoading = useSelector(selectIsRfiDashboardDetailsLoading);

  const hasValidRfiDashboardDetails = utils.generic.isValidObject(rfiDashboardDetails, 'taskRef');
  const selectedRfi = hasValidRfiDashboardDetails ? rfiDashboardDetails : tasksProcessingSelected[0];

  // State management
  const [selectedTab, setSelectedTab] = useState(params?.tab || 'rfiDetails');
  const [dmsDocListParams, setDmsDocListParams] = useState([]);

  const rfiOriginType = utils.claimsRfi.checkRfiOriginType(selectedRfi?.refType);
  const isParentTaskTypeRFI = selectedRfi?.parentTaskRef ? utils.claimsRfi.isRfiTask(selectedRfi?.parentTaskRef) : false;

  useEffect(() => {
    // cleanup
    return () => {
      dispatch(resetRfiDashboardData());
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!hasValidRfiDashboardDetails && !isRfiDetailsLoading) {
      dispatch(getClaimsTaskDashboardDetail({ query: params?.id, isRfiTask: true })).then((res) => {
        if (!res?.data?.searchValue?.length) {
          history.replace(config.routes.claimsFNOL.root);
        }
      });
    }
  }, [hasValidRfiDashboardDetails]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectTab = (tabName) => {
    setSelectedTab(tabName);
    if (tabName === 'documents') {
      const allReferenceIds = [
        ...rfiHistory?.map((item) => {
          return {
            referenceId: `${tasksProcessingSelected[0]?.taskId}-${item?.caseIncidentNotesID}`,
            sectionType: constants.DMS_CONTEXT_TASK,
          };
        }),
        ...[
          utils.generic.isValidArray(tasksProcessingSelected, true) && {
            referenceId: tasksProcessingSelected[0]?.taskId,
            sectionType: constants.DMS_CONTEXT_TASK,
          },
        ],
      ];
      setDmsDocListParams(allReferenceIds);
      if (utils.generic.isValidArray(allReferenceIds, true)) dispatch(getMultipleContextDocuments(allReferenceIds));
    }
  };

  const tabs = [
    { value: 'rfiDetails', label: utils.string.t('claims.rfiDashboard.tabs.rfiDetail') },
    { value: 'documents', label: utils.string.t('claims.rfiDashboard.tabs.documents') },
  ];

  const breadcrumbs = [
    {
      name: 'claimsProcessing',
      label: utils.string.t('claims.loss.title'),
      link: config.routes.claimsFNOL.root,
    },
    {
      name: 'loss',
      label: `${utils.string.t('claims.rfiDashboard.breadCrumbs.lossRef', { lossRef: selectedRfi?.lossRef })}`,
      link: `${config.routes.claimsFNOL.loss}/${selectedRfi?.lossRef}`,
    },
    ...(rfiOriginType === 'claim' || rfiOriginType === 'task'
      ? [
          {
            name: 'claim',
            label: `${utils.string.t('claims.rfiDashboard.breadCrumbs.claimRef', {
              claimRef: selectedRfi?.claimRef || selectedRfi?.processRef,
            })}`,
            link: `${config.routes.claimsFNOL.claim}/${selectedRfi?.claimRef || selectedRfi?.processRef}`,
          },
        ]
      : []),
    ...(rfiOriginType === 'task' && !isParentTaskTypeRFI
      ? [
          {
            name: 'task',
            label: `${utils.string.t('claims.rfiDashboard.breadCrumbs.taskRef', { taskRef: selectedRfi?.parentTaskRef })}`,
            link: `${config.routes.claimsFNOL.task}/${selectedRfi?.parentTaskRef}`,
          },
        ]
      : rfiOriginType === 'task' && isParentTaskTypeRFI
      ? [
          {
            name: 'rfiTask',
            label: `${utils.string.t('claims.rfiDashboard.breadCrumbs.rfiRef', { taskRef: selectedRfi?.parentTaskRef })}`,
            link: `${config.routes.claimsFNOL.rfi}/${selectedRfi?.parentTaskRef}`,
          },
        ]
      : []),
    {
      name: 'rfiTask',
      label: `${utils.string.t('claims.rfiDashboard.breadCrumbs.rfiRef', { taskRef: selectedRfi?.taskRef })}`,
      link: `${config.routes.claimsFNOL.rfi}/${selectedRfi?.taskRef}`,
      active: true,
      largeFont: true,
    },
  ];

  // abort
  if (!selectedRfi) return '';

  return (
    <>
      <Helmet>
        <title>{`${utils.string.t('claims.processing.title')} - ${utils.app.getAppName(brand)}`}</title>
      </Helmet>
      <RfiDashboardView
        rfiTask={selectedRfi}
        rfiOriginType={rfiOriginType}
        tabs={tabs}
        rfiHistory={utils.generic.isValidArray(rfiHistoryDocList, true) ? rfiHistoryDocList : rfiHistory}
        selectedTab={selectedTab}
        breadcrumbs={breadcrumbs}
        handleSelectTab={handleSelectTab}
        rfiLinkedDocs={rfiLinkedDocs}
        dmsDocListParams={dmsDocListParams}
      />
    </>
  );
}
