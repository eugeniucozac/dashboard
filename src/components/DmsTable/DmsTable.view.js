import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

// app
import styles from './DmsTable.styles';
import {
  TableHead,
  TableCell,
  PopoverMenu,
  TableToolbar,
  TableActions,
  Search,
  Warning,
  Avatar,
  FormFileDrop,
  Button,
  Tooltip,
  Skeleton,
  Pagination,
  Link,
} from 'components';
import { useSort, useMedia } from 'hooks';
import * as constants from 'consts';
import * as utils from 'utils';
import config from 'config';

// mui
import { Table, TableBody, Box, TableRow, Typography, makeStyles, TableContainer, Grid, Checkbox, Switch } from '@material-ui/core';
import DescriptionIcon from '@material-ui/icons/Description';
import CloudDownloadOutlined from '@material-ui/icons/CloudDownloadOutlined';
import CancelIcon from '@material-ui/icons/Cancel';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import LinkIcon from '@material-ui/icons/Link';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';

DmsTableView.propTypes = {
  cols: PropTypes.array.isRequired,
  documents: PropTypes.array.isRequired,
  popoverActions: PropTypes.array.isRequired,
  search: PropTypes.string.isRequired,
  resetKey: PropTypes.number,
  isMultiSelect: PropTypes.bool.isRequired,
  selectedDocs: PropTypes.array.isRequired,
  showHeader: PropTypes.bool,
  canUpload: PropTypes.bool,
  canSearch: PropTypes.bool,
  canUnlink: PropTypes.bool,
  canDelete: PropTypes.bool,
  canMultiSelect: PropTypes.bool,
  canLink: PropTypes.bool,
  fnolViewOptions: PropTypes.shape({
    isClaimsFNOL: PropTypes.bool,
    isClaimsUploadDisabled: PropTypes.bool,
    isDmsDocumentMenuDisabled: PropTypes.bool,
    claimsUploadWarningMsg: PropTypes.string,
    claimsSearchDocumentsTxt: PropTypes.string,
    uploadDocumentsTitle: PropTypes.string,
  }),
  isDmsFromPiRiskRef: PropTypes.bool.isRequired,
  isWorkBasketOrAllCases: PropTypes.bool,
  isDmsFileViewGridDataLoading: PropTypes.bool,
  isSeniorManager: PropTypes.bool,
  isClaims: PropTypes.bool,
  getDocClassification: PropTypes.func,
  canLinkToParentContext: PropTypes.bool,
  parentContext: PropTypes.string,
  handlers: PropTypes.shape({
    resetSearch: PropTypes.func.isRequired,
    submitSearch: PropTypes.func.isRequired,
    handleSort: PropTypes.func.isRequired,
    uploadModal: PropTypes.func.isRequired,
    handleCheckboxClick: PropTypes.func.isRequired,
    showCheckboxesClick: PropTypes.func.isRequired,
    handleMultipleDownload: PropTypes.func.isRequired,
    handleMutipleUnlinking: PropTypes.func.isRequired,
    handleMutipleDelete: PropTypes.func.isRequired,
    handleMutipleLink: PropTypes.func.isRequired,
    linkDocToParentContext: PropTypes.func.isRequired,
  }).isRequired,
  pagination: PropTypes.shape({
    obj: PropTypes.object.isRequired,
    handlers: PropTypes.shape({
      handleChangePage: PropTypes.func.isRequired,
      handleChangeRowsPerPage: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};

export function DmsTableView({
  cols: colsArr,
  sort: sortObj,
  documents,
  popoverActions,
  search,
  resetKey,
  isMultiSelect,
  selectedDocs,
  showHeader,
  canUpload,
  canSearch,
  canUnlink,
  canDelete,
  canMultiSelect,
  canLink,
  fnolViewOptions,
  isDmsFromPiRiskRef,
  isWorkBasketOrAllCases,
  isDmsFileViewGridDataLoading,
  isSeniorManager,
  isClaims,
  getDocClassification,
  canLinkToParentContext,
  parentContext,
  handlers,
  pagination,
}) {
  const media = useMedia();
  const classes = makeStyles(styles, { name: 'DmsTable' })({ isMobile: media.mobile });

  const { isClaimsFNOL, isClaimsUploadDisabled, isDmsDocumentMenuDisabled, claimsUploadWarningMsg, claimsSearchDocumentsTxt } =
    fnolViewOptions;

  const { cols, sort } = useSort(colsArr, sortObj, handlers.handleSort);

  const hasNoDocument = documents?.length === 0;
  const selectedDocLength = selectedDocs?.length;
  const hasNoDocumentSelected = selectedDocLength === 0;

  const TableActionsComponent = (
    <TableActions>
      {showHeader && (
        <Box display="flex" alignItems="center">
          <Box className={classes.icon}>
            <DescriptionIcon />
          </Box>
          <Typography variant="body2" className={classes.title}>
            {utils.string.t('dms.view.documents.title')}
          </Typography>
        </Box>
      )}
    </TableActions>
  );

  const SearchComponent = (
    <Search
      key={resetKey}
      text={search || ''}
      placeholder={isClaimsFNOL ? claimsSearchDocumentsTxt : utils.string.t('dms.view.searchDocuments')}
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
    <Box mt={2}>
      <Box>
        {!canUpload && (
          <TableToolbar>
            {TableActionsComponent}
            {canSearch && SearchComponent}
          </TableToolbar>
        )}

        {canUpload && !isClaimsFNOL && (
          <Grid container>
            <Grid item xs={4} className={classes.fileDropWrapper}>
              <FormFileDrop
                name="file"
                attachedFiles=""
                showUploadPreview={false}
                componentProps={{
                  multiple: true,
                  disabled: isWorkBasketOrAllCases || isSeniorManager,
                }}
                dragLabel={utils.string.t('dms.upload.fileUploadTitle')}
                onChange={handlers.uploadModal()}
              />
            </Grid>
            <Grid item xs={12}>
              <TableToolbar nestedClasses={{ root: classes.tableToolbarRoot }}>
                {TableActionsComponent}
                {canSearch && SearchComponent}
              </TableToolbar>
            </Grid>
          </Grid>
        )}

        {canUpload && isClaimsFNOL && (
          <Grid container>
            <Grid item xs={4} className={isClaimsUploadDisabled && classes.fileDropWrapperContainerDisabled}>
              <Tooltip title={isClaimsUploadDisabled && claimsUploadWarningMsg} block placement="top">
                <Grid item xs={12} className={isClaimsUploadDisabled && classes.fileDropWrapperDisabled}>
                  <FormFileDrop
                    name="file"
                    attachedFiles=""
                    showUploadPreview={false}
                    componentProps={{
                      multiple: true,
                      disabled: isClaimsUploadDisabled || isWorkBasketOrAllCases,
                    }}
                    dragLabel={utils.string.t('dms.upload.claimsFileUploadTitle')}
                    onChange={handlers.uploadModal()}
                  />
                </Grid>
              </Tooltip>
            </Grid>
            <Grid item xs={8}>
              <TableToolbar nestedClasses={{ root: classes.tableToolbarRootforClaims }}>{canSearch && SearchComponent}</TableToolbar>
            </Grid>
          </Grid>
        )}
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead columns={cols} sorting={sort} />
          <TableBody>
            {isDmsFileViewGridDataLoading ? (
              <TableRow>
                <TableCell colSpan={cols.length}>
                  <Skeleton height={40} animation="wave" displayNumber={5} />
                </TableCell>
              </TableRow>
            ) : (
              utils.generic.isValidArray(documents, true) &&
              documents?.map((doc) => {
                const isGxbSrcDoc = doc.srcApplication === constants.DMS_SHAREPATH_SOURCES.gxb;
                const refinedActions = isGxbSrcDoc
                  ? [...popoverActions].map((action) => {
                      const isDeleteAction = action.id === 'delete';
                      const isEditMetaDataAction = action.id === 'editMetaData';
                      return isDeleteAction || isEditMetaDataAction ? { ...action, disabled: true } : action;
                    })
                  : [...popoverActions].map((action) => {
                      const isDeleteAction = action.id === 'delete';
                      return isDeleteAction ? { ...action, disabled: doc?.isLinkedToMultipleContexts ? true : false } : action;
                    });
                const checked =
                  utils.generic.isValidArray(selectedDocs, true) &&
                  selectedDocs?.map((selDoc) => selDoc.documentId).includes(doc.documentId);
                return (
                  <TableRow key={doc.documentId}>
                    <TableCell compact minimal>
                      {isMultiSelect && (
                        <Checkbox color="primary" checked={checked} onClick={(e) => handlers.handleCheckboxClick(e, doc)} />
                      )}
                    </TableCell>
                    {!isDmsFromPiRiskRef && <TableCell>{doc.folderName}</TableCell>}
                    <TableCell>
                      <Link
                        target="_blank"
                        href={`${window.location.origin}/document/${doc.documentId}/${doc.documentName}`}
                        rel="noopener"
                        nestedClasses={{
                          link: classes.link,
                        }}
                        color="secondary"
                        tooltip={{ title: utils.string.t('dms.view.documentTooltip') }}
                        text={doc.documentName}
                      />
                      {Boolean(Number(doc.isUploadedOnGxb)) && (
                        <Box display={'flex'} alignItems={'center'}>
                          <Avatar size={20} border={false} avatarClasses={classes.fileIconColor} icon={InsertDriveFileIcon} />
                          <Typography className={classes.fileNameSize}>{utils.string.t('dms.view.gxb')}</Typography>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>{doc.srcApplication?.toUpperCase()}</TableCell>
                    {!isDmsFromPiRiskRef && !isClaimsFNOL && (
                      <TableCell>{doc.hdriveFolder && doc.hdriveFolder?.match(/.{1,19}/g).join('\n')}</TableCell>
                    )}
                    <TableCell>{doc.documentTypeDescription}</TableCell>
                    <TableCell>{getDocClassification(doc?.docClassification)}</TableCell>
                    <TableCell>
                      {utils.string.t('format.date', { value: { date: doc.updatedDate, format: config.ui.format.date.text } })}
                    </TableCell>
                    <TableCell>{doc.createdByName}</TableCell>
                    <TableCell>{doc.documentVersion}</TableCell>
                    {!(isClaimsFNOL || isClaims) && (
                      <TableCell>
                        {utils.string.t('format.date', { value: { date: doc.createdDate, format: config.ui.format.date.text } })}
                      </TableCell>
                    )}
                    {!isDmsDocumentMenuDisabled && (
                      <TableCell>
                        <PopoverMenu id="view-menu-list" items={refinedActions} data={{ doc }} />
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        {!isDmsFileViewGridDataLoading && hasNoDocument && (
          <Box p={5}>
            <Warning text={utils.string.t('dms.view.gridDataEmptyWarning')} type="info" align="center" size="large" icon />
          </Box>
        )}
      </TableContainer>

      {utils.generic.isValidArray(documents, true) && (
        <Pagination
          page={get(pagination, 'obj.page')}
          count={get(pagination, 'obj.rowsTotal')}
          rowsPerPage={get(pagination, 'obj.rowsPerPage')}
          onChangePage={get(pagination, 'handlers.handleChangePage')}
          onChangeRowsPerPage={get(pagination, 'handlers.handleChangeRowsPerPage')}
        />
      )}

      {canMultiSelect && !hasNoDocument && (
        <>
          <Box className={classes.multiSelectContainer}>
            <Box className={classes.multiSelectTitle}>
              <Typography variant="body2">{utils.string.t('dms.view.multiSelect')}</Typography>
            </Box>
            <Box mr={1}>
              <Switch
                color="primary"
                size="small"
                checked={isMultiSelect}
                disabled={hasNoDocument}
                onChange={(event) => handlers.showCheckboxesClick(event)}
              />
            </Box>
            <Box display="flex" flexDirection="column">
              <Box display="flex">
                <Box mr={1}>
                  <Button
                    icon={CloudDownloadOutlined}
                    iconWide
                    text={utils.string.t('dms.view.buttons.download')}
                    color="primary"
                    variant="outlined"
                    size="xsmall"
                    disabled={!isMultiSelect || hasNoDocument || hasNoDocumentSelected}
                    onClick={() => handlers.handleMultipleDownload()}
                  />
                </Box>
                {canUnlink && (
                  <Box mr={1}>
                    <Button
                      icon={LinkOffIcon}
                      iconWide
                      text={utils.string.t('dms.view.buttons.unlink')}
                      color="primary"
                      variant="outlined"
                      size="xsmall"
                      disabled={!isMultiSelect || hasNoDocument || hasNoDocumentSelected}
                      onClick={() => handlers.handleMutipleUnlinking()}
                    />
                  </Box>
                )}
                {canDelete && (
                  <Box mr={1}>
                    <Button
                      icon={CancelIcon}
                      text={utils.string.t('dms.view.buttons.delete')}
                      color="primary"
                      variant="outlined"
                      size="xsmall"
                      disabled={!isMultiSelect || hasNoDocument || hasNoDocumentSelected}
                      onClick={() => handlers.handleMutipleDelete()}
                    />
                  </Box>
                )}
                {(canLink || canLinkToParentContext) && (
                  <Box mr={1}>
                    <Button
                      icon={LinkIcon}
                      text={`${utils.string.t('dms.view.buttons.linkTo')} ${canLinkToParentContext ? parentContext : ''}`}
                      color="primary"
                      variant="outlined"
                      size="xsmall"
                      disabled={!isMultiSelect || hasNoDocument || hasNoDocumentSelected}
                      onClick={() =>
                        canLinkToParentContext ? handlers?.linkDocToParentContext(selectedDocs) : handlers.handleMutipleLink()
                      }
                    />
                  </Box>
                )}
              </Box>
              {isMultiSelect && (
                <Box display="flex" alignItems="center" mt={0.5}>
                  <Typography variant="body2">
                    {utils.string.t('dms.view.selectedDoc', {
                      count: selectedDocLength,
                    })}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}
