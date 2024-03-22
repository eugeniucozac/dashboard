import PropTypes from 'prop-types';

// app
import { Tabs, FormActions, Button } from 'components';
import * as constants from 'consts';
import { DmsAttachDocuments, DmsSearchDocuments } from 'modules';
import { useMedia } from 'hooks';
import styles from './DmsUploadFilesClient.styles';
import * as utils from 'utils';

// mui
import { Box, makeStyles } from '@material-ui/core';

DmsUploadFilesClientView.propTypes = {
  tabs: PropTypes.array,
  selectedTab: PropTypes.string,
  selectTab: PropTypes.string,
  referenceId: PropTypes.string,
  sourceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  documentTypeKey: PropTypes.string,
  handlers: PropTypes.shape({
    selectTab: PropTypes.func,
    handleSave: PropTypes.func,
  }),
};

export function DmsUploadFilesClientView({ tabs, selectedTab, handlers, referenceId, sourceId, documentTypeKey }) {
  const media = useMedia();
  const classes = makeStyles(styles, { name: 'DmsUploadFilesClient' })({ isMobile: media.mobile });

  return (
    <div>
      <Box overflow="hidden" display="flex" flexDirection="column">
        <Box flex="1 1 auto" className={classes.tabContainer}>
          <Tabs value={selectedTab} tabs={tabs} onChange={(tabName) => handlers.selectTab(tabName)} />

          {selectedTab === constants.DMS_ATTACH_DOCS_TAB_DOCUMENT && (
            <DmsAttachDocuments referenceId={referenceId} sourceId={sourceId} documentTypeKey={documentTypeKey} />
          )}

          {selectedTab === constants.DMS_ATTACH_DOCS_TAB_SEARCH && <DmsSearchDocuments referenceId={referenceId} sourceId={sourceId} />}
          <Box></Box>
        </Box>
        <FormActions type="dialog">
          <Button text={utils.string.t('app.ok')} type="submit" color="primary" onClick={handlers.handleSave} />
        </FormActions>
      </Box>
    </div>
  );
}
