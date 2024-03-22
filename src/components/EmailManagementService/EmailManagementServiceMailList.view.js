import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import styles from './EmailManagementService.styles';
import { PopoverMenu, Warning } from 'components';
import * as utils from 'utils';
import config from 'config';

// mui
import { makeStyles, Grid, Box, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

EmailManagementServiceMailListView.propTypes = {
  emsInboxList: PropTypes.array.isRequired,
  selectedMail: PropTypes.object.isRequired,
  handlers: PropTypes.shape({
    showMailBodyContent: PropTypes.func.isRequired,
  }),
};

function EmailManagementServiceMailListView({ emsInboxList, selectedMail, handlers }) {
  const classes = makeStyles(styles, { name: 'EmailManagementService' })();

  return (
    <>
      <PopoverMenu
        disabled
        text={utils.string.t('ems.sent')}
        iconPosition={'left'}
        icon={ExpandMoreIcon}
        id="view-menu-list"
        items={[{ id: 1, label: utils.string.t('ems.sent') }]}
      />
      <Box className={classes.mailListBody}>
        {utils.generic.isValidArray(emsInboxList, true) &&
          emsInboxList.map((mail) => {
            const checked = utils.generic.isValidObject(selectedMail) ? Boolean(selectedMail?.id === mail?.id) : false;
            return (
              <Box
                key={mail?.id}
                className={classnames({
                  [classes.mailList]: true,
                  [classes.mailSelected]: checked,
                })}
                onClick={() => handlers.showMailBodyContent(mail?.id)}
              >
                <Grid container wrap="nowrap" spacing={1}>
                  <Grid item xs={8} zeroMinWidth>
                    <Typography noWrap className={classes.mailListHeader1}>
                      {utils.string.t('ems.noReply')}
                    </Typography>
                    <Typography noWrap className={classes.mailListHeader2}>
                      {mail?.subject}
                    </Typography>
                    <Typography noWrap className={classes.mailListHeader3}>
                      {mail?.text}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography className={classes.date}>
                      {utils.string.t('format.date', {
                        value: { date: String(mail?.dateSent), format: config.ui.format.date.text },
                      })}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            );
          })}
        {!utils.generic.isValidArray(emsInboxList, true) && (
          <Warning text={utils.string.t('ems.noMailsFound')} type="info" align="center" size="medium" icon />
        )}
      </Box>
    </>
  );
}

export default EmailManagementServiceMailListView;
