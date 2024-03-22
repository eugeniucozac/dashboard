import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from '../AddRiskObjectAddress/AddRiskObjectAddress.styles';
import { MapBox, MapBoxTooltip, TableCell } from 'components';
import { AddRiskObject } from 'modules';
import { useMedia } from 'hooks';
import * as utils from 'utils';

// mui
import { makeStyles, Grid, Table, TableRow, TableBody } from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';

AddRiskObjectAddressView.propTypes = {
  field: PropTypes.object.isRequired,
  formProps: PropTypes.object.isRequired,
  map: PropTypes.object.isRequired,
  distance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  locations: PropTypes.array.isRequired,
  mapOnLoad: PropTypes.func.isRequired,
};

export function AddRiskObjectAddressView({ field, formProps, map, distance, locations, mapOnLoad }) {
  const classes = makeStyles(styles, { name: 'AddRiskObjectAddress' })();
  const media = useMedia();
  const hasLocations = utils.generic.isValidArray(locations, true);

  const customTooltipComponent = ({ tooltip }) => {
    return <MapBoxTooltip list={[{ icon: <LocationOnIcon />, title: tooltip.outputAddress }]} />;
  };

  return (
    <Grid container spacing={4} direction={media.wideUp ? 'row-reverse' : 'row'}>
      <Grid item xs={12} lg={5}>
        <div>
          <MapBox
            id={`risk-object-address-${field.name}`}
            height={media.wideUp ? '36vh' : '24vh'}
            allowFullscreen={false}
            allowSatelliteView={false}
            fitBounds
            fitBoundsOptions={{
              maxZoom: map.maxZoom,
            }}
            markerMaxZoom={map.maxZoom}
            locations={locations}
            overlay={{
              text: utils.string.t('risks.address.startTyping'),
              visible: !hasLocations,
            }}
            tooltipComponent={customTooltipComponent}
            onLoad={mapOnLoad}
          />
        </div>

        {hasLocations && (
          <div className={classes.details}>
            <Table className={classes.table}>
              <TableBody data-testid="risk-address-details">
                <TableRow className={classes.row}>
                  <TableCell className={classes.cell}>{utils.string.t('risks.address.input')}:</TableCell>
                  <TableCell className={classes.cell}>{locations[0].inputAddress}</TableCell>
                </TableRow>
                <TableRow className={classes.row}>
                  <TableCell className={classes.cell}>{utils.string.t('risks.address.output')}:</TableCell>
                  <TableCell className={classes.cell}>{locations[0].outputAddress}</TableCell>
                </TableRow>
                <TableRow className={classes.row}>
                  <TableCell className={classes.cell}>{utils.string.t('risks.address.distanceToCoast')}:</TableCell>
                  <TableCell className={classes.cell}>{`${distance ? distance + ' ' + utils.string.t('map.unit.miles') : '-'}`}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
      </Grid>
      <Grid item xs={12} lg={7}>
        <AddRiskObject field={field} formProps={formProps} />
      </Grid>
    </Grid>
  );
}
