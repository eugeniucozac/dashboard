import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './Opportunity.styles';
import { Layout, MapBox, SectionHeader, Translate } from 'components';
import { OpportunityLeads, OpportunityTooltip, TripSummary } from 'modules';
import { OpportunitySearch } from 'forms';
import * as utils from 'utils';

// mui
import { makeStyles, Box, Grid } from '@material-ui/core';
import PublicIcon from '@material-ui/icons/Public';

OpportunityView.propTypes = {
  leads: PropTypes.array.isRequired,
  map: PropTypes.object.isRequired,
  handleClickCheckbox: PropTypes.func.isRequired,
  handleClickLead: PropTypes.func.isRequired,
  handleClickMarker: PropTypes.func.isRequired,
};

export function OpportunityView({
  leads,
  leadsLoading,
  map,
  handleSearchCallback,
  handleClickCheckbox,
  handleClickLead,
  handleClickMarker,
  handleOnLoad,
  handleOnChange,
}) {
  const classes = makeStyles(styles, { name: 'Opportunity' })();

  return (
    <Layout container testid="opportunity">
      <Layout main>
        <SectionHeader title={utils.string.t('opportunity.title')} icon={PublicIcon} testid="opportunity-explorer" />

        <Grid container spacing={4}>
          <Grid item xs={12} sm={5} lg={4}>
            <Translate variant="h3" label="opportunity.travellingTo" className={classes.title} />
            <OpportunitySearch />

            <Box mt={5}>
              <OpportunityLeads
                leads={leads}
                selected={map.activeMarkers}
                handleClickLead={handleClickLead}
                handleClickCheckbox={handleClickCheckbox}
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={7} lg={8}>
            <MapBox
              id="opportunity-explorer"
              height={580}
              center={map.center}
              zoom={map.zoom}
              markerMaxZoom={map.maxZoom}
              fitBounds
              locations={leads}
              activeMarkers={map.activeMarkers}
              onClickMarker={handleClickMarker}
              onLoad={handleOnLoad}
              onChange={handleOnChange}
              tooltipComponent={OpportunityTooltip}
            />
          </Grid>
        </Grid>
      </Layout>

      <Layout sidebar padding={false}>
        <TripSummary />
      </Layout>
    </Layout>
  );
}
