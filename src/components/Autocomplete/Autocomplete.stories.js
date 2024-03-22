import React from 'react';
import { Autocomplete } from 'components';
import { withKnobs, text, array } from '@storybook/addon-knobs';
import { Box } from '@material-ui/core';

export default {
  title: 'Autocomplete',
  component: Autocomplete,
  decorators: [withKnobs],
};

export const Default = () => {
  const label = text('Label', 'Autocomplete');
  const helperText = text('Hint', 'Choose an option');
  const errorText = text('Error', '');

  const suggestions = [
    { id: 1, name: 'Associated Banc-Corp' },
    { id: 2, name: 'Stanley Black & Decker, Inc.' },
    { id: 3, name: 'HopFed Bancorp, Inc.' },
    { id: 4, name: 'Equinix, Inc.' },
    { id: 5, name: 'Zions Bancorporation' },
    { id: 6, name: 'HubSpot, Inc.' },
    { id: 7, name: 'Credit Suisse Group' },
    { id: 8, name: 'Cathay General Bancorp' },
    { id: 9, name: 'Sohu.com Inc.' },
    { id: 10, name: 'Timberland Bancorp, Inc.' },
    { id: 11, name: 'Western Asset/Claymore U.S. Treasury Inflation Prot Secs Fd' },
    { id: 12, name: 'DCP Midstream LP' },
    { id: 13, name: "Bojangles', Inc." },
    { id: 14, name: 'W.R. Berkley Corporation' },
    { id: 15, name: 'Mercury Systems Inc' },
    { id: 16, name: 'Zayo Group Holdings, Inc.' },
    { id: 17, name: 'Banco Santander, S.A.' },
    { id: 18, name: 'Alleghany Corporation' },
    { id: 19, name: 'Agree Realty Corporation' },
    { id: 20, name: 'Procter & Gamble Company (The)' },
    { id: 21, name: 'Electrum Special Acquisition Corporation' },
    { id: 22, name: 'Westmoreland Resource Partners, LP' },
    { id: 23, name: 'ContraVir Pharmaceuticals Inc' },
    { id: 24, name: 'Qwest Corporation' },
    { id: 25, name: 'VictoryShares International High Div Volatility Wtd ETF' },
    { id: 26, name: '21Vianet Group, Inc.' },
    { id: 27, name: 'Intelsat S.A.' },
    { id: 28, name: 'eHealth, Inc.' },
    { id: 29, name: 'Nivalis Therapeutics, Inc.' },
    { id: 30, name: 'Apple Inc.' },
  ];

  return (
    <Box width="100%">
      <Autocomplete
        id="storybook"
        label={label}
        suggestions={suggestions}
        optionKey="id"
        optionLabel="name"
        helperText={helperText}
        error={{ message: errorText }}
        handleUpdate={() => {}}
      ></Autocomplete>
    </Box>
  );
};
