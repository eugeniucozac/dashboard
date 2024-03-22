import React from 'react';
import { withKnobs, number, select, text, boolean } from '@storybook/addon-knobs';
import { Chart, Ratio } from 'components';
import * as utils from 'utils';
import chroma from 'chroma-js';
import config from 'config';
import merge from 'lodash/merge';
import toNumber from 'lodash/toNumber';

export default {
  title: 'Chart',
  component: Chart,
  decorators: [withKnobs],
};

const random = (min = 0, max = 100) => {
  min = Math.ceil(min);
  max = Math.floor(max) + 1;
  return Math.floor(Math.random() * (max - min)) + min;
};

const darken = (colour) => {
  // prettier-ignore
  return chroma(colour).darken(0.5).hex();
};

const parseDimension = (value) => {
  const isNumber = !['%', 'px', 'rem', 'em'].some((v) => value.includes(v));
  return isNumber ? toNumber(value) : value;
};

const getAmounts = (num = 0, includeNulls, min = 0, max = 100) => {
  return [...Array(num)].map((_, i) => {
    return includeNulls && !random(1, 3) % 3 ? null : random(min, max) * (i + 1) * (i + 1);
  });
};

const getYears = (num = 0) => {
  const year = new Date().getFullYear();
  return [...Array(num)].map((_, i) => (year - num + i + 1).toString());
};

export const Bar = () => {
  const type = select('Type', ['horizontal', 'vertical'], 'vertical');
  const width = text('Width', '100%');
  const height = text('Height', '400');
  const dataPoints = number('Data points', 20, { range: true, min: 0, max: 100, step: 1 });
  const dataLayers = number('Data layers', 1, { range: true, min: 0, max: 20, step: 1 });
  const tooltips = boolean('Tooltips', true);
  const isVertical = type === 'vertical';
  const xLabel = isVertical ? 'Year' : 'Amount';
  const yLabel = isVertical ? 'Amount' : 'Year';

  const getDatasets = (num = 0) => {
    return [...Array(num)].map((_, i) => {
      return {
        data: getAmounts(dataPoints, true),
        backgroundColor: utils.color.scale(num, true, i),
        hoverBackgroundColor: darken(utils.color.scale(num, true, i)),
      };
    });
  };

  return (
    <Chart
      key={type}
      id={type}
      type={type === 'vertical' ? 'bar' : 'horizontalBar'}
      width={parseDimension(width) || '100%'}
      height={parseDimension(height) || 400}
      data={{
        labels: getYears(dataPoints),
        datasets: getDatasets(dataLayers),
      }}
      options={{
        ...config.ui.chart.bar,
        maintainAspectRatio: false,
        scales: merge({}, config.ui.chart.bar.scales, {
          ...(boolean('X Axis Label', true) && { xAxes: [{ scaleLabel: { labelString: xLabel } }] }),
          ...(boolean('Y Axis Label', true) && { yAxes: [{ scaleLabel: { labelString: yLabel } }] }),
        }),
        tooltips: {
          enabled: tooltips,
        },
      }}
    />
  );
};

export const Doughnut = () => {
  const type = select('Type', ['doughnut', 'pie'], 'doughnut');
  const width = text('Width', '400');
  const height = text('Height', '400');
  const dataPoints = number('Data points', 8, { range: true, min: 0, max: 25, step: 1 });
  const dataLayers = number('Data layers', 1, { range: true, min: 0, max: 5, step: 1 });
  const tooltips = boolean('Tooltips', true);

  const getDatasets = (num = 0) => {
    const isMultiDatasets = dataLayers > 1;
    return [...Array(num)].map((_, i) => {
      return {
        data: getAmounts(dataPoints, false, 10, 50),
        backgroundColor: utils.color.scale(isMultiDatasets ? dataLayers : dataPoints, true, isMultiDatasets ? i : null),
        hoverBackgroundColor: utils.color.scale(isMultiDatasets ? dataLayers : dataPoints, true, isMultiDatasets ? i : null),
      };
    });
  };

  return (
    <Ratio w={1} h={1}>
      <Chart
        key={type}
        id={type}
        type={type}
        width={parseDimension(width) || 400}
        height={parseDimension(height) || 400}
        scale
        data={{
          labels: getYears(dataPoints),
          datasets: getDatasets(dataLayers),
        }}
        options={{
          ...config.ui.chart.doughnut,
          tooltips: {
            enabled: tooltips,
          },
        }}
      />
    </Ratio>
  );
};
