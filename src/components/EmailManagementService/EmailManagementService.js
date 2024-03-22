import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

//app
import EmailManagementServiceView from './EmailManagementService.view';
import {
  getEmsInboxList,
  selectEmsInboxList,
  resetEmsInboxList,
  postEmail,
  postBureauInsurerDetails,
  selectUser,
  getEmsExistingDocuments,
  selectEmsExistingDocuments,
  viewDocumentsDownload,
} from 'stores';
import * as constants from 'consts';
import * as utils from 'utils';

EmailManagementService.propTypes = {
  accountDetails: PropTypes.shape({
    sendEmailDocument: PropTypes.bool.isRequired,
    underwriterAccountID: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    policyClientId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    documentSentType: PropTypes.string,
  }).isRequired,
  accountLabel: PropTypes.string,
  accountName: PropTypes.string.isRequired,
  caseDetailsObject: PropTypes.object,
  emailType: PropTypes.string.isRequired,
  objectCode: PropTypes.string.isRequired,
  objectId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  handlers: PropTypes.shape({
    goBack: PropTypes.func,
  }).isRequired,
};

function EmailManagementService({
  accountDetails,
  accountLabel,
  accountName,
  caseDetailsObject,
  emailType,
  objectCode,
  objectId,
  handlers,
}) {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const emsInboxList = useSelector(selectEmsInboxList);
  const emsExistingDocuments = useSelector(selectEmsExistingDocuments);

  const [selectedMail, setSelectedMail] = useState({});
  const [isComposeEmail, setIsComposeEmail] = useState(!Boolean(accountDetails?.sendEmailDocument));
  const [forwardSubject, setForwardSubject] = useState('');
  const [forwardMessage, setForwardMessage] = useState('');
  const [forwardAttachments, setForwardAttachements] = useState([]);

  const policyRef = caseDetailsObject?.policyRef;
  const instructionId = caseDetailsObject?.instructionId;

  const isMiddleOffice = utils.generic.isValidArray(user.group, true) && user.group[0].code === constants.MIDDLE_OFFICE;

  useEffect(() => {
    dispatch(getEmsInboxList({ objectId, objectCode, emailType }));
    dispatch(getEmsExistingDocuments({ referenceId: objectId, sectionType: objectCode, policyRef, instructionId }));

    // cleanup
    return () => {
      dispatch(resetEmsInboxList());
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (Boolean(accountDetails?.sendEmailDocument)) setSelectedMail(utils.generic.isValidArray(emsInboxList, true) ? emsInboxList[0] : {});
  }, [emsInboxList]); // eslint-disable-line react-hooks/exhaustive-deps

  const fields = [
    {
      name: 'accountName',
      type: 'text',
      size: 'sm',
      value: accountName || '',
      muiComponentProps: {
        disabled: true,
      },
    },
  ];

  const sendEmail = ({ emailTo, emailCc, message, subject, attachments }) => {
    const params = { emailTo, emailCc, message, subject, objectId, objectCode, emailType, attachments };
    dispatch(postEmail(params)).then((data) => {
      if (data?.status?.toLowerCase() === constants.API_RESPONSE_OK.toLowerCase()) {
        dispatch(
          postBureauInsurerDetails([
            {
              caseIncidentId: Number(caseDetailsObject?.caseId),
              createdBy: user.id,
              createdDate: utils.date.today(),
              emailId: 1,
              isActive: 1,
              issueDocsType: emailType,
              marketTypesId: null,
              ...(emailType === constants.EMS_EMAIL_TYPE_CLIENT && {
                policyClientId: accountDetails?.policyClientId,
                documentSentType: accountDetails?.documentSentType,
                emailTo: emailTo
                  .split(';')
                  .map((email) => email.trim())
                  .filter((v) => !isEmpty(v)),
                emailCc: emailCc
                  .split(';')
                  .map((email) => email.trim())
                  .filter((v) => !isEmpty(v)),
              }),
              ...(emailType === constants.EMS_EMAIL_TYPE_NON_BUREAU && { policyUnderwriterId: accountDetails?.underwriterAccountID }),
              sentDate: utils.date.today(),
              sourceId: caseDetailsObject?.caseTeamData?.xbInstanceId,
              updatedBy: user.id,
              updatedDate: utils.date.today(),
              workPackageRef: null,
            },
          ])
        ).then((data) => {
          if (data?.status?.toLowerCase() === constants.API_RESPONSE_OK.toLowerCase()) {
            dispatch(getEmsInboxList({ objectId, objectCode, emailType })).then((data) => {
              if (data?.status?.toLowerCase() === constants.API_RESPONSE_OK.toLowerCase()) {
                setIsComposeEmail(false);
                setSelectedMail(utils.generic.isValidArray(data?.data, true) ? data?.data[0] : {});
              }
            });
          }
        });
      }
    });
  };

  const showMailBodyContent = (id) => {
    setIsComposeEmail(false);
    const filteredData = utils.generic.isValidArray(emsInboxList, true) && emsInboxList.filter((a) => a.id === id);
    setSelectedMail(utils.generic.isValidArray(filteredData, true) ? filteredData[0] : {});
  };

  const goBack = () => {
    setIsComposeEmail(false);
    handlers.goBack();
  };

  const forwardMail = (mailData) => {
    setIsComposeEmail(true);
    setSelectedMail({});
    setForwardSubject(`FW: ${mailData?.subject}`);
    setForwardMessage(mailData?.text);
    setForwardAttachements(mailData?.attachment);
  };

  const downloadDocument = (doc) => {
    dispatch(viewDocumentsDownload(doc));
  };

  if (!(objectId && objectCode && emailType)) {
    return null;
  }

  return (
    <EmailManagementServiceView
      accountLabel={accountLabel}
      emsInboxList={emsInboxList}
      emsExistingDocuments={emsExistingDocuments}
      forwardAttachments={forwardAttachments}
      forwardMessage={forwardMessage}
      forwardSubject={forwardSubject}
      fields={fields}
      isComposeEmail={isComposeEmail}
      isMiddleOffice={isMiddleOffice}
      selectedMail={selectedMail}
      handlers={{
        forwardMail,
        goBack,
        sendEmail,
        showMailBodyContent,
        downloadDocument,
      }}
      caseDetailsObject={caseDetailsObject}
      accountDetails={accountDetails}
      accountName={accountName}
    />
  );
}

export default EmailManagementService;
