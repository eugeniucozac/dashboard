import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// app
import { Loader, Button, FormContainer, FormFields, FormActions, FormGrid, FormText } from 'components';
import styles from './RfiQueryResponse.styles';
import * as utils from 'utils';

// mui
import { Fade, Typography, FormLabel, makeStyles, Box, Grid, Link } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import MailIcon from '@material-ui/icons/Mail';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';

const RfiQueryResponseView = ({ fields, actions, isLoading, rfiType, rfiFrom, queryCode, expectedResponseDate, queryId, documents }) => {
  const classes = makeStyles(styles, { name: 'RfiQueryResponseView' })();
  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);
  const { control, errors, handleSubmit, reset, formState } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });
  const cancel = actions && actions.find((action) => action.name === 'cancel');
  const submit = actions && actions.find((action) => action.name === 'submit');
  const handleCancel = () => () => {
    const cancel = actions && actions.find((action) => action.name === 'cancel');
    cancel && utils.generic.isFunction(cancel.handler) && cancel.handler();
    reset();
  };

  const onSubmit = (data) => {
    return submit && utils.generic.isFunction(submit.handler) && submit.handler(data);
  };

  return (
    <div className={classes.root}>
      <Fade in={!isLoading}>
        <FormContainer type="dialog" onSubmit={handleSubmit(onSubmit)} data-testid="form-rfiQueryResponse">
          <FormFields type="dialog">
            <FormGrid container>
              <FormGrid item xs={12} sm={6}>
                <FormLabel>{'RFI Type'}</FormLabel>
                <Typography variant="h5">{rfiType}</Typography>
              </FormGrid>
            </FormGrid>
            <Divider />
            <Typography className={classes.headingStyling} variant="h3">
              {'Internal Info'}
            </Typography>
            <FormGrid container>
              <FormGrid item xs={12} sm={6}>
                <FormLabel>{'From'}</FormLabel>
                <Typography variant="h5">{rfiFrom}</Typography>
              </FormGrid>
              <FormGrid item xs={12} sm={6}>
                <FormLabel>{'Query Code'}</FormLabel>
                <Typography variant="h5">{queryCode}</Typography>
              </FormGrid>
              <FormGrid item xs={12} sm={6}>
                <FormLabel>{'Expected Response Date'}</FormLabel>
                <Typography variant="h5">{expectedResponseDate}</Typography>
              </FormGrid>
              <FormGrid item xs={12} sm={6}>
                <FormLabel>{'Query ID'}</FormLabel>
                <Typography variant="h5">{queryId}</Typography>
              </FormGrid>
            </FormGrid>
            <Divider />
            <Typography className={classes.headingStyling} variant="h3">
              {'Response'}
            </Typography>
            <FormGrid container>
              <FormGrid item xs={12} sm={10}>
                <FormText
                  {...utils.form.getFieldProps(fields, 'typeYourQueryResponse')}
                  control={control}
                  error={errors.typeYourQueryResponse}
                />
              </FormGrid>
            </FormGrid>
            <Divider />
            <Typography className={classes.headingStyling} variant="h5">
              {'Joe Blocks wrote'}
            </Typography>
            <Typography variant="h6">{'3.45 PM, 2 Jan 2021'}</Typography>
            <Typography className={classes.headingStyling} variant="h5">
              {'The version of the slip document does not appear to be correct, as signed lined section is blank.'}
            </Typography>
            <FormGrid container>
              <FormGrid item xs={12} sm={8}>
                <Box pt={2} m={2} data-testid="choose-case-documents">
                  {documents && documents.length > 0 ? (
                    <FormGrid container>
                      {documents.map((doc) => (
                        <FormGrid item xs={12} sm={6} key={doc.id}>
                          <Grid container direction="row" spacing={1} className={classes.docStyle}>
                            <Grid item>
                              {doc.type === 'pdf' && <PictureAsPdfIcon color="primary" className={classes.iconNormal} />}
                              {doc.type === 'mail' && <MailIcon color="primary" className={classes.iconNormal} />}
                            </Grid>
                            <Grid item>
                              <Grid container direction="column">
                                <Grid item>
                                  <Typography variant="body2" color={'primary'}>
                                    {doc.name}
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <Typography variant="body2" color={'primary'}>
                                    {utils.string.t('premiumProcessing.rfi.version')} {doc.version}
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <Typography variant="body2" color={'primary'}>
                                    {utils.string.t('premiumProcessing.rfi.owner')}: {doc.owner}
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <Typography>
                                    <Link underline="always" className={classes.viewDocument}>
                                      {'View Document'}
                                    </Link>
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </FormGrid>
                      ))}
                    </FormGrid>
                  ) : (
                    <Box>
                      <Typography variant="body1">{utils.string.t('premiumProcessing.rfi.noDocumentFound')}</Typography>
                    </Box>
                  )}
                </Box>
              </FormGrid>
            </FormGrid>
            <Divider />
            <Typography className={classes.headingStyling} variant="h3">
              {'Attach Documents (Optional)'}
            </Typography>
            <FormGrid container>
              <FormGrid item xs={12} sm={6}>
                <Typography>
                  <Link underline="always" className={classes.viewDocument}>
                    {'Show Existing Document(s)'}
                  </Link>
                </Typography>
              </FormGrid>
              <FormGrid item xs={12} sm={6}>
                <Link underline="always" className={classes.viewDocument}>
                  <FormGrid container spacing={1}>
                    <FormGrid item>
                      <AddCircleOutlineOutlinedIcon fontSize={'small'} />
                    </FormGrid>
                    <FormGrid item>
                      <Typography className={classes.addDocument}>{'Add Document'}</Typography>
                    </FormGrid>
                  </FormGrid>
                </Link>
                <Typography variant="h6">
                  {'Note: Not more than 5MB, up to 5 documents. File types expect exe, dll, script files.'}
                </Typography>
              </FormGrid>
            </FormGrid>
          </FormFields>
          <FormActions type="dialog">
            {cancel && <Button text={cancel.label} variant="outlined" onClick={handleCancel()} disabled={formState.isSubmitting} />}
            {submit && <Button text={submit.label} type="submit" disabled={formState.isSubmitting || !formState.isDirty} color="primary" />}
          </FormActions>
        </FormContainer>
      </Fade>
      <Loader visible={isLoading} absolute />
    </div>
  );
};

RfiQueryResponseView.propTypes = {
  fields: PropTypes.array,
  actions: PropTypes.array,
  isLoading: PropTypes.bool,
  rfiType: PropTypes.string,
  rfiFrom: PropTypes.string,
  queryCode: PropTypes.string,
  expectedResponseDate: PropTypes.string,
  queryId: PropTypes.string,
  documents: PropTypes.array,
};

export default RfiQueryResponseView;
