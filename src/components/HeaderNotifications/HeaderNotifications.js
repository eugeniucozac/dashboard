import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

// app
import HeaderNotificationsView from './HeaderNotifications.view';
import { updateNotifications, deleteSingleNotification, deleteAllNotifications, enqueueNotification } from 'stores';
import * as constants from 'consts';
import config from 'config';
import * as utils from 'utils';

HeaderNotifications.propTypes = {
  notifications: PropTypes.array.isRequired,
  notificationsError: PropTypes.string,
  userId: PropTypes.number.isRequired,
  handlers: PropTypes.shape({
    onSuccessfulNotificationReadOrDelete: PropTypes.func.isRequired,
    setOpenPopover: PropTypes.func.isRequired,
  }).isRequired,
};

export default function HeaderNotifications({ notifications, notificationsError, userId, handlers }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [notificationsList, setNotificationsList] = useState([]);

  useEffect(() => {
    setNotificationsList(notifications);
  }, [notifications]); // eslint-disable-line react-hooks/exhaustive-deps

  const notificationClick = (notificationObj = {}) => {
    const { allowedToNavigate, refId, refType, source, userNotificationId } = notificationObj;
    const isValidNotification = Boolean(utils.generic.isValidObject(notificationObj) && refType && source && refId);
    const isTaskPp = refType === constants.NOTIFICATIONS_REF_TYPE_TASK && source === constants.SOURCE_ID_PP;
    const isTaskClaims = refType === constants.NOTIFICATIONS_REF_TYPE_TASK && source === constants.SOURCE_ID_CLAIMS;
    const isRfiPp = refType === constants.NOTIFICATIONS_REF_TYPE_RFI && source === constants.SOURCE_ID_PP;
    const isClientTab = refType === constants.NOTIFICATION_REF_TYPE_CLIENT && source === constants.SOURCE_ID_PP;

    if (isValidNotification && allowedToNavigate) {
      if (isTaskPp) {
        history.push(`${config.routes.premiumProcessing.root}${refId ? `/${refId}` : ''}${refType ? `/${refType}` : ''}`);
      } else if (isTaskClaims) {
        history.push(`${config.routes.claimsProcessing.root}${refId ? `/${refId}` : ''}`);
      } else if (isRfiPp || isClientTab) {
        const taskId = refId.split('||')[0];
        const rfiId = refId.split('||')[1];
        if (taskId) {
          history.push(
            `${config.routes.premiumProcessing.case}/${taskId}/${
              rfiId
                ? `${constants.PREMIUM_PROCESSING_TAB_RFI}/${rfiId}`
                : `${constants.PREMIUM_PROCESSING_TAB_ISSUE_DOCUMENTS}/${constants.PREMIUM_PROCESSING_TAB_CLIENT}`
            }`
          );
        }
      }
      dispatch(updateNotifications(userNotificationId, userId)).then((response) => {
        if (response?.status === constants.API_RESPONSE_OK) {
          handlers.onSuccessfulNotificationReadOrDelete();
        }
      });
      handlers.setOpenPopover(false);
    }
  };

  const clearAllNotifications = () => {
    dispatch(deleteAllNotifications(userId)).then((response) => {
      if (response?.status === constants.API_RESPONSE_OK) {
        handlers.onSuccessfulNotificationReadOrDelete();
        dispatch(enqueueNotification('globalNotification.deleteAllSuccess', 'success'));
      }
    });
  };

  const clearNotification = (event, notificationObj) => {
    event.stopPropagation();
    const userNotificationId = notificationObj?.userNotificationId;
    dispatch(deleteSingleNotification(userNotificationId, userId)).then((response) => {
      if (response?.status === constants.API_RESPONSE_OK) {
        handlers.onSuccessfulNotificationReadOrDelete();
        dispatch(enqueueNotification('globalNotification.deleteSuccess', 'success'));
      }
    });
  };

  // abort
  if (!notifications) return null;

  return (
    <HeaderNotificationsView
      notifications={notificationsList}
      notificationsError={notificationsError}
      handlers={{
        notificationClick: notificationClick,
        clearNotification: clearNotification,
        clearAllNotifications: clearAllNotifications,
      }}
    />
  );
}
