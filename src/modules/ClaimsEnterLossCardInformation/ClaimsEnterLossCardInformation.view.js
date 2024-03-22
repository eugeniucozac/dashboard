import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useForm } from 'react-hook-form';

//app
import * as utils from 'utils';
import styles from './ClaimsEnterLossCardInformation.styles';
import { Link, FormPopoverMenuRHF } from 'components';
import { RowDetails } from 'modules';
import config from 'config';

//mui
import { makeStyles, Card, CardHeader, CardContent, Typography, Box, Grid } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

ClaimsEnterLossCardInformationView.propTypes = {
  handleEditLossClick: PropTypes.func,
  data: PropTypes.object,
  catCode: PropTypes.object,
  claimRefDetailsStatus: PropTypes.bool,
  claimsAssociateWithLoss: PropTypes.array,
  setCheckPage: PropTypes.func,
  claimId: PropTypes.string,
};

export function ClaimsEnterLossCardInformationView({
  handleEditLossClick,
  data,
  catCode,
  claimRefDetailsStatus,
  claimsAssociateWithLoss,
  setCheckPage,
  claimId,
}) {
  const catCodeName = catCode?.name && catCode?.description ? `${catCode?.name} - ${catCode?.description?.substring(0, 99)}` : '';
  const classes = makeStyles(styles, { name: 'ClaimsEnterLossCardInformation' })();
  const { control } = useForm({});
  const selectClaimRefeToggle = (selectedValue) => {
    if (selectedValue?.claimID) setCheckPage(true, selectedValue, data?.lossDetailID);
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        className={classes.cardHeader}
        title={
          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              <Grid container direction="row">
                <Grid item>
                  <Typography variant="body2" className={classes.title}>
                    {utils.string.t('claims.lossInformation.title')}
                  </Typography>
                </Grid>
                <Grid item>
                  {!claimRefDetailsStatus && (
                    <Link text={utils.string.t('app.edit')} handleClick={handleEditLossClick} className={classes.titleLink} />
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container direction="row">
                <Grid item>
                  <FormPopoverMenuRHF
                    control={control}
                    name={utils.string.t('claims.lossInformation.otherAssociateLossTitle')}
                    placeholder={utils.string.t('claims.lossInformation.otherAssociateLossTitle')}
                    text={utils.string.t('claims.lossInformation.otherAssociateLossTitle')}
                    size="xsmall"
                    icon={ArrowDropDownIcon}
                    iconPosition="right"
                    disabled={claimsAssociateWithLoss.length > 1 ? false : true}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    nestedClasses={{ btn: classes.popoverButton }}
                    items={claimsAssociateWithLoss
                      ?.filter((item) => String(item?.claimID) !== String(claimId))
                      .map((item, index) => ({
                        id: `${item?.claimID}-${index}`,
                        label: utils.string.t('claims.lossInformation.otherAssociateLossSelectLable', {
                          claimID: item?.claimID,
                          policyRef: item?.policyRef,
                          insured: item?.insured,
                        }),
                        callback: () => selectClaimRefeToggle(item),
                      }))}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        }
      />
      <CardContent variant="body2" className={classes.cardContent}>
        <Box>
          <div className={classes.details}>
            <Box>
              <RowDetails title={utils.string.t('claims.lossInformation.ref')} details={data?.lossRef} textAlign="right" />
              <RowDetails
                title={utils.string.t('claims.lossInformation.fromDate')}
                details={data.fromDate && moment(data?.fromDate).format(config.ui.format.date.text)}
                textAlign="right"
              />
              <RowDetails
                title={utils.string.t('claims.lossInformation.toDate')}
                details={data.toDate && moment(data?.toDate).format(config.ui.format.date.text)}
                textAlign="right"
              />
            </Box>
            <Box>
              <RowDetails title={utils.string.t('claims.lossInformation.name')} details={data.lossName} textAlign="right" />
              <RowDetails title={utils.string.t('claims.lossInformation.details')} details={data.lossDescription} textAlign="right" />
            </Box>
            <Box>
              <RowDetails title={utils.string.t('claims.lossInformation.catCode')} details={catCodeName} textAlign="right" />
              <RowDetails
                title={utils.string.t('claims.lossInformation.dateAndTime')}
                details={data?.firstContactDate && moment(data?.firstContactDate).format(config.ui.format.date.textTime)}
                textAlign="right"
              />
            </Box>
          </div>
        </Box>
      </CardContent>
    </Card>
  );
}
