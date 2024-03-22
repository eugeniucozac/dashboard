import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useSelector } from 'react-redux';
import get from 'lodash/get';

// app
import styles from './HeaderNotifications.styles';
import { Avatar, Link, Warning, Button, InfiniteScroll, Skeleton } from 'components';
import { useMedia } from 'hooks';
import * as utils from 'utils';

// mui
import { makeStyles, List, ListItem, Divider, ListItemText, ListItemAvatar, Typography, Box } from '@material-ui/core';
import SmsFailedIcon from '@material-ui/icons/SmsFailed';
import CancelIcon from '@material-ui/icons/Cancel';
import ScheduleIcon from '@material-ui/icons/Schedule';

HeaderNotificationsView.propTypes = {
  notifications: PropTypes.array.isRequired,
  notificationsError: PropTypes.string,
  handlers: PropTypes.shape({
    notificationClick: PropTypes.func.isRequired,
    clearAllNotifications: PropTypes.func.isRequired,
    clearNotification: PropTypes.func.isRequired,
  }),
};

export default function HeaderNotificationsView({ notifications, notificationsError, handlers }) {
  const media = useMedia();
  const classes = makeStyles(styles, { name: 'HeaderNotifications' })({ isMobile: media.mobile });

  const isNotificationsLoading = useSelector((state) => get(state, 'notifications.isNotificationsLoading'));
  const renderNotificationComponent = (index) => {
    const isToday = moment(notifications[index].createdDate).isSame(utils.date.today(), 'day');

    return (
      <List>
        <Box key={notifications[index].userNotificationId}>
          <ListItem alignItems="flex-start" onClick={() => handlers.notificationClick(notifications[index])}>
            <ListItemAvatar>
              <Avatar avatarClasses={classes.messageAvatar} size={60} border={false} variant={'circle'} icon={SmsFailedIcon} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <>
                  <Box display="flex" alignItems="center" className={classes.expiryDateContainer}>
                    <Box className={classes.notificationHeaderSmallLabel}>
                      <Typography variant="body2">
                        <ScheduleIcon className={classes.notificationDueDateIcon} />
                      </Typography>
                    </Box>
                    <Box className={classes.expiryDate}>
                      {utils.string.t('format.date', {
                        value: { date: notifications[index].expiryDate },
                      })}
                    </Box>
                    <Box className={classes.clearNotification}>
                      <Button
                        icon={CancelIcon}
                        variant="text"
                        size="xsmall"
                        onClick={(event) => handlers.clearNotification(event, notifications[index])}
                      />
                    </Box>
                  </Box>
                  <Box className={classes.description}>
                    <Typography variant="body2">{notifications[index].description.replace(/<\/?.+?>/gi, '')}</Typography>
                  </Box>
                </>
              }
              secondary={
                isToday
                  ? utils.string.t('time.today')
                  : utils.string.t('globalNotification.receivedDate', {
                      date: notifications[index].createdDate,
                    })
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </Box>
      </List>
    );
  };

  const renderContainerHeightBasedOnLength = (length) => {
    let containerHeight;
    switch (length) {
      case 1:
        containerHeight = 215;
        break;
      case 2:
        containerHeight = 345;
        break;
      case 3:
        containerHeight = 475;
        break;
      default:
        containerHeight = 530;
        break;
    }
    return containerHeight;
  };
  return !isNotificationsLoading ? (
    utils.generic.isValidArray(notifications, true) ? (
      <>
        <Box className={classes.clearAll}>
          <Link
            text={utils.string.t('app.clearAll')}
            color={'secondary'}
            handleClick={() => {
              handlers.clearAllNotifications();
            }}
          />
        </Box>
        <InfiniteScroll
          itemCount={notifications?.length}
          content={(index) => renderNotificationComponent(index)}
          containerHeight={renderContainerHeightBasedOnLength(notifications?.length)}
          rowHeight={60}
        />
      </>
    ) : (
      <Box p={10} display={'flex'} justifyContent={'center'}>
        {!notificationsError ? (
          <Warning text={utils.string.t('app.noNotifications')} type="info" align="left" size="small" icon />
        ) : (
          <Warning text={notificationsError} type="error" align="left" size="small" icon />
        )}
      </Box>
    )
  ) : (
    <Box p={2}>
      <Skeleton height={25} animation="wave" displayNumber={5} />
    </Box>
  );
}
