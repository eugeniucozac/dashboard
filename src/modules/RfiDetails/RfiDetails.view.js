import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

//app
import styles from './RfiDetails.styles';
import { RfiAdditionInfo } from './RfiAdditionInfo';
import { Layout, Empty, Skeleton, Link, Info } from 'components';
import { RowDetails, RfiQueryForm } from 'modules';
import * as utils from 'utils';
import config from 'config';
import * as constants from 'consts';
import DescriptionIcon from '@material-ui/icons/Description';

//mui
import { makeStyles, Typography, Box, Grid, Card, CardHeader, CardContent, Divider } from '@material-ui/core';

RfiDetailsView.prototype = {
  rfiOriginType: PropTypes.oneOf(Object.values(constants.RFI_ORIGIN_TYPES_FROM_CAMUNDA)),
  lossInfo: PropTypes.object,
  claimInfo: PropTypes.object,
  taskInfo: PropTypes.object,
  rfiTask: PropTypes.object.isRequired,
  claimsQueryCodes: PropTypes.array.isRequired,
  refDataQueryCodes: PropTypes.array.isRequired,
  rfiHistory: PropTypes.array.isRequired,
  rfiHistoryLoader: PropTypes.boolean,
  rfiHistoryDocumentsLoader: PropTypes.bool,
  handlers: PropTypes.shape({
    openDocViewer: PropTypes.func,
    getRfiHistoryDetails: PropTypes.func,
  }),
};

export function RfiDetailsView({
  rfiOriginType,
  lossInfo,
  claimInfo,
  taskInfo,
  rfiTask,
  claimsQueryCodes,
  refDataQueryCodes,
  rfiHistory,
  rfiHistoryLoader,
  rfiHistoryDocumentsLoader,
  handlers,
}) {
  const classes = makeStyles(styles, { name: 'RfiDetails' })();
  const selectedQueryCode =
    claimsQueryCodes?.find((eachQry) => eachQry?.queryCodeDetails === rfiTask?.queryCode) ||
    refDataQueryCodes?.find((eachQry) => eachQry?.queryCodeDetails === rfiTask?.queryCode);

  const [expanded, setExpanded] = useState([]);
  const DOCUMENTS_COLLAPSE_COUNT = 5;

  const handleClickExpandCollapse = (id, isExpand) => {
    if (isExpand) {
      setExpanded([...expanded, id]);
    } else {
      setExpanded([...expanded?.filter((item) => item !== id)]);
    }
  };

  const checkExpandCollapseDocuments = (documentList, notesId) => {
    let isCollapsed = utils.generic.isValidArray(expanded) && !expanded.includes(notesId);
    const isTruncated = documentList?.length > DOCUMENTS_COLLAPSE_COUNT;
    if (isTruncated && isCollapsed) {
      const truncatedList = [...documentList?.slice(0, DOCUMENTS_COLLAPSE_COUNT)];
      const pendingDocList = documentList?.length - truncatedList?.length;
      return (
        <>
          <Box className={classes.uploadedDocumentContainer}>
            {truncatedList?.map((document) => (
              <Box display="flex" pr={2} key={document?.documentId}>
                <Info
                  size="md"
                  avatarIcon={DescriptionIcon}
                  description={
                    <Link text={document?.documentName} color="secondary" onClick={(event) => handlers.openDocViewer(event, document)} />
                  }
                  verticalAlign={true}
                  avatarBorder={false}
                />
              </Box>
            ))}
          </Box>
          <Box className={classes.expandBtn}>
            <Link
              text={`${utils.string.t('app.seeMore')} (${pendingDocList})`}
              color="secondary"
              onClick={() => handleClickExpandCollapse(notesId, true)}
            />
          </Box>
        </>
      );
    } else {
      return (
        <>
          <Box className={classes.uploadedDocumentContainer}>
            {documentList?.map((document) => (
              <Box display="flex" mb={1} pr={3} key={document?.documentId}>
                <Info
                  size="md"
                  avatarIcon={DescriptionIcon}
                  description={
                    <Link text={document?.documentName} color="secondary" onClick={(event) => handlers.openDocViewer(event, document)} />
                  }
                  verticalAlign={true}
                  avatarBorder={false}
                />
              </Box>
            ))}
          </Box>
          {isTruncated && (
            <Box className={classes.collapseBtn}>
              <Link text={utils.string.t('app.seeLess')} color="secondary" onClick={() => handleClickExpandCollapse(notesId, false)} />
            </Box>
          )}
        </>
      );
    }
  };

  return (
    <div className={classes.wrapper}>
      <Layout main padding>
        <RfiAdditionInfo rfiOriginType={rfiOriginType} lossInfo={lossInfo} claimInfo={claimInfo} taskInfo={taskInfo} rfiTask={rfiTask} />

        <Divider />

        <Card className={classes.root}>
          <CardHeader
            className={classes.cardHeader}
            title={
              <Grid container direction="row">
                <Grid item>
                  <Typography variant="body2" className={classes.title}>
                    {utils.string.t('claims.rfiDashboard.rfiDetails.title')}
                  </Typography>
                </Grid>
              </Grid>
            }
          />
          <CardContent variant="body2" className={classes.cardContent}>
            <div className={classes.details}>
              <Box>
                <RowDetails
                  title={utils.string.t('claims.rfiDashboard.rfiDetails.from')}
                  details={rfiTask?.requestedByFullName}
                  textAlign="right"
                />
                <RowDetails
                  title={utils.string.t('claims.rfiDashboard.rfiDetails.responseDueDate')}
                  details={rfiTask?.targetDueDate && moment(rfiTask?.targetDueDate)?.format(config.ui.format.date.text)}
                  textAlign="right"
                />
                <RowDetails
                  title={utils.string.t('claims.processing.taskDetailsLabels.description')}
                  details={rfiTask?.description}
                  textAlign="right"
                />
              </Box>
              <Box>
                <RowDetails
                  title={utils.string.t('claims.rfiDashboard.rfiDetails.queryCode')}
                  details={selectedQueryCode?.queryCodeDescription}
                  textAlign="right"
                />
                <RowDetails
                  title={utils.string.t('claims.rfiDashboard.rfiDetails.queryId')}
                  details={rfiTask?.queryCode}
                  textAlign="right"
                />
              </Box>
            </div>
          </CardContent>
        </Card>

        <Divider />

        <Card className={classes.root}>
          <CardHeader
            className={classes.cardHeader}
            title={
              <Grid container direction="row">
                <Grid item>
                  <Typography variant="body2" className={classes.title}>
                    {utils.string.t('claims.rfiDashboard.rfiHistory.title')}
                  </Typography>
                </Grid>
              </Grid>
            }
          />

          <Box>
            {utils.generic.isValidArray(rfiHistory, true) ? (
              rfiHistory?.map((rfiReplyData) => (
                <Grid key={rfiReplyData?.caseIncidentNotesID} container className={classes.historyGrid}>
                  <Grid container direction="row" alignItems="center">
                    <Typography variant="body1" className={classes.userName}>
                      {rfiReplyData?.assignee}
                    </Typography>
                    <Typography className={classes.queryDate}>
                      {moment(rfiReplyData?.queryDateTime)?.format(config.ui.format.date.slashNumericDateAndTime)}
                    </Typography>
                  </Grid>
                  <Grid container direction="row" className={classes.queryDescription}>
                    <Typography>{rfiReplyData?.description}</Typography>
                  </Grid>
                  {rfiHistoryDocumentsLoader && (
                    <Box ml={2} mr={2} className={classes.documentsLoaderContainer}>
                      <Grid container spacing={1}>
                        <Grid item xs={12}>
                          <Skeleton height={50} variant="rect" animation="wave" displayNumber={1} />
                        </Grid>
                      </Grid>
                    </Box>
                  )}

                  <Box display="flex" width="100%">
                    {checkExpandCollapseDocuments(rfiReplyData?.documentList, rfiReplyData?.caseIncidentNotesID)}
                  </Box>
                </Grid>
              ))
            ) : rfiHistoryLoader ? (
              <Box ml={2} mr={2}>
                <Grid container spacing={1}>
                  <Grid item xs={2}>
                    <Skeleton height={40} variant="rect" animation="wave" displayNumber={1} />
                  </Grid>
                  <Grid item xs={1}>
                    <Skeleton height={40} variant="rect" animation="wave" displayNumber={1} />
                  </Grid>
                  <Grid item xs={12}>
                    <Skeleton height={60} variant="rect" animation="wave" displayNumber={1} />
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <div>
                <Empty text={utils.string.t('claims.rfiDashboard.rfiHistory.empty')} padding />
              </div>
            )}
          </Box>

          <Box>
            <RfiQueryForm rfiTask={rfiTask} selectedQueryCode={selectedQueryCode} rfiHistory={rfiHistory} handlers={handlers} />
          </Box>
        </Card>
      </Layout>
    </div>
  );
}
