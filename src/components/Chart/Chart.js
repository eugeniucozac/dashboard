import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import classnames from 'classnames';
import ChartJS from 'chart.js';
import isEqual from 'lodash/isEqual';

// app
import styles from './Chart.styles';
import { Tooltip } from 'components';
import * as utils from 'utils';

// mui
import { withStyles } from '@material-ui/core';

export class Chart extends PureComponent {
  static propTypes = {
    id: PropTypes.string,
    type: PropTypes.oneOf(['bar', 'horizontalBar', 'doughnut', 'pie']).isRequired,
    data: PropTypes.shape({
      datasets: PropTypes.arrayOf(
        PropTypes.shape({
          data: PropTypes.arrayOf(PropTypes.number).isRequired,
        })
      ).isRequired,
      labels: PropTypes.arrayOf(PropTypes.string),
      id: PropTypes.string,
    }),
    options: PropTypes.object.isRequired,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    scale: PropTypes.bool,
    tooltip: PropTypes.string,
    nestedClasses: PropTypes.shape({
      root: PropTypes.string,
      chart: PropTypes.string,
    }),
    onload: PropTypes.func,
  };

  static defaultProps = {
    nestedClasses: {},
  };

  constructor(props) {
    super(props);
    this.chartRef = React.createRef();
  }

  componentDidMount() {
    const { id, type, data, options, onload } = this.props;

    this.myChart = new ChartJS(this.chartRef.current, {
      type: type,
      data: Object.assign({}, data),
      options: Object.assign({}, options),
    });

    if (utils.generic.isFunction(onload)) {
      onload(id, this.myChart);
    }
  }

  componentDidUpdate(prevProps) {
    const { options } = this.props;
    const { labels, datasets, id } = this.props.data;

    // compare data props then update if values have changed
    const isDataEqual = prevProps.data.id === id && this.isDataEqual(prevProps.data.datasets, datasets);
    const isOptionsEqual = this.isOptionsEqual(prevProps.options, options);

    if (!isDataEqual) {
      this.myChart.data.labels = [...labels];

      // if the datasets have the same number, we can animate the values
      // if not, ChartJS will redraw them from scratch
      if (prevProps.data.datasets.length === datasets.length) {
        this.myChart.data.datasets.map((dataset, index) => {
          dataset.data = this.props.data.datasets[index].data;
          dataset.backgroundColor = this.props.data.datasets[index].backgroundColor;
          dataset.hoverBackgroundColor = this.props.data.datasets[index].hoverBackgroundColor;
          return dataset;
        });
      } else {
        this.myChart.data.datasets = [...datasets];
      }

      this.myChart.update();
    }

    if (!isOptionsEqual) {
      this.myChart.options = options;
      this.myChart.update();
    }
  }

  componentWillUnmount() {
    if (this.myChart && this.myChart.destroy) {
      this.myChart.destroy();
    }
  }

  isDataEqual = (prevData, currentData) => {
    // check if we have different number of datasets
    if (prevData.id !== currentData.id) {
      return false;
    }
    if (prevData.length !== currentData.length) {
      return false;
    }

    // go through the datasets
    // check that the data arrays are equal or not
    return prevData.reduce((acc, dataset, index) => {
      return acc && isEqual(dataset.data, currentData[index].data) && isEqual(dataset.backgroundColor, currentData[index].backgroundColor);
    }, true);
  };

  isOptionsEqual = (prevOptions, currentOptions) => {
    return isEqual(prevOptions, currentOptions);
  };

  render() {
    const { id, type, data, options, width, height, scale, tooltip, nestedClasses, classes } = this.props;

    if (!type || !data || !options) return null;

    const chartClasses = {
      [classes.root]: true,
      [classes.scale]: Boolean(scale),
      [nestedClasses.root]: true,
    };

    return (
      <div className={classnames(chartClasses)} style={{ width, height }} data-testid={id}>
        {tooltip && (
          <Tooltip title={tooltip} style={{ width, height }}>
            <canvas ref={this.chartRef} className={nestedClasses.chart} />
          </Tooltip>
        )}

        {!tooltip && <canvas ref={this.chartRef} className={nestedClasses.chart} />}
      </div>
    );
  }
}

export default compose(withStyles(styles))(Chart);
