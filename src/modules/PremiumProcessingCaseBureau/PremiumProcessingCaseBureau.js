import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

//app
import PremiumProcessingCaseBureauView from './PremiumProcessingCaseBureau.view';
import * as utils from 'utils';
import { selectRefDataMarketTypes, selectUser, enqueueNotification, getBureauList, postBureauInsurerDetails } from 'stores';
import * as constants from 'consts';
import { showModal } from 'stores';

PremiumProcessingCaseBureau.propTypes = {
  handlers: PropTypes.shape({
    setIsPageDirty: PropTypes.func.isRequired,
  }),
  caseDetailsObject: PropTypes.object.isRequired,
  taskId: PropTypes.string.isRequired,
  isPageDirty: PropTypes.bool.isRequired,
  isNotMyTaskView: PropTypes.bool.isRequired,
};

export default function PremiumProcessingCaseBureau({ handlers, caseDetailsObject, taskId, isPageDirty, isNotMyTaskView }) {
  const dispatch = useDispatch();
  const policyId = caseDetailsObject?.policyId || '';
  const caseIncidentID = caseDetailsObject?.caseId || '';
  const sourceId = caseDetailsObject?.caseTeamData?.xbInstanceId || '';
  const { caseStageDetails } = caseDetailsObject;
  const marketTypes = useSelector(selectRefDataMarketTypes);
  const user = useSelector(selectUser);
  const [bureauInsurersDetails, setBureauInsurersDetails] = useState({});
  const [isFiveBureauAdded, setIsFiveBureauAdded] = useState(false);
  const [bureauListData, setBureauListData] = useState([]);
  const [isDuplicateWorkRefNo, setIsDuplicateWorkRefNo] = useState();
  const [isDuplicateWorkRefNoInDb, setIsDuplicateWorkRefNoInDb] = useState([]);
  const hasEditPermission = utils.app.access.feature('premiumProcessing.issueDocumentBi', ['read', 'create', 'update', 'delete'], user);

  const isCompletedStage = caseStageDetails?.some((cs) => [constants.BPM_STAGE_COMPLETED].includes(cs.bpmStageCode) && cs.active);
  const isRejectedStage = caseStageDetails?.some((cs) => [constants.BPM_STAGE_REJECTED].includes(cs.bpmStageCode) && cs.active);

  const columnsData = [
    {
      id: 'workPackageRefNumber',
      visible: true,
      nowrap: true,
      label: utils.string.t('premiumProcessing.bureauColumns.workPackageRefNumber'),
    },
    {
      id: 'status',
      visible: true,
      nowrap: true,
      label: utils.string.t('premiumProcessing.bureauColumns.status'),
    },
    {
      id: 'date',
      visible: true,
      nowrap: true,
      label: utils.string.t('premiumProcessing.bureauColumns.date'),
    },
    {
      id: 'bureau',
      visible: true,
      nowrap: true,
      label: utils.string.t('premiumProcessing.bureauColumns.bureau'),
    },
  ];

  const emptyDetails = {
    workPackageRefNumber: '',
    status: false,
    date: '',
    selectedBureau: [],
  };

  useEffect(() => {
    dispatch(getBureauList({ policyId, sourceId, caseIncidentID }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(
    () => {
      if (utils.generic.isValidArray(marketTypes, true)) {
        const bureauList = [];
        for (let marketType of marketTypes) {
          if (marketType.marketTypeDescription !== constants.OUTSIDE_COMPANIES) {
            bureauList.push({ id: marketType.marketTypeID, name: marketType.marketTypeDescription });
          }
        }
        setBureauListData(bureauList);
      }
      setInitialBureauInsurerData();
    },
    [marketTypes] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    if (
      utils.generic.isValidArray(caseDetailsObject?.caseIssueDocuments?.bureauList?.items) &&
      !utils.generic.isValidArray(isDuplicateWorkRefNoInDb, true)
    ) {
      setInitialBureauInsurerData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseDetailsObject?.caseIssueDocuments?.bureauList?.items, isDuplicateWorkRefNoInDb]);

  const setInitialBureauInsurerData = () => {
    const bureauInsurers =
      (caseDetailsObject?.caseIssueDocuments?.bureauList?.items &&
        caseDetailsObject?.caseIssueDocuments?.bureauList?.items?.length && [...caseDetailsObject.caseIssueDocuments.bureauList.items]) ||
      [];
    let addRowEntry = {};
    if (utils.generic.isValidArray(bureauInsurers, true)) {
      const keys = Object.keys(bureauInsurersDetails);
      let key = (utils.generic.isValidArray(keys, true) && Number(keys[keys.length - 1]) + 1) || 0;
      bureauInsurers.forEach((insurer) => {
        const selectedBureau = [];
        utils.generic.isValidArray(insurer.marketTypesId, true) &&
          utils.generic.isValidArray(marketTypes, true) &&
          insurer.marketTypesId.forEach((id) => {
            const bureau = marketTypes.find(
              (data) => data.marketTypeID === id && data.marketTypeDescription !== constants.OUTSIDE_COMPANIES
            );
            if (bureau?.marketTypeDescription) {
              selectedBureau.push({ id: bureau.marketTypeID, name: bureau.marketTypeDescription });
            }
          });
        addRowEntry[key] = {
          workPackageRefNumber: insurer.workPackageRef,
          status: !!insurer.sentDate,
          date: insurer.sentDate,
          selectedBureau,
          caseIncidentIssueDocsId: insurer.caseIncidentIssueDocsId,
        };
        key = key + 1;
      });
    }
    const rowNumber = Object.keys(addRowEntry).length || Object.keys(bureauInsurersDetails).length;
    if (rowNumber < 5) {
      if (isFiveBureauAdded) {
        setIsFiveBureauAdded(false);
      }
      const keys =
        (utils.generic.isValidArray(Object.keys(addRowEntry), true) && Object.keys(addRowEntry)) ||
        (utils.generic.isValidArray(Object.keys(bureauInsurersDetails), true) && Object.keys(bureauInsurersDetails)) ||
        [];
      const lastKey = keys[keys.length - 1] || -1;
      addRowEntry[Number(lastKey) + 1] = emptyDetails;
    } else {
      showBureauEntryWarning();
    }

    setBureauInsurersDetails({ ...addRowEntry });
  };

  const showBureauEntryWarning = () => {
    if (!isFiveBureauAdded && !isCompletedStage && !isRejectedStage) {
      setIsFiveBureauAdded(true);
      dispatch(enqueueNotification('premiumProcessing.bureauColumns.workRefValidation', 'warning', { delay: 60000 }));
    }
  };

  const checkLastRow = (index) => {
    handlers.setIsPageDirty(true);
    const totalRows = Object.keys(bureauInsurersDetails);
    const lastIndex = Number(Math.max(...totalRows));
    if (totalRows.length < 5) {
      if (isFiveBureauAdded) {
        setIsFiveBureauAdded(false);
      }
      if (Number(index) >= lastIndex) {
        return { ...bureauInsurersDetails, [lastIndex + 1]: emptyDetails };
      } else if (
        Number(index) < lastIndex &&
        (bureauInsurersDetails[lastIndex].workPackageRefNumber ||
          bureauInsurersDetails[lastIndex].date ||
          bureauInsurersDetails[lastIndex].selectedBureau.length)
      ) {
        return { ...bureauInsurersDetails, [lastIndex + 1]: emptyDetails };
      } else {
        return bureauInsurersDetails;
      }
    } else {
      if (Number(index).toString() === lastIndex.toString()) {
        showBureauEntryWarning();
      }
      return bureauInsurersDetails;
    }
  };
  const handleInputChange = (event) => {
    const rowsDetails = checkLastRow(event.target.id);
    setBureauInsurersDetails({
      ...rowsDetails,
      [event.target.id]: {
        ...bureauInsurersDetails[event.target.id],
        workPackageRefNumber: utils.string.stripNonAlphaNumeric(event.target.value).toUpperCase(),
      },
    });
  };

  const handleDatePickerUpdate = (index, date) => {
    const rowsDetails = checkLastRow(index);
    setBureauInsurersDetails({
      ...rowsDetails,
      [index]: {
        ...bureauInsurersDetails[index],
        date: date,
      },
    });
  };

  const toggleMultiSelectOption = (currentIndex) => (id, value) => {
    const rowsDetails = checkLastRow(currentIndex);
    const selectedBureau = bureauInsurersDetails[currentIndex].selectedBureau || [];
    let isSelected = false;
    for (let bureau of selectedBureau) {
      if (bureau.id === value.id) {
        isSelected = true;
        break;
      }
    }
    if (!isSelected) {
      setBureauInsurersDetails({
        ...rowsDetails,
        [currentIndex]: {
          ...bureauInsurersDetails[currentIndex],
          selectedBureau: [...bureauInsurersDetails[currentIndex].selectedBureau, { id: value.id, name: value.name }],
        },
      });
    } else {
      setBureauInsurersDetails({
        ...rowsDetails,
        [currentIndex]: {
          ...bureauInsurersDetails[currentIndex],
          selectedBureau: [...selectedBureau.filter((obj) => obj.id !== value.id)],
        },
      });
    }
  };

  const getSelectedBureauLabel = (index) => {
    const countOfSelectedBureau = bureauInsurersDetails?.[index]?.selectedBureau.length || 0;
    let showSelectedBureau = '';
    if (countOfSelectedBureau) {
      for (let bureau of bureauInsurersDetails?.[index]?.selectedBureau) {
        showSelectedBureau += bureau.name + ', ';
      }
    }
    return showSelectedBureau.replace(/,\s*$/, '');
  };

  const handleSubmit = () => {
    let showToast = false;
    let bureauInsurerData = { ...bureauInsurersDetails };
    const data = [];
    Object.keys(bureauInsurerData).forEach((key) => {
      if (
        (bureauInsurerData[key]?.workPackageRefNumber || bureauInsurerData[key]?.date || bureauInsurerData[key]?.selectedBureau.length) &&
        (!bureauInsurerData[key]?.workPackageRefNumber || !bureauInsurerData[key]?.date || !bureauInsurerData[key]?.selectedBureau.length)
      ) {
        bureauInsurerData = {
          ...bureauInsurerData,
          [key]: {
            ...bureauInsurerData[key],
            error: true,
          },
        };
        showToast = true;
      } else if (bureauInsurerData[key]?.workPackageRefNumber && !bureauInsurersDetails[key]?.caseIncidentIssueDocsId) {
        data.push({
          caseIncidentId: Number(caseDetailsObject.caseId),
          createdBy: user.id,
          createdDate: utils.date.today(),
          documentSentType: caseDetailsObject.caseTeamData.policyType,
          emailId: (user.emailId.length && 1) || 0,
          isActive: 1,
          issueDocsType: 'Bureau',
          marketTypesId: bureauInsurersDetails[key].selectedBureau.map((data) => data.id),
          policyClientId: policyId,
          policyUnderwriterId: null,
          sentDate: bureauInsurersDetails[key].date,
          sourceId: sourceId,
          updatedBy: user.id,
          updatedDate: utils.date.today(),
          workPackageRef: bureauInsurersDetails[key].workPackageRefNumber,
        });
      }
    });
    if (showToast) {
      setBureauInsurersDetails(bureauInsurerData);
      dispatch(enqueueNotification('premiumProcessing.bureauColumns.fail', 'error'));
      return;
    }

    let workPackageRef = data?.map((item) => {
      return item.workPackageRef;
    });
    let isDuplicateRefNo = workPackageRef?.find((item, idx) => {
      return workPackageRef.indexOf(item) !== idx;
    });

    setIsDuplicateWorkRefNo(isDuplicateRefNo);

    if (isDuplicateRefNo) {
      return dispatch(enqueueNotification('premiumProcessing.bureauColumns.duplicateWorkPackageNo', 'error'));
    }

    if (utils.generic.isValidArray(data, true)) {
      dispatch(postBureauInsurerDetails(data)).then((response) => {
        if (response?.response?.status === 500 && utils.generic.isValidArray(response?.json?.data, true)) {
          workPackageRef = response?.json?.data?.map((item) => {
            return item.workPackageRef;
          });

          setIsDuplicateWorkRefNoInDb(workPackageRef);

          if (workPackageRef) {
            dispatch(enqueueNotification('premiumProcessing.bureauColumns.duplicateWorkPackageInEds', 'error'));
          } else dispatch(enqueueNotification('premiumProcessing.bureauColumns.apiFail', 'error'));
        } else {
          setIsDuplicateWorkRefNoInDb([]);
        }
        if (response.status === constants.API_RESPONSE_OK) {
          handlers.setIsPageDirty(false);
        }
      });
    } else {
      handlers.setIsPageDirty(false);
    }
  };

  const handleRemoveRow = (key) => {
    if (key in bureauInsurersDetails) {
      delete bureauInsurersDetails?.[key];
      let data = { ...bureauInsurersDetails };
      const keys = Object.keys(bureauInsurersDetails);
      const lastKey = keys[keys.length - 1];
      if (keys.length === 4 && bureauInsurersDetails[lastKey]?.workPackageRefNumber) {
        data = { ...data, [lastKey + 1]: emptyDetails };
      }
      setBureauInsurersDetails({ ...data });
    }
  };

  const showAlert = (submitHandler, cancelHandler, message = utils.string.t('premiumProcessing.bureauColumns.alertPopup')) => {
    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          title: utils.string.t('status.alert'),
          hint: message,
          fullWidth: true,
          maxWidth: 'xs',
          componentProps: {
            cancelLabel: utils.string.t('app.cancel'),
            confirmLabel: utils.string.t('app.yes'),
            submitHandler,
            cancelHandler,
          },
        },
      })
    );
  };

  const handleCancel = () => {
    if (isPageDirty) {
      showAlert(
        () => {
          setInitialBureauInsurerData();
          handlers.setIsPageDirty(false);
        },
        () => {},
        utils.string.t('premiumProcessing.bureauColumns.alertPopupOnCancel')
      );
    }
  };

  return (
    <PremiumProcessingCaseBureauView
      columnsData={columnsData}
      bureauInsurersDetails={bureauInsurersDetails}
      bureauList={bureauListData}
      hasEditPermission={hasEditPermission}
      isDuplicateWorkRefNo={isDuplicateWorkRefNo}
      isDuplicateWorkRefNoInDb={isDuplicateWorkRefNoInDb}
      isCompletedStage={isCompletedStage}
      isRejectedStage={isRejectedStage}
      handlers={{
        handleSubmit,
        handleInputChange,
        handleDatePickerUpdate,
        toggleMultiSelectOption,
        getSelectedBureauLabel,
        showAlert,
        handleCancel: handleCancel,
        handleRemoveRow,
      }}
      taskId={taskId}
      isEdited={isPageDirty}
      isNotMyTaskView={isNotMyTaskView}
    />
  );
}
