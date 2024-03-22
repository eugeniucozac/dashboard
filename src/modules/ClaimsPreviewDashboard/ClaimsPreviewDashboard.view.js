import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

// app
import styles from './ClaimsPreviewDashboard.styles';
import { Accordion, Info, TableHead, TableCell, Skeleton, Overflow } from 'components';
import { DetailsCard } from 'modules';
import * as utils from 'utils';
import config from 'config';

// mui
import { makeStyles, Box, Grid, Table, TableBody, TableRow, Typography } from '@material-ui/core';

ClaimsPreviewDashboardView.propTypes = {
  sections: PropTypes.array.isRequired,
  underWritingGroupColumns: PropTypes.array.isRequired,
};
export function ClaimsPreviewDashboardView({ sections, underWritingGroupColumns }) {
  const classes = makeStyles(styles, { name: 'ClaimsPreviewDashboardView' })();

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

  return (
    <Box mt={2}>
      {sections.map((section) => {
        return (
          <Accordion
            key={section.title}
            expanded={section.isExpanded}
            title={
              <Typography className={classes.title} variant="body2">
                {section.title}
              </Typography>
            }
            actions={section.actions}
            onChange={(event, isExpanded) => section.handleExpanded(isExpanded)}
          >
            {section.title === utils.string.t('claims.underWritingGroups.tilteInformation') ? (
              underWritingInfoCard(section.data)
            ) : (
              <Grid container spacing={2}>
                {section?.data?.map((info) => (
                  <Grid item xs={6} sm={4} md={3} key={info?.title}>
                    <Info title={info?.title} description={info?.value || ''} showSkeleton={info?.isLoading} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Accordion>
        );
      })}
    </Box>
  );
}
