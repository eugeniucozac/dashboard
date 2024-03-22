import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useWatch } from 'react-hook-form';
import get from 'lodash/get';
import moment from 'moment';

// app
import styles from './AddRiskFormField.styles';
import { AddRiskFormFieldView } from './AddRiskFormField.view';
import { getClient, getInsured, selectUser } from 'stores';
import * as utils from 'utils';
// mui
import { makeStyles } from '@material-ui/core';

AddRiskFormField.propTypes = {
  field: PropTypes.object.isRequired,
  formProps: PropTypes.object.isRequired,
  handleUpdateObject: PropTypes.func,
};

export default function AddRiskFormField({ field, formProps, handleUpdateObject }) {
  const { control, register, watch, errors, setValue, trigger } = formProps;
  const classes = makeStyles(styles, { name: 'AddRiskFormField' })();
  const dispatch = useDispatch();
  const riskProductsSelected = useSelector((store) => store.risk.products.selected);
  const user = useSelector(selectUser);
  const endpoint = useSelector((state) => get(state, 'config.vars.endpoint'));
  const { auth } = user;

  const calculateFieldsValues = useWatch({
    control,
    name: field?.calculate,
  });

  const calculateField = field?.calculate?.length > 0 ? true : false;

  useEffect(() => {
    let isSubscribed = true;

    const fetchData = async () => {
      try {
        const data = {
          ...calculateFieldsValues,
          riskType: riskProductsSelected,
        };

        const response = await utils.api.post({
          token: auth.accessToken,
          endpoint: endpoint.auth,
          path: `api/v1/products/${riskProductsSelected}/calculate/${field.name}`,
          data,
        });
        const responseData = await utils.api.handleResponse(response);
        isSubscribed && responseData?.result && setValue(field.name, responseData.result);
      } catch (err) {
        const errorParams = {
          file: 'AddRiskForm field, calculate',
          message: 'API fetch error',
        };

        utils.api.handleError(err, errorParams);
      }
    };

    const isAllDefined = Object.keys(calculateFieldsValues).every((key) => Boolean(calculateFieldsValues[key]));

    if (isAllDefined && calculateField) {
      fetchData();
    }

    return () => (isSubscribed = false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calculateFieldsValues, calculateField]);

  // abort
  if (!field || !field.name || !field.type) return null;
  if (!formProps || !formProps.control) return null;

  const checkboxProps = field.type === 'checkbox' ? { register, watch } : {};
  const selectProps = field.type === 'select' ? { nestedClasses: { root: classes.select } } : {};

  field.error = get(errors, field.name);

  if (field.type === 'autocomplete') {
    field.handleUpdate = (id, value) => {
      setValue(id, value);
      trigger(id);
    };
  }

  if (field?.targetField) {
    field.callback = async (e, item) => {
      switch (field.name) {
        case 'clientId': {
          const client = await dispatch(getClient(item?.value));
          utils.generic.isFunction(handleUpdateObject) && handleUpdateObject(field.targetField, client);
          break;
        }
        case 'insuredId': {
          const insured = await dispatch(getInsured(item?.value, false));
          utils.generic.isFunction(handleUpdateObject) && handleUpdateObject(field.targetField, insured);
          break;
        }
        case 'reinsuredId': {
          const reInsured = await dispatch(getInsured(item?.value, true));
          utils.generic.isFunction(handleUpdateObject) && handleUpdateObject(field.targetField, reInsured);
          break;
        }

        default:
          break;
      }
    };
  }

  if (field.name === 'inceptionDate') {
    field.handleUpdate = (id, value) => {
      const values = control.getValues();

      if (Object.keys(values).includes('expiryDate')) {
        setValue('expiryDate', moment(value).add(1, 'y').toISOString());
        trigger('expiryDate');
      }
    };
  }

  return (
    <AddRiskFormFieldView field={field} control={control} setValue={setValue} checkboxProps={checkboxProps} selectProps={selectProps} />
  );
}
