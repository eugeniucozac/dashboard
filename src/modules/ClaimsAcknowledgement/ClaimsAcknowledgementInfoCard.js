import React, { useState } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

// app
import styles from './ClaimsAcknowledgement.styles';
import { Accordion } from 'components';
import { TableHead, TableCell, Overflow, Skeleton } from 'components';
import * as utils from 'utils';
import config from 'config';

// mui
import { Box, Typography, makeStyles, Grid, Table, TableBody, TableRow } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { DetailsCard } from 'modules';

ClaimsAcknowledgementInfoCard.propTypes = {
  lossInfo: PropTypes.array.isRequired,
  policyInfo: PropTypes.array.isRequired,
  claimInfo: PropTypes.array.isRequired,
  underWritingInfo: PropTypes.object.isRequired,
  underWritingGroupColumns: PropTypes.array.isRequired,
  handleStep: PropTypes.func.isRequired,
};
export function ClaimsAcknowledgementInfoCard({ lossInfo, policyInfo, claimInfo, underWritingInfo, underWritingGroupColumns, handleStep }) {
  const classes = makeStyles(styles, { name: 'ClaimsAcknowledgementInfoCard' })();

  const [accordionsExpandStatus, setAccordiansStatus] = useState({
    [utils.string.t('claims.lossInformation.title')]: true,
    [utils.string.t('claims.claimInformation.policyTitle')]: true,
    [utils.string.t('claims.underWritingGroups.tilteInformation')]: true,
    [utils.string.t('claims.claimInformation.title')]: true,
  });

  const accordionTitle = (title) => {
    return (
      <Typography className={classes.title} variant="body2">
        {title}
      </Typography>
    );
  };

  const actions = ({ index }) => {
    return [
      {
        id: '1',
        icon: Edit,
        color: 'primary',
        onClick: () => {
          handleStep(index);
        },
      },
    ];
  };

  const renderInfoCards = (items) => {
    return (
      <>
        {items?.map((info) => (
          <Grid item xs={6} sm={4} md={3} key={info?.title}>
            <DetailsCard title={info?.title} details={info?.value} isLoading={info?.isLoading} canCopyText />
          </Grid>
        ))}
      </>
    );
  };

  const underWritingInfoCard = (underWriting) => {
    return (
      <Box width={1}>
        <DetailsCard
          title={utils.string.t('claims.underWritingGroups.section')}
          details={underWriting?.policySectionInfo}
          isLoading={underWriting?.isPolicySectionLoading}
        />

        <Grid container direction="column">
          <Overflow>
            <Table size="small">
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
                      <TableCell>{ugRows?.dateValidTo && moment(ugRows.dateValidTo).format(config.ui.format.date.slashNumeric)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Overflow>
        </Grid>

        <Box mt={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4} md={3}>
              <Typography className={classes.infoCardTitle} variant="h5" color="secondary">
                {utils.string.t('claims.movementInformation.heading')}
              </Typography>
              <Typography className={classes.infoCardValue} variant="h6">
                {underWriting?.isLoading ? <Skeleton height={40} animation="wave" displayNumber={1} /> : underWriting?.movementType}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <Typography className={classes.infoCardTitle} variant="h5" color="secondary">
                {utils.string.t('claims.typeOfSettlement.orderBasis')}
              </Typography>
              <Typography className={classes.infoCardValue} variant="h6">
                {underWriting?.isLoading ? <Skeleton height={40} animation="wave" displayNumber={1} /> : underWriting?.basisOfOrder}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <Typography className={classes.infoCardTitle} variant="h5" color="secondary">
                {utils.string.t('claims.typeOfSettlement.order')}
              </Typography>
              <Typography className={classes.infoCardValue} variant="h6">
                {underWriting?.isLoading ? <Skeleton height={40} animation="wave" displayNumber={1} /> : underWriting?.orderPercentage}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  };

  const setAccordiansIsExpanded = (cardName, isExpand) => {
    const accordionsStatus = { ...accordionsExpandStatus };
    accordionsStatus[cardName] = isExpand;
    setAccordiansStatus(accordionsStatus);
  };

  return (
    <>
      <Accordion
        expanded={accordionsExpandStatus[utils.string.t('claims.lossInformation.title')]}
        title={accordionTitle(utils.string.t('claims.lossInformation.title'))}
        actions={handleStep && actions({ index: 0 })}
        onChange={(event, isExpanded) => setAccordiansIsExpanded(utils.string.t('claims.lossInformation.title'), isExpanded)}
      >
        <Grid container spacing={2}>
          {renderInfoCards(lossInfo)}
        </Grid>
      </Accordion>
      <Accordion
        expanded={accordionsExpandStatus[utils.string.t('claims.claimInformation.policyTitle')]}
        title={accordionTitle(utils.string.t('claims.claimInformation.policyTitle'))}
        onChange={(event, isExpanded) => setAccordiansIsExpanded(utils.string.t('claims.claimInformation.policyTitle'), isExpanded)}
        actions={handleStep && actions({ index: 1 })}
      >
        <Grid container spacing={2}>
          {renderInfoCards(policyInfo)}
        </Grid>
      </Accordion>
      <Accordion
        expanded={accordionsExpandStatus[utils.string.t('claims.underWritingGroups.tilteInformation')]}
        title={accordionTitle(utils.string.t('claims.underWritingGroups.tilteInformation'))}
        onChange={(event, isExpanded) => setAccordiansIsExpanded(utils.string.t('claims.underWritingGroups.tilteInformation'), isExpanded)}
        actions={handleStep && actions({ index: 1 })}
      >
        {underWritingInfoCard(underWritingInfo)}
      </Accordion>
      <Accordion
        expanded={accordionsExpandStatus[utils.string.t('claims.claimInformation.title')]}
        title={accordionTitle(utils.string.t('claims.claimInformation.title'))}
        onChange={(event, isExpanded) => setAccordiansIsExpanded(utils.string.t('claims.claimInformation.title'), isExpanded)}
        actions={handleStep && actions({ index: 2 })}
      >
        <Grid container spacing={2}>
          {renderInfoCards(claimInfo)}
        </Grid>
      </Accordion>
    </>
  );
}
