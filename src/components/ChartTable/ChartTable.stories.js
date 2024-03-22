import React from 'react';
import { withKnobs, number, boolean } from '@storybook/addon-knobs';
import { ChartTable, ChartTooltip } from 'components';
import * as utils from 'utils';
import compact from 'lodash/compact';

export default {
  title: 'ChartTable',
  component: ChartTable,
  decorators: [withKnobs],
};

// prettier-ignore
const rows = [
  { id: 1, name: 'Google' },
  { id: 2, name: 'Facebook Inc' },
  { id: 3, name: 'Ford General Motors' },
  { id: 4, name: 'Uber' },
  { id: 5, name: 'Microsoft Inc' },
  { id: 6, name: 'Tesla Motors' },
  { id: 7, name: 'Yahoo!' },
  { id: 8, name: 'HSBC UK' },
  { id: 9, name: 'AstraZeneca' },
  { id: 10, name: 'BP' },
  { id: 11, name: 'GlaxoSmithKline' },
  { id: 12, name: 'British American Tobacco' },
  { id: 13, name: 'Diageo' },
  { id: 14, name: 'Rio Tinto' },
  { id: 15, name: 'Unilever' },
  { id: 16, name: 'Reckitt Benckiser Group' },
  { id: 17, name: 'Vodafone Group' },
  { id: 18, name: 'Youtube' },
  { id: 19, name: 'Starbuck\'s' },
  { id: 20, name: 'British Airways' },
  { id: 21, name: 'Llyods Banking' },
  { id: 22, name: 'Centrica' },
  { id: 23, name: 'Tesco' },
  { id: 24, name: 'Barclay\'s' },
  { id: 25, name: 'Homebase' },
  { id: 26, name: 'Coventry Building Society' },
  { id: 27, name: 'Admiral Insurance' },
  { id: 28, name: 'Roche	Healthcare' },
  { id: 29, name: 'Hobbycraft' },
  { id: 30, name: 'BT' },
  { id: 31, name: 'Marriott Hotels' },
  { id: 32, name: 'Arcadia' },
  { id: 33, name: 'UK Power Networks' },
  { id: 34, name: 'LastMinute' },
  { id: 35, name: 'Tata Consultancy' },
  { id: 36, name: 'SpecSavers' },
  { id: 37, name: 'Howdens' },
  { id: 38, name: 'Openreach' },
  { id: 39, name: 'Puregym' },
  { id: 40, name: 'O2' },
  { id: 41, name: 'Telegraph Group' },
  { id: 42, name: 'Waitrose' },
  { id: 43, name: 'Aston Martin' },
  { id: 44, name: 'Harrod\'s' },
  { id: 45, name: 'Selfridges' },
  { id: 46, name: 'SUEZ Recycling' },
  { id: 47, name: 'Halfords' },
  { id: 48, name: 'Asda' },
  { id: 49, name: 'Apple' },
  { id: 50, name: 'Amazon' },

];

const random = (min = 0, max = 100) => {
  min = Math.ceil(min);
  max = Math.floor(max) + 1;
  return Math.floor(Math.random() * (max - min)) + min;
};

const getDatasets = (num, idx, layers, min = 0, max = 100, round = 1) => {
  return [...Array(num)].map((_, i) => {
    return layers > 1 && !(random(1, 3) % 3)
      ? null
      : {
          id: i,
          value: Math.round((random(min, max) * (idx + 1) * (idx + 1)) / round) * round,
        };
  });
};

const getRows = (num = 0, layers = 0) => {
  return [...Array(num)].map((_, i) => {
    const data = compact(getDatasets(Math.ceil((random() / 100) * layers), num - i, layers, 1000, 100000, 50000));
    const total = data.reduce((acc, cur) => acc + cur.value, 0);

    return {
      ...rows[i],
      label: utils.string.t('format.currency', { value: { number: total, currency: 'GBP' } }),
      datasets: data,
    };
  });
};

export const Default = () => {
  const dataPoints = number('Data points', 10, { range: true, min: 0, max: 50, step: 1 });
  const dataLayers = number('Data layers', 1, { range: true, min: 0, max: 10, step: 1 });
  const tooltips = boolean('Tooltips', true);
  const dataRows = getRows(dataPoints, dataLayers);

  const tooltipRender = (row, obj) => {
    return (
      <ChartTooltip title={row.name}>
        <div>{`Layer ${obj.id + 1}: ${obj.value}`}</div>
        <div>
          Total:{' '}
          {utils.string.t('format.currency', {
            value: { number: row.datasets.reduce((acc, dataset) => acc + dataset.value, 0), currency: 'GBP' },
          })}
        </div>
      </ChartTooltip>
    );
  };

  return (
    <ChartTable
      id="default"
      rows={dataRows}
      cols={[
        { id: 'name', label: 'Name', sort: { type: 'lexical', direction: 'asc' } },
        { id: 'value', label: 'Value', sort: { type: 'numeric', direction: 'desc' } },
      ]}
      sort={{
        by: 'value',
        type: 'numeric',
        direction: 'desc',
      }}
      pagination={{
        page: 0,
        rowsPerPage: 10,
        rowsTotal: dataRows.length,
      }}
      hover={boolean('Hover', false)}
      tooltip={tooltips ? tooltipRender : undefined}
    />
  );
};
