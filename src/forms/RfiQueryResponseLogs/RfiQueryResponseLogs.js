import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

// app
import RfiQueryResponseLogsView from './RfiQueryResponseLogs.view';
import * as utils from 'utils';
import { getRfiQueryHistory } from 'stores';

const RfiQueryResponseLogs = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const rfiType = 'Internal';
  const sendTo = 'John Wood';
  const queryCode = 'Document Version Incorrect';
  const expectedResponseDate = '7 Jan 2021';
  const queryId = '11111';
  const documents = [
    {
      id: '1',
      name: 'Slip Document',
      type: 'pdf',
      version: '1.5',
      owner: 'John Wood',
    },
  ];

  const resolutionCodes = [
    { id: '1', label: 'ResCode1', value: 'resCode1' },
    { id: '2', label: 'ResCode2', value: 'resCode2' },
    { id: '3', label: 'ResCode3', value: 'resCode3' },
    { id: '4', label: 'ResCode4', value: 'resCode4' },
    { id: '5', label: 'ResCode5', value: 'resCode5' },
    { id: '6', label: 'ResCode6', value: 'resCode6' },
  ];

  const fields = [
    {
      name: 'resolutionCode',
      label: 'Resolution code',
      value: '',
      type: 'select',
      options: resolutionCodes,
      validation: Yup.string().required(utils.string.t('validation.required')),
      muiComponentProps: {
        'data-testid': 'resolutionCode',
      },
    },
  ];

  const handleSubmit = () => {
    setIsLoading(true);
    setInterval(() => {
      setIsLoading(false);
    }, 2000);
  };

  const actions = [
    {
      name: 'submit',
      label: 'Close Ticket',
      handler: handleSubmit,
    },
  ];

  //This has to be moved to redux and then has to be returned from an API
  const caseTeamMembers = [
    {
      userId: 1,
      userName: 'John Wood',
      userRole: 'Premium Processing Technician',
    },
    {
      userId: 2,
      userName: 'Harry Taylor',
      userRole: 'Front End Contact',
    },
    {
      userId: 3,
      userName: 'Amy Dante',
      userRole: 'Premium Processing Technician',
    },
    {
      userId: 4,
      userName: 'Robert Pattinson',
      userRole: 'Front End Contact',
    },
    {
      userId: 5,
      userName: 'Olive Brown',
      userRole: 'Premium Processing Technician',
    },
    {
      userId: 6,
      userName: 'Pam Smith',
      userRole: 'Front End Contact',
    },
  ];

  const [selectedTab, setSelectedTab] = useState(1);

  const handleSelectTab = (tabName) => {
    dispatch(getRfiQueryHistory());
    setSelectedTab(tabName);
  };

  const tabs = caseTeamMembers.map((caseTeamMember) => {
    return { value: caseTeamMember.userId, label: caseTeamMember.userName, subLabel: caseTeamMember.userRole };
  });

  return (
    <RfiQueryResponseLogsView
      fields={fields}
      actions={actions}
      isLoading={isLoading}
      rfiType={rfiType}
      sendTo={sendTo}
      queryCode={queryCode}
      expectedResponseDate={expectedResponseDate}
      queryId={queryId}
      documents={documents}
      tabs={tabs}
      selectedTab={selectedTab}
      handleSelectTab={handleSelectTab}
    />
  );
};

export default RfiQueryResponseLogs;
