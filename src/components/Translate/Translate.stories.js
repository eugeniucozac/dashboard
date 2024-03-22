import React from 'react';
import { Translate } from 'components';
import { withKnobs, text, select } from '@storybook/addon-knobs';
import { Grid } from '@material-ui/core';

export default {
  title: 'Translate',
  decorators: [withKnobs],
};

export const Format = () => {
  return (
    <Translate
      label={`format.${select('Formatting', ['number', 'percent', 'currency'], 'number')}`}
      options={{ value: { number: text('Value', '1000'), currency: select('Currency', ['USD', 'GBP', 'EUR'], 'GBP') } }}
      variant={select(
        'Variant',
        [
          'h1',
          'h2',
          'h3',
          'h4',
          'h5',
          'h6',
          'subtitle1',
          'subtitle2',
          'body1',
          'body2',
          'caption',
          'button',
          'overline',
          'srOnly',
          'inherit',
        ],
        'body1'
      )}
    />
  );
};

export const Text = () => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Translate label="H1 text" variant="h1" />
      </Grid>
      <Grid item xs={12}>
        <Translate label="H2 text" variant="h2" />
      </Grid>
      <Grid item xs={12}>
        <Translate label="H3 text" variant="h3" />
      </Grid>
      <Grid item xs={12}>
        <Translate label="H4 text" variant="h4" />
      </Grid>
      <Grid item xs={12}>
        <Translate label="H5 text" variant="h5" />
      </Grid>
      <Grid item xs={12}>
        <Translate label="H6 text" variant="h6" />
      </Grid>
      <Grid item xs={12}>
        <Translate label="Subtitle1 text" variant="subtitle1" />
      </Grid>
      <Grid item xs={12}>
        <Translate label="Subtitle2 text" variant="subtitle2" />
      </Grid>
      <Grid item xs={12}>
        <Translate label="Body1 text" variant="body1" />
      </Grid>
      <Grid item xs={12}>
        <Translate label="Body2 text" variant="body2" />
      </Grid>
      <Grid item xs={12}>
        <Translate label="Caption text" variant="caption" />
      </Grid>
      <Grid item xs={12}>
        <Translate label="Button text" variant="button" />
      </Grid>
      <Grid item xs={12}>
        <Translate label="Overline text" variant="overline" />
      </Grid>
      <Grid item xs={12}>
        <Translate label="SrOnly text" variant="srOnly" />
      </Grid>
      <Grid item xs={12}>
        <Translate label="Inherit text" variant="inherit" />
      </Grid>
    </Grid>
  );
};
