import React from 'react';
import propTypes from 'prop-types';

// app
import * as utils from 'utils';
import { Translate, InfiniteScroll } from 'components';
import { PortfolioAccounts } from 'modules';
import styles from './PortfolioData.styles';
// mui
import { makeStyles } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import LocationOnIcon from '@material-ui/icons/LocationOn';

PortfolioDataView.propTypes = {
  locations: propTypes.array.isRequired,
};

export function PortfolioDataView({ locations, handleUpdateCenter }) {
  const classes = makeStyles(styles, { name: 'PortfolioData' })();

  const renderContent = (index) => {
    return (
      <div className={classes.root}>
        <div className={classes.address}>
          {locations[index].address ? (
            locations[index].address
          ) : (
            <span className={classes.missingLocation}>
              <InfoOutlinedIcon color="error" className={classes.errorIcon} /> <span>{utils.string.t('client.missingLocation')}</span>
            </span>
          )}
        </div>
        <div className={classes.accounts}>
          <PortfolioAccounts accounts={locations[index].accounts} />
        </div>
        <div className={classes.tiv}>
          <Translate label="format.currency" options={{ value: { number: locations[index].tivTotal, currency: 'USD' } }} />
        </div>
        <div className={classes.tiv}>
          {locations[index].address && (
            <LocationOnIcon color="primary" onClick={() => handleUpdateCenter([locations[index].lng, locations[index].lat])} />
          )}
        </div>
      </div>
    );
  };

  return locations.length > 0 ? (
    <InfiniteScroll itemCount={locations.length} content={(index) => renderContent(index)} containerHeight={300} rowHeight={57} />
  ) : (
    <Translate label={utils.string.t('client.noLocationsFound')} variant="body2" />
  );
}
