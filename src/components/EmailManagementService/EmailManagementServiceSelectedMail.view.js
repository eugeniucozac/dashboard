import React from 'react';
import PropTypes from 'prop-types';

//app
import styles from './EmailManagementService.styles';
import { Avatar, Button, Link } from 'components';
import * as utils from 'utils';
import config from 'config';
import * as constants from 'consts';
import { useMedia } from 'hooks';

//mui
import { makeStyles, Box, Typography, Grid } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';

EmailManagementServiceSelectedMailView.propTypes = {
  isMiddleOffice: PropTypes.bool.isRequired,
  selectedMail: PropTypes.object.isRequired,
  handlers: PropTypes.shape({
    downloadDocument: PropTypes.func.isRequired,
    forwardMail: PropTypes.func.isRequired,
  }).isRequired,
};

function EmailManagementServiceSelectedMailView({ isMiddleOffice, selectedMail, handlers }) {
  const classes = makeStyles(styles, { name: 'EmailManagementService' })();
  const { mobile, tablet, desktop, wide, extraWide } = useMedia();

  const emailToList = selectedMail?.recipient?.filter(
    (recipient) => recipient?.attributeKey.toLowerCase() === constants.EMS_TO.toLowerCase()
  );
  const emailCcList = selectedMail?.recipient?.filter(
    (recipient) => recipient?.attributeKey.toLowerCase() === constants.EMS_CC.toLowerCase()
  );

  const documentTitleLength = mobile ? 5 : tablet ? 10 : desktop ? 15 : wide ? 20 : extraWide ? 25 : 30;

  return (
    <Box p={2}>
      <Box py={1}>
        <Grid container wrap="nowrap" spacing={2} alignItems={'center'}>
          <Grid item zeroMinWidth xs>
            <Typography noWrap className={classes.mailBodySubject}>
              {selectedMail?.subject}
            </Typography>
          </Grid>
          {isMiddleOffice ? (
            <Grid item>
              <Button
                icon={ArrowForwardIcon}
                iconPosition={'left'}
                text={utils.string.t('ems.forward')}
                size={'xsmall'}
                variant="outlined"
                onClick={() => {
                  handlers.forwardMail(selectedMail);
                }}
              />
            </Grid>
          ) : null}
        </Grid>
      </Box>
      <Box>
        <Grid container spacing={2} wrap="nowrap" alignItems={'center'}>
          <Grid item xs={10}>
            <Box sx={{ flexGrow: 1, overflow: 'hidden', px: 3 }}>
              <Grid container wrap="nowrap" spacing={2}>
                <Grid item>
                  <Avatar text={constants.EMS_NO_REPLY_AVATAR} size={40} />
                </Grid>
                <Grid item>
                  <Grid container direction="column">
                    <Grid item>
                      <Typography className={classes.mailListHeader1}>{utils.string.t('ems.noReply')}</Typography>
                    </Grid>
                    <Grid item>
                      <Grid container spacing={1} justify="flex-start" alignItems="center">
                        <Grid item>
                          <Typography className={classes.mailBodyToCc}>{utils.string.t('ems.emailTo')}:</Typography>
                        </Grid>
                        <Grid item>
                          {utils.generic.isValidArray(emailToList, true) &&
                            emailToList?.map((toUser) => (
                              <span key={toUser?.id} className={classes.mailBodyToCc}>
                                {`${toUser?.attributeValue}; `}
                              </span>
                            ))}
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Grid container spacing={1} justify="flex-start" alignItems="center">
                        <Grid item>
                          <Typography className={classes.mailBodyToCc}>{utils.string.t('ems.emailCc')}:</Typography>
                        </Grid>
                        <Grid item>
                          {utils.generic.isValidArray(emailCcList, true) &&
                            emailCcList?.map((ccUser) => (
                              <span key={ccUser?.id} className={classes.mailBodyToCc}>
                                {`${ccUser?.attributeValue}; `}
                              </span>
                            ))}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={2}>
            <Typography className={classes.date}>
              {utils.string.t('format.date', {
                value: { date: String(selectedMail?.dateSent), format: config.ui.format.date.textTime },
              })}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {utils.generic.isValidArray(selectedMail?.attachment, true) && (
        <Box my={1}>
          <Grid container spacing={1} alignItems="center">
            {selectedMail.attachment.map((doc) => (
              <Grid item key={doc?.documentId}>
                <Box className={classes.attachment}>
                  <Link
                    target="_blank"
                    rel="noopener"
                    color="primary"
                    icon={InsertDriveFileIcon}
                    iconPosition="left"
                    text={doc?.documentName ? utils.app.getEllipsisString(doc?.documentName, documentTitleLength) : ''}
                    tooltip={doc?.documentName?.length > documentTitleLength ? { title: doc?.documentName } : null}
                    onClick={() => {
                      handlers.downloadDocument(doc);
                    }}
                    nestedClasses={{
                      link: classes.documentLink,
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Box py={2} className={classes.mailBody}>
        <Typography variant="body2">{selectedMail?.text}</Typography>
      </Box>
    </Box>
  );
}

export default EmailManagementServiceSelectedMailView;
