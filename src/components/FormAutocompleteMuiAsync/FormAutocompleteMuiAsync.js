/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useFormContext } from 'react-hook-form';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';

// app
import { selectUser } from 'stores';
import * as utils from 'utils';

// app
import FormAutocompleteMuiAsyncView from './FormAutocompleteMuiAsync.view';

FormAutocompleteMuiAsync.propTypes = {
  control: PropTypes.object,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  optionKey: PropTypes.string.isRequired,
  optionLabel: PropTypes.string.isRequired,
  optionsCreatable: PropTypes.bool,
  optionsFetch: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  defaultValue: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  label: PropTypes.string,
  placeholder: PropTypes.string,
  hint: PropTypes.string,
  error: PropTypes.shape({
    message: PropTypes.string,
    type: PropTypes.string,
  }),
  muiComponentProps: PropTypes.object,
  callback: PropTypes.func,
};

FormAutocompleteMuiAsync.defaultProps = {
  muiComponentProps: {},
  options: [],
  optionKey: 'value',
  optionLabel: 'label',
  value: null,
  defaultValue: null,
};

export default function FormAutocompleteMuiAsync(props) {
  const { setValue, watch } = useFormContext();
  const [dependentFieldsState, setDependentFieldsState] = useState(props?.dependentFieldsValues);
  const [componentOptions, setComponentOptions] = useState([]);
  const { dataIndex, dataSource, dataIncludeCustom, dependants, dependentFieldsValues, name } = props;
  const product = useSelector((state) => get(state, 'risk.products.selected'));
  const user = useSelector(selectUser);
  const endpoint = useSelector((state) => get(state, 'config.vars.endpoint'));
  const { auth } = user;
  const isMultiple = props?.muiComponentProps?.multiple;

  useEffect(() => {
    if (isEqual(dependentFieldsValues, dependentFieldsState)) return;

    setDependentFieldsState(dependentFieldsValues);
  }, [dependentFieldsValues]);

  useEffect(() => {
    let isSubscribed = true;

    const fetchData = async () => {
      try {
        const response = await utils.api.get({
          token: auth.accessToken,
          endpoint: endpoint.auth,
          path: `api/v1/products/${product}/data/${dataIndex}`,
          params: { dataSource: dataSource },
        });
        const data = await utils.api.handleResponse(response);
        isSubscribed && setComponentOptions(data);
      } catch (err) {
        const errorParams = {
          file: 'FormAutocompleteMuiAsync.js',
          message: 'API fetch error, initial fetchData',
        };

        utils.api.handleError(err, errorParams);
      }
    };
    dependants.length === 0 && fetchData();

    return () => (isSubscribed = false);
  }, []);

  useEffect(() => {
    let isSubscribed = true;

    const fetchData = async () => {
      try {
        let restrictBy = ``;
        for (const dependant of dependants) {
          const [dependantIndex, depandantName] = dependant.split(':');
          restrictBy = `${restrictBy}${dependantIndex}:${dependentFieldsState[depandantName]?.value};`;
        }
        const response = await utils.api.get({
          token: auth.accessToken,
          endpoint: endpoint.auth,
          path: `api/v1/products/${product}/data/${dataIndex}`,
          params: {
            dataSource,
            restrictBy: encodeURIComponent(restrictBy),
            ...(dataIncludeCustom ? { includeCustom: dataIncludeCustom } : {}),
          },
        });
        const data = await utils.api.handleResponse(response);

        const selectedValue = watch(name);
        isSubscribed && setComponentOptions(data);

        if (utils.generic.isValidArray(data, true) && selectedValue) {
          const foundInOptions = isMultiple
            ? selectedValue.every((item) => data.find((dataItem) => dataItem?.value === item?.value || dataItem?.value === item))
            : data.find((item) => selectedValue?.value === item?.value || selectedValue === item?.value) || false;

          if (!Boolean(foundInOptions) && isSubscribed) setValue(name, isMultiple ? [] : null);
        }
      } catch (err) {
        const errorParams = {
          file: 'FormAutocompleteMuiAsync.js',
          message: 'API fetch error',
        };

        utils.api.handleError(err, errorParams);
      }
    };
    const isAllDefined = Object.keys(dependentFieldsState).every((key) => utils.generic.isValidObject(dependentFieldsState[key]));
    if (isAllDefined && dependants.length > 0) {
      isSubscribed && setComponentOptions([]);
      fetchData();
    }

    return () => (isSubscribed = false);
  }, [dependentFieldsState]);

  return <FormAutocompleteMuiAsyncView componentOptions={componentOptions} {...props} />;
}
