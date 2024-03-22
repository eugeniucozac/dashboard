import PropTypes from 'prop-types';

// mui
import { Grid, makeStyles, Box } from '@material-ui/core';

// app
import { FormFileDrop, TableToolbar, Search } from 'components';
import * as utils from 'utils';
import { useMedia } from 'hooks';
import styles from './DmsAttachDocuments.styles';
import { DmsAttachDocumentsTable } from '../DmsAttachDocumentsTable/DmsAttachDocumentsTable';

DmsAttachDocumentsView.propTypes = {
  search: PropTypes.string.isRequired,
  resetKey: PropTypes.number,
  handlers: PropTypes.shape({
    uploadModal: PropTypes.func,
  }),
};

export function DmsAttachDocumentsView({ search, resetKey, handlers, documentList }) {
  const media = useMedia();
  const classes = makeStyles(styles, { name: 'DmsAttachDocuments' })({ isMobile: media.mobile });

  const SearchComponent = (
    <Search
      text=""
      placeholder={utils.string.t('dms.view.searchDocuments')}
      minChars={4}
      submitButtonProps={{ size: 'small' }}
      nestedClasses={{
        inputPropsRoot: classes.inputPropsRoot,
      }}
      handlers={{
        search: (args) => {
          handlers.submitSearch(args);
        },
        reset: () => {
          handlers.resetSearch();
        },
      }}
    />
  );

  return (
    <div>
      <Box mt={2} className={classes.tableContainer}>
        <Grid container>
          <Grid item xs={4}>
            <Grid item xs={12}>
              <FormFileDrop
                name="file"
                attachedFiles=""
                showUploadPreview={false}
                componentProps={{
                  multiple: true,
                }}
                dragLabel={utils.string.t('dms.upload.claimsFileUploadTitle')}
                onChange={handlers.uploadModal()}
              />
            </Grid>
          </Grid>
          <Grid item xs={8}>
            <TableToolbar nestedClasses={{ root: classes.tableToolbarRootforClaims }}>{SearchComponent}</TableToolbar>
          </Grid>

          <DmsAttachDocumentsTable documentList={documentList}/>
        </Grid>
      </Box>
    </div>
  );
}
