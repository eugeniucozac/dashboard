import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';

// app
import { getFilesList, showModal, postOpeningMemoPDF, selectUser, getPolicy } from 'stores';
import { OpeningMemoView } from './OpeningMemo.view';
import { downloadPDF, savePDF } from './OpeningMemo.pdf';
import * as utils from 'utils';

OpeningMemo.propTypes = {
  routeWithId: PropTypes.bool.isRequired,
  route: PropTypes.string.isRequired,
  origin: PropTypes.shape({
    path: PropTypes.string.isRequired,
    id: PropTypes.number,
  }),
};

OpeningMemo.defaultProps = {
  routeWithId: false,
};

export default function OpeningMemo({ routeWithId, route, origin }) {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const configVars = useSelector((state) => state.config.vars);
  const openingMemoSelected = useSelector((state) => state.openingMemo.selected);
  const referenceData = useSelector((state) => state.referenceData) || [];
  const [umrFiles, setUmrFiles] = useState([]);
  const [hasXbPolicies, setHasXbPolicies] = useState(false);
  const isApproved = utils.openingMemo.isApproved(openingMemoSelected) && hasXbPolicies;

  useEffect(
    () => {
      // fetch XB policies associated with the UMR(s) listed on the Opening Memo
      if (openingMemoSelected && openingMemoSelected.uniqueMarketReference) {
        dispatch(getPolicy(openingMemoSelected.uniqueMarketReference, false)).then((response) => {
          setHasXbPolicies(utils.generic.isValidArray(response, true));
        });
      }

      // DEV ONLY!!!
      // temporarily prevent whitespace call
      if (utils.app.isDevelopment(configVars)) {
        if (!openingMemoSelected || !openingMemoSelected.uniqueMarketReference) return;

        const getUmrFileList = async () => {
          return await dispatch(getFilesList(openingMemoSelected.uniqueMarketReference));
        };

        getUmrFileList().then((data) => {
          setUmrFiles(data);
        });
      }
    },
    [openingMemoSelected.uniqueMarketReference] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const popoverItems = [
    {
      id: 'addUMR',
      label: utils.string.t('openingMemo.addEditUmr.title'),
      callback: () => handleAddEditUmr(),
    },
    ...(utils.generic.isValidArray(umrFiles, true)
      ? [
          {
            id: 'downloadWhitespaceMrc',
            label: utils.string.t('openingMemo.whitespace.downloadMrc'),
            callback: () => handleDownloadWhitespaceMRC(),
          },
        ]
      : []),
    {
      id: 'downloadOpeningMemo',
      label: utils.string.t('openingMemo.downloadOpeningMemo'),
      callback: () => handleDownloadOpeningMemo(),
    },
    ...(utils.user.isBroker(user)
      ? [
          {
            id: 'uploadOpeningMemo',
            label: utils.string.t('openingMemo.upload.btn'),
            disabled: !isApproved,
            tooltip: !isApproved
              ? !hasXbPolicies
                ? utils.string.t('openingMemo.upload.noXbPolicies')
                : utils.string.t('openingMemo.upload.notApproved')
              : null,
            callback: () => handleUploadOpeningMemo(),
          },
        ]
      : []),
  ];

  const handleDownloadWhitespaceMRC = () => {
    dispatch(
      showModal({
        component: 'DOWNLOAD_FILES',
        props: {
          title: 'openingMemo.whitespace.downloadMrc',
          fullWidth: true,
          maxWidth: 'sm',
          disableAutoFocus: true,
          componentProps: {
            umrIds: umrFiles,
          },
        },
      })
    );
  };

  const handleDownloadOpeningMemo = () => {
    downloadPDF({
      openingMemo: openingMemoSelected,
      departmentName: utils.placement.getDepartmentName(openingMemoSelected, referenceData.departments),
      referenceData,
    });
  };

  const handleUploadOpeningMemo = () => {
    const pdf = savePDF({
      openingMemo: openingMemoSelected,
      departmentName: utils.placement.getDepartmentName(openingMemoSelected, referenceData.departments),
      referenceData,
    });

    if (isApproved) {
      dispatch(postOpeningMemoPDF(openingMemoSelected.id, pdf));
    }
  };

  const handleAddEditUmr = () => {
    const umr = openingMemoSelected ? get(openingMemoSelected, 'uniqueMarketReference', '') : '';

    dispatch(
      showModal({
        component: 'ADD_EDIT_UMR',
        props: {
          title: 'openingMemo.addEditUmr.title',
          subtitle: umr.replace(/,/g, ', '),
          fullWidth: true,
          maxWidth: 'xs',
          disableAutoFocus: true,
          componentProps: {
            origin,
            openingMemo: openingMemoSelected,
          },
        },
      })
    );
  };

  return <OpeningMemoView origin={origin} routeWithId={routeWithId} route={route} popoverItems={popoverItems} />;
}
