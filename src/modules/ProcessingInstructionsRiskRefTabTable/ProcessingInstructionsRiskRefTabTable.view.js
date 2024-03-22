import React from 'react';
import PropTypes from 'prop-types';

//app
import styles from './ProcessingInstructionsRiskRefTabTable.styles';
import { Badge, Overflow, TableCell, TableHead, Button, Skeleton, Tooltip } from 'components';
import * as utils from 'utils';
import { useMedia } from 'hooks';

// mui
import { makeStyles, Checkbox, TableContainer, Table, TableBody, TableRow, Typography } from '@material-ui/core';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import CheckIcon from '@material-ui/icons/Check';

ProcessingInstructionsRiskRefTabTableView.propTypes = {
  columns: PropTypes.array.isRequired,
  documents: PropTypes.object.isRequired,
  isFaBorderProcessType: PropTypes.bool,
  isRiskReferenceDocumentCountLoading: PropTypes.bool,
  riskReferencesDocumentsCountList: PropTypes.array.isRequired,
  selectedRefinementColumns: PropTypes.bool,
  handlers: PropTypes.shape({
    manageSetting: PropTypes.func.isRequired,
  }).isRequired,
};

export default function ProcessingInstructionsRiskRefTabTableView({
  columns,
  documents,
  isFaBorderProcessType,
  isRiskReferenceDocumentCountLoading,
  riskReferencesDocumentsCountList,
  selectedRefinementColumns,
  handlers,
}) {
  const { mobile, tablet, wideUp } = useMedia();
  const classes = makeStyles(styles, { name: 'ProcessingInstructionsRiskRefTabTable' })({
    isMobile: mobile,
    isTablet: tablet,
    wide: wideUp,
  });

  return (
    <Overflow>
      <TableContainer className={classes.tableContainer}>
        <Table size="small" data-testid="riskRefs-grid" stickyHeader>
          <TableHead columns={columns} nestedClasses={{ tableHead: classes.tableHead }} data-testid="riskRefs-grid-th" />
          <TableBody data-testid="riskRef-grid-body">
            {documents?.riskReferences?.map((riskRef, idx) => {
              const documentCountValue =
                utils.generic.isValidArray(riskReferencesDocumentsCountList, true) &&
                riskReferencesDocumentsCountList?.find((a) => a.riskRefId === riskRef.riskRefId);
              return (
                <TableRow key={riskRef.riskRefId + '_' + idx} hover>
                  <TableCell nowrap left>
                    {(riskRef.leadPolicy || riskRef.isLeadPolicy === 'Yes') && (
                      <Badge badgeContent={<CheckIcon className={classes.icon} />} type="success" compact standalone />
                    )}
                  </TableCell>
                  <TableCell nowrap>{riskRef.riskRefId}</TableCell>
                  <TableCell nowrap>{riskRef.assuredName}</TableCell>
                  <TableCell>{riskRef.yoa}</TableCell>
                  <TableCell>{riskRef.xbInstance}</TableCell>
                  <TableCell>{riskRef.clientName}</TableCell>
                  <TableCell>{riskRef.status}</TableCell>
                  <TableCell>{riskRef.riskDetails}</TableCell>

                  {selectedRefinementColumns && (
                    <>
                      <TableCell>{riskRef.endorsementNumber}</TableCell>
                      <TableCell>
                        <Checkbox color="primary" checked={riskRef.isNonPremium === 'Yes'} disabled />
                      </TableCell>
                    </>
                  )}
                  <TableCell center>
                    {isRiskReferenceDocumentCountLoading ? (
                      <Skeleton animation="wave" height={20} displayNumber={1} />
                    ) : utils.generic.isValidObject(documentCountValue, 'documentCount') &&
                      !isFaBorderProcessType &&
                      documentCountValue.documentCount === 0 ? (
                      <Tooltip
                        title={utils.string.t('processingInstructions.checklist.tabs.riskRefs.table.documentRequired')}
                        placement="bottom"
                      >
                        <Typography className={classes.zeroDocument}>{documentCountValue.documentCount}</Typography>
                      </Tooltip>
                    ) : (
                      documentCountValue.documentCount
                    )}
                  </TableCell>
                  <TableCell menu center>
                    <Button
                      icon={InsertDriveFileIcon}
                      size="medium"
                      variant="text"
                      color="default"
                      tooltip={{ title: utils.string.t('app.uploadDocuments') }}
                      light
                      onClick={() => {
                        handlers.manageSetting({ riskRef });
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Overflow>
  );
}
