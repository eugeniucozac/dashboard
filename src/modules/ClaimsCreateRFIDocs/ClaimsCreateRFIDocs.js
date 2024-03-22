import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

//app
import ClaimsCreateRFIDocsView from './ClaimsCreateRFIDocs.view';
import { setRFIDocuments, selectorDmsViewFiles } from 'stores';
import * as utils from 'utils';

ClaimsCreateRFIDocs.propTypes = {
  createRfiInfo: PropTypes.object.isRequired,
  activeStep: PropTypes.number.isRequired,
  isAllStepsCompleted: PropTypes.bool,
  index: PropTypes.number.isRequired,
  save: PropTypes.bool,
  claim: PropTypes.object,
  handlers: PropTypes.shape({
    handleBack: PropTypes.func.isRequired,
    handleCancel: PropTypes.func.isRequired,
    handleNextSubmit: PropTypes.func.isRequired
  })
}

export default function ClaimsCreateRFIDocs({
  createRfiInfo,
  activeStep,
  index,
  isAllStepsCompleted,
  handlers,
  save,
  claim
}) {

  const dispatch = useDispatch();

  const viewDmsDocuments = useSelector(selectorDmsViewFiles);
  useEffect(() => {
    if (!utils.generic.isInvalidOrEmptyArray(viewDmsDocuments)) {
      dispatch(setRFIDocuments(viewDmsDocuments));
    }
  }, [viewDmsDocuments]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ClaimsCreateRFIDocsView
      createRfiInfo={createRfiInfo}
      activeStep={activeStep}
      index={index}
      isAllStepsCompleted={isAllStepsCompleted}
      handlers={handlers}
      save={save}
      sourceId={claim?.sourceID || claim?.sourceId}
      taskId={claim?.taskId}
    />
  );
}
