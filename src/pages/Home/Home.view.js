import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './Home.styles';
import { CardList, Footer, Panel } from 'components';
import { ReactComponent as PolicyFile } from '../../assets/svg/line-icon-policy.svg';
import * as utils from 'utils';
import * as constants from 'consts';

// mui
import { makeStyles, Box, Grid, Typography } from '@material-ui/core';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import ApartmentIcon from '@material-ui/icons/Apartment';

HomeView.propTypes = {
  brand: PropTypes.string,
  departments: PropTypes.array.isRequired,
  offices: PropTypes.array.isRequired,
  isCobroker: PropTypes.bool,
  isUnderwriter: PropTypes.bool,
  isExtendedEdge: PropTypes.bool,
};

export function HomeView({ brand, departments, offices, isCobroker, isUnderwriter, isExtendedEdge }) {
  const classes = makeStyles(styles, { name: 'Home' })();
  const isPriceForbes = brand === constants.BRAND_PRICEFORBES;

  return (
    <div className={classes.root}>
      <PolicyFile className={classes.icon} />

      <Grid container alignItems="center">
        <Grid item xs={12} sm={12} md={isPriceForbes ? 6 : 12}>
          <Box className={classes.hero}>
            <Typography variant="h1" className={classes.title}>
              <span className={classes.nobreak}>{utils.app.getAppName(brand)}</span>
            </Typography>
            <Typography variant="h3" className={classes.subtitle}>
              <span className={classes.nobreak}>{utils.string.t('home.slogan1')}</span>{' '}
              <span className={classes.nobreak}>{utils.string.t('home.slogan2')}</span>{' '}
              <span className={classes.nobreak}>{utils.string.t('home.slogan3')}</span>
            </Typography>
          </Box>
        </Grid>
        {isPriceForbes ? (
          <Grid item xs={12} sm={12} md={6}>
            <Box className={classes.container}>
              <Box className={classes.video}>
                <div className={classes.responsive}>
                  <iframe
                    title={utils.string.t('home.videoAltText')}
                    src="https://player.vimeo.com/video/413542189?title=0&byline=0&portrait=0"
                    className={classes.iframe}
                    frameBorder="0"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                  />
                </div>
              </Box>
            </Box>
          </Grid>
        ) : null}
      </Grid>

      {!isExtendedEdge && (
        <div className={classes.content}>
          <Grid container>
            {isUnderwriter ? null : (
              <Grid item xs={12} sm={12} lg={isCobroker ? 6 : 12}>
                <Panel nestedClasses={{ root: classes.panel }}>
                  <div className={classes.sectionHeader}>
                    <AccountBalanceIcon className={classes.sectionIcon} />
                    <Typography variant="h2" className={classes.sectionTitle}>
                      {utils.string.t('app.department_plural')}
                    </Typography>
                  </div>

                  <Box mt={2}>
                    <CardList data={departments} scrollable={false} />
                  </Box>
                </Panel>
              </Grid>
            )}

            {isCobroker && (
              <Grid item xs={12} sm={12} lg={6}>
                <Panel nestedClasses={{ root: classes.panel }}>
                  <div className={classes.sectionHeader}>
                    <ApartmentIcon className={classes.sectionIcon} />
                    <Typography variant="h2" className={classes.sectionTitle}>
                      {utils.string.t('app.office_plural')}
                    </Typography>
                  </div>

                  <Box mt={2}>
                    <CardList data={offices} scrollable={false} />
                  </Box>
                </Panel>
              </Grid>
            )}
          </Grid>
        </div>
      )}

      <Footer />

      <script src="https://player.vimeo.com/api/player.js" />

      {/* empty div with testid for testing purpose */}
      <div data-testid="home" style={{ display: 'none' }} />
    </div>
  );
}
