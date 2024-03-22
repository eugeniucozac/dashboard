import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './ConfigLoader.styles';
import { Button, Loader, Logo, Translate } from 'components';
import * as utils from 'utils';

// mui
import { makeStyles, Box, Grid, Paper } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

ConfigLoaderView.propTypes = {
  isLoading: PropTypes.bool,
  hasConfig: PropTypes.bool,
};

export function ConfigLoaderView({ isLoading, hasConfig, children }) {
  const classes = makeStyles(styles, { name: 'ConfigLoader' })();

  if (isLoading) {
    return <Loader label={utils.string.t('app.configuring')} />;
  } else {
    if (hasConfig) {
      return children;
    } else {
      return (
        <Grid container justifyContent="center" alignItems="center" className={classes.grid}>
          <Grid item xs={12}>
            <Paper elevation={1} className={classes.paper}>
              <Logo height={60} className={classes.logo} data-testid="edge-logo" />
              <Box mt={-2} mb={3}>
                <Alert severity="warning" icon={false}>
                  <Translate label="notification.loadConfig.fail" />
                </Alert>
              </Box>
              <Button color="primary" text={<Translate label="app.tryAgain" />} onClick={() => window.location.reload()} />
            </Paper>
          </Grid>
        </Grid>
      );
    }
  }
}
