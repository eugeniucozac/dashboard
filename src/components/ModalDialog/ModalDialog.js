import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import get from 'lodash/get';

// app
import styles from './ModalDialog.styles';
import * as utils from 'utils';
import { Button, Translate } from 'components';

// mui
import CloseIcon from '@material-ui/icons/Close';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import { makeStyles, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider } from '@material-ui/core';

const ModalDialog = (props) => {
  const classes = makeStyles(styles, { name: 'Products' })();
  const { visible, fullScreen, fullWidth, enableFullScreen, maxWidth, cancelHandler, disableBackdropClick } = props;

  const handleClose = (callback) => {
    props.hideModal();
    utils.generic.isFunction(callback) && callback();
  };

  const handleFullScreen = () => {
    props.fullScreenModal();
  };

  return (
    <Dialog
      disableBackdropClick={disableBackdropClick}
      open={visible}
      onClose={() => (cancelHandler ? handleClose(cancelHandler) : handleClose())}
      fullWidth={fullWidth}
      fullScreen={fullScreen || props.fullScreen}
      maxWidth={props.maxWidth}
      disableAutoFocus={props.disableAutoFocus}
      aria-labelledby="modal-title"
      classes={{
        ...(!maxWidth && { paper: classes.paper }),
      }}
    >
      {enableFullScreen ? (
        <Button
          icon={FullscreenIcon}
          variant="text"
          onClick={() => handleFullScreen}
          nestedClasses={{ btn: classes.fullScreen }}
          data-testid="modal-fullscreen-button"
        />
      ) : null}

      <Button
        icon={CloseIcon}
        variant="text"
        onClick={() => (cancelHandler ? handleClose(cancelHandler) : handleClose())}
        nestedClasses={{ btn: classes.close }}
        data-testid="modal-close-button"
      />

      {(props.title || props.titleChildren) && (
        <Fragment>
          <DialogTitle disableTypography id="modal-title">
            {props.titleChildren ? (
              props.titleChildren
            ) : (
              <>
                <Translate label={props.title} variant="h2" className={classes.title} />
                {props.subtitle && <Translate label={props.subtitle} variant="h6" className={classes.subtitle} />}
              </>
            )}
          </DialogTitle>
          <Divider />
        </Fragment>
      )}

      <DialogContent className={classes.content}>
        {props.hint && (
          <DialogContentText className={classes.hint}>
            <Translate variant="body2" label={props.hint} />
          </DialogContentText>
        )}

        {get(props, 'children') ? get(props, 'children') : null}
      </DialogContent>

      {get(props, 'actions', []).length > 0 && (
        <Fragment>
          <Divider />
          <DialogActions>
            {props.actions.map((action, idx) => {
              let btnAction = null;

              if (action.type === 'ok' || action.type === 'cancel') {
                btnAction = () => handleClose(action.callback);
              } else {
                btnAction = () => action.callback;
              }

              return (
                <Button
                  key={idx}
                  {...(btnAction && { onClick: btnAction })}
                  {...(action.variant && { variant: action.variant })}
                  {...(action.color && { color: action.color })}
                  text={<Translate label={action.label} />}
                  data-testid={`modal-btn-${action.type}`}
                />
              );
            })}
          </DialogActions>
        </Fragment>
      )}
    </Dialog>
  );
};

ModalDialog.propTypes = {
  visible: PropTypes.bool,
  type: PropTypes.string,
  props: PropTypes.shape({
    title: PropTypes.string,
    subtitle: PropTypes.string,
    fullWidth: PropTypes.bool,
    fullScreen: PropTypes.bool,
    maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
    componentProps: PropTypes.object,
  }),
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      label: PropTypes.string,
      variant: PropTypes.string,
      color: PropTypes.string,
      callback: PropTypes.func,
    })
  ),
  hideModal: PropTypes.func.isRequired,
};

export default ModalDialog;
