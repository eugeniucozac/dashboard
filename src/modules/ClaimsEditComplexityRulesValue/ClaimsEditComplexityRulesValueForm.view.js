import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

//app
import styles from './ClaimsEditComplexityRulesValue.styles';
import { FormContainer, FormGrid, FormText } from 'components';
import { selectComplexityBasisValueId, selectComplexityReferralValueId } from 'stores';
import * as utils from 'utils';

//mui
import { makeStyles } from '@material-ui/core';

ClaimsEditComplexityRulesValueFormView.prototypes = {
  isComplexityActive: PropTypes.bool.isRequired,
  handleEditValues: PropTypes.func.isRequired,
};
export function ClaimsEditComplexityRulesValueFormView({ isComplexityActive, handleEditValues }) {
  const classes = makeStyles(styles, { name: 'ClaimsEditComplexityRulesValue' })();

  const currentComplexity = useSelector(selectComplexityBasisValueId);
  const currentReferral = useSelector(selectComplexityReferralValueId);

  const editFields = [
    {
      name: 'editComplexityValue',
      type: 'text',
      value: (isComplexityActive ? currentComplexity?.complexityRulesValue : currentReferral?.complexityRulesValue) || '',
      muiComponentProps: {
        classes: {
          root: classes.formInput,
        },
      },
      validation: Yup.string().trim().required(utils.string.t('validation.required')).max(75, utils.string.t('validation.string.max')),
    },
  ];

  const defaultValues = utils.form.getInitialValues(editFields);
  const validationSchema = utils.form.getValidationSchema(editFields);
  const { control, errors, handleSubmit, watch } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });
  const complexityRulesValue = watch('editComplexityValue');

  useEffect(() => {
    handleSubmit(handleEditValues({ complexityRulesValue, isComplex: 1 }));
  }, [complexityRulesValue]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <FormContainer onSubmit={handleSubmit} className={classes.formcontainer}>
      <FormGrid container spacing={0} className={classes.editcomplexityruleForm}>
        <FormGrid item xs={6}>
          <FormText {...utils.form.getFieldProps(editFields, 'editComplexityValue', control)} error={errors.editComplexityValue} />
        </FormGrid>
      </FormGrid>
    </FormContainer>
  );
}
