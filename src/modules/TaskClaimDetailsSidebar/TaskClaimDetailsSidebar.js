import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

// app
import { TaskClaimDetailsSidebarView } from './TaskClaimDetailsSidebar.view';
import { selectClaimsTasksProcessingSelected, getClaimsPreviewInformation, selectClaimsInformation } from 'stores';

TaskClaimDetailsSidebar.propTypes = {
  isClaimsTabSelected: PropTypes.bool,
};

export default function TaskClaimDetailsSidebar() {
  const dispatch = useDispatch();
  const claimsTaskProcessingSelected = useSelector(selectClaimsTasksProcessingSelected);
  const claimPreviewInfo = useSelector(selectClaimsInformation);
  const claimsTaskProcessingSelectedLength = claimsTaskProcessingSelected?.length || 0;
  const taskSelected = claimsTaskProcessingSelected?.[0];

  useEffect(() => {
    if (claimsTaskProcessingSelectedLength === 1) {
      dispatch(
        getClaimsPreviewInformation(
          {
            claimId: taskSelected?.businessProcessID,
            claimRefParams: taskSelected?.processRef,
            sourceIdParams: taskSelected?.sourceID,
            divisionIDParams: taskSelected?.departmentID
          }
        )
      );
    }
  }, [claimsTaskProcessingSelectedLength, dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  return <TaskClaimDetailsSidebarView claimPreviewInfo={claimPreviewInfo} taskDetails={taskSelected} />;
}
