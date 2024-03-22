import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './Login.styles';
import { Button, Link, Logo, Translate } from 'components';
import * as utils from 'utils';

// mui
import { makeStyles, Box, Paper, Grid, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

LoginView.propTypes = {
  isPriceForbes: PropTypes.bool,
  error: PropTypes.string,
  redirects: PropTypes.shape({
    analytics: PropTypes.string,
  }).isRequired,
  handlers: PropTypes.shape({
    login: PropTypes.func,
  }).isRequired,
};

export function LoginView({ isPriceForbes, error, redirects, handlers }) {
  const classes = makeStyles(styles, { name: 'Login' })();

  return (
    <Grid container justifyContent="center" alignItems="center" className={classes.grid} data-testid="login">
      <Grid item xs={12}>
        <Paper elevation={1} className={classes.paper}>
          <Logo height={60} className={[classes.logo, classes.login]} data-testid="edge-logo" />

          {error && (
            <Box mt={-2} mb={3}>
              <Alert severity="warning" icon={false}>
                <Typography>{error}</Typography>
              </Alert>
            </Box>
          )}

          <Translate label="app.signInToApp" variant="h3" data-testid="signin-message" />
          <Button
            color="primary"
            text={<Translate label={error ? 'app.tryAgain' : 'app.signIn'} />}
            onClick={handlers.login}
            data-testid="sign-in"
          />

          <Box mt={4}>
            {isPriceForbes ? (
              <Link
                text={utils.string.t('app.redirectAnalytics')}
                color="secondary"
                disabled
                href={redirects.analytics}
                data-testid="redirect-analytics"
              />
            ) : null}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
