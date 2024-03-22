import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import debounce from 'lodash/debounce';
import get from 'lodash/get';
// app
import { HeaderNavView } from './HeaderNav.view';

import { expandNav, collapseNav, showModal, getSearchResults, resetSearch } from 'stores';

import config from 'config';
import * as utils from 'utils';
import { AuthContext } from 'components';

HeaderNav.propTypes = {
  showFloatingButton: PropTypes.bool,
  showMagnifierButton: PropTypes.bool,
};

HeaderNav.defaultProps = {
  showFloatingButton: true,
  showMagnifierButton: true,
};

export default function HeaderNav({ showFloatingButton, showMagnifierButton }) {
  const dispatch = useDispatch();
  const location = useLocation();

  const uiNavExpanded = useSelector((state) => get(state, 'ui.nav.expanded'));
  const uiSidebarExpanded = useSelector((state) => get(state, 'ui.sidebar.expanded'));
  const configVars = useSelector((state) => get(state, 'config.vars'));
  const context = useContext(AuthContext);
  const { pathname } = location;

  const isDev = utils.app.isDevelopment(configVars);
  const [searchResultsVisible, setSearchResultsVisible] = useState(false);
  const [searchMobileVisible, setSearchMobileVisible] = useState(false);
  const [resetKey, setResetKey] = useState(new Date().getTime());
  const [displayUserMenu, setDisplayUserMenu] = useState(null);

  const toggleNav = () => {
    if (uiNavExpanded) {
      dispatch(collapseNav());
    } else {
      dispatch(expandNav());
    }
  };

  const clickNewEnquiry = (event) => {
    dispatch(
      showModal({
        component: 'NEW_ENQUIRY',
        props: {
          title: 'submission.createNew',
          fullWidth: true,
          maxWidth: 'sm',
          disableAutoFocus: true,
        },
      })
    );
  };

  const searchMobileToggle = () => {
    setSearchResultsVisible(false);
    setSearchMobileVisible(!searchMobileVisible);
  };

  const searchSubmit = debounce((query) => {
    if (query.length >= 2) {
      dispatch(getSearchResults(query));
      setSearchResultsVisible(true);
    } else setSearchResultsVisible(false);
  }, config.ui.autocomplete.delay);

  const searchReset = () => {
    setSearchResultsVisible(false);
    setResetKey(new Date().getTime());
    dispatch(resetSearch());
  };

  const handleClickUserMenu = (event) => {
    setDisplayUserMenu(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setDisplayUserMenu(null);
  };

  return (
    <HeaderNavView
      resetKey={resetKey}
      context={context}
      isDev={isDev}
      isSidebarExpanded={uiSidebarExpanded}
      isFabVisible={showFloatingButton}
      isMagnifierVisible={showMagnifierButton}
      isSearchMobileVisible={searchMobileVisible}
      isSearchResultsVisible={searchResultsVisible}
      displayUserMenu={displayUserMenu}
      pathname={pathname}
      handlers={{
        searchMobileToggle,
        searchSubmit,
        searchReset,
        toggleNav,
        clickNewEnquiry,
        handleClickUserMenu,
        handleCloseUserMenu,
      }}
    />
  );
}
