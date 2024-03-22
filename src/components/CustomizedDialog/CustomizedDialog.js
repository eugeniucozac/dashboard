import { React, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';

// app
import styles from './CustomizedDialog.styles';
import { Button, Translate } from 'components';
import { selectDmsWidgetExpanded } from 'stores';
import config from 'config';

// mui
import { makeStyles, Dialog, DialogTitle, DialogContent, Divider } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';

CustomizedDialog.propTypes = {
  drawerOpen: PropTypes.bool.isRequired,
  dialogOpen: PropTypes.bool.isRequired,
  modalTitle: PropTypes.string.isRequired,
  handlers: PropTypes.shape({
    handleDialogClose: PropTypes.func.isRequired,
    handleCleanUp: PropTypes.func,
  }),
  isDrawerExpanded: PropTypes.bool.isRequired,
  isAnyformDirty: PropTypes.bool.isRequired,
};

CustomizedDialog.defaultProps = {
  handlers: {
    handleCleanUp: () => {},
  },
};

function CustomizedDialog({ parentRef, children, dialogOpen, modalTitle, handlers, isDirty, redirectUrl }) {
  const classes = makeStyles(styles, { name: 'CustomizedDialog' })();
  const history = useHistory();

  const [openDialog, setOpenDialog] = useState(false);

  const isDmsWidgetExpanded = useSelector(selectDmsWidgetExpanded);

  useEffect(() => {
    setOpenDialog(dialogOpen);
  }, [dialogOpen]);

  const handleClose = () => {
    if (isDirty) {
      handlers.handleDialogClose();
    } else {
      handlers.handleCleanUp();
      setOpenDialog(false);
      history.push(redirectUrl || config.routes.claimsFNOL.root);
    }
  };

  return (
    <Dialog
      maxWidth="xl"
      className={isDmsWidgetExpanded ? classes.dialogExpanded : classes.dialog}
      fullWidth
      onClose={handleClose}
      disableBackdropClick
      aria-labelledby="customized-dialog-title"
      open={openDialog}
      disablePortal
      container={() => parentRef.current}
    >
      <Button icon={CloseIcon} variant="text" onClick={handleClose} nestedClasses={{ btn: classes.close }} />

      <DialogTitle disableTypography>
        <Translate label={modalTitle} variant="h2" className={classes.title} />
      </DialogTitle>
      <Divider />

      <DialogContent className={classes.content}>
        <div className={classes.container}>{children}</div>
      </DialogContent>
    </Dialog>
  );
}

export default withStyles(styles)(CustomizedDialog);
