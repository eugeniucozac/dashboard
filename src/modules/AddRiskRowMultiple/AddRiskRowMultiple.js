import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import compact from 'lodash/compact';
import { useFormContext, useFieldArray, useWatch } from 'react-hook-form';
import mapValues from 'lodash/mapValues';
import omit from 'lodash/omit';
import get from 'lodash/get';
import camelCase from 'lodash/camelCase';
// app
import { AddRiskRowMultipleView } from './AddRiskRowMultiple.view';
import { enqueueNotification, hideModal, showModal, getRiskAddress, getDistanceToCoast } from 'stores';
import * as utils from 'utils';
import { RISK_LOCATIONS_ACCURACY, WIND_HAIL_TEMPLATE_PATH } from 'consts';

AddRiskRowMultiple.propTypes = {
  field: PropTypes.object.isRequired,
  formProps: PropTypes.object.isRequired,
  overflow: PropTypes.bool,
  formatData: PropTypes.string,
};

AddRiskRowMultiple.defaultProps = {
  overflow: true,
};

export default function AddRiskRowMultiple({ field, formProps, overflow, formatData }) {
  const dispatch = useDispatch();
  const [isAdding, setIsAdding] = useState(false);

  const { errors, trigger } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    name: field.name,
  });

  const fieldsValues = useWatch({
    control: formProps.control,
    name: field.name,
  });

  // abort
  if (!field || !field.name || !field.arrayItemDef) return null;
  if (!formProps || !formProps.control) return null;

  const validFields = [
    'text',
    'number',
    'datepicker',
    'select',
    'autocomplete',
    'autocompletemui',
    'radio',
    'checkbox',
    'toggle',
    'hidden',
  ];

  const cols = [
    ...compact(
      field.arrayItemDef.map((def) => {
        if (!validFields.includes(def.type) || def.type === 'hidden') return null;

        return { id: def.name, label: def.label };
      })
    ),
    { id: 'delete' },
  ];

  const headers = [
    ...compact(
      field.arrayItemDef.map((def) => {
        if (def?.excelHidden || def.type === 'hidden') return null;

        return { key: def.name, label: def.label, value: camelCase(def.label) };
      })
    ),
  ];

  const launchPasteFromExcelModal = (data) => {
    dispatch(
      showModal({
        component: 'PASTE_FROM_EXCEL',
        props: {
          title: 'app.pasteFromExcel',
          fullWidth: true,
          maxWidth: 'lg',
          componentProps: {
            ...data,
            headers,
          },
        },
      })
    );
  };

  const handleDownloadExcelTeamplate = () => {
    const url = WIND_HAIL_TEMPLATE_PATH;
    const link = window.document.createElement('a');

    link.href = url;
    link.download = 'EdgeQ&BW&Hbuildingstemplate';
    window.document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  const closePasteFromExcelModal = () => {
    dispatch(hideModal('PASTE_FROM_EXCEL'));
  };

  const getEmptyObject = () => {
    return mapValues(omit(fields[0], ['id']), (value, key) => {
      const defaultValue = get(
        field.arrayItemDef.find((def) => def.name === key),
        'defaultValue'
      );

      return typeof defaultValue !== 'undefined' ? defaultValue : '';
    });
  };

  const getAddressDetails = async (address) => {
    const response = await dispatch(getRiskAddress(address));
    if (!RISK_LOCATIONS_ACCURACY.includes(response?.accuracy)) return { error: 'NO_ACCURATE_RESULT', address };

    const location = { lng: response.lng, lat: response.lat };
    const distanceToCoastResult = await dispatch(getDistanceToCoast(location));
    const streetAddress = response?.streetNumber ? `${response.streetNumber} ${response?.streetAddress}` : `${response?.streetAddress}`;

    const result = {
      city: response?.city,
      zip: response?.zip,
      county: response?.county,
      state: response?.state,
      streetAddress,
      formattedAddress: response?.outputAddress,
      distanceToCoast: distanceToCoastResult?.distanceInMiles,
      distanceToCoastInitialValue: distanceToCoastResult?.distanceInMiles,
      latitude: response?.lat,
      longitude: response?.lng,
    };

    return result;
  };

  async function asyncForEach(array, callback) {
    setIsAdding(true);
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
    setIsAdding(false);
  }

  const appendHandler = async (obj, isFromExcel = false) => {
    let formattedObj = obj;
    if (formatData === 'PROPERTY' && isFromExcel) {
      asyncForEach(obj, async (item) => {
        const zipCode = item?.zip ? ` ${item?.zip}` : '';
        const address = `${item?.streetAddress}${zipCode}`;
        const result = await getAddressDetails(address);

        if (utils.generic.isValidObject(result)) {
          if (result?.error !== 'NO_ACCURATE_RESULT') {
            const itemObj = utils.generic.formatFields(item, field?.arrayItemDef);
            const buildingObj = { ...itemObj, ...result };

            const newValue = { ...getEmptyObject(), ...buildingObj };

            append(newValue);
            validateRiskRow();
          } else {
            dispatch(
              enqueueNotification(`${result?.address} ${utils.string.t('products.multiLocation.buildingError')}`, 'error', { delay: 6000 })
            );
          }
        }
      });
    } else append(formattedObj || getEmptyObject());
  };

  const removeHandler = (idx) => {
    remove(idx);
  };

  const copyHandler = (idx) => {
    const { id, buildingTitle, ...rest } = fieldsValues[idx];

    const newValue = { ...rest };
    append(newValue);
  };

  const validateRiskRow = () => {
    trigger(field.name);
  };

  const handleAddNewObj = (obj) => {
    const newValue = { ...getEmptyObject(), ...obj };
    appendHandler(newValue);
    validateRiskRow();
  };

  return (
    <AddRiskRowMultipleView
      isAdding={isAdding}
      cols={cols}
      field={field}
      validFields={validFields}
      formProps={formProps}
      overflow={overflow}
      formatData={formatData}
      errors={errors}
      fields={fields}
      handlers={{
        launchPasteFromExcelModal,
        closePasteFromExcelModal,
        copyHandler,
        handleAddNewObj,
        removeHandler,
        appendHandler,
        handleDownloadExcelTeamplate,
      }}
    />
  );
}
