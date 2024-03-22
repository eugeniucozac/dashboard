import React from 'react';
import PropTypes from 'prop-types';

//app
import styles from './DmsDocViewer.styles';
import { Empty } from 'components';
import * as utils from 'utils';
import { ReactComponent as IconSearchFile } from '../../assets/svg/line-icon-search-file.svg';

//mui
import { makeStyles, Box } from '@material-ui/core';

DmsDocViewerView.propTypes = {
  fileProps: PropTypes.object.isRequired,
};

export function DmsDocViewerView({ fileProps }) {
  const classes = makeStyles(styles, { name: 'DmsDocViewer' })();

  const { url, mimeType, isUnSupported, isFetchable } = fileProps;

  const getFileStyles = (isUnSupported, mimeType) => {
    if (!isUnSupported || !mimeType?.category) {
      switch (mimeType?.category) {
        case 'application':
        case 'text':
          return classes.defaultFrame;
        case 'video':
        case 'audio':
          return classes.mediaFrame;
        case 'image':
          return classes.imageFrame;
        default:
          return classes.defaultFrame;
      }
    } else {
      return classes.unSupportedDocFrame;
    }
  };

  return (
    <Box>
      {isUnSupported ? (
        <Empty
          title={isFetchable ? utils.string.t('dms.docViewer.noSupport') : utils.string.t('dms.docViewer.docFetchFailed')}
          text={isFetchable ? utils.string.t('dms.docViewer.noSupportReason') : utils.string.t('dms.docViewer.docFetchFailedReason')}
          icon={<IconSearchFile />}
          padding
        />
      ) : (
        <iframe
          src={url}
          title="iframe1"
          name="iframe1"
          id="iframe1"
          frameborder="0"
          border="0"
          cellspacing="0"
          className={getFileStyles(isUnSupported, mimeType)}
        />
      )}
    </Box>
  );
}
