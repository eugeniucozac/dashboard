import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import get from 'lodash/get';

// app
import styles from './ChartLegend.styles';

// mui
import { withStyles } from '@material-ui/core';

export class ChartLegend extends PureComponent {
  static propTypes = {
    instance: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.legendRef = React.createRef();
  }

  componentDidMount() {
    this.createLegend();
  }

  componentWillUnmount() {
    const legend = get(this, 'legendRef.current');
    const elems = this.getLegendElems();

    if (legend) {
      elems.forEach((el) => {
        el.removeEventListener('click', this.handleClick);
      });
    }
  }

  componentDidUpdate() {
    this.createLegend();
  }

  createLegend = () => {
    const { instance } = this.props;
    const legend = get(this, 'legendRef.current');

    if (instance && legend) {
      legend.innerHTML = instance.generateLegend();

      this.getLegendElems().forEach((el, index) => {
        el.addEventListener('click', this.handleClick(instance, index));
      });
    }
  };

  getLegendElems = () => {
    let elems = [];
    const legend = get(this, 'legendRef.current');

    if (legend) {
      elems = legend.querySelectorAll('li');
    }

    return elems;
  };

  handleClick = (instance, index) => (event) => {
    const meta = instance.getDatasetMeta(index);

    event.currentTarget.classList.toggle('strike', !meta.hidden);
    meta.hidden = !meta.hidden;
    instance.update();
  };

  render() {
    const { instance, classes } = this.props;

    if (!instance) return null;

    return <div ref={this.legendRef} className={classes.root} />;
  }
}

export default compose(withStyles(styles))(ChartLegend);
