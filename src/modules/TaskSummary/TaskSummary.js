import React from 'react';
import PropTypes from 'prop-types';

// app
import { TaskSummaryView } from './TaskSummary.view';

TaskSummary.propTypes = {
  claim: PropTypes.object,
  allowNavigation: PropTypes.func.isRequired,
};

export default function TaskSummary({ claim, allowNavigation }) {
  return <TaskSummaryView claim={claim} allowNavigation={allowNavigation} />;
}
