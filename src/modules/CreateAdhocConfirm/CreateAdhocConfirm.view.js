import React from 'react';
import PropTypes from 'prop-types';

//app
import { CreateAdhocTaskFooter } from 'modules';
import { FormLegend } from 'components';
import styles from './CreateAdhocConfirm.style';
import * as utils from 'utils';
import { DetailsCard } from 'modules';

//mui
import { makeStyles, Box, Grid, Typography } from '@material-ui/core';
import { Edit } from '@material-ui/icons';

CreateAdhocConfirmView.propTypes = {
  adHocTaskInfo: PropTypes.array.isRequired,
  handleCancel: PropTypes.object.isRequired,
  submitTask: PropTypes.func.isRequired,
  activeStep: PropTypes.number.isRequired,
  handleBack: PropTypes.func.isRequired,
  handleStep: PropTypes.func.isRequired,
  adhocDocuments: PropTypes.func.isRequired,
};

function CreateAdhocConfirmView(props) {
  const classes = makeStyles(styles, { name: 'ConfrmCreateAdhock' })();
  const { adhocDocuments } = props;

  const renderInfoCards = (items) => {
    return (
      <>
        {items?.map((info) => (
          <Grid item xs={6} sm={4} md={3} key={info?.title}>
            <DetailsCard
              title={info?.title}
              details={info?.value}
              isLoading={info?.isLoading}
              nestedClasses={{ title: classes.detailsCardTitle, text: classes.detailsCardText }}
            />
          </Grid>
        ))}
      </>
    );
  };
  return (
    <>
      <Box overflow="hidden" display="flex" flexDirection="column">
        <Box flex="1 1 auto" className={classes.container}>
          <div className={classes.spacingContainer}>
            <FormLegend text={utils.string.t('claims.processing.taskDetailsLabels.adHocInfo')} />
            <Grid container spacing={2}>
              {renderInfoCards(props?.adHocTaskInfo?.rowOne)}
            </Grid>
            <Grid container spacing={2}>
              {renderInfoCards(props?.adHocTaskInfo?.rowTwo)}
            </Grid>
            <Grid container spacing={2}>
              {renderInfoCards(props?.adHocTaskInfo?.rowThree)}
            </Grid>
            <FormLegend text={utils.string.t('claims.processing.taskDetailsLabels.diarise')} />
            <Grid container spacing={2}>
              {renderInfoCards(props?.adHocTaskInfo?.rowDiarise)}
            </Grid>
          </div>
          <Grid container alignItems="center" className={classes.gutterBottom}>
            <Grid item xs>
              <Typography variant="body2" className={classes.confirmTitles}>
                {utils.string.t('claims.processing.taskDetailsLabels.documents')}
              </Typography>
            </Grid>
            <Grid item>
              <Typography className={classes.confirmTitles} variant="h6" onClick={() => props.handleStep(props.activeStep - 1)}>
                <Edit />
              </Typography>
            </Grid>
          </Grid>
          <div className={classes.spacingContainer}>
            {!utils.generic.isInvalidOrEmptyArray(adhocDocuments) && (
              <Typography className={classes.fileTitle} variant="h4">
                {utils.string.t('claims.processing.taskDetailsLabels.fileName')}
              </Typography>
            )}
            {!utils.generic.isInvalidOrEmptyArray(adhocDocuments) ? (
              adhocDocuments?.map((item) => {
                return <Typography className={classes.subTitle}>{item?.fileName}</Typography>;
              })
            ) : (
              <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Typography className={classes.subTitle}>
                  {utils.string.t('claims.processing.taskDetailsLabels.noDocumentsAttached')}
                </Typography>
              </Grid>
            )}
          </div>
        </Box>
        <Box flex="0 1 auto">
          <CreateAdhocTaskFooter
            lastStep={true}
            handleSubmit={props?.submitTask}
            handleCancel={props?.handleCancel}
            handleBack={props?.handleBack}
            activeStep={props?.activeStep}
          />
        </Box>
      </Box>
    </>
  );
}

export default CreateAdhocConfirmView;
