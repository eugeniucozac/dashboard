import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import * as utils from 'utils';
import { DetailsCard } from 'modules';
import { Accordion, TableHead, TableCell, Overflow, Skeleton, Info } from 'components';
import styles from './TaskDetails.styles';
import { Typography, makeStyles, Grid, Table, TableBody, TableRow, Divider } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import config from 'config';

TasksAdditionInfo.propTypes = {
  handleStep: PropTypes.func.isRequired,
  lossInfo: PropTypes.array.isRequired,
  policyInfo: PropTypes.array.isRequired,
  claimInfo: PropTypes.array.isRequired,
  underWritingInfo: PropTypes.object.isRequired,
  underWritingGroupColumns: PropTypes.array.isRequired,
};
export function TasksAdditionInfo({
  handleEditLoss = () => {},
  lossInfo,
  policyInfo,
  claimInfo,
  underWritingInfo,
  underWritingGroupColumns,
  taskInfo,
  isTaskDetailsLoading,
  taskObj = {},
}) {
  const [accordionsExpandStatus, setAccordiansStatus] = useState({
    [utils.string.t('claims.lossInformation.title')]: false,
    [utils.string.t('claims.claimInformation.title')]: true,
    [utils.string.t('claims.claimInformation.policyTitle')]: false,
    [utils.string.t('claims.underWritingGroups.tilteInformation')]: false,
  });
  const setAccordiansIsExpanded = (cardName, isExpand) => {
    const accordionsStatus = { ...accordionsExpandStatus };
    accordionsStatus[cardName] = isExpand;
    setAccordiansStatus(accordionsStatus);
  };
  const classes = makeStyles(styles, { name: 'TaskDetails' })();

  const accordionTitle = (title) => {
    return (
      <Typography className={classes.title} variant="body2">
        {' '}
        {title}
      </Typography>
    );
  };

  const renderInfoCard = (items) => {
    return (
      <Grid container spacing={2}>
        {items?.map((info) => (
          <Grid item xs={6} sm={4} md={info?.colsUpdate ? 4 : 3} key={info?.title}>
            <Info title={info?.title} description={info?.value || ''} showSkeleton={info?.isLoading} />
          </Grid>
        ))}
      </Grid>
    )
  };

  const underWritingInfoCard = (underWriting) => {
    return (
      <>
        <div className={classes.underWritingContainer}>
          <DetailsCard
            title={utils.string.t('claims.underWritingGroups.section')}
            details={underWriting?.policySectionInfo}
            isLoading={underWriting?.isPolicySectionLoading}
          />

          <Grid container direction="column">
            <Overflow>
              <Table>
                <TableHead columns={underWritingGroupColumns} />
                <TableBody>
                  {underWriting?.isLoading ? (
                    <TableRow>
                      <TableCell colSpan={underWritingGroupColumns?.length}>
                        <Skeleton height={40} animation="wave" displayNumber={3} />
                      </TableCell>
                    </TableRow>
                  ) : (
                    underWriting?.items?.map((ugRows, index) => (
                      <TableRow key={index}>
                        <TableCell>{ugRows?.groupRef}</TableCell>
                        <TableCell>{ugRows?.percentage}</TableCell>
                        <TableCell>{ugRows?.facility}</TableCell>
                        <TableCell>{ugRows?.facilityRef}</TableCell>
                        <TableCell>{ugRows?.slipLeader}</TableCell>
                        <TableCell>{ugRows?.ucr}</TableCell>
                        <TableCell>{ugRows?.narrative}</TableCell>
                        <TableCell>
                          {ugRows?.dateValidFrom && moment(ugRows.dateValidFrom).format(config.ui.format.date.slashNumeric)}
                        </TableCell>
                        <TableCell>
                          {ugRows?.dateValidTo && moment(ugRows.dateValidTo).format(config.ui.format.date.slashNumeric)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Overflow>
          </Grid>
          <div className={classes.underWritingCardContainer}>
            <div className={classes.infoCardContainer}>
              <div className={classes.infoCard}>
                <Typography className={classes.infoCardTitle} variant="h5" color="secondary">
                  {utils.string.t('claims.movementInformation.heading')}
                </Typography>
                <Typography className={classes.infoCardValue} variant="h6">
                  {underWriting?.isLoading ? <Skeleton height={40} animation="wave" displayNumber={1} /> : underWriting?.movementType}
                </Typography>
              </div>
              <div className={classes.infoCard}>
                <Typography className={classes.infoCardTitle} variant="h5" color="secondary">
                  {utils.string.t('claims.typeOfSettlement.orderBasis')}
                </Typography>
                <Typography className={classes.infoCardValue} variant="h6">
                  {underWriting?.isLoading ? <Skeleton height={40} animation="wave" displayNumber={1} /> : underWriting?.basisOfOrder}
                </Typography>
              </div>
              <div className={classes.infoCard}>
                <Typography className={classes.infoCardTitle} variant="h5" color="secondary">
                  {utils.string.t('claims.typeOfSettlement.order')}
                </Typography>
                <Typography className={classes.infoCardValue} variant="h6">
                  {underWriting?.isLoading ? <Skeleton height={40} animation="wave" displayNumber={1} /> : underWriting?.orderPercentage}
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <>
        <Accordion title={accordionTitle(utils.string.t('claims.processing.taskDetailsLabels.additionalDetails'))}>
          <div className={classes.infoCardContainerWrapper}>
            <Accordion
              expanded={accordionsExpandStatus[utils.string.t('claims.lossInformation.title')]}
              title={accordionTitle(utils.string.t('claims.lossInformation.title'))}
              onChange={(event, isExpanded) => setAccordiansIsExpanded(utils.string.t('claims.lossInformation.title'), isExpanded)}
              actions={[
                {
                  id: 'edit',
                  icon: Edit,
                  color: 'primary',
                  onClick: () => {
                    handleEditLoss();
                  },
                },
              ]}
            >
              {renderInfoCard(lossInfo)}
            </Accordion>
            <Divider />

            <Accordion
              expanded={accordionsExpandStatus[utils.string.t('claims.claimInformation.title')]}
              title={accordionTitle(utils.string.t('claims.claimInformation.title'))}
              onChange={(event, isExpanded) => setAccordiansIsExpanded(utils.string.t('claims.claimInformation.title'), isExpanded)}
            >
              {renderInfoCard(claimInfo)}
            </Accordion>
            <Divider />

            <Accordion
              expanded={accordionsExpandStatus[utils.string.t('claims.claimInformation.policyTitle')]}
              title={accordionTitle(utils.string.t('claims.claimInformation.policyTitle'))}
              onChange={(event, isExpanded) => setAccordiansIsExpanded(utils.string.t('claims.claimInformation.policyTitle'), isExpanded)}
            >
              {renderInfoCard(policyInfo)}
            </Accordion>
            <Divider />

            <Accordion
              expanded={accordionsExpandStatus[utils.string.t('claims.underWritingGroups.tilteInformation')]}
              title={accordionTitle(utils.string.t('claims.underWritingGroups.tilteInformation'))}
              onChange={(event, isExpanded) =>
                setAccordiansIsExpanded(utils.string.t('claims.underWritingGroups.tilteInformation'), isExpanded)
              }
            >
              {underWritingInfoCard(underWritingInfo)}
            </Accordion>
          </div>
        </Accordion>
        <Divider />

        <div className={classes.taskDetailsInfo}>
          <div>{accordionTitle(utils.string.t('claims.processing.taskFunctionalityTabs.taskDetails'))}</div>
          <div className={classes.taskDetailsInfoCards}>
            {renderInfoCard(taskInfo)}
            <Grid container spacing={2}>
              <Grid item>
                <Info
                  title={utils.string.t('claims.processing.taskDetailsLabels.description')}
                  description={taskObj?.description || ''}
                  showSkeleton={isTaskDetailsLoading}
                />
              </Grid>
            </Grid>
          </div>
        </div>
        <Divider />
      </>
    </>
  );
}
