import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import compact from 'lodash/compact';
import omit from 'lodash/omit';

// app
import { DownloadFilesView } from './DownloadFiles.view';
import { hideModal, downloadWhitespacePdf, downloadWhitespaceZip } from 'stores';
import * as utils from 'utils';

DownloadFiles.propTypes = {
  umrIds: PropTypes.array.isRequired,
  handleClose: PropTypes.func.isRequired,
};

DownloadFiles.defaultProps = {
  umrIds: [],
};

export default function DownloadFiles({ umrIds, handleClose }) {
  const dispatch = useDispatch();

  // abort
  if (!utils.generic.isValidArray(umrIds, true)) return null;

  const handleSubmit = async ({ downloadAll, downloadUmr }) => {
    if (downloadAll) {
      const blob = await dispatch(downloadWhitespaceZip(umrIds));
      dispatch(hideModal());
      utils.file.download(blob, `${utils.string.t('app.contract_plural')}-${umrIds.join('-')}.zip`);
    } else if (downloadUmr.length >= 2) {
      const blob = await dispatch(downloadWhitespaceZip(downloadUmr));
      dispatch(hideModal());
      utils.file.download(blob, `${utils.string.t('app.contract_plural')}-${downloadUmr.join('-')}.zip`);
    } else if (downloadUmr.length === 1) {
      const blob = await dispatch(downloadWhitespacePdf(downloadUmr[0]));
      dispatch(hideModal());
      utils.file.download(blob, `${utils.string.t('app.contract')}-${downloadUmr[0]}.pdf`);
    }
  };

  const fields = [
    {
      name: 'downloadAll',
      type: 'checkbox',
      value: false,
      title: utils.string.t('openingMemo.whitespace.downloadAllUmrs'),
      label: utils.string.t('app.all'),
      hint: umrIds.join(', '),
    },
    {
      name: 'downloadUmr',
      type: 'checkbox',
      title: utils.string.t('openingMemo.whitespace.downloadSelectUmrs'),
      value: [],
      options: umrIds.map((umr) => ({
        label: umr,
        name: umr,
        value: false,
      })),
    },
  ];

  const actions = [
    {
      name: 'cancel',
      label: utils.string.t('app.cancel'),
      handler: handleClose,
    },
    {
      name: 'submit',
      label: utils.string.t('app.download'),
      handler: (values) => handleSubmit(values),
    },
  ];

  const isValid = (values) => {
    const umrsFiltered = omit(values, values.downloadAll);
    const isUmrOptionsValid = utils.generic.isValidArray(umrsFiltered, true) && umrsFiltered.length > 0;

    return Boolean(values.downloadAll || isUmrOptionsValid);
  };

  const isDownloadAllSelected = ({ downloadAll }) => {
    return Boolean(downloadAll);
  };

  const isDownloadUmrSelected = (values) => {
    const downloadUmr = omit(values, values.downloadAll);
    return Boolean(utils.generic.isValidArray(compact(downloadUmr), true));
  };

  return (
    <DownloadFilesView
      fields={fields}
      actions={actions}
      isValid={isValid}
      isDownloadAllSelected={isDownloadAllSelected}
      isDownloadUmrSelected={isDownloadUmrSelected}
    />
  );
}
