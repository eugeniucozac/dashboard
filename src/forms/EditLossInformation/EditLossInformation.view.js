import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

//app
import * as utils from 'utils';
import { Button, FormContainer, FormFields, FormGrid, FormAutocompleteMui, FormText, FormLabel, FormDate, FormActions } from 'components';
import { ClaimsUploadViewSearchDocs } from 'modules';
import { useFormActions } from 'hooks';
import styles from './EditLossInformation.styles';
import * as constants from 'consts';

//mui
import { makeStyles } from '@material-ui/core';

EditLossInformationView.propTypes = {
  actions: PropTypes.array.isRequired,
  fields: PropTypes.array.isRequired,
  lossInformation: PropTypes.object.isRequired,
  handlers: PropTypes.shape({
    onClosingUploadModal: PropTypes.func,
  }),
};
export function EditLossInformationView({ actions, fields, lossInformation, handlers }) {
  const classes = makeStyles(styles, { name: 'EditLossInformation' })();
  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);

  const { control, reset, errors, handleSubmit, formState, watch } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  const { secondary, submit } = useFormActions(actions, reset);

  const catCodesID = watch('catCodesID');
  const datesRequired = catCodesID !== null && catCodesID?.id !== '0';

  return (
    <div>
      <FormContainer onSubmit={handleSubmit} data-testid="form-edit-loss-information">
        <FormFields type="dialog">
          <FormGrid container spacing={6}>
            <FormGrid item xs={12} sm={5}>
              <FormGrid container alignItems="center">
                <FormGrid item xs={4}>
                  <FormLabel label={utils.string.t('claims.lossInformation.ref')} align="right" />
                </FormGrid>
                <FormGrid item xs={8}>
                  <FormText {...utils.form.getFieldProps(fields, 'lossRef', control)} />
                </FormGrid>
              </FormGrid>
              <FormGrid container alignItems="center">
                <FormGrid item xs={4}>
                  <FormLabel label={`${utils.string.t('claims.lossInformation.fromDate')} ${datesRequired ? '*' : ''}`} align="right" />
                </FormGrid>
                <FormGrid item xs={8}>
                  <FormDate {...utils.form.getFieldProps(fields, 'fromDate', control)} error={errors.fromDate} />
                </FormGrid>
              </FormGrid>
              <FormGrid container alignItems="center">
                <FormGrid item xs={4}>
                  <FormLabel label={`${utils.string.t('claims.lossInformation.toDate')} ${datesRequired ? '*' : ''}`} align="right" />
                </FormGrid>
                <FormGrid item xs={8}>
                  <FormDate {...utils.form.getFieldProps(fields, 'toDate', control)} error={errors.toDate} />
                </FormGrid>
              </FormGrid>
              <FormGrid container alignItems="center">
                <FormGrid item xs={4}>
                  <FormLabel label={utils.string.t('claims.lossInformation.dateAndTime')} align="right" />
                </FormGrid>
                <FormGrid item xs={8}>
                  <FormGrid container alignItems="center">
                    <FormGrid item xs={7}>
                      <FormDate {...utils.form.getFieldProps(fields, 'firstContactDate', control)} error={errors.firstContactDate} />
                    </FormGrid>
                    <FormGrid item xs={5}>
                      <FormText {...utils.form.getFieldProps(fields, 'firstContactTime', control)} />
                    </FormGrid>
                  </FormGrid>
                </FormGrid>
              </FormGrid>
            </FormGrid>
            <FormGrid item xs={12} sm={7}>
              <FormGrid container alignItems="center">
                <FormGrid item xs={4}>
                  <FormLabel label={`${utils.string.t('claims.lossInformation.name')}*`} align="right" />
                </FormGrid>
                <FormGrid item xs={8}>
                  <FormText {...utils.form.getFieldProps(fields, 'lossName', control)} error={errors.lossName} />
                </FormGrid>
              </FormGrid>
              <FormGrid container>
                <FormGrid item xs={4}>
                  <FormLabel label={`${utils.string.t('claims.lossInformation.details')}*`} align="right" />
                </FormGrid>
                <FormGrid item xs={8}>
                  <FormText {...utils.form.getFieldProps(fields, 'lossDescription', control)} error={errors.lossDescription} />
                </FormGrid>
              </FormGrid>
              <FormGrid container alignItems="center">
                <FormGrid item xs={4}>
                  <FormLabel label={utils.string.t('claims.lossInformation.catCode')} align="right" />
                </FormGrid>
                <FormGrid item xs={8}>
                  <FormAutocompleteMui
                    {...utils.form.getFieldProps(fields, 'catCodesID', control)}
                    nestedClasses={{ root: classes.catCodeSelect }}
                  />{' '}
                </FormGrid>
              </FormGrid>
            </FormGrid>
          </FormGrid>
        </FormFields>
      </FormContainer>
      <div className={classes.dmsView}>
        <ClaimsUploadViewSearchDocs
          refData={lossInformation}
          refIdName={constants.DMS_CONTEXT_LOSS_ID}
          dmsContext={constants.DMS_CONTEXT_LOSS}
          documentTypeKey={constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.claim}
          handlers={{ onClosingUploadModal: handlers.onClosingUploadModal }}
        />
      </div>
      <FormActions type="dialog">
        {secondary && (
          <Button text={secondary.label} variant="outlined" size="medium" disabled={formState.isSubmitting} onClick={secondary.handler} />
        )}
        {submit && (
          <Button
            text={submit.label}
            type="submit"
            disabled={formState.isSubmitting}
            onClick={handleSubmit(submit.handler)}
            color="primary"
          />
        )}
      </FormActions>
    </div>
  );
}
