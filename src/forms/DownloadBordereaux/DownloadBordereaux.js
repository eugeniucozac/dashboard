import * as React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import * as Yup from 'yup';
import get from 'lodash/get';
import moment from 'moment';

// app
import { DownloadBordereauxView } from './DownloadBordereaux.view';
import {
  downloadRiskBordereaux,
  getRiskProductsWithReports,
  getRiskFacilities,
  selectFacilitiesListItems,
  selectProductsWithReportsSorted,
  selectDownloadStatus,
} from 'stores';
import * as utils from 'utils';

DownloadBordereaux.propTypes = {
  handleClose: PropTypes.func.isRequired,
};

export default function DownloadBordereaux({ handleClose }) {
  const dispatch = useDispatch();
  const productsWithReports = useSelector(selectProductsWithReportsSorted);
  const riskProductsLoading = useSelector((state) => get(state, 'risk.productsWithReports.loading'));
  const riskFacilitiesItems = useSelector(selectFacilitiesListItems);
  const download = useSelector(selectDownloadStatus);
  const [productSelected, setProductSelected] = React.useState();
  const [, setDownloadTypeSelected] = React.useState();
  const [reportsOptions, setReportsOptions] = React.useState([]);

  const products = productsWithReports.map((product) => ({
    value: product.value,
    label: product.label,
  }));

  const facilities = riskFacilitiesItems.filter((facility) => facility.productCode === productSelected);

  React.useEffect(() => {
    if (products?.length === 1) {
      setProductSelected(products[0].value);
    }
  }, [products]);

  React.useEffect(
    () => {
      !utils.generic.isValidArray(productsWithReports, true) && dispatch(getRiskProductsWithReports());
      dispatch(getRiskFacilities({ size: 1000 }));
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  React.useEffect(
    () => {
      if (productSelected) {
        setReportsOptions(
          riskProductsLoading
            ? []
            : get(
                productsWithReports.find((product) => product.value === productSelected),
                'reports'
              )
        );
      }
    },
    [productSelected, riskProductsLoading] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleSubmit = (data) => {
    return dispatch(downloadRiskBordereaux(data));
  };

  const handleCancel = () => {
    if (utils.generic.isFunction(handleClose)) {
      handleClose();
    }
  };

  const fields = [
    [
      {
        gridSize: { xs: 12 },
        id: 'product',
        name: 'product',
        transform: 'option',
        type: 'select',
        value: products?.length === 1 && products[0]?.value ? products[0].value : '',
        options: products,
        label: utils.string.t('products.product'),
        muiComponentProps: {
          disabled: !utils.generic.isValidArray(products, true),
        },
        validation: Yup.string().required(utils.string.t('validation.required')),
        handleUpdate: (name, value) => setProductSelected(value),
      },
      {
        gridSize: { xs: 9 },
        id: 'type',
        name: 'type',
        type: 'select',
        value: '',
        options: reportsOptions,
        label: utils.string.t('products.report'),
        handleUpdate: (name, value) => setDownloadTypeSelected(value),
        muiComponentProps: {
          disabled: !productSelected || !utils.generic.isValidArray(reportsOptions, true),
        },
        validation: Yup.string().required(utils.string.t('validation.required')),
      },
      {
        gridSize: { xs: 3 },
        id: 'onlyBound',
        name: 'onlyBound',
        title: utils.string.t('products.boundOnly'),
        type: 'checkbox',
        value: false,

        conditional: {
          conditional: true,
          conditionalField: 'type',
          conditionValue: 'DATA_DUMP',
        },
      },

      {
        gridSize: { xs: 12 },
        id: 'facility',
        name: 'facility',
        type: 'select',
        value: '',
        options: facilities,
        optionKey: 'id',
        optionLabel: 'name',
        label: utils.string.t('products.facility'),
        hint: utils.string.t('products.facilityHint'),
        muiComponentProps: {
          disabled: !productSelected || !utils.generic.isValidArray(facilities, true),
        },
        validation: Yup.string(),
      },
      {
        gridSize: { xs: 12, sm: 6 },
        type: 'datepicker',
        icon: 'TodayIcon',
        name: 'from',
        label: utils.string.t('form.dateFrom.label'),
        value: null,
        muiComponentProps: {
          fullWidth: true,
        },
        muiPickerProps: {
          views: ['year', 'month'],
          format: 'MMMM YYYY',
        },
        validation: Yup.string()
          .nullable()
          .required(utils.string.t('form.dateFrom.required'))
          .test('from', utils.string.t('form.dateFrom.mustBeSameOrBeforeTo'), function (value) {
            return value && this.options.parent.to ? moment(value).isSameOrBefore(this.options.parent.to) : true;
          }),
      },
      {
        gridSize: { xs: 12, sm: 6 },
        type: 'datepicker',
        name: 'to',
        label: utils.string.t('form.dateTo.label'),
        value: null,
        muiComponentProps: {
          fullWidth: true,
        },
        muiPickerProps: {
          views: ['year', 'month'],
          format: 'MMMM YYYY',
        },
        validation: Yup.string()
          .nullable()
          .required(utils.string.t('form.dateTo.required'))
          .test('from', utils.string.t('form.dateTo.mustBeSameOrAfterFrom'), function (value) {
            return value && this.options.parent.from ? moment(value).isSameOrAfter(this.options.parent.from) : true;
          }),
      },
    ],
  ];

  const actions = [
    {
      name: 'submit',
      label: utils.string.t('app.download'),
      handler: handleSubmit,
    },
    {
      name: 'cancel',
      label: utils.string.t('app.cancel'),
      handler: handleCancel,
    },
  ];

  return <DownloadBordereauxView fields={fields} actions={actions} loading={riskProductsLoading} download={download} />;
}
