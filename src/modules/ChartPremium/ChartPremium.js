import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import chunk from 'chunk-text';
import chroma from 'chroma-js';
import throttle from 'lodash/throttle';
import merge from 'lodash/merge';
import get from 'lodash/get';

// app
import styles from './ChartPremium.styles';
import { Chart, ChartLegend, ChartTable, ChartTooltip, SectionHeader, Ratio, Translate } from 'components';
import { getPlacementDetails } from 'stores';
import { withThemeListener } from 'hoc';
import * as utils from 'utils';
import config from 'config';

// mui
import { withStyles } from '@material-ui/core';
import EqualizerIcon from '@material-ui/icons/Equalizer';

// dispatch
const mapDispatchToProps = {
  getPlacementDetails,
};

export class ChartPremium extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    year: PropTypes.number,
    dataByCurrency: PropTypes.arrayOf(
      PropTypes.shape({
        data: PropTypes.array.isRequired,
        columns: PropTypes.array.isRequired,
      })
    ),
    legend: PropTypes.bool,
    table: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.state = {
      instance: null,
    };
  }

  buildChartData = (data, columns) => {
    const colorScale = utils.color.scale(data.length);

    return {
      labels: columns.map((item) => (item ? item.toString() : '')),
      datasets: data.map((obj, index) => {
        const name = Object.keys(obj)[0];
        const color = colorScale[index];
        let label = '';

        const premiumsSummed = columns.map((column) => {
          const premiums = data[index][name][column] || [];

          if (premiums.length > 0) {
            label = get(data, `[${index}][${name}][${column}][0].insureds`);
          }

          return premiums.reduce((acc, obj) => acc + obj.premium, 0);
        });

        const objects = columns.map((column) => {
          return data[index][name][column] || null;
        });

        // prettier-ignore
        return {
          id: name,
          label: label,
          data: premiumsSummed,
          objects: objects,
          backgroundColor: color,
          hoverBackgroundColor: chroma(color).darken(0.5).hex(),
        };
      }),
    };
  };

  handleChartOnload = (id, instance) => {
    this.setState({
      instance,
    });
  };

  render() {
    const { instance } = this.state;
    const { id, year, dataByCurrency, legend, table, mobile, tablet, desktop, wide, classes } = this.props;

    // abort
    if (!dataByCurrency) return null;

    const optionsMerge = merge({}, config.ui.chart.bar, {
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            scaleLabel: {
              labelString: utils.string.t('app.premium'),
            },
            ticks: {
              callback: (label) => {
                return utils.string
                  .t('format.number', { value: { number: label, format: { average: true, totalLength: 12, lowPrecision: false } } })
                  .toUpperCase();
              },
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              callback: (label) => {
                return chunk(label, 30); //split in multiple rows
              },
            },
          },
        ],
      },
      tooltips: {
        mode: 'point',
        callbacks: {
          title: (tooltipItems, data) => {
            const object = get(data, `datasets[${tooltipItems[0].datasetIndex}].objects[${tooltipItems[0].index}][0]`);

            return object && object.insureds;
          },
          label: (tooltipItem, data) => {
            const dataset = get(data, `datasets[${tooltipItem.datasetIndex}]`);
            const object = get(dataset, `objects[${tooltipItem.index}][0]`);
            const premium = get(dataset, `data[${tooltipItem.index}]`);

            return (
              object &&
              premium && [
                ...chunk(`${utils.string.t('app.client_plural')}: ${object.clients}`, 50),
                utils.string.t('chart.tooltip.premium', { amount: premium }),
              ]
            );
          },
          footer: (tooltipItems, data) => {
            const index = get(tooltipItems, '[0].index');
            let count = 0;
            let sum = 0;

            data.datasets.forEach((set, idx) => {
              const meta = instance.getDatasetMeta(idx) || {};
              const value = !meta.hidden ? set.data[index] : 0;
              count = value ? count + 1 : count;
              sum += value;
            });

            return [utils.string.t('chart.tooltip.accounts', { count: count }), utils.string.t('chart.tooltip.total', { amount: sum })];
          },
        },
      },
      onHover: throttle((event, elems) => {
        const canvas = instance && instance.canvas;

        if (canvas) {
          canvas.style.cursor = elems[0] ? 'pointer' : 'default';
        }
      }, 100),
      onClick: (event) => {
        const element = instance && instance.getElementAtEvent(event)[0];

        if (element) {
          const object = get(instance, `data.datasets[${element._datasetIndex}].objects[${element._index}][0]`);

          if (object && object.id) {
            this.props.getPlacementDetails(object.id);
          }
        }
      },
    });

    const chartDataByCurrency = table ? dataByCurrency : dataByCurrency.map(({ data, columns }) => this.buildChartData(data, columns));

    return (
      <Fragment>
        <SectionHeader
          title={<Translate label={`client.office.${id}.title${year ? 'ForYear' : ''}`} options={{ year: year }} />}
          subtitle={<Translate label={`client.office.${id}.description`} className={classes.subtitle} parseDangerousHtml />}
          icon={EqualizerIcon}
          testid={`page-header-office-premium-${id}`}
          nestedClasses={{ root: classes.header }}
        />

        {!table &&
          chartDataByCurrency.map((chartData, index) => (
            <Fragment key={index}>
              <Ratio w={mobile ? 1.25 : tablet ? 2 : desktop ? 2.5 : wide ? 3 : 3.5} h={1}>
                <Chart id={id} type="bar" height="100%" data={chartData} options={optionsMerge} onload={this.handleChartOnload} />
              </Ratio>
            </Fragment>
          ))}

        {table &&
          chartDataByCurrency.map(({ data, columns }, index) => (
            <Fragment key={index}>
              <ChartTable
                id={id}
                rows={data}
                cols={columns}
                stacked
                sort={{
                  by: 'value',
                  type: 'numeric',
                  direction: 'desc',
                }}
                pagination={{
                  page: 0,
                  rowsPerPage: 10,
                }}
                tooltip={(row, dataset) => {
                  const premiumTotal = row.datasets.reduce((acc, dataset) => acc + dataset.value, 0);
                  const premiumTotalString = utils.string.t('format.currency', {
                    value: { number: premiumTotal, currency: row.currency },
                  });
                  const premiumString = utils.string.t('format.currency', {
                    value: { number: dataset.value, currency: row.currency },
                  });

                  return (
                    <ChartTooltip title={dataset.name}>
                      <div>{`${utils.string.t('app.premium')}: ${premiumString}`}</div>
                      <div>{`${utils.string.t('app.total')}: ${premiumTotalString}`}</div>
                    </ChartTooltip>
                  );
                }}
                onClick={(row, dataset) => (event) => {
                  if (dataset && dataset.id) {
                    this.props.getPlacementDetails(dataset.id);
                  }
                }}
              />
            </Fragment>
          ))}

        {legend && !table && <ChartLegend instance={instance} />}
      </Fragment>
    );
  }
}

export default compose(connect(null, mapDispatchToProps), withStyles(styles), withThemeListener)(ChartPremium);
