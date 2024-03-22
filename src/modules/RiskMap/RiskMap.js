import * as React from 'react';
import { firstBy } from 'thenby';
import startCase from 'lodash/startCase';
import toLower from 'lodash/toLower';

import { Pagination, TableCell, TableHead, Translate, MapBox, MapBoxTooltip, Overflow } from 'components';
import { Box, Table, TableRow, TableBody, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LocationOnIcon from '@material-ui/icons/LocationOn';

// app
import { LocationTooltip } from './LocationTooltip';
import { useSort } from 'hooks';
import * as utils from 'utils';
import { mapLayers } from 'utils/map/mapLayers';
import config from 'config';

const { pagination: paginationConfig } = config?.ui;

const useStyles = makeStyles(() => ({
  root: {
    color: 'red',
    '& .MuiTableCell-sizeSmall': {
      '&:first-child': {
        paddingLeft: 30,
      },

      '&:last-child': {
        paddingRight: 0,
      },
    },
  },
}));

function RiskMap({ title, locations, locationDefinitions }) {
  const classes = useStyles();
  const [isTooltipOpen, setIsTooltipOpen] = React.useState(false);
  const [viewport, setViewport] = React.useState({});
  const [activeMarkers, setActiveMarkers] = React.useState([]);
  const [pagination, setPagination] = React.useState({
    page: 0,
    rowsPerPage: paginationConfig.default,
    rowsPerPageOptions: paginationConfig.options,
    count: locations?.length,
  });

  const defaultSort = {
    by: 'id',
    direction: 'asc',
    type: 'numeric',
  };

  const columns = [
    { id: 'id', label: <Translate label="risks.building" />, sort: { by: 'id', type: 'numeric', direction: 'asc' } },
    { id: 'streetAddress', label: <Translate label="app.streetAddress" />, sort: { type: 'lexical', direction: 'asc' } },
    { id: 'city', label: <Translate label="app.city" />, sort: { type: 'lexical', direction: 'asc' } },
    { id: 'county', label: 'County', sort: { type: 'lexical', direction: 'asc' } },
    { id: 'state', label: <Translate label="app.state" />, sort: { type: 'lexical', direction: 'asc' } },
    { id: 'distanceToCoast', label: <Translate label="risks.address.distanceToCoast" />, sort: { type: 'numeric', direction: 'asc' } },
    { id: 'totalInsurableValue', label: <Translate label="app.tiv" />, sort: { type: 'numeric', direction: 'desc' } },
    { id: 'buildingInfo', label: '' },
  ];

  const { cols, sort } = useSort(columns, defaultSort);
  const sortedLocations = locations.sort(firstBy(utils.sort.array(sort.type, sort.by, sort.direction)));

  const start = pagination.page * pagination.rowsPerPage;
  const end = start + pagination.rowsPerPage;

  const handleChangePage = (_, page) => {
    setPagination((prevState) => {
      return { ...prevState, page };
    });
  };
  const handleChangeRowsPerPage = (event) => {
    setPagination((prevState) => {
      return { ...prevState, rowsPerPage: event.target.value };
    });
  };

  const handleOpenTooltip = (open) => {
    setIsTooltipOpen(open);
  };

  const handleMarkerClick = ({ id }) => {
    const locationIndex = sortedLocations.findIndex((location) => location.id === id);

    setPagination((prevState) => {
      return { ...prevState, page: Math.floor(locationIndex / prevState.rowsPerPage) };
    });
    setActiveMarkers([id]);
  };

  const handleRowClick = (location) => {
    setViewport({
      ...viewport,
      center: [location.longitude, location.latitude],
      zoom: config.mapbox.marker.maxZoom,
    });

    setActiveMarkers([location.id]);
  };

  const customTooltipComponent = ({ tooltip }) => {
    const title = `${tooltip.streetAddress}, ${tooltip.zip}, ${tooltip.city}, ${tooltip.county}, ${tooltip.state}`;

    return tooltip.buildingTitle ? <MapBoxTooltip title={tooltip.buildingTitle} list={[{ icon: <LocationOnIcon />, title }]} /> : null;
  };

  return (
    <Box>
      <Box m={3} mb={1} display="flex" alignItems="center" data-testid="risk-map">
        <Typography variant="h3">{startCase(toLower(title))}</Typography>
      </Box>

      <Box>
        <MapBox
          data-testid="mapbox"
          id="markers"
          height={400}
          activeMarkers={activeMarkers}
          onClickMarker={handleMarkerClick}
          fitBounds
          locations={sortedLocations}
          allowFullscreen
          allowSatelliteView
          allowScrollZoom
          allowMarkerClickZoom
          layers={mapLayers}
          tooltipComponent={customTooltipComponent}
          {...viewport}
        />
      </Box>
      <Box>
        <Overflow>
          <Table size="small" classes={{ root: classes.root }}>
            <TableHead
              columns={cols}
              sorting={{ by: sort.by, direction: sort.direction }}
              nestedClasses={{ tableHead: classes.tableHead }}
            />
            <TableBody>
              {sortedLocations.slice(start, end).map((location) => {
                return (
                  <TableRow
                    key={location.id}
                    data-testid={`location-row`}
                    hover
                    selected={activeMarkers.includes(location.id)}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleRowClick(location)}
                  >
                    <TableCell>{location.buildingTitle}</TableCell>
                    <TableCell>{location.streetAddress}</TableCell>
                    <TableCell>{location.city}</TableCell>
                    <TableCell>{location.county}</TableCell>
                    <TableCell>{location.state}</TableCell>
                    <TableCell>{location.distanceToCoast} miles</TableCell>
                    <TableCell>{utils.number.formatNumber(location.totalInsurableValue)}</TableCell>
                    <TableCell>
                      <LocationTooltip
                        location={location}
                        locationDefinitions={locationDefinitions}
                        excludeColumns={columns}
                        handleOpen={handleOpenTooltip}
                        disabled={isTooltipOpen}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <Pagination
            page={pagination.page}
            count={pagination.count}
            rowsPerPage={pagination.rowsPerPage}
            rowsPerPageOptions={pagination.rowsPerPageOptions}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Overflow>
      </Box>
    </Box>
  );
}

export default RiskMap;
