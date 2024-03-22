import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import debounce from 'lodash/debounce';
import get from 'lodash/get';

// app
import { MarketingMudmapView } from './MarketingMudmap.view';
import {
  editPlacementConfig,
  selectPlacementLayers,
  selectPlacementDepartmentId,
  selectPlacementConfig,
  selectRefDataDepartmentById,
  selectRefDataStatusIdByCode,
  selectRefDataCapacityTypes,
  resetMarket,
} from 'stores';
import * as utils from 'utils';
import { KEYCODE, STATUS_MARKET_QUOTED, STATUS_POLICY_NTU } from 'consts';

MarketingMudmap.propTypes = {
  placementId: PropTypes.string.isRequired,
};

export default function MarketingMudmap({ placementId }) {
  const dispatch = useDispatch();

  const placementLayers = useSelector(selectPlacementLayers);
  const placementDepartmentId = useSelector(selectPlacementDepartmentId);
  const placementConfig = useSelector(selectPlacementConfig);
  const department = useSelector(selectRefDataDepartmentById(placementDepartmentId));
  const refDataCapacityTypes = useSelector(selectRefDataCapacityTypes);
  const statusMarketQuoted = useSelector(selectRefDataStatusIdByCode('market', STATUS_MARKET_QUOTED));
  const statusPolicyNtu = useSelector(selectRefDataStatusIdByCode('policy', STATUS_POLICY_NTU));

  const isFullscreen = useRef(false);
  const [tab, setTab] = useState();
  const [capacity, setCapacity] = useState({});
  const [capacityTypes, setCapacityTypes] = useState(placementConfig?.capacity || refDataCapacityTypes);
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });

  // TODO added on 17/06/2020: try to get currency from layers
  const [mudmap, setMudmap] = useState({
    // currency: '$',
    fullscreen: false,
    layers: [],
  });

  const tabs = utils.placement.getTabsByBusinessTypeId(placementLayers, department);

  const selectedTab = tab && tabs.map((tab) => tab.value).includes(tab) ? tab : tabs && tabs.length && get(tabs, '[0].value');

  // first render
  useEffect(() => {
    dispatch(resetMarket());
    windowResize();
    window.addEventListener('resize', windowResize);
    document.addEventListener('keydown', keyDownEscape);

    // cleanup
    return () => {
      dispatch(resetMarket());
      window.removeEventListener('resize', windowResize);
      document.removeEventListener('keydown', keyDownEscape);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(
    () => {
      if (!placementConfig?.capacity && utils.generic.isValidArray(refDataCapacityTypes, true)) {
        setCapacityTypes(refDataCapacityTypes);
      }
    },
    [refDataCapacityTypes] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const windowResize = debounce(() => {
    setDimensions({ w: window.innerWidth, h: window.innerHeight });
  }, 200);

  const keyDownEscape = (event) => {
    if (isFullscreen.current && event.keyCode === KEYCODE.Escape) {
      event.preventDefault();
      setFullscreen(false);
    }
  };

  const setFullscreen = (bool) => {
    isFullscreen.current = bool;
    setMudmap({
      ...mudmap,
      fullscreen: bool,
    });
  };

  const handleToggleMudmapFullscreen = (event) => {
    setFullscreen(!isFullscreen.current);
  };

  const handleOpenColorPicker = (e, item) => {
    setCapacity({ target: e.target, item });
  };

  const handleChangeColorPicker = (styles) => {
    if (!styles) {
      setCapacity({});
      return;
    }

    const updatedTypes = capacityTypes.map((type) => {
      const isMatch = type.id === styles.id;
      const obj = isMatch ? styles : type;

      return {
        id: obj.id,
        color: obj.color,
        name: isMatch ? styles.label : obj.name,
      };
    });

    setCapacity({});
    setCapacityTypes(updatedTypes);

    dispatch(editPlacementConfig({ capacity: updatedTypes }));
  };

  const handleToggleTab = (tabSelected) => {
    setTab(tabSelected);
  };

  const handleReorderMudmap = (layersObj) => {
    const layers = Object.values(layersObj);

    dispatch(
      editPlacementConfig({
        mudmap: {
          ...placementConfig?.mudmap,
          [selectedTab]: layers.map((layer) => {
            return {
              id: layer.id,
              order: layer.order,
              capacityId: layer.capacityId,
            };
          }),
        },
      })
    );
  };

  const handleToggleMudmapForCobrokers = (value) => (event) => {
    dispatch(
      editPlacementConfig({
        visibleToCobrokers: value,
      })
    );
  };

  const getMudmapLayers = (layers) => {
    if (utils.generic.isInvalidOrEmptyArray(layers)) return [];

    return layers.filter((layer) => {
      const isValidStatus = layer.statusId !== statusPolicyNtu;
      const isSelectedGroup = layer.businessTypeId === selectedTab;
      return isValidStatus && isSelectedGroup;
    });
  };

  // abort
  if (!placementId) return null;

  const mudmapConfig = placementConfig?.mudmap?.[selectedTab] || [];
  const mudmapLayers = utils.layers.getMudmap(getMudmapLayers(placementLayers), mudmapConfig, statusMarketQuoted, 'written');

  return (
    <MarketingMudmapView
      mudmap={{
        ...mudmap,
        capacities: capacityTypes,
        dimensions,
        layers: mudmapLayers,
        visibleToCobrokers: placementConfig?.visibleToCobrokers || false,
      }}
      capacity={capacity}
      tabs={tabs}
      selectedTab={selectedTab}
      handlers={{
        toggleTab: handleToggleTab,
        toggleMudmapFullscreen: handleToggleMudmapFullscreen,
        toggleMudmapForCobrokers: handleToggleMudmapForCobrokers,
        reorderMudmap: handleReorderMudmap,
        openColorPicker: handleOpenColorPicker,
        changeColorPicker: handleChangeColorPicker,
      }}
    />
  );
}
