import React, { useState } from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import { useDispatch } from 'react-redux';

//app
import { RfiResponseDmsView } from './RfiResponseDms.view';
import { setDmsTaskContextType } from 'stores';
import * as utils from 'utils';

RfiResponseDms.propTypes = {
  task: PropTypes.object.isRequired,
  taskResponse: PropTypes.object,
  defaultState: PropTypes.bool,
  viewOptions: PropTypes.shape({
    disabled: PropTypes.bool,
    upload: PropTypes.bool,
    search: PropTypes.bool,
    unlink: PropTypes.bool,
    delete: PropTypes.bool,
    readOnly: PropTypes.bool,
  }).isRequired,
};
export default function RfiResponseDms({ task, taskResponse, defaultState, viewOptions }) {
  const dispatch = useDispatch();

  const [expanded, setExpanded] = useState(defaultState || false);

  const viewOptionsMerged = merge(
    {
      disabled: false,
      upload: false,
      search: true,
      unlink: false,
      delete: false,
      readOnly: false,
    },
    viewOptions
  );

  const toggleDmsSection = () => {
    setExpanded(!expanded);
    if (!expanded && viewOptions?.readOnly && utils.generic.isValidObject(taskResponse, 'caseIncidentNotesID')) {
      dispatch(
        setDmsTaskContextType({
          caseIncidentID: taskResponse?.caseIncidentID,
          caseIncidentNotesID: taskResponse?.caseIncidentNotesID,
        })
      );
    }
  };

  return <RfiResponseDmsView task={task} expanded={expanded} toggleDmsSection={toggleDmsSection} viewOptions={viewOptionsMerged} />;
}
