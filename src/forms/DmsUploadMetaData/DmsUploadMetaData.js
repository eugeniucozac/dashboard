import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

// app
import { DmsUploadMetaDataView } from './DmsUploadMetaData.view';
import { selectDmsMetaData, selectRefDataXbInstances, selectRefDataCatCodesList, selectDmsMetaDataLoader } from 'stores';
import * as utils from 'utils';

DmsUploadMetaData.propTypes = {
  dmsContext: PropTypes.string,
  filesSubmitted: PropTypes.bool,
  postUploadMetaData: PropTypes.array,
};

export default function DmsUploadMetaData({ dmsContext, filesSubmitted, postUploadMetaData }) {
  // redux
  const documentMetaData = useSelector(selectDmsMetaData);
  const refDataXbInstances = useSelector(selectRefDataXbInstances);
  const catCodesData = useSelector(selectRefDataCatCodesList);
  const isMetaDataLoading = useSelector(selectDmsMetaDataLoader);

  const { commonInfo, lossInfo, claimInfo, policyInfo } = utils.dmsFormatter.formatDocumentMetaData(
    documentMetaData,
    dmsContext,
    refDataXbInstances,
    utils.referenceData.catCodes.getAllFormatted(catCodesData)
  );

  return (
    <DmsUploadMetaDataView
      isLoading={isMetaDataLoading}
      dmsContext={dmsContext}
      preUploadMetaData={{ commonInfo, lossInfo, claimInfo, policyInfo }}
      postUploadMetaData={postUploadMetaData}
      filesSubmitted={filesSubmitted}
    />
  );
}
