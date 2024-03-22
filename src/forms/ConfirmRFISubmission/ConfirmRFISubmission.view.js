import React from 'react';
import PropTypes from 'prop-types';

//app
import { DetailsCard } from 'modules';
import * as utils from 'utils';
import styles from './ConfirmRFISubmission.styles';
import { CreateTaskStepperActions } from 'forms';

//mui
import { Grid, Typography, makeStyles, Box } from '@material-ui/core';
import { Edit } from '@material-ui/icons';

ConfirmRFISubmissionView.propTypes = {
  rfiInfo: PropTypes.array.isRequired,
  diariseInfo: PropTypes.array.isRequired,
  activeStep: PropTypes.bool.isRequired,
  isAllStepsCompleted: PropTypes.bool,
  handleBack: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleFinish: PropTypes.func.isRequired,
  rfiDocs: PropTypes.array
}
export function ConfirmRFISubmissionView({ rfiInfo, diariseInfo, activeStep, isAllStepsCompleted, handleBack, handleCancel, handleFinish, rfiDocs, ...props }) {

  const classes = makeStyles(styles, { name: 'ConfirmRFISubmission' })();

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
    <Box overflow="hidden" display="flex" flexDirection="column">
      <Box className={classes.container} flex="1 1 auto">
        <div className={classes.spacingContainer}>
          <Grid container alignItems="center">
            <Grid item xs>
              <Typography variant="h5" className={classes.confirmTitles}>
                {utils.string.t('claims.processing.taskFunction.rfiInfo')}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6" onClick={() => props?.handleStep(activeStep - 2)}>
                <Edit className={classes.editIcon} />
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            {renderInfoCards(rfiInfo)}
          </Grid>
          <Typography variant="h5" className={classes.confirmTitles}>
            {utils.string.t('claims.processing.taskFunction.diarise')}
          </Typography>
          <Grid container spacing={2}>
            {renderInfoCards(diariseInfo)}
          </Grid>
        </div>
        <Grid container alignItems="center">
          <Grid item xs>
            <Typography variant="body2" className={classes.confirmTitles}>
              {utils.string.t('claims.processing.taskDetailsLabels.documents')}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6" onClick={() => props?.handleStep(activeStep - 1)}>
              <Edit className={classes.editIcon} />
            </Typography>
          </Grid>
        </Grid>
        <div className={classes.spacingContainer}>
          {!utils.generic.isInvalidOrEmptyArray(rfiDocs) && (
            <Typography className={classes.fileTitle} variant="h4">
              {utils.string.t('claims.processing.taskDetailsLabels.fileName')}
            </Typography>
          )}
          {!utils.generic.isInvalidOrEmptyArray(rfiDocs) ? (
            rfiDocs?.map((item) => {
              return <Typography>{item?.fileName}</Typography>;
            })
          ) : (
            <Grid container spacing={2} justifyContent="center" alignItems="center">
              <Typography>
                {utils.string.t('claims.processing.taskDetailsLabels.noDocumentsAttached')}
              </Typography>
            </Grid>
          )}
        </div>
      </Box>
      <Box flex="0 1 auto">
        <CreateTaskStepperActions
          {...props}
          activeStep={activeStep}
          onSave={() => { }}
          isAllStepsCompleted={isAllStepsCompleted}
          handleBack={() => {
            handleBack(0);
          }}
          handleCancel={handleCancel}
          handleFinish={handleFinish}
          save={true}
        />
      </Box>
    </Box>
  );
}