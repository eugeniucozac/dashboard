import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import get from 'lodash/get';

// app
import { LoaderView } from './Loader.view';

Loader.propTypes = {
  visible: PropTypes.bool.isRequired,
  absolute: PropTypes.bool,
  panel: PropTypes.bool,
  label: PropTypes.string,
};

Loader.defaultProps = {
  visible: true,
};

export default function Loader({ visible, absolute, panel, label, inline }) {
  const uiLoaderQueue = useSelector((state) => get(state, 'ui.loader.queue', []));
  const uiNavExpanded = useSelector((state) => get(state, 'ui.nav.expanded'));
  const uiSidebarExpanded = useSelector((state) => get(state, 'ui.sidebar.expanded'));

  const message = uiLoaderQueue.length > 0 ? uiLoaderQueue[0].message : label;

  return (
    <LoaderView
      message={message}
      visible={visible}
      absolute={absolute}
      panel={absolute ? false : panel} // making sure we don't have multiple props set to true
      navExpanded={uiNavExpanded}
      sidebarExpanded={uiSidebarExpanded}
      inline={inline}
    />
  );
}
