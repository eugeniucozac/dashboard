import {
  Button,
  FormContainer,
  FormActions,
  FormText,
  FormFields,
  FormGrid,
  Info,
  FormDate,
  FormAutocompleteMui,
  FormLabel,
} from 'components';
import config from 'config';
import React from 'react';
import PropTypes from 'prop-types';
import { useFormActions } from 'hooks';

//app
import * as utils from 'utils';
import * as constants from 'consts';
import styles from './DmsEditMetadata.style';

//mui
import { Box, Typography, makeStyles } from '@material-ui/core';

DmsEditMetadataView.propTypes = {
  fields: PropTypes.array.isRequired,
  control: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  actions: PropTypes.array.isRequired,
  reset: PropTypes.object.isRequired,
  handleSubmit: PropTypes.object.isRequired,
  formState: PropTypes.object.isRequired,
  dmsContext: PropTypes.string,
  docInfo: PropTypes.object,
  documentData: PropTypes.object,
  isPaymentAllowed: PropTypes.bool.isRequired,
};

export default function DmsEditMetadataView({
  fields,
  control,
  errors,
  actions,
  reset,
  handleSubmit,
  formState,
  dmsContext,
  docInfo,
  documentData,
  isPaymentAllowed,
}) {
  const { commonInfo, lossInfo, claimInfo, policyInfo } = docInfo;
  const classes = makeStyles(styles, { name: 'DmsEditMetadata' })();
  const { secondary, submit } = useFormActions(actions, reset);

  return (
    <FormContainer type="dialog" onSubmit={handleSubmit} data-testid="form-edit-meta-data">
      <FormFields type="dialog">
          <Box width="100%">
            <Box className={classes.boxView}>
              <Typography className={classes.subTitle}>{utils.string.t('dms.metadata.commonInfoSection.commonInfo')}</Typography>
              <FormGrid container spacing={3}>
                <FormGrid item xs={12} sm={4} md={3}>
                  <FormGrid xs={12}>
                    <FormGrid item>
                      <FormLabel
                        label={utils.string.t('dms.metadata.documentDetails.documentName')}
                        align="left"
                        nestedClasses={{ root: classes.dmsFieldTiltles }}
                      />
                      <FormText {...utils.form.getFieldProps(fields, 'documentName', control, errors)} />
                    </FormGrid>
                  </FormGrid>
                </FormGrid>
                <FormGrid item xs={12} sm={4} md={3}>
                  <FormGrid xs={12}>
                    <FormGrid item>
                      <FormLabel
                        label={utils.string.t('dms.metadata.documentDetails.documentType')}
                        align="left"
                        nestedClasses={{ root: classes.dmsFieldTiltles }}
                      />
                      <FormAutocompleteMui
                        {...utils.form.getFieldProps(fields, 'documentType', control, errors)}
                        nestedClasses={{ root: classes.dmsDocSelect }}
                      />
                    </FormGrid>
                  </FormGrid>
                </FormGrid>
                <FormGrid item xs={12} sm={4} md={3}>
                  <FormGrid xs={12}>
                    <FormGrid item>
                      <FormLabel
                        label={utils.string.t('dms.metadata.documentDetails.documentClassification')}
                        align="left"
                        nestedClasses={{ root: classes.dmsFieldTiltles }}
                      />
                      <FormAutocompleteMui
                        {...utils.form.getFieldProps(fields, 'documentClassification', control, errors)}
                        nestedClasses={{ root: classes.dmsDocSelect }}
                      />
                    </FormGrid>
                  </FormGrid>
                </FormGrid>
              </FormGrid>
              <FormGrid container spacing={3}>
                {commonInfo?.map(({ name, value, id }) => (
                  <FormGrid key={id} item xs={12} sm={4} md={3}>
                    <Info title={name} description={value} nestedClasses={{ root: classes.info }} />
                  </FormGrid>
                ))}
                <FormGrid item xs={12} sm={4} md={3}>
                  <Info
                    title={utils.string.t('dms.metadata.documentVersion.documentUploadedBy')}
                    description={documentData?.createdByName}
                    nestedClasses={{ root: classes.info }}
                  />
                </FormGrid>
                <FormGrid item xs={12} sm={4} md={3}>
                  <Info
                    title={utils.string.t('dms.metadata.documentVersion.documentVersion')}
                    description={documentData?.documentVersion}
                    nestedClasses={{ root: classes.info }}
                  />
                </FormGrid>
                <FormGrid item xs={12} sm={4} md={3}>
                  <Info
                    title={utils.string.t('dms.metadata.documentVersion.documentCreatedOn')}
                    description={utils.string.t('format.date', {
                      value: { date: documentData?.createdDate, format: config.ui.format.date.text },
                    })}
                    nestedClasses={{ root: classes.info }}
                  />
                </FormGrid>
                <FormGrid item xs={12} sm={4} md={3}>
                  <Info
                    title={utils.string.t('dms.metadata.documentVersion.documentUpdatedBy')}
                    description={utils.string.t('format.date', {
                      value: { date: documentData?.updatedDate, format: config.ui.format.date.text },
                    })}
                    nestedClasses={{ root: classes.info }}
                  />
                </FormGrid>
                <FormGrid item xs={12} sm={4} md={3}>
                  <Info
                    title={utils.string.t('dms.metadata.documentVersion.documentSource')}
                    description={documentData?.srcApplication}
                    nestedClasses={{ root: classes.info }}
                  />
                </FormGrid>
              </FormGrid>
            </Box>
            {isPaymentAllowed && (
              <Box className={classes.boxView} mt={2}>
                <Typography className={classes.subTitle}>{utils.string.t('dms.metadata.paymentDetails.title')}</Typography>
                <FormGrid container spacing={3}>
                  <FormGrid item xs={12} sm={2} md={2}>
                    <FormGrid xs={12}>
                      <FormGrid item>
                        <FormLabel
                          label={utils.string.t('dms.metadata.paymentDetails.paymentDate')}
                          align="left"
                          nestedClasses={{ root: classes.dmsFieldTiltles }}
                        />
                        <FormDate {...utils.form.getFieldProps(fields, 'payment.paymentDate', control, errors)} />
                      </FormGrid>
                    </FormGrid>
                  </FormGrid>
                  <FormGrid item xs={12} sm={2} md={2}>
                    <FormGrid xs={12}>
                      <FormGrid item>
                        <FormLabel
                          label={utils.string.t('dms.metadata.paymentDetails.paymentReference')}
                          align="left"
                          nestedClasses={{ root: classes.dmsFieldTiltles }}
                        />
                        <FormText {...utils.form.getFieldProps(fields, 'payment.paymentReference', control, errors)} />
                      </FormGrid>
                    </FormGrid>
                  </FormGrid>
                  <FormGrid item xs={12} sm={2} md={2}>
                    <FormGrid xs={12}>
                      <FormGrid item>
                        <FormLabel
                          label={utils.string.t('dms.metadata.paymentDetails.lossPayee')}
                          align="left"
                          nestedClasses={{ root: classes.dmsFieldTiltles }}
                        />
                        <FormText {...utils.form.getFieldProps(fields, 'payment.lossPayee', control, errors)} />
                      </FormGrid>
                    </FormGrid>
                  </FormGrid>
                  <FormGrid item xs={12} sm={2} md={2}>
                    <FormGrid xs={12}>
                      <FormGrid item>
                        <FormLabel
                          label={utils.string.t('dms.metadata.paymentDetails.amount')}
                          align="left"
                          nestedClasses={{ root: classes.dmsFieldTiltles }}
                        />
                        <FormText {...utils.form.getFieldProps(fields, 'payment.amount', control, errors)} />
                      </FormGrid>
                    </FormGrid>
                  </FormGrid>
                  <FormGrid item xs={12} sm={2} md={2}>
                    <FormGrid xs={12}>
                      <FormGrid item>
                        <FormLabel
                          label={utils.string.t('dms.metadata.paymentDetails.currency')}
                          align="left"
                          nestedClasses={{ root: classes.dmsFieldTiltles }}
                        />
                        <FormAutocompleteMui
                          {...utils.form.getFieldProps(fields, 'payment.currency', control, errors)}
                          nestedClasses={{ root: classes.dmsDocSelect }}
                        />
                      </FormGrid>
                    </FormGrid>
                  </FormGrid>
                </FormGrid>
              </Box>
            )}
            {dmsContext === constants.DMS_CONTEXT_CLAIM && (
              <Box className={classes.boxView} mt={2}>
                <Typography className={classes.subTitle}>{utils.string.t('dms.metadata.claimInfoSection.claimDetails')}</Typography>
                <FormGrid container spacing={3}>
                  {claimInfo?.map(({ name, value, id }) => (
                    <FormGrid key={id} item xs={12} sm={4} md={3}>
                      <Info title={name} description={value} nestedClasses={{ root: classes.info }} />
                    </FormGrid>
                  ))}
                </FormGrid>
              </Box>
            )}
            {(dmsContext === constants.DMS_CONTEXT_CLAIM || dmsContext === constants.DMS_CONTEXT_LOSS) && (
              <Box className={classes.boxView} mt={2}>
                <Typography className={classes.subTitle}>{utils.string.t('dms.metadata.lossInfoSection.lossDetails')}</Typography>
                <FormGrid container spacing={3}>
                  {lossInfo?.map(({ name, value, id }) => (
                    <FormGrid key={id} item xs={12} sm={4} md={3}>
                      <Info title={name} description={value} nestedClasses={{ root: classes.info }} />
                    </FormGrid>
                  ))}
                </FormGrid>
              </Box>
            )}
            {(dmsContext === constants.DMS_CONTEXT_PROCESSING_INSTRUCTION ||
              dmsContext === constants.DMS_CONTEXT_POLICY ||
              dmsContext === constants.DMS_CONTEXT_CASE) && (
                <Box className={classes.boxView} mt={2}>
                  <Typography className={classes.subTitle}>{utils.string.t('dms.metadata.policyInfoSection.policyDetails')}</Typography>
                  <FormGrid container spacing={3}>
                    {policyInfo?.map(({ name, value, id }) => (
                      <FormGrid key={id} item xs={12} sm={4} md={3}>
                        <Info title={name} description={value} nestedClasses={{ root: classes.info }} />
                      </FormGrid>
                    ))}
                  </FormGrid>
                </Box>
              )}
          </Box>
      </FormFields>
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
    </FormContainer>
  );
}
