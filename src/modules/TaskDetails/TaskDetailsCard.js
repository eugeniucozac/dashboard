import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

//app
import * as utils from 'utils';
import styles from './TaskDetails.styles';
import { RowDetails } from 'modules';
import config from 'config';

//mui
import { makeStyles, Typography, Box, Grid, Card, CardHeader, CardContent } from '@material-ui/core';

TaskDetailsCard.prototype = {
  taskObj: PropTypes.object.isRequired,
  detailsHeader: PropTypes.string.isRequired,
};

export function TaskDetailsCard({ taskObj, detailsHeader }) {
  const classes = makeStyles(styles, { name: 'TaskDetails' })();

  return (
    <div className={classes.wrapper}>
      <Card>
        <CardHeader
          className={classes.cardHeader}
          title={
            <Grid container justify="space-between" alignItems="center">
              <Grid item>
                <Typography variant="body2" className={classes.title}>
                  {detailsHeader}
                </Typography>
              </Grid>
            </Grid>
          }
        />
        <CardContent variant="body2" className={classes.cardContent}>
          <div className={classes.details}>
            <Box>
              <RowDetails
                title={utils.string.t('claims.processing.taskDetailsLabels.taskRef')}
                details={taskObj?.taskRef}
                textAlign="right"
              />
              <RowDetails
                title={utils.string.t('claims.processing.taskDetailsLabels.taskType')}
                details={taskObj?.taskType}
                textAlign="right"
              />
              <RowDetails
                title={utils.string.t('claims.processing.taskDetailsLabels.dateCreated')}
                details={taskObj?.createdOn && moment(taskObj?.createdOn).format(config.ui.format.date.text)}
                textAlign="right"
              />
              <RowDetails
                title={utils.string.t('claims.processing.taskDetailsLabels.description')}
                details={taskObj?.description}
                textAlign="right"
              />
            </Box>
            <Box>
              <RowDetails
                title={utils.string.t('claims.processing.taskDetailsLabels.targetDueDate')}
                details={taskObj?.targetDueDate && moment(taskObj?.targetDueDate).format(config.ui.format.date.text)}
                textAlign="right"
              />
              <RowDetails
                title={utils.string.t('claims.processing.taskDetailsLabels.assignedTo')}
                details={taskObj?.assigneeFullName}
                textAlign="right"
              />
              <RowDetails
                title={utils.string.t('claims.processing.taskDetailsLabels.additionalAssignee')}
                details={taskObj?.additionalAssignee}
                textAlign="right"
              />
            </Box>
            <Box>
              <RowDetails
                title={utils.string.t('claims.processing.taskDetailsLabels.status')}
                details={taskObj?.status}
                textAlign="right"
              />
              <RowDetails
                title={utils.string.t('claims.processing.taskDetailsLabels.priority')}
                details={taskObj?.priority}
                textAlign="right"
              />
            </Box>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
