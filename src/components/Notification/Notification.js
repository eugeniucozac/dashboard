import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import classnames from 'classnames';
import get from 'lodash/get';

// app
import styles from './Notification.styles';
import { Button, Translate } from 'components';
import { removeNotification, hideNotification } from 'stores';
import config from 'config';

// mui
import { withStyles, Snackbar, Slide } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

// state
const mapStateToProps = (state) => ({
  uiNotificationQueue: get(state, 'ui.notification.queue', []),
});

// dispatch
const mapDispatchToProps = {
  removeNotification,
  hideNotification,
};

export class Notification extends PureComponent {
  handleClose = (key) => (event, reason) => {
    if (reason === 'clickaway') return;
    this.props.hideNotification(key);
  };

  handleExited = (key) => () => {
    this.props.removeNotification(key);
  };

  render() {
    const { uiNotificationQueue, classes } = this.props;
    const notification = uiNotificationQueue[0];

    if (!notification) return null;

    const snackbarClasses = {
      [classes.root]: true,
      [classes.success]: notification.type === 'success',
      [classes.error]: notification.type === 'error',
      [classes.info]: notification.type === 'info',
      [classes.warning]: notification.type === 'warning',
    };

    const delay = notification.delay || config.ui.notification.delay[notification.type] || null;
    return (
      <Snackbar
        key={notification.key}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={notification.visible}
        autoHideDuration={delay}
        onClose={this.handleClose(notification.key)}
        TransitionProps={{
          onExited: this.handleExited(notification.key),
        }}
        ContentProps={{
          'aria-describedby': 'notification-message-id',
          className: classnames(snackbarClasses),
        }}
        className={classes.notification}
        message={<Translate label={notification.message} options={notification.data} />}
        TransitionComponent={Slide}
        action={[
          <Button
            key="close"
            icon={CloseIcon}
            variant="text"
            aria-label="Close"
            nestedClasses={{
              btn: classes.close,
            }}
            onClick={this.handleClose(notification.key)}
          />,
        ]}
      />
    );
  }
}

export default compose(connect(mapStateToProps, mapDispatchToProps), withStyles(styles))(Notification);
