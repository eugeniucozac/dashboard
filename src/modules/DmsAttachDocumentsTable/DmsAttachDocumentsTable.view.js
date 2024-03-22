import PropTypes from 'prop-types';

// app
import * as utils from 'utils';
import { Avatar, PopoverMenu, Overflow, TableHead, Warning, Button } from 'components';
import config from 'config';
import { useMedia } from 'hooks';
import styles from './DmsAttachDocumentsTable.styles';

// mui
import { Box, makeStyles, Table, TableBody, TableRow, TableCell, Typography, Checkbox, Switch } from '@material-ui/core';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import CancelIcon from '@material-ui/icons/Cancel';

DmsAttachDocumentsTableView.propTypes = {
  columnsArray: PropTypes.array,
  documentList: PropTypes.array,
  popoverActions: PropTypes.array,
  handlers: PropTypes.shape({
    getDocClassification: PropTypes.func,
    handleCheckboxClick: PropTypes.func.isRequired,
    showCheckboxesClick: PropTypes.func.isRequired,
    handleMutipleDelete: PropTypes.func.isRequired,
    handleMutipleUnlinking: PropTypes.func.isRequired,
  }),
};

export function DmsAttachDocumentsTableView({ columnsArray, documentList, popoverActions, handlers, isMultiSelect, selectedDocs }) {
  const media = useMedia();
  const classes = makeStyles(styles, { name: 'DmsAttachDocumentsTable' })({ isMobile: media.mobile });
  const hasNoDocument = documentList?.length === 0;
  const selectedDocLength = selectedDocs?.length;
  const hasNoDocumentSelected = selectedDocLength === 0;

  return (
    <Box mt={2} className={classes.tableContainer}>
      <Overflow>
        <Table size="small">
          <TableHead columns={columnsArray} />
          <TableBody>
            {documentList?.map((doc, index) => {
              const refinedActions = [...popoverActions].map((action) => {
                return (
                  (doc?.isLink && action.id === 'delete' ? { ...action, disabled: true } : action) ||
                  (!doc?.isLink && action.id === 'unlink' ? { ...action, disabled: true } : action)
                );
              });
              const checked =
                utils.generic.isValidArray(selectedDocs, true) &&
                selectedDocs?.map((selDoc) => selDoc.documentName).includes(doc.documentName);
              return (
                <TableRow key={doc?.documentName}>
                  <TableCell compact minimal>
                    {isMultiSelect && <Checkbox color="primary" checked={checked} onClick={(e) => handlers.handleCheckboxClick(e, doc)} />}
                  </TableCell>
                  <TableCell>
                    {doc?.documentName}
                    {Boolean(Number(doc?.isUploadedOnGxb)) && (
                      <Box display={'flex'} alignItems={'center'}>
                        <Avatar size={20} border={false} icon={InsertDriveFileIcon} />
                        <Typography>{utils.string.t('dms.view.gxb')}</Typography>
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>{doc?.srcApplication?.toUpperCase()}</TableCell>

                  <TableCell>{doc?.documentTypeDescription}</TableCell>
                  <TableCell>{handlers.getDocClassification(doc?.docClassification)}</TableCell>
                  <TableCell>
                    {utils.string.t('format.date', { value: { date: doc?.updatedDate, format: config.ui.format.date.text } })}
                  </TableCell>
                  <TableCell>{doc?.createdByName}</TableCell>

                  <TableCell>
                    {utils.string.t('format.date', { value: { date: doc?.createdDate, format: config.ui.format.date.text } })}
                  </TableCell>

                  <TableCell>
                    <PopoverMenu id="view-menu-list" items={refinedActions} data={{ index }} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {utils.generic.isInvalidOrEmptyArray(documentList) && (
          <Box p={5}>
            <Warning text={utils.string.t('dms.view.gridDataEmptyWarning')} type="info" align="center" size="large" icon />
          </Box>
        )}
      </Overflow>
      {!hasNoDocument && (
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
      )}
    </Box>
  );
}
