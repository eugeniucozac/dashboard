import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import get from 'lodash/get';

// app
import { ProcessingInstructionsView } from './ProcessingInstructions.view';
import * as utils from 'utils';
import { getProcessingInstructionsGridData, getPiRefData, getDepartments, resetPiSearchParams } from 'stores';

const ProcessingInstructions = () => {
  const dispatch = useDispatch();
  const uiBrand = useSelector((state) => get(state, 'ui.brand'));
  const processingInstructionGridData = useSelector((state) => state.processingInstructions.gridData);
  const processTypes = useSelector((state) => get(state, 'referenceData.processTypes')) || [];

  const departments = useSelector((state) => state.processingInstructions.departmentList) || [];
  const statuses = useSelector((state) => state.processingInstructions.statuses) || [];

  const isProcessTypesLoaded = utils.generic.isValidArray(processTypes, true);
  const isDeparmentsLoaded = utils.generic.isValidArray(departments, true);
  const isStatusesLoaded = utils.generic.isValidArray(statuses, true);

  useEffect(() => {
    dispatch(getProcessingInstructionsGridData());

    // only fetch refData if it hasn't been loaded already
    if (!isProcessTypesLoaded) dispatch(getPiRefData('processTypes'));
    if (!isDeparmentsLoaded) dispatch(getDepartments());
    if (!isStatusesLoaded) dispatch(getPiRefData('status'));

    // cleanup
    return () => {
      dispatch(resetPiSearchParams());
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Helmet>
        <title>{`${utils.string.t('processingInstructions.title')} - ${utils.app.getAppName(uiBrand)}`}</title>
      </Helmet>
      <ProcessingInstructionsView
        gridData={processingInstructionGridData}
        processTypes={processTypes}
        departments={departments}
        statuses={statuses}
      />
    </>
  );
};

export default ProcessingInstructions;
