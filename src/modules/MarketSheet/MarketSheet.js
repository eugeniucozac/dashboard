import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash/debounce';
import groupBy from 'lodash/groupBy';
import toNumber from 'lodash/toNumber';
import get from 'lodash/get';
// app
import { MarketSheetView } from './MarketSheet.view';
import {
  selectRefDataDepartmentById,
  selectRefDataStatusIdByCode,
  selectRefDataCapacityTypes,
  filterReferenceDataBusinessTypes,
  editPlacementConfig,
  resetMarket,
  showModal,
} from 'stores';
import { MarketSheetPDF } from 'modules';
import { KEYCODE, STATUS_MARKET_QUOTED, STATUS_POLICY_NTU } from 'consts';
import * as utils from 'utils';

export default function MarketSheet() {
  const dispatch = useDispatch();
  const placement = useSelector((state) => get(state, 'placement'));
  const policies = useSelector((state) => get(state, 'placement.selected.policies', []));
  const department = useSelector(selectRefDataDepartmentById(get(placement, 'selected.departmentId')));
  const statusMarketQuoted = useSelector(selectRefDataStatusIdByCode('market', STATUS_MARKET_QUOTED));
  const statusPolicyNtu = useSelector(selectRefDataStatusIdByCode('policy', STATUS_POLICY_NTU));
  const refDataCapacityTypes = useSelector(selectRefDataCapacityTypes);
  const configVars = useSelector((state) => get(state, 'config.vars'));

  const placementConfig = get(placement, 'selected.config') || {};

  const isFullscreen = useRef(false);
  const [tab, setTab] = useState();
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });
  const [capacity, setCapacity] = useState({});
  const [capacityTypes, setCapacityTypes] = useState(placementConfig.capacity || refDataCapacityTypes);
  const [years] = useState([
    {
      id: 2019,
      label: '2019',
      selected: true,
      options: [{ id: 'all', label: utils.string.t('app.all'), selected: true }],
    },
  ]);

  // TODO added on 17/06/2020: try to get currency from policies
  const [mudmap, setMudmap] = useState({
    // currency: '$',
    fullscreen: false,
    policies: [],
    visible: Boolean(JSON.parse(localStorage.getItem('edge-mudmap-expanded') || true)),
  });

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
      if (!placementConfig.capacity && utils.generic.isValidArray(refDataCapacityTypes, true)) {
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

  const getOptions = (year) => {
    return utils.generic.isValidArray(year && year.options, true) ? year.options : [];
  };

  const handleToggleMudmapVisible = (event) => {
    const isVisible = !mudmap.visible;
    localStorage.setItem('edge-mudmap-expanded', isVisible ? 'true' : 'false');

    setMudmap({
      ...mudmap,
      visible: isVisible,
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

    dispatch(
      editPlacementConfig({
        capacity: updatedTypes,
      })
    );
  };

  const handleToggleTab = (tabSelected) => {
    setTab(tabSelected);
  };

  const handleReorderMudmap = (policiesObj) => {
    const policies = Object.values(policiesObj);

    dispatch(
      editPlacementConfig({
        mudmap: {
          ...placementConfig.mudmap,
          [selectedTab]: policies.map((policy) => {
            return {
              id: policy.id,
              order: policy.order,
              capacityId: policy.capacityId,
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

  const handleAddLayerClick =
    (popoverData = {}) =>
    () => {
      dispatch(filterReferenceDataBusinessTypes());
      dispatch(
        showModal({
          component: 'ADD_LAYER',
          props: {
            title: 'placement.sheet.addLayer',
            subtitle: popoverData.title,
            fullWidth: true,
            maxWidth: 'sm',
            disableAutoFocus: true,
            componentProps: {
              businessTypeId: popoverData.id,
            },
          },
        })
      );
    };

  const handleBulkUpdateClick = (event) => {
    dispatch(
      showModal({
        component: 'BULK_UPDATE_POLICY',
        props: {
          title: 'placement.sheet.bulkEdit',
          fullWidth: true,
          maxWidth: 'xs',
        },
      })
    );
  };

  // abort
  if (!placement.selected || !department || utils.generic.isInvalidOrEmptyArray(refDataCapacityTypes)) return null;

  const year = years ? years.find((y) => y.selected) || years[0] : {};
  const policiesFiltered = policies.filter((policy) => utils.policy.isOriginEdge(policy));
  const groups = groupBy(policiesFiltered, (policy) => policy.businessTypeId);

  const tabs = Object.keys(groups).map((group) => {
    const businessTypeId = toNumber(group);
    const businessTypeName = utils.referenceData.businessTypes.getNameById(department.businessTypes, businessTypeId);
    return { value: businessTypeId, label: businessTypeName };
  });

  const selectedTab = tab && tabs.map((tab) => tab.value).includes(tab) ? tab : tabs && tabs.length && get(tabs, '[0].value');
  const groupPolicies = groups[selectedTab] || [];
  const mudmapConfig = get(placementConfig, `mudmap[${selectedTab}]`, []);

  const policiesMudmap = utils.policies.getMudmap(
    policiesFiltered.filter((policy) => {
      const isValidStatus = policy.statusId !== statusPolicyNtu;
      const isSelectedGroup = policy.businessTypeId === selectedTab;
      return isValidStatus && isSelectedGroup;
    }),
    mudmapConfig,
    statusMarketQuoted,
    'written'
  );

  const handleLaunchPDFModal = () => {
    dispatch(
      showModal({
        component: 'PLACEMENT_PDF',
        props: {
          title: 'placement.sheet.downloadMarketSheet',
          fullWidth: true,
          maxWidth: 'md',
          componentProps: {
            component: MarketSheetPDF,
            placement: placement.selected,
            policiesFiltered,
            layers: groups,
            mudmaps: placementConfig.mudmap,
            year,
            capacity,
            mudmapConfig: {
              ...mudmap,
              capacities: capacityTypes,
            },
          },
        },
      })
    );
  };

  return (
    <MarketSheetView
      placement={placement}
      policies={groupPolicies}
      tabs={tabs}
      selectedTab={selectedTab}
      year={year}
      capacity={capacity}
      options={getOptions(year)}
      mudmap={{
        ...mudmap,
        capacities: capacityTypes,
        dimensions,
        policies: policiesMudmap,
        visibleToCobrokers: placementConfig.visibleToCobrokers || false,
      }}
      handlers={{
        openColorPicker: handleOpenColorPicker,
        changeColorPicker: handleChangeColorPicker,
        reorderMudmap: handleReorderMudmap,
        toggleMudmapVisible: handleToggleMudmapVisible,
        toggleMudmapFullscreen: handleToggleMudmapFullscreen,
        toggleMudmapForCobrokers: handleToggleMudmapForCobrokers,
        toggleTab: handleToggleTab,
        addLayerClick: handleAddLayerClick,
        bulkUpdateClick: handleBulkUpdateClick,
        launchPDFModal: handleLaunchPDFModal,
      }}
      isDev={utils.app.isDevelopment(configVars)}
    />
  );
}
