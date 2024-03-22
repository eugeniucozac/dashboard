import React from 'react';
import propTypes from 'prop-types';

// app
import * as utils from 'utils';
import { CardList, Translate } from 'components';
import styles from './PortfolioMapHeader.styles';

// mui
import { makeStyles } from '@material-ui/core';

PortfolioMapHeaderView.propTypes = {
  departments: propTypes.array.isRequired,
  logo: propTypes.string,
  title: propTypes.string,
};

export function PortfolioMapHeaderView({ departments, logo, title }) {
  const classes = makeStyles(styles, { name: 'PortfolioMapHeader' })();

  return (
    <div className={classes.modalHeader}>
      <div className={classes.logo}>
        {logo && <img src={logo} alt="logo" />}
        {!logo && title && <Translate label={title} variant="h2" className={classes.title} />}
      </div>

      {utils.generic.isValidArray(departments, true) && (
        <div className={classes.filterModal}>
          <CardList title="Departments" data={departments} nestedClasses={{ card: classes.card }} />
        </div>
      )}
    </div>
  );
}
