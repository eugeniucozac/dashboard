import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';

// app
import { hideModal, hideNotification } from 'stores';

export default function ResetUi(props) {
  const location = useLocation();
  const dispatch = useDispatch();
  const uiModal = useSelector((state) => state.ui.modal || []);
  const uiNotification = useSelector((state) => state.ui.notification.queue || []);

  useEffect(
    () => {
      const hasVisibleModal = uiModal.some((modal) => modal.visible);
      const hasVisibleNotification = uiNotification.length > 0;

      if (hasVisibleModal) {
        dispatch(hideModal());
      }

      if (hasVisibleNotification) {
        uiNotification.forEach((notification) => {
          if (!notification.keepAfterUrlChange) {
            dispatch(hideNotification(notification.key));
          }
        });
      }
    },
    [location.pathname] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return React.cloneElement(props.children, props);
}
