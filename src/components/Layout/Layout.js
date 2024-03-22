import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import get from 'lodash/get';

// app
import { LayoutView } from './Layout.view';
import { expandSidebar, collapseSidebar } from 'stores';
import { useMedia } from 'hooks';
import * as constants from 'consts';

// context
export const LayoutContext = React.createContext({});

Layout.propTypes = {
  main: PropTypes.bool,
  sidebar: PropTypes.bool,
  isCentered: PropTypes.bool,
  showDesktopControls: PropTypes.bool,
  disableDesktopControls: PropTypes.bool,
  extensiveScreen: PropTypes.bool,
  testid: PropTypes.string,
  hideScrollBar: PropTypes.bool,
};

Layout.defaultProps = {
  extensiveScreen: false,
};

export default function Layout({
  main,
  sidebar,
  isCentered,
  showDesktopControls,
  disableDesktopControls,
  extensiveScreen,
  testid,
  children,
  hideScrollBar,
}) {
  const dispatch = useDispatch();
  const media = useMedia();
  const refMain = useRef(null);
  const refSidebar = useRef(null);
  const uiSidebarExpanded = useSelector((state) => get(state, 'ui.sidebar.expanded'));
  const uiModalVisible = useSelector((state) => get(state, 'ui.modal.visible'));
  const uiModalType = useSelector((state) => get(state, 'ui.modal.type'));
  const hasMobileControls = Boolean(media.mobile || media.tablet);
  const hasDesktopControls = Boolean(media.desktopUp && showDesktopControls);

  useEffect(
    () => {
      document.addEventListener('keydown', handleEscape);

      // cleanup
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    },
    [uiSidebarExpanded] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleSidebarClick = (forcedStatus) => (event) => {
    const shouldCollapse = forcedStatus === 'collapsed' ? true : uiSidebarExpanded;

    if (hasMobileControls || (hasDesktopControls && !disableDesktopControls)) {
      if (shouldCollapse) {
        dispatch(collapseSidebar());
      } else {
        dispatch(expandSidebar());
      }
    }
  };

  const handleEscape = (event) => {
    if (!hasDesktopControls && hasMobileControls && uiSidebarExpanded && event.keyCode === constants.KEYCODE.Escape) {
      event.preventDefault();
      dispatch(collapseSidebar());
    }
  };

  // abort
  if (main || sidebar) return children;

  const childrenArray = children ? (Array.isArray(children) ? children : [children]) : [];
  const childrenMain = childrenArray.filter((c) => c.props && c.props.main);
  const childrenSidebar = childrenArray.filter((c) => c.props && c.props.sidebar);

  return (
    <LayoutContext.Provider
      value={{
        refMain: refMain,
        refSidebar: refSidebar,
      }}
    >
      <LayoutView
        main={main}
        sidebar={sidebar}
        isCentered={isCentered}
        extensiveScreen={extensiveScreen}
        mobile={media.mobile}
        tablet={media.tablet}
        desktop={media.desktopUp}
        showDesktopControls={showDesktopControls}
        disableDesktopControls={showDesktopControls && disableDesktopControls}
        collapsed={!uiSidebarExpanded}
        hasSidebar={childrenSidebar && childrenSidebar.length > 0}
        hasModal={Boolean(uiModalVisible && uiModalType)}
        childrenMain={childrenMain}
        childrenSidebar={childrenSidebar}
        testid={testid}
        handleSidebarClick={handleSidebarClick}
        hideScrollBar={hideScrollBar}
      />
    </LayoutContext.Provider>
  );
}
