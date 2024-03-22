import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import get from 'lodash/get';

// app
import { PremiumProcessingTasksView } from './PremiumProcessingTasks.view';
import { selectTechnicians, selectUser, showModal, resetCasesSelected, hideModal } from 'stores';
import * as utils from 'utils';
import * as constants from 'consts';
import { Tooltip, Badge, StatusIcon } from 'components';
import styles from './PremiumProcessingTasks.styles';
// mui
import { Box, makeStyles } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';

export default function PremiumProcessingTasks() {
  const classes = makeStyles(styles, { name: 'PremiumProcessingTasks' })();

  const dispatch = useDispatch();
  const uiBrand = useSelector((state) => get(state, 'ui.brand'));
  const technicians = useSelector(selectTechnicians);
  const technicianAssigning = true;
  const loggedUserDetails = useSelector(selectUser);
  const userRoleDetails = loggedUserDetails?.userRole;

  const showAssignedToModal = (displayMessages) => {
    const successMessages = displayMessages?.filter((data) => data.flag === constants.ASSINGED_TO_SUCCESS_STATUS);
    const failureMessages = displayMessages?.filter((data) => data.flag === constants.ASSINGED_TO_FAIL_STATUS);
    const juniorTechnicianMessages = displayMessages?.filter((data) => data.flag === constants.ASSINGED_TO_FAIL_JUNIOR_TECHNICIAN_STATUS);
    const crossAssignmentUserMessages = displayMessages?.filter((data) => data.flag === constants.ASSINGED_TO_CROSS_USER_STATUS);
    const statusList = [
      { id: 1, code: 'success', type: 'success' },
      { id: 2, code: 'error', type: 'error' },
    ];
    const width = '80%';
    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          fullWidth: true,
          title: utils.string.t('premiumProcessing.assignedToModalTitle'),
          hideCompOnBlur: false,
          disableAutoFocus: true,
          maxWidth: 'xs',
          componentProps: {
            hideCancelButton: true,
            confirmLabel: utils.string.t('app.ok'),
            confirmMessage: (
              <Box>
                <ul>
                  {successMessages?.length > 0 && (
                    <li>
                      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                        <Box pr={1} display={'flex'} width={width} alignItems={'center'} justifyContent={'flex-start'}>
                          {successMessages[0]?.message}
                        </Box>
                        <StatusIcon list={statusList} translationPath="status" id={1} />
                        <Tooltip
                          title={`Case Id : ${successMessages[0]?.caseId?.length > 0 && successMessages[0]?.caseId.join()}`}
                          placement={'top'}
                          arrow={true}
                        >
                          <Badge badgeContent={<InfoIcon className={classes.infoStyle} />} type="info" compact standalone />
                        </Tooltip>
                      </Box>
                    </li>
                  )}
                  {failureMessages?.length > 0 && (
                    <li>
                      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                        <Box pr={1} display={'flex'} width={width} alignItems={'center'} justifyContent={'flex-start'}>
                          {failureMessages[0]?.message}
                        </Box>
                        <StatusIcon list={statusList} id={2} translationPath="status" />
                        <Tooltip
                          title={`Case Id : ${failureMessages[0]?.caseId?.length > 0 && failureMessages[0]?.caseId.join()}`}
                          placement={'top'}
                          arrow={true}
                        >
                          <Badge badgeContent={<InfoIcon className={classes.infoStyle} />} type="info" compact standalone />
                        </Tooltip>
                      </Box>
                    </li>
                  )}
                  {juniorTechnicianMessages?.length > 0 && (
                    <li>
                      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                        <Box pr={1} display={'flex'} width={width} alignItems={'center'} justifyContent={'flex-start'}>
                          {juniorTechnicianMessages[0]?.message}
                        </Box>
                        <StatusIcon list={statusList} id={2} translationPath="status" />
                        <Tooltip
                          title={`Case Id : ${
                            juniorTechnicianMessages[0]?.caseId?.length > 0 && juniorTechnicianMessages[0]?.caseId.join()
                          }`}
                          placement={'top'}
                          arrow={true}
                        >
                          <Badge badgeContent={<InfoIcon className={classes.infoStyle} />} type="info" compact standalone />
                        </Tooltip>
                      </Box>
                    </li>
                  )}
                  {crossAssignmentUserMessages?.length > 0 && (
                    <li>
                      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                        <Box pr={1} display={'flex'} width={width} alignItems={'center'} justifyContent={'flex-start'}>
                          {crossAssignmentUserMessages[0]?.message}
                        </Box>
                        <StatusIcon list={statusList} id={2} translationPath="status" />
                        <Tooltip
                          title={`Case Id : ${
                            crossAssignmentUserMessages[0]?.caseId?.length > 0 && crossAssignmentUserMessages[0]?.caseId.join()
                          }`}
                          placement={'top'}
                          arrow={true}
                        >
                          <Badge badgeContent={<InfoIcon className={classes.infoStyle} />} type="info" compact standalone />
                        </Tooltip>
                      </Box>
                    </li>
                  )}
                </ul>
              </Box>
            ),
            buttonColors: { confirm: 'secondary' },
            submitHandler: () => {
              dispatch(hideModal());
            },
            handleClose: () => {
              dispatch(hideModal());
            },
          },
        },
      })
    );
    dispatch(resetCasesSelected());
  };
  const assignedToModalObject = (flagValue, dataList, successStatus, failureStatus, juniorTechnicianStatus, crossGroupAssignmentStatus) => {
    const displayObject = {
      message: '',
      flag: flagValue,
      caseId: [],
    };
    if (flagValue === constants.ASSINGED_TO_SUCCESS_STATUS) {
      displayObject.message = utils.string.t('premiumProcessing.casesAssignedSuccessfully', {
        count: successStatus?.length,
      });
      displayObject.caseId = utils.generic.isValidArray(dataList, true)
        ? dataList.filter((data) => data.status === constants.SUCCESS_STATUS_CASE_ASSIGN).map((a) => a.caseIncidentId)
        : [];
    } else if (flagValue === constants.ASSINGED_TO_FAIL_STATUS) {
      displayObject.message = utils.string.t('premiumProcessing.casesAssignmentFailure', {
        failureCount: failureStatus?.length,
      });
      displayObject.caseId = utils.generic.isValidArray(dataList, true)
        ? dataList.filter((data) => data.status === constants.FAILURE_STATUS_CASE_ASSIGN).map((a) => a.caseIncidentId)
        : [];
    } else if (flagValue === constants.ASSINGED_TO_FAIL_JUNIOR_TECHNICIAN_STATUS) {
      displayObject.message = utils.string.t('premiumProcessing.caseNotAssignedToJuniorTechnician', {
        juniorTechCount: juniorTechnicianStatus?.length,
      });
      displayObject.caseId = utils.generic.isValidArray(dataList, true)
        ? dataList.filter((data) => data.isJuniorTechnician === constants.SUCCESS_STATUS_CASE_ASSIGN).map((a) => a.caseIncidentId)
        : [];
    } else if (flagValue === constants.ASSINGED_TO_CROSS_USER_STATUS) {
      displayObject.message = utils.string.t('premiumProcessing.crossGroupAssignmentStatus', {
        crossGroupCount: crossGroupAssignmentStatus?.length,
      });
      displayObject.caseId = utils.generic.isValidArray(dataList, true)
        ? dataList.filter((data) => data.isCrossGroupAssignment === constants.SUCCESS_STATUS_CASE_ASSIGN).map((a) => a.caseIncidentId)
        : [];
    }
    return displayObject;
  };

  const handleAssignedUserToCase = (response) => {
    const responseObject = response?.data?.assignCaseRequest;
    const successStatus = utils.generic.isValidArray(responseObject, true)
      ? responseObject.filter((data) => data.status === constants.SUCCESS_STATUS_CASE_ASSIGN)
      : [];
    const failureStatus = utils.generic.isValidArray(responseObject, true)
      ? responseObject.filter(
          (data) =>
            data.status === constants.FAILURE_STATUS_CASE_ASSIGN &&
            data?.isJuniorTechnician !== constants.SUCCESS_STATUS_CASE_ASSIGN &&
            data?.isCrossGroupAssignment !== constants.SUCCESS_STATUS_CASE_ASSIGN
        )
      : [];
    const juniorTechnicianStatus = utils.generic.isValidArray(responseObject, true)
      ? responseObject.filter((data) => data.isJuniorTechnician === constants.SUCCESS_STATUS_CASE_ASSIGN)
      : [];
    const crossGroupAssignmentStatus = utils.generic.isValidArray(responseObject, true)
      ? responseObject.filter((data) => data.isCrossGroupAssignment === constants.SUCCESS_STATUS_CASE_ASSIGN)
      : [];
    let displayAssignedToResponse = [];
    //For Cross user assignment
    if (crossGroupAssignmentStatus?.length > 0) {
      displayAssignedToResponse.push(
        assignedToModalObject(
          constants.ASSINGED_TO_CROSS_USER_STATUS,
          responseObject,
          successStatus,
          failureStatus,
          juniorTechnicianStatus,
          crossGroupAssignmentStatus
        )
      );
    }
    // All success
    if (successStatus?.length > 0 && failureStatus?.length === 0) {
      displayAssignedToResponse.push(
        assignedToModalObject(
          constants.ASSINGED_TO_SUCCESS_STATUS,
          responseObject,
          successStatus,
          failureStatus,
          juniorTechnicianStatus,
          crossGroupAssignmentStatus
        )
      );
    }
    // All failed
    if (successStatus?.length === 0 && failureStatus?.length > 0) {
      displayAssignedToResponse.push(
        assignedToModalObject(
          constants.ASSINGED_TO_FAIL_STATUS,
          responseObject,
          successStatus,
          failureStatus,
          juniorTechnicianStatus,
          crossGroupAssignmentStatus
        )
      );
    }
    if (juniorTechnicianStatus?.length > 0) {
      displayAssignedToResponse.push(
        assignedToModalObject(
          constants.ASSINGED_TO_FAIL_JUNIOR_TECHNICIAN_STATUS,
          responseObject,
          successStatus,
          failureStatus,
          juniorTechnicianStatus,
          crossGroupAssignmentStatus
        )
      );
    }

    // Mixed some are success and some or failure
    if (successStatus?.length > 0 && failureStatus?.length > 0) {
      displayAssignedToResponse.push(
        assignedToModalObject(
          constants.ASSINGED_TO_SUCCESS_STATUS,
          responseObject,
          successStatus,
          failureStatus,
          juniorTechnicianStatus,
          crossGroupAssignmentStatus
        )
      );
      displayAssignedToResponse.push(
        assignedToModalObject(
          constants.ASSINGED_TO_FAIL_STATUS,
          responseObject,
          successStatus,
          failureStatus,
          juniorTechnicianStatus,
          crossGroupAssignmentStatus
        )
      );
      if (juniorTechnicianStatus?.length > 0) {
        displayAssignedToResponse.push(
          assignedToModalObject(
            constants.ASSINGED_TO_FAIL_JUNIOR_TECHNICIAN_STATUS,
            responseObject,
            successStatus,
            failureStatus,
            juniorTechnicianStatus,
            crossGroupAssignmentStatus
          )
        );
      }
    }

    showAssignedToModal(displayAssignedToResponse);
  };

  return (
    <>
      <Helmet>
        <title>{`${utils.string.t('premiumProcessing.title')} - ${utils.app.getAppName(uiBrand)}`}</title>
      </Helmet>
      <PremiumProcessingTasksView
        technicians={technicians}
        technicianAssigning={technicianAssigning}
        userRoleDetails={userRoleDetails}
        handleAssignedUserToCase={handleAssignedUserToCase}
      />
    </>
  );
}
