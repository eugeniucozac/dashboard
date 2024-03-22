import React, { PureComponent } from 'react';
import moment from 'moment';
import flatten from 'lodash/flatten';
import uniq from 'lodash/uniq';

// app
import { ChartPremium } from 'modules';
import * as utils from 'utils';

export class ChartPremiumByYear extends PureComponent {
  getData = (placements) => {
    const data = placements.reduce((list, placement) => {
      const insureds = utils.placement.getInsureds(placement);
      const clients = utils.placement.getClients(placement).join(', ');
      const date = new Date(placement.inceptionDate);
      const dateString = date && moment(date).format('DD/MM');
      const year = utils.placement.getYear(placement);
      const account = [insureds, clients, dateString].join(' - ');
      const premiumByCurrency = utils.placement.getPremiumBySettlementCurrency(placement, true, true);
      const hasPremiums = Boolean(premiumByCurrency);
      const currentAccountObj = list.find((obj) => obj[account]);

      if (hasPremiums) {
        Object.keys(premiumByCurrency).forEach((currency) => {
          const chartObject = {
            id: placement.id,
            insureds: insureds,
            clients: clients,
            premium: premiumByCurrency[currency],
            placement: placement,
          };

          if (currentAccountObj) {
            if (!currentAccountObj[account][`${year} (${currency})`]) {
              currentAccountObj[account][`${year} (${currency})`] = [];
            }

            currentAccountObj[account][`${year} (${currency})`].push(chartObject);
            return list;
          }

          list.push({
            [account]: {
              [`${year} (${currency})`]: [chartObject],
            },
          });
        });
      }

      return list;
    }, []);

    return {
      data,
      columns: this.getColumns(data),
    };
  };

  getColumns = (data) => {
    return data
      .reduce((list, entry) => {
        const keys = flatten(Object.keys(entry).map((key) => Object.keys(entry[key])));
        return uniq([...list, ...keys]);
      }, [])
      .sort();
  };

  render() {
    const { placements } = this.props;

    // abort
    if (!placements) return null;

    return <ChartPremium id="byYear" dataByCurrency={[this.getData(placements)]} />;
  }
}

export default ChartPremiumByYear;
