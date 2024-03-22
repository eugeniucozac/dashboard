import React from 'react';
import PropTypes from 'prop-types';

import { DetailsCard, CreateAdhocTaskFooter } from 'modules';
import styles from './EnterAdHockDetails.style';

import * as utils from 'utils';
import { makeStyles, Box } from '@material-ui/core';

import { FormAutocompleteMui, FormSelect, FormContainer, FormLegend, FormFields, FormGrid, FormText, FormDate } from 'components';

EnterAdHockDetailsView.propTypes = {
  fields: PropTypes.array.isRequired,
  createAdHocTask: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  control: PropTypes.func.isRequired,
  claim: PropTypes.object.isRequired,
  skipUploadDocs: PropTypes.func.isRequired,
};

export default function EnterAdHockDetailsView({
  fields,
  createAdHocTask,
  handleSubmit,
  handleCancel,
  errors,
  control,
  claim,
  skipUploadDocs,
}) {
  const classes = makeStyles(styles, { name: 'EnterAdHockDetails' })();

  return (
    <Box overflow="hidden" display="flex" flexDirection="column">
      <Box flex="1 1 auto" className={classes.container}>
        <FormContainer data-testid="form-lossInformation">
          <FormFields type="blank">
            <FormGrid container spacing={3}>
              <FormGrid item xs={12}>
                <FormGrid container spacing={3}>
                  <FormGrid item xs={4}>
                    <DetailsCard
                      title={utils.string.t('claims.processing.taskDetailsLabels.claimRef')}
                      details={claim?.claimReference}
                      nestedClasses={{ title: classes.detailsCardTitle, text: classes.detailsCardText }}
                    />
                  </FormGrid>
                  <FormGrid item xs={4}>
                    <FormText {...utils.form.getFieldProps(fields, 'taskName', control)} error={errors?.taskName} />
                  </FormGrid>
                  <FormGrid item xs={4}>
                    <FormSelect {...utils.form.getFieldProps(fields, 'priority', control)} error={errors?.priority} />
                  </FormGrid>
                </FormGrid>
              </FormGrid>

              <FormGrid item xs={12}>
                <FormGrid container spacing={3}>
                  <FormGrid item xs={4}>
                    <FormSelect {...utils.form.getFieldProps(fields, 'team', control)} error={errors?.team} />
                  </FormGrid>
                  <FormGrid item xs={4}>
                    <FormAutocompleteMui {...utils.form.getFieldProps(fields, 'assignTo', control)} error={errors?.assignTo} />
                  </FormGrid>
                </FormGrid>
              </FormGrid>

              <FormGrid item xs={12}>
                <FormGrid container spacing={3}>
                  <FormGrid item xs={12}>
                    <FormText {...utils.form.getFieldProps(fields, 'taskDescription', control)} error={errors?.taskDescription} />
                  </FormGrid>
                </FormGrid>
              </FormGrid>

              <FormGrid item xs={12}>
                <FormGrid container spacing={3}>
                  <FormGrid item xs={12}>
                    <FormLegend text={utils.string.t('claims.processing.taskDetailsLabels.diarise')} />
                  </FormGrid>
                </FormGrid>
              </FormGrid>

              <FormGrid item xs={12}>
                <FormGrid container spacing={3}>
                  <FormGrid item xs={4}>
                    <FormDate {...utils.form.getFieldProps(fields, 'targetDueDate', control)} error={errors?.targetDueDate} />
                  </FormGrid>
                  <FormGrid item xs={4}>
                    <FormAutocompleteMui {...utils.form.getFieldProps(fields, 'reminder', control)} error={errors?.remainder} />
                  </FormGrid>
                </FormGrid>
              </FormGrid>
            </FormGrid>
          </FormFields>
        </FormContainer>
      </Box>
      <Box flex="0 1 auto">
        <CreateAdhocTaskFooter
          handleNext={handleSubmit(createAdHocTask)}
          handleSkipUpload={handleSubmit(skipUploadDocs)}
          handleCancel={handleCancel}
        />
      </Box>
    </Box>
  );
}
