import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import moment from 'moment';

// app
import styles from './LossDetail.styles';
import { Info, Accordion, TableHead, TableCell, Overflow, Skeleton, Chip, Link } from 'components';
import { STATUS_CLAIMS_DRAFT, STATUS_NOT_APPLICABLE } from 'consts';
import { setClaimsTabSelectedItem } from 'stores';
import * as utils from 'utils';
import config from 'config';

// mui
import { makeStyles, Box, Typography, Grid, Table, TableBody, TableRow, Divider } from '@material-ui/core';
import { Edit } from '@material-ui/icons';

LossDetailView.propTypes = {
  columns: PropTypes.array.isRequired,
  lossInfo: PropTypes.array.isRequired,
  lossRef: PropTypes.string.isRequired,
  claimsAssociateWithLoss: PropTypes.array.isRequired,
  isClaimAssociateWithLossLoading: PropTypes.bool.isRequired,
};

export default function LossDetailView({ columns, lossInfo, lossRef, claimsAssociateWithLoss, isClaimAssociateWithLossLoading }) {
  const classes = makeStyles(styles, { name: 'LossDetail' })();

  const history = useHistory();
  const dispatch = useDispatch();

  const [accordionsExpandStatus, setAccordiansStatus] = useState({
    [utils.string.t('claims.loss.lossInformation.title')]: true,
    [utils.string.t('claims.loss.relatedClaims.title')]: true,
  });

  const checkClaimStatus = utils.generic.isValidArray(claimsAssociateWithLoss, true)
    ? Boolean(claimsAssociateWithLoss?.find((claim) => claim?.claimStatus !== STATUS_CLAIMS_DRAFT?.toUpperCase()))
    : false;

  const setAccordiansIsExpanded = (cardName, isExpand) => {
    const accordionsStatus = { ...accordionsExpandStatus };
    accordionsStatus[cardName] = isExpand;
    setAccordiansStatus(accordionsStatus);
  };

  const lossRefHandler = (event, claimObj) => {
    if (event.detail === 2 && claimObj?.claimReference) {
      dispatch(setClaimsTabSelectedItem(claimObj, true));
      history.push({
        pathname: `${config.routes.claimsFNOL.claim}/${claimObj?.claimReference}`,
        state: {
          isInflightClaim: claimObj?.isInflightClaim,
        },
      });
    }
  };

  const claimRefHandler = (claimObj) => (event) => {
    event.stopPropagation();

    if (claimObj?.claimReference) {
      dispatch(setClaimsTabSelectedItem(claimObj, true));
      history.push({
        pathname: `${config.routes.claimsFNOL.claim}/${claimObj?.claimReference}`,
        state: {
          isInflightClaim: claimObj?.isInflightClaim,
        },
      });
    }
  };

  return (
    <div className={classes.wrapper}>
      <Accordion
        expanded={accordionsExpandStatus[utils.string.t('claims.loss.lossInformation.title')]}
        title={
          <Typography className={classes.title} variant="body2">
            {utils.string.t('claims.loss.lossInformation.title')}
          </Typography>
        }
        actions={[
          {
            id: 'edit',
            icon: Edit,
            color: 'primary',
            onClick: () => {
              history.push({
                pathname: `${config.routes.claimsFNOL.newLoss}`,
                state: {
                  isNewLoss: false,
                  redirectUrl: `${config.routes.claimsFNOL.loss}/${lossRef}`,
                  loss: { isNextDiabled: true, isClaimSubmitted: checkClaimStatus },
                },
              });
            },
          },
        ]}
        onChange={(event, isExpanded) => setAccordiansIsExpanded(utils.string.t('claims.loss.lossInformation.title'), isExpanded)}
      >
        <Box display="flex" width="100%" flexDirection="column">
          <Grid container spacing={2}>
            {lossInfo?.map((info) => (
              <Grid item xs={6} sm={4} md={3} key={info?.title}>
                <Info title={info?.title} description={info?.value || ''} showSkeleton={info?.isLoading} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Accordion>
      <Divider />
      <Accordion
        expanded={accordionsExpandStatus[utils.string.t('claims.loss.relatedClaims.title')]}
        title={
          <Typography className={classes.title} variant="body2">
            {utils.string.t('claims.loss.relatedClaims.title')}
          </Typography>
        }
        onChange={(event, isExpanded) => setAccordiansIsExpanded(utils.string.t('claims.loss.relatedClaims.title'), isExpanded)}
      >
        <Grid item xs={12}>
          <Grid container direction="column">
            <Overflow>
              <Table>
                <TableHead columns={columns} />
                <TableBody>
                  {isClaimAssociateWithLossLoading ? (
                    <TableRow>
                      <TableCell colSpan={columns?.length}>
                        <Skeleton height={40} animation="wave" displayNumber={3} />
                      </TableCell>
                    </TableRow>
                  ) : (
                    utils.generic.isValidArray(claimsAssociateWithLoss, true) &&
                    claimsAssociateWithLoss?.map((claim, index) => (
                      <TableRow hover key={index} onClick={(e) => lossRefHandler(e, claim)} className={classes.claimRow}>
                        <TableCell>
                          <div className={classes.inFlightIcon}>
                            {claim?.isInflightClaim && <Chip label="" type={'new'} nestedClasses={{ root: classes.inFlightMarksText }} />}
                          </div>

                          <Link
                            text={claim?.claimReference?.toString() || STATUS_NOT_APPLICABLE}
                            color="secondary"
                            onClick={claimRefHandler(claim)}
                          />
                        </TableCell>
                        <TableCell>{claim?.claimant || STATUS_NOT_APPLICABLE}</TableCell>
                        <TableCell>{claim?.policyRef || STATUS_NOT_APPLICABLE}</TableCell>
                        <TableCell>
                          {moment(claim?.claimReceivedDate).format(config.ui.format.date.text) || STATUS_NOT_APPLICABLE}
                        </TableCell>
                        <TableCell>{claim?.division || STATUS_NOT_APPLICABLE}</TableCell>
                        <TableCell>{claim?.insured || STATUS_NOT_APPLICABLE}</TableCell>
                        <TableCell>{claim?.riskDetails || STATUS_NOT_APPLICABLE}</TableCell>
                        <TableCell>{claim?.claimStatus || STATUS_NOT_APPLICABLE}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Overflow>
          </Grid>
        </Grid>
      </Accordion>
      <div>
        <Chip label="" type={'new'} nestedClasses={{ root: classes.inFlightMarksText }} />{' '}
        {utils.string.t('claims.loss.relatedClaims.inFlightMarksText')}
      </div>
    </div>
  );
}
