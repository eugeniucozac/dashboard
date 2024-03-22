import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './DmsAdvancedSearch.styles';
import {
  Button,
  FormActions,
  FormAutocompleteMui,
  FormContainer,
  FormDate,
  FormFields,
  FormGrid,
  FormLegend,
  FormText,
  FormMultiSelect,
} from 'components';
import * as constants from 'consts';
import * as utils from 'utils';

// mui
import { makeStyles, Box, Collapse, Fade, Grid, Typography } from '@material-ui/core';

DmsAdvancedSearchView.propTypes = {
  fields: PropTypes.array.isRequired,
  buttons: PropTypes.shape({
    cancel: PropTypes.object.isRequired,
    submit: PropTypes.object.isRequired,
  }).isRequired,
  formProps: PropTypes.object.isRequired,
  isDocumentTypePayment: PropTypes.bool,
  resetKey: PropTypes.number,
};

export function DmsAdvancedSearchView({ fields, buttons, formProps, isDocumentTypePayment, resetKey }) {
  const classes = makeStyles(styles, { name: 'DmsAdvancedSearch' })();

  const { control, errors, handleSubmit } = formProps;
  const { cancel, submit } = buttons;

  const hasAdvancedSearch = isDocumentTypePayment;

  return (
    <Box width="100%" overflow="hidden">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box m={2} mb={-1}>
            <Typography variant="body1" classes={{ root: classes.title }}>
              {utils.string.t('dms.search.title')}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <FormContainer type="dialog" onSubmit={handleSubmit(submit.handler)} key={resetKey}>
            <FormFields type="dialog">
              <Box mb={-1.5}>
                <FormGrid container spacing={2}>
                  <FormGrid item xs={6} sm={4} md={3}>
                    <FormText {...utils.form.getFieldProps(fields, 'policyId', control, errors)} />
                  </FormGrid>
                  <FormGrid item xs={6} sm={4} md={3}>
                    <FormText {...utils.form.getFieldProps(fields, 'claimId', control, errors)} />
                  </FormGrid>
                  <FormGrid item xs={6} sm={4} md={3}>
                    <FormText {...utils.form.getFieldProps(fields, 'lossId', control, errors)} />
                  </FormGrid>
                  <FormGrid item xs={6} sm={4} md={3}>
                    <FormText {...utils.form.getFieldProps(fields, 'insuredName', control, errors)} />
                  </FormGrid>
                  <FormGrid item xs={12} sm={8} md={4}>
                    <FormAutocompleteMui {...utils.form.getFieldProps(fields, 'documentType', control, errors)} />
                  </FormGrid>
                  <FormGrid item xs={7} sm={4} md={3}>
                    <FormText {...utils.form.getFieldProps(fields, 'documentName', control, errors)} />
                  </FormGrid>
                  <FormGrid item xs={5} sm={4} md={2}>
                    <FormDate {...utils.form.getFieldProps(fields, 'year', control, errors)} />
                  </FormGrid>
                  <FormGrid item xs={12} sm={4} md={3}>
                    <FormMultiSelect
                      {...utils.form.getFieldProps(fields, 'division', control, errors)}
                      nestedClasses={{ wrapper: classes.multiSelect }}
                    />
                  </FormGrid>
                </FormGrid>
              </Box>

              <Fade in={hasAdvancedSearch}>
                <Collapse in={hasAdvancedSearch}>
                  <Box mt={5}>
                    <Box mb={-3}>
                      <FormLegend text={utils.string.t('dms.search.advancedSearch')} />
                    </Box>
                    {isDocumentTypePayment && (
                      <FormGrid container spacing={2}>
                        <FormGrid item xs={12} sm={4} md={3}>
                          <FormDate
                            {...utils.form.getFieldProps(fields, `${constants.DMS_DOCUMENT_TYPE_PAYMENT}_paymentDate`, control, errors)}
                          />
                        </FormGrid>
                        <FormGrid item xs={12} sm={4} md={3}>
                          <FormText
                            {...utils.form.getFieldProps(
                              fields,
                              `${constants.DMS_DOCUMENT_TYPE_PAYMENT}_paymentReference`,
                              control,
                              errors
                            )}
                          />
                        </FormGrid>
                        <FormGrid item xs={12} sm={4} md={3}>
                          <FormText
                            {...utils.form.getFieldProps(fields, `${constants.DMS_DOCUMENT_TYPE_PAYMENT}_lossPayee`, control, errors)}
                          />
                        </FormGrid>
                        <FormGrid item xs={12} sm={4} md={3}>
                          <FormText
                            {...utils.form.getFieldProps(fields, `${constants.DMS_DOCUMENT_TYPE_PAYMENT}_amount`, control, errors)}
                          />
                        </FormGrid>
                      </FormGrid>
                    )}
                  </Box>
                </Collapse>
              </Fade>
            </FormFields>
            <FormActions type="dialog" nestedClasses={{ actions: classes.buttons }}>
              <Button size="small" color="primary" variant="outlined" text={utils.string.t('app.cancel')} onClick={cancel.handler} />
              <Button
                size="small"
                color="primary"
                text={utils.string.t('dms.search.btn')}
                type="submit"
                onClick={handleSubmit(submit.handler)}
              />
            </FormActions>
          </FormContainer>
        </Grid>
      </Grid>
    </Box>
  );
}
