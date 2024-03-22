import React from 'react';
import propTypes from 'prop-types';

// app
import config from 'config';
import { mapLayers } from 'utils/map/mapLayers';
import * as utils from 'utils';
import { MapBox, ChartTooltip, Translate, Button } from 'components';
import { PortfolioData, PortfolioAccounts } from 'modules';
import styles from './PortfolioMap.styles';

// mui
import { makeStyles, Collapse } from '@material-ui/core';
import DoubleArrowOutlinedIcon from '@material-ui/icons/DoubleArrowOutlined';

PortfolioMapView.propTypes = {
  token: propTypes.string.isRequired,
  locations: propTypes.array.isRequired,
  mapKeyFilter: propTypes.func.isRequired,
  mapKeyFilterAll: propTypes.func.isRequired,
  getLocations: propTypes.func.isRequired,
  mapKey: propTypes.array.isRequired,
  isLoading: propTypes.bool.isRequired,
  level: propTypes.string.isRequired,
  handleUpdateCenter: propTypes.func.isRequired,
  handleToggleTable: propTypes.func.isRequired,
  center: propTypes.array,
};

export function PortfolioMapView({
  handleUpdateCenter,
  center,
  token,
  locations,
  getLocations,
  mapKey,
  mapKeyFilter,
  mapKeyFilterAll,
  isLoading,
  level,
  levelOverride,
  showTable,
  handleToggleTable,
}) {
  const classes = makeStyles(styles, { name: 'PortfolioMap' })({ showTable, levelOverride: !!levelOverride });

  const ClientLocationTooltip = ({ tooltip }) => {
    const { accounts, address, tivTotal } = tooltip;
    return (
      <ChartTooltip title={address}>
        <div>
          {<PortfolioAccounts accounts={accounts} />}
          <div className={classes.valueLabel}>
            <span className={classes.label}>{utils.string.t('app.total')}:</span>
            <Translate label="format.currency" options={{ value: { number: tivTotal, currency: 'USD' } }} />
          </div>
        </div>
      </ChartTooltip>
    );
  };

  return (
    <>
      <MapBox
        id="client-map"
        reCenter={false}
        center={center}
        height="100%"
        levelOverride={levelOverride}
        layers={mapLayers}
        onLevelChange={getLocations}
        isLoading={isLoading}
        allowMarkerClickZoom={false}
        markerType={config.mapbox.markerType.doughnut}
        showMarkers={true}
        tooltipComponent={ClientLocationTooltip}
        locations={locations}
        nestedClasses={{ map: classes.map }}
        mapKey={{
          title: utils.string.t('client.accountsKey'),
          items: mapKey,
          onToggle: mapKeyFilter,
          onToggleAll: mapKeyFilterAll,
          colorMode: 'dark',
          nestedClasses: { root: classes.mapKeyRoot },
          allowCollapse: true,
        }}
        instanceObject={{
          transformRequest: (url, resourceType) => {
            if (resourceType === 'Source' && url.includes('api/locations')) {
              return {
                url: url,
                headers: { Authorization: 'Bearer ' + token },
              };
            }
          },
        }}
      />
      <div className={classes.bottomPanel}>
        <div className={classes.toggleButtonContainer}>
          <Button
            nestedClasses={{ btn: classes.toggleButton, icon: classes.toggleIcon }}
            icon={DoubleArrowOutlinedIcon}
            onClick={handleToggleTable}
            text={utils.string.t(showTable ? 'portfolioMap.hideTable' : 'portfolioMap.viewTable')}
            variant="text"
            light
            size="small"
          />
        </div>
        <Collapse in={showTable}>
          <div className={classes.tableContainer}>
            <Translate variant="h4" label={utils.string.t('portfolioMap.dataLabel', { level: levelOverride || level })} />
            <PortfolioData handleUpdateCenter={handleUpdateCenter} locations={locations.sort((a, b) => b.tivTotal - a.tivTotal)} />
          </div>
        </Collapse>
      </div>
    </>
  );
}
