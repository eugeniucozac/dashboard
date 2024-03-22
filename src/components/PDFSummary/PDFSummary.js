import React from 'react';
import { PDFSummaryView } from './PDFSummary.view';
import * as utils from 'utils';

export function PDFSummary({ placementInfo, introduction }) {
  const filteredUsers = utils.users.getWithName(placementInfo.users);
  const brokers = filteredUsers.map((user) => utils.user.fullname(user)).join(', ');

  return <PDFSummaryView introduction={introduction} placementInfo={placementInfo} brokers={brokers} />;
}

export default PDFSummary;
