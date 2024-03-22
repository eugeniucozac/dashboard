import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classnames from 'classnames';

// app
import styles from './ClaimsTasksReporting.styles';
import { Accordion, Chart, Skeleton } from 'components';
import * as utils from 'utils';
import config from 'config';

// mui
import { Box, Grid, makeStyles, Typography } from '@material-ui/core';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

ClaimsTasksReportingView.propTypes = {
  data: PropTypes.object.isRequired,
  expanded: PropTypes.bool.isRequired,
  isDataLoading: PropTypes.bool.isRequired,
  isExpanded: PropTypes.bool,
  handlers: PropTypes.shape({
    buildChartData: PropTypes.func.isRequired,
    toggle: PropTypes.func.isRequired,
  }).isRequired,
};

export function ClaimsTasksReportingView({ data, expanded, isDataLoading, isExpanded, handlers }) {
  const classes = makeStyles(styles, { name: 'ClaimsTasksReporting' })({ expanded });

  const claimsDataPoints = [data?.nonComplexClaimsProcess, data?.complexClaimsProcess, data?.unClassifiedClaimsProcess];

  const tasksDataPoints = [
    parseInt(data?.nonComplexTaskAssignedProcess + data?.nonComplexTaskUnAssignedProcess),
    parseInt(data?.complexTaskAssignedProcess + data?.complexTaskUnAssignedProcess),
    parseInt(data?.unsureTaskAssignedProcess + data?.unsureTaskUnAssignedProcess),
  ];

  const claimsLabels = [
    utils.string.t('claims.processing.reportingView.nonComplex'),
    utils.string.t('claims.processing.reportingView.complex'),
    utils.string.t('claims.processing.reportingView.unclassified'),
  ];

  const tasksLabel = [
    utils.string.t('claims.processing.reportingView.nonComplex'),
    utils.string.t('claims.processing.reportingView.complex'),
    utils.string.t('claims.processing.reportingView.unclassified'),
  ];

  const claimsColorsPalette = ['rgb(27,204,12)', 'rgb(246, 100, 97)', 'rgb(127, 127, 127)'];
  const tasksColorsPalette = ['rgb(27,204,12)', 'rgb(246, 100, 97)', 'rgb(127, 127, 127)'];

  const claimsData = handlers.buildChartData(claimsDataPoints || 0, claimsLabels, claimsColorsPalette);
  const tasksData = handlers.buildChartData(tasksDataPoints || 0, tasksLabel, tasksColorsPalette);

  return (
    <div className={classes.root} data-testid="reporting-claims-tasks">
      <Accordion
        icon={false}
        title={`${utils.string.t('time.today')}: ${moment().format('DD MMM YYYY')}`}
        expanded={expanded}
        isDataLoading={isDataLoading}
        actions={
          !isExpanded
            ? [
                {
                  id: 'reporting',
                  text: utils.string.t('claims.processing.reportingView.title'),
                  icon: KeyboardArrowUpIcon,
                  iconPosition: 'left',
                  color: 'primary',
                  onClick: handlers.toggle,
                  nestedClasses: {
                    link: classes.toggleBtnLink,
                    icon: classes.toggleBtnIcon,
                  },
                },
              ]
            : []
        }
      >
        <Box className={classes.container}>
          <Box className={classes.wrapper} data-testid="reporting-claims">
            <Box className={classes.canvas}>
              {isDataLoading ? (
                <Skeleton height={150} width={100} variant="rect" displayNumber={1} />
              ) : (
                <Chart
                  id="chart-claims"
                  type="doughnut"
                  data={claimsData}
                  options={{
                    ...config.ui.chart.doughnut,
                    tooltips: {
                      enabled: true,
                    },
                  }}
                  nestedClasses={{ root: classes.chartRoot, chart: classes.chart }}
                />
              )}
            </Box>

            <Box className={classes.content}>
              <Grid container direction="column" spacing={1}>
                <Grid item>
                  <span
                    className={classes.layers}
                    dangerouslySetInnerHTML={{
                      __html: `${utils.string.t('claims.processing.reportingView.totalActiveClaims', {
                        count: data?.totalActiveClaimsProcess || 0,
                      })}`,
                    }}
                  />
                </Grid>

                <Grid item>
                  <Grid container spacing={0}>
                    <Grid item xs={12} className={classes.box}>
                      <span className={classnames(classes.dot, classes.dotGreen)} />
                      <Typography className={classes.type}>{utils.string.t('claims.processing.reportingView.nonComplex')}</Typography>
                      <Typography className={classes.value}>{claimsDataPoints[0]}</Typography>
                    </Grid>

                    <Grid item xs={12} className={classes.box}>
                      <span className={classnames(classes.dot, classes.dotOrange)} />
                      <Typography className={classes.type}>{utils.string.t('claims.processing.reportingView.complex')}</Typography>
                      <Typography className={classes.value}>{claimsDataPoints[1]}</Typography>
                    </Grid>

                    <Grid item xs={12} className={classes.box}>
                      <span className={classnames(classes.dot)} />
                      <Typography className={classes.type}>{utils.string.t('claims.processing.reportingView.unclassified')}</Typography>
                      <Typography className={classes.value}>{claimsDataPoints[2]}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Box className={classes.wrapper} data-testid="reporting-tasks">
            <Box className={classes.canvas}>
              {isDataLoading ? (
                <Skeleton height={150} width={100} variant="rect" displayNumber={1} />
              ) : (
                <Chart
                  id="chart-tasks"
                  type="doughnut"
                  data={tasksData}
                  options={{
                    ...config.ui.chart.doughnut,
                    tooltips: {
                      enabled: true,
                    },
                  }}
                  nestedClasses={{ root: classes.chartRoot, chart: classes.chart }}
                />
              )}
            </Box>

            <Box className={classes.content}>
              <Grid container direction="column" spacing={1}>
                <Grid item>
                  <Grid container spacing={0}>
                    <Grid container justify="flex-end">
                      <Grid item xs={6} className={classes.totalTasksSpacing}>
                        <span
                          className={classes.layers}
                          dangerouslySetInnerHTML={{
                            __html: `${utils.string.t('claims.processing.reportingView.totalActiveTasks', {
                              count: data?.totalActiveTasksProcess || 0,
                            })}`,
                          }}
                        />
                      </Grid>
                      <Grid item xs={6} className={classes.taskLabelBox}>
                        <Typography className={classnames(classes.type, classes.taskBorderRight, classes.tasksLblBoxAlign)}>
                          {utils.string.t('claims.processing.reportingView.assigned')}
                        </Typography>
                        <Typography className={classnames(classes.type, classes.tasksLblBoxAlign)}>
                          {utils.string.t('claims.processing.reportingView.unassigned')}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Grid item xs={12} className={classes.box}>
                      <span className={classnames(classes.dot, classes.dotGreen)} />
                      <Typography className={classes.type}>{utils.string.t('claims.processing.reportingView.nonComplex')}</Typography>
                      <Typography className={classnames(classes.value, classes.taskBorderRight, classes.valueSpacing)}>
                        {data?.nonComplexTaskAssignedProcess}
                      </Typography>
                      <Typography className={classnames(classes.value, classes.valueSpacing)}>
                        {data?.nonComplexTaskUnAssignedProcess}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} className={classes.box}>
                      <span className={classnames(classes.dot, classes.dotOrange)} />
                      <Typography className={classes.type}>{utils.string.t('claims.processing.reportingView.complex')}</Typography>
                      <Typography className={classnames(classes.value, classes.taskBorderRight, classes.valueSpacing)}>
                        {data?.complexTaskAssignedProcess}
                      </Typography>
                      <Typography className={classnames(classes.value, classes.valueSpacing)}>
                        {data?.complexTaskUnAssignedProcess}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} className={classes.box}>
                      <span className={classnames(classes.dot)} />
                      <Typography className={classes.type}>{utils.string.t('claims.processing.reportingView.unclassified')}</Typography>
                      <Typography className={classnames(classes.value, classes.taskBorderRight, classes.valueSpacing)}>
                        {data?.unsureTaskAssignedProcess}
                      </Typography>
                      <Typography className={classnames(classes.value, classes.valueSpacing)}>
                        {data?.unsureTaskUnAssignedProcess}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
      </Accordion>
    </div>
  );
}
