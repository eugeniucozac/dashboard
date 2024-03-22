import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './OpportunityTooltip.styles';
import { MapBoxTooltip, TooltipList } from 'components';
import * as utils from 'utils';
import * as constants from 'consts';

// mui
import { makeStyles } from '@material-ui/core';
import { LocationOn, AttachMoney } from '@material-ui/icons';

OpportunityTooltipView.propTypes = {
  title: PropTypes.string,
  address: PropTypes.string,
  year: PropTypes.number,
  premiums: PropTypes.array,
};

export function OpportunityTooltipView({ title, address, year, premiums }) {
  const classes = makeStyles(styles, { name: 'OpportunityTooltip' })({
    overflow: premiums && premiums.length > 5,
  });

  const hasPremiums = utils.generic.isValidArray(premiums, true);

  const list = [
    {
      icon: <LocationOn />,
      title: address,
    },
    {
      icon: <AttachMoney />,
      title: hasPremiums ? `${utils.string.t('app.premium_plural')} (${year} - ${constants.CURRENCY_USD})` : '',
      content: hasPremiums && (
        <div className={classes.listWrapper}>
          <div className={classes.list} data-testid="opportunity-tooltip-premiums-list">
            <TooltipList
              items={premiums.map((premium) => ({ id: premium.departmentId, label: premium.departmentName, amount: premium.premium }))}
            />
          </div>
        </div>
      ),
    },
  ];

  return <MapBoxTooltip title={title} list={list} />;
}
