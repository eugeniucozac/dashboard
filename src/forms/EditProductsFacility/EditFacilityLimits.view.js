import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

// app
import styles from './EditProductsFacility.styles';
import { Button, FormActions, FormFields, FormGrid, Tabs, FormContainer } from 'components';
import { AddLimitsRow } from 'modules';
import { useFormActions } from 'hooks';
import * as utils from 'utils';

// mui
import { makeStyles, Box, Typography } from '@material-ui/core';

EditFacilityLimitsView.propTypes = {
  actions: PropTypes.array.isRequired,
  facilityLimitFields: PropTypes.array,
  defaultFacilityLimits: PropTypes.object,
};

export function EditFacilityLimitsView({ actions, facilityLimitFields, defaultFacilityLimits }) {
  const classes = makeStyles(styles, { name: 'EditProductsFacility' })();
  const [selectedTab, setSelectedTab] = useState(facilityLimitFields[0]?.label || '');
  const tabs = facilityLimitFields?.map((item, index) => {
    return {
      value: item.name,
      label: item.label,
    };
  });

  const validationLimit = Yup.number()
    .nullable()
    .transform((value) => (Number.isNaN(value) ? null : value))
    .required(utils.string.t('validation.required'));

  const validationAlert = Yup.number()
    .nullable()
    .min(10)
    .max(99)
    .transform((value) => (Number.isNaN(value) ? null : value))
    .required(utils.string.t('validation.required'));

  const limitsFields = utils.risk.parseFacilityLimits(defaultFacilityLimits?.fieldLimits, facilityLimitFields) || [];

  const fields = [
    {
      name: 'limits',
      type: 'array',
      arrayDefaultValues: limitsFields,
      arrayItemDef: [
        {
          name: 'fieldName',
          type: 'hidden',
        },
        {
          name: 'label',
          type: 'hidden',
        },
        {
          name: 'qualifier',
          type: 'hidden',
        },
        {
          name: 'limitFieldOptions',
          type: 'autocompletemui',
          label: selectedTab,
          value: null,
          width: 30,
        },
        {
          name: 'limit',
          type: 'number',
          label: utils.string.t('products.admin.facilities.limit'),
          value: 0,
          defaultValue: 0,
        },
        {
          name: 'alert',
          type: 'number',
          label: utils.string.t('products.admin.facilities.alert'),
          value: 0,
          defaultValue: 0,
        },
      ],
      validation: Yup.array().of(
        Yup.object().shape({
          limitFieldOptions: Yup.object().typeError(utils.string.t('validation.required')).required(utils.string.t('validation.required')),
          limit: validationLimit,
          alert: validationAlert,
        })
      ),
    },
  ];

  const defaultValues = {
    limits: [...limitsFields],
  };

  const validationSchema = utils.form.getValidationSchema(fields);
  const { control, register, reset, watch, errors, setValue, formState, handleSubmit, trigger } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
    shouldUnregister: false,
  });
  const { cancel, submit } = useFormActions(actions, reset);

  const handleChange = (val) => {
    const currentTabLabel = facilityLimitFields?.find((item, index) => item.name === val)?.label;
    setSelectedTab(currentTabLabel);
  };

  return (
    <div className={classes.root}>
      {facilityLimitFields?.length > 0 ? (
        <FormContainer type="dialog" onSubmit={handleSubmit(submit)} autoComplete="off">
          <FormFields type="dialog">
            <FormGrid container>
              <FormGrid item xs={12}>
                <Box>
                  <Tabs tabs={tabs} light={false} compact={false} swipeable={false} onChange={handleChange}>
                    {tabs.map((tab, index) => {
                      const field = JSON.parse(JSON.stringify(utils.form.getFieldProps(fields, 'limits')));
                      const facilityLimits = facilityLimitFields?.find((obj) => obj.name === tab.value);
                      field.arrayItemDef[3].options = [...facilityLimits?.options];

                      return (
                        <Box value={tab.value} key={`${tab.value}-${index}`}>
                          <AddLimitsRow
                            field={field}
                            formProps={{ control, register, watch, errors, setValue, trigger }}
                            limitFieldOptions={facilityLimits?.options}
                            fieldName={tab.value}
                            label={tab.label}
                            qualifier={facilityLimits?.qualifier}
                            overflow={false}
                            removeLastField={true}
                          />
                        </Box>
                      );
                    })}
                  </Tabs>
                </Box>
              </FormGrid>
            </FormGrid>
          </FormFields>
          <FormActions type="dialog">
            {cancel && <Button text={cancel.label} variant="text" disabled={formState.isSubmitting} onClick={cancel.handler} />}
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
      ) : (
        <FormGrid item xs={12}>
          <Typography
            variant="h2"
            style={{
              fontWeight: 500,
              color: 'darkgray',
              marginLeft: '25%',
              marginTop: '20px',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {utils.string.t('products.admin.facilities.noLimitsFields')}
          </Typography>
        </FormGrid>
      )}
    </div>
  );
}
