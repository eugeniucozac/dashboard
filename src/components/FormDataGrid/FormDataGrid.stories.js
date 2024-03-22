import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import reducer from 'stores';
import { Button, FormActions, FormDataGrid, FormContainer, FormFields } from 'components';
import { withKnobs, boolean, text, select } from '@storybook/addon-knobs';
import * as utils from 'utils';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { Box, Grid } from '@material-ui/core';
import merge from 'lodash/merge';

export default {
  title: 'FormDataGrid',
  component: FormDataGrid,
  decorators: [withKnobs],
};

export const Default = () => {
  const showButtonFirst = boolean('Show CopyButton First', false);
  const getStore = (obj) => {
    const enhancer = compose(applyMiddleware(thunk));
    const defaultStore = createStore(reducer, {}, enhancer);
    const preloadedState = merge(defaultStore.getState(), obj);

    // return default store if no custom JSON is passed
    if (!obj) {
      return defaultStore;
    }

    // otherwise, return new deeply-merged store with data from JSON obj
    return createStore(reducer, preloadedState, enhancer);
  };
  // prettier-ignore

  const fields = [
    {
      name: 'processing-instruction',
      type: 'array',
      arrayDefaultValues: [
        {
          UUID: 'REF-1',
          firstName: '',
          lastName: '',
          age: '',
          active: '',
          limit: null,
          'field-toggle': '',
          refer: false,
        },
        {
          UUID: 'REF-2',
          firstName: '',
          lastName: '',
          age: '',
          active: '',
          limit: null,
          'field-toggle': '',
          refer: false,
        },
        {
          UUID: 'REF-3',
          firstName: '',
          lastName: '',
          age: '',
          active: '',
          limit: null,
          'field-toggle': '',
          refer: false,
        },
      ],
      arrayItemDef: [
        {
          name: 'UUID',
          type: 'text',
          label: 'UUID',
          value: '',
          disabled: true,
          excludeCopy: true,
          width: 80,
        },
        {
          name: 'firstName',
          type: 'text',
          label: utils.string.t('market.fields.firstName'),
          value: '',
          width: 120,
          muiComponentProps: {
            InputProps: {
              classes: {
                // input: classes.input,
              },
            },
          },
          validation: Yup.string().required(utils.string.t('validation.required')),
        },
        {
          name: 'lastName',
          type: 'text',
          label: utils.string.t('market.fields.lastName'),
          value: '',
          width: 120,
          muiComponentProps: {
            InputProps: {
              classes: {
                // input: classes.input,
              },
            },
          },
        },
        {
          name: 'fullName',
          type: 'stringDisplay',
          label: 'Full Name',
          width: 120,
          valueFields: ['firstName', 'lastName'],
        },
        {
          name: 'age',
          type: 'number',
          label: 'Age',
          value: '',
          width: 80,
          muiComponentProps: {
            InputProps: {
              classes: {
                // input: classes.input,
              },
            },
          },
        },
        {
          name: 'active',
          type: 'select',
          label: 'Active',
          width: 80,
          placeholder: 'Placeholder...',
          value: '',
          optionKey: 'value',
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
            { label: 'Maybe', value: 'Maybe' },
          ],
        },
        {
          name: 'limit',
          type: 'autocompletemui',
          label: 'MUI Limit',
          width: 200,
          options: [
            { value: 1, label: 'Value 1' },
            { value: 2, label: 'Value 2' },
            { value: 3, label: 'Value 3' },
            { value: 4, label: 'Value 4' },
          ],
          value: null,
          callback: (event, data) => {
            console.log('data');
          },
        },
        {
          name: 'field-toggle',
          type: 'toggle',
          label: 'Toggle',
          value: [],
          options: [
            { label: 'yes', value: 'yes' },
            { label: 'no', value: 'no' },
          ],
          width: 120,
        },
        {
          name: 'refer',
          type: 'checkbox',
          label: utils.string.t('products.admin.facilities.referred'),
          value: false,
          defaultValue: false,
          alignCenter: true,
          width: 80,
        },
      ],
      validation: Yup.array().of(
        Yup.object().shape({
          firstName: Yup.string().required(utils.string.t('validation.required')),
          lastName: Yup.string().required(utils.string.t('validation.required')),
        })
      ),
    },
  ];

  const defaultValues = utils.form.getInitialValues(fields);
  const { control, setValue, reset, errors, handleSubmit, formState, watch } = useForm({ defaultValues });
  const formProps = { control, setValue, reset, errors, handleSubmit, formState, watch };

  useEffect(
    () => {
      reset(defaultValues);
    },
    [showButtonFirst] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const submitHandler = (values) => {
    console.log('[submit] with RHF control', values);
  };

  return (
    <Provider store={getStore()}>
      <Box width={1}>
        <Grid container>
          <Grid item xs={12}>
            <FormContainer onSubmit={handleSubmit(submitHandler)}>
              <FormFields>
                <Box display="inline-block" width="100%">
                  <FormDataGrid
                    field={utils.form.getFieldProps(fields, 'processing-instruction')}
                    formProps={formProps}
                    showCopyIconFirst={showButtonFirst}
                  />
                </Box>
              </FormFields>

              <FormActions align="left">
                <Button text="Submit" type="submit" color="primary" />
              </FormActions>
            </FormContainer>
          </Grid>
        </Grid>
      </Box>
    </Provider>
  );
};

// m

export const ProcessingInstructionDetails = () => {
  const showButtonFirst = boolean('Show CopyButton First', false);
  const getStore = (obj) => {
    const enhancer = compose(applyMiddleware(thunk));
    const defaultStore = createStore(reducer, {}, enhancer);
    const preloadedState = merge(defaultStore.getState(), obj);

    // return default store if no custom JSON is passed
    if (!obj) {
      return defaultStore;
    }

    // otherwise, return new deeply-merged store with data from JSON obj
    return createStore(reducer, preloadedState, enhancer);
  };
  // prettier-ignore

  const fields = [
    {
      name: 'processing-instruction',
      type: 'array',
      arrayDefaultValues: [
        {
          facilityReference: 'Reference-1',
          grossPremium: '',
          slipOrder: '',
          totalBrokerage: '',
          clientDiscount: '',
          thirdPartyCommissionSharing: '',
          thirdPartyName: '',
          PFInternalCommissionSharing:'',
          PFInternalDepartment:'',
          retainedBrokerage:'',
          fees:'',
          otherDeductions:'',
          settlementCurrency:'',
          paymentBasis:'',
          ppwPpc:''
        },
        {
          facilityReference: 'Reference-2',
          grossPremium: '',
          slipOrder: '',
          totalBrokerage: '',
          clientDiscount: '',
          thirdPartyCommissionSharing: '',
          thirdPartyName: '',
          PFInternalCommissionSharing:'',
          PFInternalDepartment:'',
          retainedBrokerage:'',
          fees:'',
          otherDeductions:'',
          settlementCurrency:'',
          paymentBasis:'',
          ppwPpc:''
        }, {
          facilityReference: 'Reference-3',
          grossPremium: '',
          slipOrder: '',
          totalBrokerage: '',
          clientDiscount: '',
          thirdPartyCommissionSharing: '',
          thirdPartyName: '',
          PFInternalCommissionSharing:'',
          PFInternalDepartment:'',
          retainedBrokerage:'',
          fees:'',
          otherDeductions:'',
          settlementCurrency:'',
          paymentBasis:'',
          ppwPpc:''
        },
      ],
      arrayItemDef: [
        {
          name: 'facilityReference',
          type: 'text',
          label: 'Facility Reference',
          value: '',
          disabled: true,
          excludeCopy: true,
          width: 120,
        },
        {
          name: 'grossPremium',
          type: 'number',
          label: 'Gross Premium (100%)',
          value: '',
          width: 120,
          validation: Yup.string().required(utils.string.t('validation.required')),
        },
        {
          name: 'slipOrder',
          type: 'number',
          label: 'Slip Order',
          value: '',
          width: 80,
        },
        {
          name: 'totalBrokerage',
          type: 'number',
          label: 'Total Brokerage',
          value: '',
          width: 80,
        },
       
        {
          name: 'clientDiscount',
          type: 'number',
          label: 'Client Discount (%)',
          value: '',
          width: 120,
        },
        {
          name: 'thirdPartyCommissionSharing',
          type: 'number',
          label: 'Third Party Commission Sharing (%)',
          value: '',
          width: 120,
        },
        {
          name: 'thirdPartyName',
          type: 'text',
          label: 'Third party name',
          value: '',
          width: 120,
        },
        {
          name: 'PFInternalCommissionSharing',
          type: 'number',
          label: 'PF Internal Commission Sharing (%)',
          value: '',
          width: 120,
        },
        {
          name: 'PFInternalDepartment',
          type: 'text',
          label: 'PF Internal Department',
          value: '',
          width: 120,
        },
        {
          name: 'retainedBrokerage',
          type: 'number',
          label: 'Retained Brokerage',
          value: '',
          width: 80,
        },
     
        {
          name: 'total',
          type: 'sumOfValues',
          label: 'Total',
          width: 50,
          valueFields: ['clientDiscount','thirdPartyCommissionSharing','PFInternalCommissionSharing', 'retainedBrokerage'],
        },
       
        {
          name: 'fees',
          type: 'number',
          label: 'Fees',
          value: '',
          width: 80,
        },
        {
          name: 'otherDeductions',
          type: 'number',
          label: 'Other Deductions (eg. Taxes)',
          value: '',
          width: 80,
        },
        {
          name: 'settlementCurrency',
          type: 'select',
          label: 'Settlement Currency',
          width: 80,
          placeholder: 'Placeholder...',
          value: '',
          optionKey: 'value',
          options: [
            { label: 'USD', value: 'USD' },
            { label: 'EUR', value: 'EUR' },
            { label: 'GBP', value: 'GBP' },
          ],
        },
        {
          name: 'paymentBasis',
          type: 'select',
          label: 'Payment Basis',
          width: 80,
          placeholder: 'Placeholder...',
          value: '',
          optionKey: 'value',
          options: [
            { label: 'Cash', value: 'Cash' },
            { label: 'Quarterly', value: 'Quarterly' },
            { label: 'Other Deferred', value: 'Other Deferred' },
          ],
        },
        {
          name: 'ppwPpc',
          type: 'select',
          label: 'PPW/PPC',
          width: 80,
          placeholder: 'Placeholder...',
          value: '',
          optionKey: 'value',
          options: [
            { label: 'PPW', value: 'PPW' },
            { label: 'PPC', value: 'PPC' },
          ],
        },
        

       
      ],
      validation: Yup.array().of(
        Yup.object().shape({
          firstName: Yup.string().required(utils.string.t('validation.required')),
          lastName: Yup.string().required(utils.string.t('validation.required')),
        })
      ),
    },
  ];

  const defaultValues = utils.form.getInitialValues(fields);
  const { control, setValue, reset, errors, handleSubmit, formState, watch } = useForm({ defaultValues });
  const formProps = { control, setValue, reset, errors, handleSubmit, formState, watch };

  useEffect(
    () => {
      reset(defaultValues);
    },
    [showButtonFirst] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const submitHandler = (values) => {
    console.log('[submit] with RHF control', values);
  };

  return (
    <Provider store={getStore()}>
      <Box width={1}>
        <Grid container>
          <Grid item xs={12}>
            <FormContainer onSubmit={handleSubmit(submitHandler)}>
              <FormFields>
                <Box display="inline-block" width="100%">
                  <FormDataGrid
                    field={utils.form.getFieldProps(fields, 'processing-instruction')}
                    formProps={formProps}
                    showCopyIconFirst={showButtonFirst}
                  />
                </Box>
              </FormFields>

              <FormActions align="left">
                <Button text="Submit" type="submit" color="primary" />
              </FormActions>
            </FormContainer>
          </Grid>
        </Grid>
      </Box>
    </Provider>
  );
};
