import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { get } from 'lodash';

// app
import styles from './DmsSearch.styles';
import {
  Button,
  Pagination,
  TableActions,
  TableCell,
  TableFilters,
  TableHead,
  TableToolbar,
  Warning,
  PopoverMenu,
  Skeleton,
} from 'components';
import * as utils from 'utils';
import config from 'config';
import { useMedia, useSort, usePagination } from 'hooks';
import { DmsAdvancedSearch } from 'forms';
import * as constants from 'consts';

// mui
import { Checkbox, makeStyles, Box, Table, TableBody, TableContainer, TableRow, Typography, Switch } from '@material-ui/core';
import FindInPageOutlinedIcon from '@material-ui/icons/FindInPageOutlined';
import GetAppOutlinedIcon from '@material-ui/icons/GetAppOutlined';
import LinkOutlinedIcon from '@material-ui/icons/LinkOutlined';
import CloudDownloadOutlined from '@material-ui/icons/CloudDownloadOutlined';
import LinkOffOutlinedIcon from '@material-ui/icons/LinkOffOutlined';

DmsSearchView.propTypes = {
  cols: PropTypes.array.isRequired,
  columnPropsFunc: PropTypes.func.isRequired,
  rows: PropTypes.array.isRequired,
  fields: PropTypes.array.isRequired,
  popoverLinkOption: PropTypes.array,
  buttons: PropTypes.shape({
    cancel: PropTypes.object.isRequired,
    submit: PropTypes.object.isRequired,
  }).isRequired,
  formProps: PropTypes.object.isRequired,
  isFnolDmsSearch: PropTypes.bool,
  searchExpanded: PropTypes.object,
  handlers: PropTypes.shape({
    download: PropTypes.func.isRequired,
    link: PropTypes.func.isRequired,
    fnolLink: PropTypes.func.isRequired,
    sort: PropTypes.func.isRequired,
    handleCheckboxClick: PropTypes.func.isRequired,
    showCheckboxesClick: PropTypes.func.isRequired,
    handleMutiplelinking: PropTypes.func.isRequired,
    handleMultipleDownload: PropTypes.func.isRequired,
    resetFilter: PropTypes.func.isRequired,
    handleSearchFilter: PropTypes.func.isRequired,
    resetNotificationFilters: PropTypes.func,
    viewDocLauncher: PropTypes.func,
  }),
  resetKey: PropTypes.number,
  selectedDocs: PropTypes.array.isRequired,
  isMultiSelect: PropTypes.bool.isRequired,
  pagination: PropTypes.shape({
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    rowsTotal: PropTypes.number,
    handlers: PropTypes.shape({
      handleChangePage: PropTypes.func.isRequired,
      handleChangeRowsPerPage: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  isDmsSearchDataLoading: PropTypes.bool.isRequired,
};

export function DmsSearchView({
  cols: colsArr,
  columnPropsFunc,
  rows,
  sort: sortObj,
  fields,
  buttons,
  formProps,
  isFnolDmsSearch,
  searchExpanded,
  handlers,
  resetKey,
  isMultiSelect,
  selectedDocs,
  pagination,
  tableFilterFields,
  isFetchingFilters,
  isDmsSearchDataLoading,
}) {
  const media = useMedia();
  const classes = makeStyles(styles, { name: 'DmsSearch' })({ isMobile: media.mobile });

  const { cols, sort } = useSort(colsArr, sortObj, handlers.sort);
  const hasNoDocuments = rows?.length === 0;
  const selectedDocLength = selectedDocs?.length;
  const hasNoSelectedDocuments = selectedDocLength === 0;
  const selectedDocumentCount = selectedDocLength === 1 ? 'selectedDoc' : 'selectedDoc_plural';
  const { formState } = formProps;
  const hasClaims = utils.generic.isValidArray(rows, true);
  const paginationObj = usePagination(rows, pagination, pagination.handlers.handleChangePage, pagination.handlers.handleChangeRowsPerPage);

  return (
    <Box mt={2}>
      <TableToolbar>
        <TableActions>
          <Box display="flex" alignItems="center">
            <Box className={classes.icon}>
              <FindInPageOutlinedIcon />
            </Box>
            <Typography variant="body2" className={classes.title}>
              {utils.string.t('dms.search.title')}
            </Typography>
          </Box>
        </TableActions>
        <TableFilters
          nestedClasses={{ root: classes.filterBar }}
          search={false}
          searchAdvanced={<DmsAdvancedSearch fields={fields} buttons={buttons} formProps={formProps} resetKey={resetKey} />}
          searchAdvancedDisabled={formState.isSubmitting || !formState.isDirty}
          searchAdvancedExpanded={searchExpanded}
          handlers={{
            onResetFilter: handlers.resetFilter,
            onFilter: (values) => handlers.handleSearchFilter(values),
            onToggleColumn: handlers.toggleColumn,
          }}
          filters
          isFetchingFilters={isFetchingFilters}
          filtersArray={tableFilterFields}
        />
      </TableToolbar>
      <TableContainer>
        <Table size="small">
          <TableHead columns={cols} sorting={sort} nestedClasses={{ tableHead: classes.tableHead }} />
          <TableBody>
            {isDmsSearchDataLoading ? (
              <TableRow>
                <TableCell colSpan={cols.length}>
                  <Skeleton height={40} animation="wave" displayNumber={5} />
                </TableCell>
              </TableRow>
            ) : (
              rows.map((doc, i) => {
                const checked =
                  utils.generic.isValidArray(selectedDocs, true) &&
                  selectedDocs?.map((selDoc) => selDoc.documentId).includes(doc.documentId);
                return (
                  <TableRow hover key={doc.documentId} className={classes.docViewCursor} onClick={(e) => handlers.viewDocLauncher(e, doc)}>
                    <TableCell compact minimal>
                      {isMultiSelect && (
                        <Checkbox color="primary" checked={checked} onClick={(e) => handlers.handleCheckboxClick(e, doc)} />
                      )}
                    </TableCell>
                    <TableCell title={doc?.documentName} className={classes.noWrap} {...columnPropsFunc('fileName')}>
                      {doc.documentName.match(/.{1,19}/g).join('\n')}
                      {Boolean(doc.isLinked) && <Button size="small" variant="text" icon={LinkOutlinedIcon} disabled />}
                    </TableCell>
                    <TableCell title={doc?.hdriveFolder} className={classes.noWrap} {...columnPropsFunc('hDriveFolders')}>
                      {doc.hdriveFolder && doc.hdriveFolder.match(/.{1,19}/g).join('\n')}
                    </TableCell>
                    <TableCell {...columnPropsFunc('reference')}>{doc?.reference || 'N/A'}</TableCell>
                    <TableCell {...columnPropsFunc('documentType')}>{doc.documentTypeDescription}</TableCell>
                    <TableCell {...columnPropsFunc('version')}>{doc.documentVersion}</TableCell>
                    <TableCell {...columnPropsFunc('uploadedBy')}>
                      {doc.uploadedName}
                      {!isFnolDmsSearch && (
                        <Typography classes={{ root: classes.uploadedDate }}>
                          {utils.string.t('format.date', {
                            value: { date: doc?.uploadedDate, format: config.ui.format.date.text },
                          })}
                        </Typography>
                      )}
                    </TableCell>
                    {isFnolDmsSearch && (
                      <TableCell {...columnPropsFunc('uploadedDate')}>
                        {utils.string.t('format.date', {
                          value: { date: doc?.uploadedDate, format: config.ui.format.date.text },
                        })}
                      </TableCell>
                    )}

                    <TableCell title={doc?.documentName} {...columnPropsFunc('actionButtons')} nowrap>
                      <Button size="small" variant="text" icon={GetAppOutlinedIcon} onClick={(e) => handlers.download(e, doc)} />
                      {!isFnolDmsSearch ? (
                        <Button
                          size="small"
                          variant="text"
                          disabled={doc.isLinked}
                          icon={!doc.isLinked ? LinkOutlinedIcon : LinkOffOutlinedIcon}
                          onClick={(e) => (!doc.isLinked ? handlers.link(e, doc) : false)}
                        />
                      ) : (
                        <PopoverMenu
                          id="dms-link-functions"
                          icon={LinkOutlinedIcon}
                          size="small"
                          color="primary"
                          iconPosition="center"
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                          }}
                          items={[
                            { id: 'lossLink', label: 'Link to Loss', callback: () => handlers.fnolLink(doc, constants.DMS_CONTEXT_LOSS) },
                            {
                              id: 'claimLink',
                              label: 'Link to Claim',
                              callback: () => handlers.fnolLink(doc, constants.DMS_CONTEXT_CLAIM),
                            },
                          ]}
                          nestedClasses={{ root: classnames(classes.linkPopover) }}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        {hasNoDocuments && !isDmsSearchDataLoading && (
          <Box p={5}>
            <Warning text={utils.string.t('dms.search.gridDataEmptyWarning')} type="info" align="center" size="large" icon />
          </Box>
        )}
      </TableContainer>
      <Box display="flex" alignItems="center" className={classes.buttonContainer}>
        <Box className={classes.multiSelect}>
          <Typography variant="body2">{utils.string.t('dms.view.multiSelect')}</Typography>
        </Box>
        <Box>
          <Switch
            size="small"
            checked={isMultiSelect}
            disabled={hasNoDocuments}
            onChange={(event) => handlers.showCheckboxesClick(event)}
          />
        </Box>
        <Box>
          <Button
            icon={CloudDownloadOutlined}
            text={utils.string.t('dms.view.buttons.download')}
            color={'default'}
            size="xsmall"
            disabled={hasNoDocuments || hasNoSelectedDocuments}
            nestedClasses={{ btn: classnames(classes.button) }}
            onClick={() => handlers.handleMultipleDownload()}
          />
        </Box>
        <Box>
          {!isFnolDmsSearch ? (
            <Button
              icon={LinkOutlinedIcon}
              text={utils.string.t('dms.view.buttons.link')}
              color={'default'}
              size="xsmall"
              disabled={hasNoDocuments || hasNoSelectedDocuments}
              nestedClasses={{ btn: classnames(classes.button) }}
              onClick={() => handlers.handleMutiplelinking()}
            />
          ) : (
            <PopoverMenu
              id="dms-link-functions"
              icon={LinkOutlinedIcon}
              size="xsmall"
              variant="outlined"
              text={utils.string.t('dms.view.buttons.link')}
              color="default"
              iconPosition="left"
              disabled={hasNoDocuments || hasNoSelectedDocuments}
              isButton
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              items={[
                { id: 'lossLink', label: 'Link to Loss', callback: () => handlers.handleMutiplelinking(constants.DMS_CONTEXT_LOSS) },
                { id: 'claimLink', label: 'Link to Claim', callback: () => handlers.handleMutiplelinking(constants.DMS_CONTEXT_CLAIM) },
              ]}
              nestedClasses={{ root: classnames(classes.linkPopover) }}
            />
          )}
        </Box>
      </Box>
      <Box display="flex" alignItems="center">
        {isMultiSelect && (
          <Box className={classes.selectedDocCount}>
            <Typography variant="body2">
              {utils.string.t(`dms.view.${selectedDocumentCount}`, {
                count: selectedDocLength,
              })}
            </Typography>
          </Box>
        )}
      </Box>
      {hasClaims && (
        <Pagination
          page={get(paginationObj, 'obj.page')}
          count={get(paginationObj, 'obj.rowsTotal')}
          rowsPerPage={get(paginationObj, 'obj.rowsPerPage')}
          onChangePage={get(paginationObj, 'handlers.handleChangePage')}
          onChangeRowsPerPage={get(paginationObj, 'handlers.handleChangeRowsPerPage')}
        />
      )}
    </Box>
  );
}
