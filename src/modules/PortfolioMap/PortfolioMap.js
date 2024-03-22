import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import get from 'lodash/get';
import uniq from 'lodash/uniq';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';

// app
import * as portfolioMapUtils from './PortfolioMap.utils';
import {
  getLocationSummary,
  updatePortfolioMapLevel,
  resetPortfolioMapLocations,
  updatePortfolioMapLevelOverride,
  resetPortfolioMapLevelOverride,
} from 'stores';
import { PortfolioMapView } from './PortfolioMap.view';
import * as utils from 'utils';

PortfolioMap.propTypes = {
  parent: PropTypes.object.isRequired,
};

export function PortfolioMap({ parent }) {
  const allAccountsRef = useRef([]);

  const dispatch = useDispatch();
  const userAccessToken = useSelector((state) => get(state, 'user.auth.accessToken'));
  const departments = useSelector((state) => get(state, 'referenceData.departments'));
  const { loading, level, levels, placementIds, levelOverride, filteredDepartments } = useSelector((state) => state.portfolioMap.tiv);

  const [filteredLocations, setFilteredLocations] = useState([]);
  const [center, setCenter] = useState();
  const [mapKey, setMapKey] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [showTable, setShowTable] = useState(false);

  /*
    Retrieve placement location data by level (default level = 'state')
  */
  useEffect(
    () => {
      // filter out placements that are not phyical loss and with current date between inception and expiration
      const placements = portfolioMapUtils.getFilteredPlacements(parent.placements);

      setPlacements(placements);
      allAccountsRef.current = portfolioMapUtils.groupAccounts(placements, departments);

      // fetch location data for ALL placements
      dispatch(getLocationSummary({ placementIds: placements.map((placement) => placement.id) }));
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(
    () => {
      if (!utils.generic.isValidArray(filteredDepartments)) return;

      setFilteredLocations(portfolioMapUtils.addMapData(levels[levelOverride || level], mapKey, getFilteredDeps(filteredDepartments)));
    },
    [filteredDepartments] // eslint-disable-line react-hooks/exhaustive-deps
  );

  /*
    Update mapKey and locations when a level has been changed
  */
  useEffect(
    () => {
      if (!levels[levelOverride || level]) return;

      // Get all locations from state by the requested level, and return their placementIds
      const populatedPlacementIds = uniq(
        levels[levelOverride || level].map((location) => location.placements.map((placement) => placement.placementId)).flat()
      );

      // Retains checked/unchecked map key after appyling new placementIds
      const updatedMapKey = portfolioMapUtils.filterAccounts(populatedPlacementIds, allAccountsRef.current, mapKey);

      // Set the data required for the map key
      setMapKey(updatedMapKey);

      // Hydrate new placements with mapKey data (ie, color)
      setFilteredLocations(
        portfolioMapUtils.addMapData(levels[levelOverride || level], updatedMapKey, getFilteredDeps(filteredDepartments)) || []
      );
    },
    [levels[levelOverride || level]] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const mapKeyFilter = (id, checked) => {
    const updatedMapKey = mapKey.map((item) => ({
      ...item,
      checked: id === item.id ? checked : item.checked,
    }));
    setMapKey(updatedMapKey);
    setFilteredLocations(portfolioMapUtils.addMapData(levels[levelOverride || level], updatedMapKey, getFilteredDeps(filteredDepartments)));
  };

  const mapKeyFilterAll = (checked) => {
    const updatedMapKey = mapKey.map((item) => ({ ...item, checked }));
    setMapKey(updatedMapKey);
    setFilteredLocations(portfolioMapUtils.addMapData(levels[levelOverride || level], updatedMapKey, getFilteredDeps(filteredDepartments)));
  };

  const getFilteredDeps = () => {
    return filteredDepartments.filter((dep) => dep.active).map((dep) => dep.rawId);
  };

  const getLocations = (props) => {
    if (props.resetLevelOverride) {
      dispatch(resetPortfolioMapLevelOverride());
    }

    const newLevel = props.levelOverride || props.level;
    const filteredPlacementIds = placements.map((placement) => placement.id);

    if (!filteredPlacementIds.length) {
      dispatch(resetPortfolioMapLocations());
      if (props.level) dispatch(updatePortfolioMapLevel({ level: props.level }));
      if (props.levelOverride) dispatch(updatePortfolioMapLevelOverride({ levelOverride: props.levelOverride }));
      return;
    }

    const dataAlreadyFetched = isEqual(filteredPlacementIds, placementIds) && utils.generic.isValidArray(levels[newLevel], true);

    if (dataAlreadyFetched || (levelOverride && props.level)) {
      if (props.level) dispatch(updatePortfolioMapLevel({ level: props.level }));
      if (props.levelOverride) dispatch(updatePortfolioMapLevelOverride({ levelOverride: props.levelOverride }));
    } else {
      dispatch(
        getLocationSummary({
          placementIds: filteredPlacementIds,
          ...(props.level && { level: props.level }),
          ...(props.levelOverride && { levelOverride: props.levelOverride }),
        })
      );
    }
  };

  const handleUpdateCenter = (coords) => {
    setCenter(coords);
  };

  const handleToggleTable = () => {
    setShowTable(!showTable);
  };

  return (
    <PortfolioMapView
      center={center}
      handleUpdateCenter={handleUpdateCenter}
      mapKeyFilter={mapKeyFilter}
      mapKeyFilterAll={mapKeyFilterAll}
      mapKey={mapKey}
      isLoading={loading}
      getLocations={getLocations}
      token={userAccessToken}
      locations={filteredLocations}
      level={level}
      levelOverride={levelOverride}
      handleToggleTable={handleToggleTable}
      showTable={showTable}
    />
  );
}

export default PortfolioMap;
