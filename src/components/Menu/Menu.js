import React, { useEffect, useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import get from 'lodash/get';
import kebabCase from 'lodash/kebabCase';

// app
import MenuView from './Menu.view';
import { AuthContext } from 'components';
import {
  showModal,
  collapseNav,
  expandNav,
  getParentList,
  setDepartmentSelected,
  selectUserDepartment,
  selectUserDepartmentId,
  selectIsAdmin,
  selectIsBroker,
  selectIsCobroker,
  selectIsUnderwriter,
  selectUserDepartments,
  selectUserIsExtended,
  selectUserIsCurrent,
} from 'stores';
import { useMedia } from 'hooks';
import * as utils from 'utils';
import config from 'config';

// mui
import ListAltIcon from '@material-ui/icons/ListAlt';
import ApartmentIcon from '@material-ui/icons/Apartment';
import AssessmentIcon from '@material-ui/icons/Assessment';
import AssignmentIcon from '@material-ui/icons/Assignment';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import BallotIcon from '@material-ui/icons/Ballot';
import DescriptionIcon from '@material-ui/icons/Description';
import FlightTakeoffIcon from '@material-ui/icons/FlightTakeoff';
import HomeIcon from '@material-ui/icons/Home';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import PublicIcon from '@material-ui/icons/Public';
import SettingsIcon from '@material-ui/icons/Settings';
import TimelineIcon from '@material-ui/icons/Timeline';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import StarIcon from '@material-ui/icons/Star';

export default function Menu() {
  const dispatch = useDispatch();
  const history = useHistory();
  const media = useMedia();
  const context = useContext(AuthContext);

  const configVars = useSelector((state) => get(state, 'config.vars'));
  const uiNavExpanded = useSelector((state) => get(state, 'ui.nav.expanded'));
  const user = useSelector((state) => state.user);
  const userIsAdmin = useSelector(selectIsAdmin);
  const userIsBroker = useSelector(selectIsBroker);
  const userIsCoBroker = useSelector(selectIsCobroker);
  const userIsUnderwriter = useSelector(selectIsUnderwriter);
  const userIsExtended = useSelector(selectUserIsExtended);
  const userIsCurrentEdge = useSelector(selectUserIsCurrent);
  const userIsLoaded = utils.user.isLoaded(user);
  const parentList = useSelector((state) => get(state, 'parent.list'));
  const parentListFetched = useSelector((state) => get(state, 'parent.listFetched'));
  const referenceDataDepartments = useSelector((state) => get(state, 'referenceData.departments'));
  const userDepartment = useSelector(selectUserDepartment) || {};
  const userDepartmentId = useSelector(selectUserDepartmentId);
  const userDepartments = useSelector(selectUserDepartments);
  const userDepartmentSlug = userDepartment && kebabCase(get(userDepartment, 'name', ''));

  const locationParams = history.location.pathname.split('/');
  const locationFirstParam = locationParams.length > 0 && locationParams[1] ? locationParams[1] : null;
  const [firstLevel, setFirstLevel] = useState(locationFirstParam);

  useEffect(() => {
    if (userIsLoaded && !userIsExtended && !parentListFetched) {
      dispatch(getParentList());
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return history.listen((location) => {
      const paramArr = location.pathname.split('/');
      const firstParam = paramArr.length > 0 && paramArr[1] ? paramArr[1] : null;

      setFirstLevel(firstParam);
    });
  }, [history]);

  const handleClick = (event) => {
    if (media.mobile) {
      dispatch(collapseNav());
    }
  };
  const toggleNav = () => {
    if (uiNavExpanded) {
      dispatch(collapseNav());
    } else {
      dispatch(expandNav());
    }
  };

  const handleFileUpload = (files, rejectedFiles) => {
    dispatch(
      showModal({
        component: 'POLICY_DOCUMENTS',
        props: {
          title: utils.string.t('app.fileUpload'),
          fullWidth: true,
          maxWidth: 'xl',
          componentProps: {
            files: utils.generic.isValidArray(files) ? files.map((f) => ({ file: f, name: f.name, type: null })) : [],
            rejectedFiles,
          },
        },
      })
    );
  };

  const getDepartmentName = (dept) => {
    if (!dept || !dept.name) return '';

    return dept.name.indexOf('-XB_') >= 0 ? `${dept.name.split('-XB_').join(' (')})` : dept.name;
  };

  // abort
  if (!user || !user.id) return null;

  const departmentList = utils.user.department.getAll(user) || [];

  const addMenuItems = (condition, items) => {
    return condition ? [...items] : [];
  };

  const menuItems = [
    ...addMenuItems(userIsCurrentEdge || (userIsExtended && utils.app.access.route('home', user)), [
      {
        name: 'home',
        text: utils.string.t('app.home'),
        icon: HomeIcon,
        link: config.routes.home.root,
      },
    ]),
    ...addMenuItems(userIsExtended && utils.app.access.route('reporting', user), [
      {
        name: 'reportingExtended',
        text: utils.string.t('reportingExtended.menuItem.title'),
        icon: DonutLargeIcon,
        link: config.routes.reportingExtended.root,
      },
    ]),
    ...addMenuItems(userIsExtended && utils.app.access.route('processingInstructions', user), [
      {
        name: 'processing-instructions',
        text: utils.string.t('processingInstructions.title'),
        icon: PlaylistAddCheckIcon,
        link: config.routes.processingInstructions.root,
      },
    ]),
    ...addMenuItems(userIsExtended && utils.app.access.route('premiumProcessing', user), [
      {
        name: 'premium-processing',
        text: utils.string.t('premiumProcessing.title'),
        icon: StarIcon,
        link: config.routes.premiumProcessing.root,
      },
    ]),
    ...addMenuItems(userIsExtended && utils.app.access.route('claimsFNOL', user), [
      {
        name: 'claims-fnol',
        text: utils.string.t('claims.title'),
        icon: DescriptionIcon,
        link: config.routes.claimsFNOL.root,
      },
    ]),
    ...addMenuItems(userIsExtended && utils.app.access.route('claimsProcessing', user), [
      {
        name: 'claims-processing',
        text: utils.string.t('claims.processing.title'),
        icon: AssignmentTurnedInIcon,
        link: config.routes.claimsProcessing.root,
      },
    ]),
    ...addMenuItems(userIsCurrentEdge, [
      {
        name: 'department',
        text:
          (userIsBroker && utils.string.t('department.titlePlacements')) || (userIsCoBroker && utils.string.t('department.titleAccounts')),
        icon: ListAltIcon,
        link: `${config.routes.department.root}/${userDepartmentId}${userDepartmentSlug ? `/${userDepartmentSlug}` : ''}`,
        disabled: userIsUnderwriter,
      },
      {
        name: 'client',
        text: utils.string.t('client.title'),
        icon: ApartmentIcon,
        link: config.routes.client.root,
        disabled: parentList.length <= 0 || userIsUnderwriter,
      },
      {
        name: 'market',
        text: utils.string.t('market.title'),
        icon: TimelineIcon,
        link: config.routes.market.root,
        isDev: true,
        disabled: userIsUnderwriter,
      },
      {
        name: 'products',
        text: utils.string.t('products.title'),
        icon: BallotIcon,
        link: config.routes.quoteBind.root,
        disabled: !(userIsBroker || userIsUnderwriter),
      },
      {
        name: 'trips',
        text: utils.string.t('trips.title'),
        icon: FlightTakeoffIcon,
        link: config.routes.trip.root,
        disabled: !userIsBroker,
        isDev: true,
      },
      {
        name: 'opportunity',
        text: utils.string.t('opportunity.title'),
        icon: PublicIcon,
        link: config.routes.opportunity.root,
        disabled: !userIsBroker,
        isDev: true,
      },
      {
        name: 'modelling',
        text: utils.string.t('modelling.title'),
        icon: AssessmentIcon,
        link: config.routes.modelling.root,
        disabled: !userIsBroker,
      },
      {
        name: 'reportings',
        text: utils.string.t('reporting.title'),
        icon: DonutLargeIcon,
        link: config.routes.reporting.root,
        disabled: userIsUnderwriter,
      },
      {
        name: 'checklist',
        text: utils.string.t('openingMemo.title'),
        icon: PlaylistAddCheckIcon,
        link: config.routes.checklist.root,
        disabled: !userIsBroker,
      },
      {
        name: 'industryNews',
        text: utils.string.t('industryNews.title'),
        icon: AssignmentIcon,
        link: config.routes.industryNews.root,
        disabled: userIsUnderwriter,
        isDev: true,
      },
    ]),
    ...addMenuItems(userIsCurrentEdge, [
      {
        name: 'admin',
        text: utils.string.t('admin.currentEdgeTitle'),
        icon: SettingsIcon,
        link: config.routes.admin.currentAdmin, // Core EDGE Admin
        adminOnly: true,
      },
    ]),
    ...addMenuItems(userIsExtended && utils.app.access.route('admin', user), [
      {
        name: 'administration',
        text: utils.string.t('administration.extendedAdminTitle'), // Extended Admin
        icon: PeopleAltIcon,
        link: config.routes.admin.edgeAdmin,
      },
    ]),
  ];

  const menuItemsFiltered = menuItems
    .filter((item) => {
      const isActive = !item.disabled;
      const adminOnly = !item.adminOnly || userIsAdmin;
      const isDev = !item.isDev || utils.app.isDevelopment(configVars);
      const isValid = item.link || item.divider || item.title;

      return isActive && adminOnly && isDev && isValid;
    })
    .map((item) => {
      const isHome = item.name === 'home';
      item.selected = isHome ? firstLevel === null : item.link && item.link.includes(firstLevel);
      return item;
    });
  const deptItemsFiltered = departmentList
    .map((deptId) => {
      const department = utils.referenceData.departments.getById(referenceDataDepartments, deptId) || {};
      if (!deptId || !department.name) return null;

      return {
        id: deptId,
        label: department.name,
        callback: () => {
          dispatch(setDepartmentSelected(deptId));
          menuItemsFiltered
            .filter((menu) => menu.selected)
            .map((item) => item.name)
            .toString() === 'department' && history.push(`${config.routes.department.root}/${deptId}/${kebabCase(department.name)}`);
        },
      };
    })
    .filter((dept) => dept);

  return (
    <MenuView
      items={menuItemsFiltered}
      deptSelected={getDepartmentName(userDepartment)}
      user={user}
      context={context}
      deptList={deptItemsFiltered}
      isExpanded={uiNavExpanded}
      isMobile={media.mobile}
      toggleNav={toggleNav}
      isFileUploadVisible={false} // if file upload is not required we can delete the code in menu.view.js
      hasMultipleDept={userDepartments.length > 1 && referenceDataDepartments.length > 0}
      userIsExtended={userIsExtended}
      userIsCurrentEdge={userIsCurrentEdge}
      handlers={{
        click: handleClick,
        fileUpload: handleFileUpload,
      }}
    />
  );
}
