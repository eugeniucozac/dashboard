import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import minimatch from 'minimatch';

// app
import * as utils from 'utils';
import { showModal } from 'stores';
import { PreventNavigationView } from './PreventNavigation.view';

PreventNavigation.propTypes = {
  dirty: PropTypes.bool,
  allowedUrls: PropTypes.array,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  cancelLabel: PropTypes.string,
  confirmLabel: PropTypes.string,
  hint: PropTypes.string,
  maxWidth: PropTypes.string,
  onCancelCallBack: PropTypes.func,
  onSubmitCallBack: PropTypes.func,
};
// default props for making the comp to run independantly and for dropting  new display messages
PreventNavigation.defaultProps = {
  title: 'navigation.page.title',
  subtitle: 'navigation.page.subtitle',
  cancelLabel: 'navigation.page.cancel',
  confirmLabel: 'navigation.page.confirm',
  hint: '',
  maxWidth: 'sm',
  onCancelCallBack: () => {},
  onSubmitCallBack: () => {},
};
export function PreventNavigation({
  dirty,
  allowedUrls = [],
  title,
  subtitle,
  cancelLabel,
  maxWidth,
  confirmLabel,
  hint,
  onCancelCallBack,
  onSubmitCallBack,
}) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [location, setLocation] = useState();
  const [allowNavigation, setAllowNavigation] = useState(false);

  const allowNavigationToUrlException = (pathname) => {
    // if there's no pathname, allow navigation
    if (!pathname) return true;

    // if there's no allowed urls array, prevent navigation
    if (!utils.generic.isValidArray(allowedUrls, true)) return false;

    // allow navigation if pathname matches any of the allowed urls
    return allowedUrls.some((url) => {
      return minimatch(pathname, url);
    });
  };

  useEffect(
    () => {
      if (location && (allowNavigation || allowNavigationToUrlException(location))) {
        history.push(location);
      }
    },
    [location, allowNavigation] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const launchConfirmModal = () => {
    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          title: title,
          subtitle: subtitle,
          hint: hint,
          fullWidth: true,
          maxWidth: maxWidth,
          componentProps: {
            cancelLabel: utils.string.t(cancelLabel),
            confirmLabel: utils.string.t(confirmLabel),
            cancelHandler: () => {
              onCancelCallBack();
            },
            submitHandler: () => {
              setAllowNavigation(true);
              onSubmitCallBack();
            },
          },
        },
      })
    );
  };

  const handleInternalNavigation = (location) => {
    if (!allowNavigation && !allowNavigationToUrlException(location.pathname)) {
      setLocation(location.pathname);
      launchConfirmModal();
      return false;
    }

    return true;
  };

  return <PreventNavigationView dirty={dirty} handleInternalNavigation={handleInternalNavigation} />;
}

export default PreventNavigation;
