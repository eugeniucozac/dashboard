import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import groupBy from 'lodash/groupBy';

// app
import { ChartPremium } from 'modules';
import * as utils from 'utils';

// state
const mapStateToProps = (state) => ({
  referenceDataCurrencies: state.referenceData.currencies,
  referenceDataDepartments: state.referenceData.departments,
});

export class ChartPremiumByAccount extends PureComponent {
  static propTypes = {
    placements: PropTypes.array.isRequired,
    year: PropTypes.number,
  };

  getTableColumns = (currency) => [
    {
      id: 'name',
      label: utils.string.t('app.account'),
      sort: { type: 'lexical', direction: 'asc' },
    },
    {
      id: 'department',
      label: utils.string.t('app.department'),
      sort: { type: 'lexical', direction: 'asc' },
    },
    {
      id: 'offices',
      label: utils.string.t('app.office'),
      sort: { type: 'lexical', direction: 'asc' },
    },
    {
      id: 'value',
      label: utils.string.t('chart.legend.premium', { currency }),
      sort: { type: 'numeric', direction: 'desc' },
    },
  ];

  formatData = (placements) => {
    const { referenceDataDepartments } = this.props;

    const data = placements.reduce((list, placement) => {
      const placementId = placement.id;
      const placementName = utils.placement.getInsureds(placement);
      const placementPremiumByCurrency = utils.placement.getPremiumBySettlementCurrency(placement, true, true);
      const placementOffices = utils.placement.getOffices(placement).join(', ');

      const byCurrency = Object.keys(placementPremiumByCurrency).map((currency) => {
        return {
          id: placementId,
          currency,
          name: placementName,
          department: utils.placement.getDepartmentName(placement, referenceDataDepartments),
          offices: placementOffices,
          label: utils.string.t('format.currency', { value: { number: placementPremiumByCurrency[currency], currency } }),
          datasets: [
            {
              id: placementId,
              value: placementPremiumByCurrency[currency],
              name: placementName,
              object: [placement],
            },
          ],
        };
      });

      return [...list, ...byCurrency];
    }, []);

    const grouped = groupBy(data, (item) => item.currency);

    return Object.keys(grouped).map((currency) => ({
      currency,
      data: grouped[currency],
      columns: this.getTableColumns(currency),
    }));
  };

  render() {
    const { placements, year } = this.props;

    // abort
    if (!placements) return null;

    const filteredPlacements = utils.placement.getByYear(placements, year);
    const dataByCurrency = this.formatData(filteredPlacements);

    return <ChartPremium id="byAccount" year={year} dataByCurrency={dataByCurrency} table />;
  }
}

export default compose(connect(mapStateToProps, null))(ChartPremiumByAccount);
