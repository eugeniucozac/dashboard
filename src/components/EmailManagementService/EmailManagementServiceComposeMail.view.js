import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

//app
import styles from './EmailManagementService.styles';
import { Avatar, Button, PopoverFilter, FormContainer, FormText, FormFileDrop, FilterChips, FormGrid } from 'components';
import * as utils from 'utils';

//mui
import { makeStyles, Box, Typography, Grid } from '@material-ui/core';
import SendOutlinedIcon from '@material-ui/icons/SendOutlined';

EmailManagementServiceComposeMailView.propTypes = {
  actions: PropTypes.array.isRequired,
  attachedMailDocuments: PropTypes.array.isRequired,
  attachmentProps: PropTypes.object.isRequired,
  fields: PropTypes.array.isRequired,
  mailBoxExistingAttachmentsList: PropTypes.array,
  handlers: PropTypes.shape({
    removeAttachedDocument: PropTypes.func.isRequired,
  }).isRequired,
};

function EmailManagementServiceComposeMailView({ attachedMailDocuments, actions, fields, attachmentProps, handlers }) {
  const classes = makeStyles(styles, { name: 'EmailManagementService' })();

  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);

  const { control, errors, handleSubmit } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });
  const sendMail = actions && actions.find((action) => action.name === 'sendMail' && action.handler);

  const hasAttachedDocuments = utils.generic.isValidArray(attachedMailDocuments, true);

  return (
    <FormContainer onSubmit={handleSubmit(sendMail.handler)} className={classes.composeMailForm}>
      <Box p={2}>
        <FormGrid container>
          <FormGrid item xs={1}>
            {sendMail && (
              <Button
                icon={SendOutlinedIcon}
                text={utils.string.t('app.send')}
                tooltip={{ title: utils.string.t('app.send') }}
                type="submit"
                nestedClasses={{
                  btn: classes.sendButton,
                  label: classes.sendLabel,
                  icon: classes.sendIcon,
                }}
                iconWide
                color={'default'}
                variant={'outlined'}
                size="large"
              />
            )}
          </FormGrid>
          <FormGrid item xs={11}>
            <Box pb={errors?.emailTo ? 3 : 1}>
              <Grid container wrap="nowrap">
                <Grid item>
                  <Avatar variant="rounded" text={utils.string.t('ems.emailTo')} size={24} avatarClasses={classes.mailBodyButton} />
                </Grid>
                <Grid item className={classes.fullWidth}>
                  <FormText {...utils.form.getFieldProps(fields, 'emailTo', control, errors)} />
                </Grid>
              </Grid>
            </Box>
            <Box pb={errors?.emailCc ? 3 : 1}>
              <Grid container wrap="nowrap">
                <Grid item>
                  <Avatar variant="rounded" text={utils.string.t('ems.emailCc')} size={24} avatarClasses={classes.mailBodyButton} />
                </Grid>
                <Grid item className={classes.fullWidth}>
                  <FormText {...utils.form.getFieldProps(fields, 'emailCc', control, errors)} />
                </Grid>
              </Grid>
            </Box>
            <Box pb={errors?.subject ? 1 : 0}>
              <Grid container wrap="nowrap" spacing={1}>
                <Grid item>
                  <Typography variant="body2">{utils.string.t('ems.emailSubject')}</Typography>
                </Grid>
                <Grid item className={classes.fullWidth}>
                  <FormText {...utils.form.getFieldProps(fields, 'subject', control, errors)} />
                </Grid>
              </Grid>
            </Box>
          </FormGrid>
        </FormGrid>
      </Box>

      <Box px={2}>
        <Grid container alignItems="center" justify="center" spacing={1}>
          <Grid item xs={10}>
            {!hasAttachedDocuments ? (
              <FormFileDrop
                nestedClasses={{
                  dragArea: classes.mailBodyFileUploadDragArea,
                }}
                {...utils.form.getFieldProps(fields, 'filesUpload', control, errors)}
                onChange={(files, rejectedFiles) => {}}
              />
            ) : (
              <Box className={classes.attachedDocumentsContainer}>
                <FilterChips
                  items={hasAttachedDocuments ? attachedMailDocuments?.map((doc) => ({ value: doc?.id, label: doc?.name })) : []}
                  handleRemoveItems={(item) => handlers.removeAttachedDocument(item[0])}
                />
              </Box>
            )}
          </Grid>
          <Grid item xs={2}>
            <PopoverFilter {...attachmentProps} />
          </Grid>
        </Grid>
      </Box>

      <Box m={2}>
        <FormText {...utils.form.getFieldProps(fields, 'message', control, errors)} />
      </Box>
    </FormContainer>
  );
}

export default EmailManagementServiceComposeMailView;
