import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

//app
import styles from './EmailManagementService.styles';
import EmailManagementServiceMailListView from './EmailManagementServiceMailList.view';
import EmailManagementServiceComposeMail from './EmailManagementServiceComposeMail';
import EmailManagementServiceSelectedMailView from './EmailManagementServiceSelectedMail.view';
import { Button, FormLabel, Tooltip, FormText } from 'components';
import * as utils from 'utils';

//mui
import { makeStyles, Box, Grid, Hidden } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

EmailManagementServiceView.propTypes = {
  accountLabel: PropTypes.string.isRequired,
  emsInboxList: PropTypes.array.isRequired,
  emsExistingDocuments: PropTypes.array.isRequired,
  forwardAttachments: PropTypes.array.isRequired,
  forwardSubject: PropTypes.string.isRequired,
  forwardMessage: PropTypes.string.isRequired,
  fields: PropTypes.array.isRequired,
  isComposeEmail: PropTypes.bool.isRequired,
  isMiddleOffice: PropTypes.bool.isRequired,
  selectedMail: PropTypes.object.isRequired,
  handlers: PropTypes.shape({
    forwardMail: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    sendEmail: PropTypes.func.isRequired,
    showMailBodyContent: PropTypes.func.isRequired,
    downloadDocument: PropTypes.func.isRequired,
  }).isRequired,
  caseDetailsObject: PropTypes.object,
  accountDetails: PropTypes.object,
  accountName: PropTypes.string.isRequired,
};

function EmailManagementServiceView({
  accountLabel,
  emsInboxList,
  emsExistingDocuments,
  forwardAttachments,
  forwardSubject,
  forwardMessage,
  fields,
  isComposeEmail,
  selectedMail,
  handlers,
  isMiddleOffice,
  caseDetailsObject,
  accountDetails,
  accountName,
}) {
  const classes = makeStyles(styles, { name: 'EmailManagementService' })();

  return (
    <>
      <Box my={1}>
        <Grid container spacing={2}>
          <Grid item xs={isComposeEmail && accountLabel ? 6 : 12}>
            <Box flex="0.5">
              <Button
                icon={ChevronLeftIcon}
                text={utils.string.t('app.back')}
                tooltip={{ title: utils.string.t('app.goBack') }}
                nestedClasses={{
                  btn: classes.goBackButton,
                }}
                onClick={() => handlers.goBack()}
                color={'default'}
                variant={'outlined'}
                size="medium"
              />
            </Box>
          </Grid>
          {isComposeEmail && accountLabel && (
            <Grid item xs={6}>
              <Grid container justify="flex-end" alignItems="center" spacing={1}>
                <Grid item>
                  <FormLabel label={accountLabel} align="right" />
                </Grid>
                <Grid item>
                  <Hidden xsDown>
                    <Tooltip
                      title={<>{`${accountLabel}: ${accountName}`}</>}
                      placement="top"
                      nestedClasses={{ tooltip: classnames(classes.toolTip) }}
                    >
                      <FormText {...utils.form.getFieldProps(fields, 'accountName')} />
                    </Tooltip>
                  </Hidden>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Box>

      <Box className={classes.gridBorder}>
        <Grid container>
          <Grid item xs={12} sm={3} className={classes.mailInboxContainer}>
            <EmailManagementServiceMailListView
              emsInboxList={emsInboxList}
              selectedMail={selectedMail}
              handlers={{ showMailBodyContent: handlers.showMailBodyContent }}
            />
          </Grid>
          <Grid item xs={12} sm={9}>
            {isComposeEmail && (
              <EmailManagementServiceComposeMail
                emsExistingDocuments={emsExistingDocuments}
                forwardAttachments={forwardAttachments}
                forwardMessage={forwardMessage}
                forwardSubject={forwardSubject}
                handlers={{ sendEmail: handlers.sendEmail }}
                caseDetailsObject={caseDetailsObject}
                accountDetails={accountDetails}
              />
            )}
            {!isComposeEmail && utils.generic.isValidObject(selectedMail, 'id') && (
              <EmailManagementServiceSelectedMailView
                isMiddleOffice={isMiddleOffice}
                selectedMail={selectedMail}
                handlers={{ downloadDocument: handlers.downloadDocument, forwardMail: handlers.forwardMail }}
              />
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default EmailManagementServiceView;
