//react
import { React, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

//app
import styles from './PremiumProcessingCaseClientTable.styles';
import * as utils from 'utils';
import { EmailManagementService, TableHead, TableCell, Button, Warning, Tooltip } from 'components';
import { useFlexiColumns, useSort } from 'hooks';
import * as constants from 'consts';

//mui
import { Table, TableBody, TableRow, TableContainer, makeStyles, Box, Collapse, Hidden } from '@material-ui/core';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

PremiumProcessingCaseClientTableView.propTypes = {
  accountName: PropTypes.string.isRequired,
  caseDetailsObject: PropTypes.object.isRequired,
  caseIncidentID: PropTypes.string.isRequired,
  columnsData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.node.isRequired,
    })
  ).isRequired,
  clientTable: PropTypes.array.isRequired,
  openEms: PropTypes.bool.isRequired,
  clientDetails: PropTypes.object.isRequired,
  frontEndSendDocs: PropTypes.bool.isRequired,
  isSendEmailAllowed: PropTypes.bool.isRequired,
  isFecSendEmailAllowed: PropTypes.bool.isRequired,
  hasViewOrEditAccess: PropTypes.bool.isRequired,
  handlers: PropTypes.shape({
    sendEmail: PropTypes.func.isRequired,
  }).isRequired,
  isNotMyTaskView: PropTypes.bool.isRequired,
};

export default function PremiumProcessingCaseClientTableView({
  accountName,
  caseDetailsObject,
  caseIncidentID,
  columnsData,
  clientTable,
  isSendEmailAllowed,
  isFecSendEmailAllowed,
  openEms,
  clientDetails,
  frontEndSendDocs,
  hasViewOrEditAccess,
  handlers,
  isNotMyTaskView,
}) {
  const classes = makeStyles(styles, { name: 'PremiumProcessingCaseClientTable' })();
  const [columns] = useState(columnsData);
  const { columns: columnsArray, columnProps } = useFlexiColumns(columns);
  const { cols } = useSort(columnsArray, {});
  return (
    <>
      {openEms && caseIncidentID ? (
        <EmailManagementService
          accountName={accountName}
          caseDetailsObject={caseDetailsObject}
          objectId={caseIncidentID}
          objectCode={constants.EMS_CONTEXT_CASE}
          emailType={constants.EMS_EMAIL_TYPE_CLIENT}
          accountLabel={utils.string.t('ems.clientName')}
          accountDetails={clientDetails}
          handlers={{
            goBack: handlers.goBack,
          }}
        />
      ) : (
        <TableContainer>
          <Table>
            {columnsArray && <TableHead columns={cols} />}
            <TableBody size="small">
              {utils.generic.isValidArray(clientTable, true) ? (
                clientTable.map((clientData) => {
                  return (
                    <>
                      <TableRow className={classes.root}>
                        <TableCell {...columnProps('client')}>
                          <Hidden xsDown>
                            <Tooltip
                              disableFocusListener={!hasViewOrEditAccess || isNotMyTaskView}
                              disableHoverListener={!hasViewOrEditAccess || isNotMyTaskView}
                              disableTouchListener={!hasViewOrEditAccess || isNotMyTaskView}
                              title={
                                <>
                                  {utils.string.t('premiumProcessing.client.clientName')}
                                  {clientData.accountName}
                                  <br />
                                  {utils.string.t('premiumProcessing.client.address')} {clientData.clientAddress}
                                </>
                              }
                              placement="top"
                              nestedClasses={{ tooltip: classnames(classes.toolTip) }}
                            >
                              {clientData.accountName.substr(0, 30)}
                            </Tooltip>
                          </Hidden>
                        </TableCell>
                        <TableCell {...columnProps('documentSent')}>{clientData.documentsSend}</TableCell>
                        <TableCell {...columnProps('status')}>
                          <CheckCircleOutlineIcon className={clientData.status ? classes.enabled : classes.disabled} />
                        </TableCell>
                        <TableCell {...columnProps('sentDate')}>{clientData.sendDate}</TableCell>
                        <TableCell {...columnProps('emailDocument')}>
                          {
                            <Button
                              onClick={() => {
                                clientData.documentSentType = clientData.documentsSend;
                                handlers.sendEmail(clientData);
                              }}
                              size="xsmall"
                              tooltip={{
                                title: clientData.sendEmailDocument
                                  ? utils.string.t('premiumProcessing.processingClientTable.tableColumns.viewEmail')
                                  : utils.string.t('premiumProcessing.processingClientTable.tableColumns.sendEmail'),
                              }}
                              variant="outlined"
                              color="default"
                              text={
                                clientData.sendEmailDocument
                                  ? utils.string.t('premiumProcessing.processingClientTable.tableColumns.viewEmail')
                                  : utils.string.t('premiumProcessing.processingClientTable.tableColumns.sendEmail')
                              }
                              light
                              disabled={!isSendEmailAllowed || isNotMyTaskView}
                            />
                          }
                        </TableCell>
                        <TableRow>
                          <TableCell colSpan={6} className={classes.style}>
                            <Collapse in={frontEndSendDocs} timeout="auto" unmountOnExit />
                          </TableCell>
                        </TableRow>
                      </TableRow>
                      {frontEndSendDocs ? (
                        <TableRow>
                          <TableCell {...columnProps('client')}></TableCell>
                          <TableCell {...columnProps('documentSent')}>{clientData.documentsSend_FECtoClient}</TableCell>
                          <TableCell {...columnProps('status')}>
                            <CheckCircleOutlineIcon className={clientData.status_FECtoClient ? classes.enabled : classes.disabled} />
                          </TableCell>
                          <TableCell {...columnProps('sentDate')}>{clientData.sendDate_FECtoClient}</TableCell>
                          <TableCell {...columnProps('emailDocument')}>
                            <Button
                              onClick={() => {
                                clientData.documentSentType = clientData.documentsSend_FECtoClient;
                                handlers.sendEmail(clientData);
                              }}
                              disabled={!isFecSendEmailAllowed || isNotMyTaskView || clientData.isNotBackOfficeToFecMailSent}
                              size="xsmall"
                              tooltip={{
                                title: clientData.sendEmailDocument_FECtoClient
                                  ? utils.string.t('premiumProcessing.processingClientTable.tableColumns.viewEmail')
                                  : utils.string.t('premiumProcessing.processingClientTable.tableColumns.sendEmail'),
                              }}
                              variant="outlined"
                              color="default"
                              text={
                                clientData.sendEmailDocument_FECtoClient
                                  ? utils.string.t('premiumProcessing.processingClientTable.tableColumns.viewEmail')
                                  : utils.string.t('premiumProcessing.processingClientTable.tableColumns.sendEmail')
                              }
                              light
                            />
                          </TableCell>
                        </TableRow>
                      ) : null}
                    </>
                  );
                })
              ) : (
                <Box>
                  <Warning
                    text={utils.string.t('premiumProcessing.processingClientTable.warningText')}
                    type="info"
                    align="left"
                    size="small"
                    icon
                  />
                </Box>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}
