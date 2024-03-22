import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// app
import { Loader, Button, FormContainer, FormFields, FormActions, FormGrid, FormSelect, Tabs } from 'components';
import * as utils from 'utils';
import styles from './RfiQueryResponseLogs.styles';

// mui
import { Fade, makeStyles, FormLabel, Typography, Box, Grid, Link } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import MailIcon from '@material-ui/icons/Mail';

const RfiQueryResponseLogsView = ({
  fields,
  actions,
  isLoading,
  rfiType,
  sendTo,
  queryCode,
  queryId,
  expectedResponseDate,
  documents,
  tabs,
  selectedTab,
  handleSelectTab,
}) => {
  const classes = makeStyles(styles, { name: 'RfiQueryResponseLogsView' })();
  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);
  const { control, errors, handleSubmit } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });
  const submit = actions && actions.find((action) => action.name === 'submit');
  const onSubmit = (data) => {
    return submit && utils.generic.isFunction(submit.handler) && submit.handler(data);
  };

  return (
    <div className={classes.root}>
      <Fade in={!isLoading}>
        <FormContainer type="dialog" onSubmit={handleSubmit(onSubmit)} data-testid="form-rfiQueryResponseLogs">
          <FormFields type="dialog">
            <FormGrid container>
              <div className={classes.formStyling}>
                <div className={classes.toggleButtonStyling} data-testid="form-toggleButtonGroup">
                  <Typography className={classes.headingStyling} variant="h3">
                    {'Query Log'}
                  </Typography>
                  <Tabs verticalAlignBool={true} tabs={tabs} value={selectedTab} onChange={(tabName) => handleSelectTab(tabName)} />
                </div>
                <Divider orientation="vertical" flexItem />
                <div className={classes.formFieldsStyling} data-testid="form-elements">
                  <FormGrid container>
                    <FormGrid item xs={12} sm={6}>
                      <Typography className={classes.headingStyling} variant="h3">
                        {'RFI Detail'}
                      </Typography>
                      <FormLabel>{'RFI Type'}</FormLabel>
                      <Typography variant="h5">{rfiType}</Typography>
                    </FormGrid>
                  </FormGrid>
                  <Divider />
                  <FormGrid container>
                    <FormGrid item xs={12} sm={6}>
                      <FormLabel>{'Send To'}</FormLabel>
                      <Typography variant="h5">{sendTo}</Typography>
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
                    {'RFI Loop'}
                  </Typography>
                  <Typography className={classes.headingStyling} variant="h5">
                    {'Joe Blocks wrote :'}
                  </Typography>
                  <Typography variant="h6">{'3.45 PM, 2 Jan 2021'}</Typography>
                  <Typography className={classes.headingStyling} variant="h5">
                    {'The version of the slip document does not appear to be correct, as signed lined section is blank.'}
                  </Typography>
                  <FormGrid container>
                    <FormGrid item xs={12} sm={10}>
                      <Box pt={2} m={2} data-testid="choose-case-documents">
                        {documents && documents.length > 0 ? (
                          <FormGrid container>
                            {documents.map((doc) => (
                              <FormGrid item xs={12} sm={8} key={doc.id}>
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
                  <Typography className={classes.headingStyling} variant="h5">
                    {'John Woods wrote :'}
                  </Typography>
                  <Typography variant="h6">{'10:04 AM, 3 Jan 2021'}</Typography>
                  <Typography className={classes.headingStyling} variant="h5">
                    {'Correct slip document attached now.'}
                  </Typography>
                  <FormGrid container>
                    <FormGrid item xs={12} sm={10}>
                      <Box pt={2} m={2} data-testid="choose-case-documents">
                        {documents && documents.length > 0 ? (
                          <FormGrid container>
                            {documents.map((doc) => (
                              <FormGrid item xs={12} sm={8} key={doc.id}>
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
                    {'Decision'}
                  </Typography>
                  <FormGrid item xs={12} sm={6}>
                    <FormSelect {...utils.form.getFieldProps(fields, 'resolutionCode')} error={errors.resolutionCode} control={control} />
                  </FormGrid>
                </div>
              </div>
            </FormGrid>
          </FormFields>
          <FormActions type="dialog">
            {submit && <Button text={submit.label} type="submit" color="primary" data-testid="closeTicket-btn" />}
          </FormActions>
        </FormContainer>
      </Fade>
      <Loader visible={isLoading} absolute />
    </div>
  );
};

RfiQueryResponseLogsView.propTypes = {
  fields: PropTypes.array,
  actions: PropTypes.array,
  isLoading: PropTypes.bool,
  rfiType: PropTypes.string,
  sendTo: PropTypes.string,
  queryCode: PropTypes.string,
  expectedResponseDate: PropTypes.string,
  queryId: PropTypes.string,
  documents: PropTypes.array,
  tabs: PropTypes.array,
  selectedTab: PropTypes.string,
  handleSelectTab: PropTypes.func,
};

export default RfiQueryResponseLogsView;
