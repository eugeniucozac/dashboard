import React from 'react';
import * as Yup from 'yup';
import difference from 'lodash/difference';

// app
import { Translate } from 'components';
import * as utils from 'utils';
import config from 'config';
import { ROLE_BROKER, ROLE_COVERHOLDER, ROLE_COBROKER, ROLE_UNDERWRITER, ROLE_ADMIN } from 'consts';

const checkDependencies = (dependencies, options) => difference(dependencies, Object.keys(options)).length === 0;

const permissionOptions = [
  { value: ROLE_BROKER, label: 'Broker', fixed: false },
  { value: ROLE_COVERHOLDER, label: 'Coverholder', fixed: false },
  { value: ROLE_COBROKER, label: 'Co-Broker', fixed: false },
  { value: ROLE_UNDERWRITER, label: 'Underwriter', fixed: true },
  { value: ROLE_ADMIN, label: 'Admin', fixed: false },
];
const fixedOptions = permissionOptions.filter((option) => option.fixed);

const schema = {
  insureds: {
    key: 'insureds',
    dependenciesLoaded: (options) => checkDependencies(['countries'], options),
    items: null,
    fields: [
      {
        id: 'name',
        name: 'name',
        type: 'text',
        cellProps: {
          nowrap: true,
        },
        value: '',
        label: 'products.admin.insureds.tableCols.name',
        validation: Yup.string().required(() => utils.form.getValidationLabel('products.admin.insureds.tableCols.name', 'required')),
        gridSize: { xs: 12, sm: 5 },
      },
      {
        id: 'clientId',
        name: 'clientId',
        transform: 'option',
        type: 'autocompletemui',
        value: null,
        options: [],
        optionKey: 'value',
        optionLabel: 'label',
        cellProps: {
          nowrap: true,
        },
        defaultValue: '',
        optionsDynamicKey: 'clients',
        label: 'products.admin.facilities.tableCols.clientId',
        gridSize: { xs: 12, sm: 4 },
      },

      {
        id: 'partyType',
        name: 'partyType',
        label: 'products.admin.insureds.tableCols.partyType',
        value: [],
        type: 'autocompletemui',
        options: [
          { value: 'BUSINESS', label: 'products.admin.insureds.typeOptions.business' },
          { value: 'INDIVIDUAL', label: 'products.admin.insureds.typeOptions.individual' },
        ],
        validation: Yup.object()
          .nullable()
          .required(() => utils.form.getValidationLabel('products.admin.insureds.tableCols.partyType', 'required')),
        gridSize: { xs: 12, sm: 3 },
      },
      {
        id: 'genderType',
        name: 'genderType',
        label: 'products.admin.insureds.gender',
        value: [],
        type: 'autocompletemui',
        options: [
          { value: 'MALE', label: 'products.admin.insureds.genderOptions.male' },
          { value: 'FEMALE', label: 'products.admin.insureds.genderOptions.female' },
          { value: 'UNKNOWN', label: 'products.admin.insureds.genderOptions.unknown' },
          { value: 'NONE', label: 'products.admin.insureds.genderOptions.none' },
        ],
        conditional: {
          conditional: true,
          conditionalField: 'partyType',
          conditionValue: 'INDIVIDUAL',
        },
        gridSize: { xs: 12, md: 5 },
      },
      {
        id: 'dateOfBirth',
        name: 'dateOfBirth',
        transform: 'date',
        label: 'products.admin.insureds.dateOfBirth',
        conditional: {
          conditional: true,
          conditionalField: 'partyType',
          conditionValue: 'INDIVIDUAL',
        },
        type: 'datepicker',
        value: null,
        gridSize: { xs: 12, md: 3 },
      },
      {
        id: 'street',
        name: 'street',
        type: 'text',
        value: '',
        label: 'products.admin.insureds.tableCols.street',
        gridSize: { xs: 12, md: 5 },
      },
      {
        id: 'city',
        name: 'city',
        type: 'text',
        value: '',
        label: 'products.admin.insureds.tableCols.city',
        gridSize: { xs: 12, sm: 8, md: 4 },
      },
      {
        id: 'zipCode',
        name: 'zipCode',
        type: 'text',
        value: '',
        label: 'products.admin.insureds.tableCols.zipCode',
        gridSize: { xs: 12, sm: 4, md: 3 },
      },
      {
        id: 'county',
        name: 'county',
        type: 'text',
        value: '',
        label: 'products.admin.insureds.tableCols.county',
        gridSize: { xs: 12, sm: 4 },
      },
      {
        id: 'state',
        name: 'state',
        type: 'text',
        value: '',
        label: 'products.admin.insureds.tableCols.state',
        gridSize: { xs: 12, sm: 3 },
      },
      {
        id: 'country',
        name: 'country',
        type: 'autocompletemui',
        value: [],
        options: [],
        optionsDynamicKey: 'countries',
        label: 'products.admin.insureds.tableCols.country',
        validation: Yup.object()
          .nullable()
          .required(() => utils.form.getValidationLabel('products.admin.insureds.tableCols.country', 'required')),
        gridSize: { xs: 12, sm: 5 },
      },
      {
        id: 'distanceToCoast',
        name: 'distanceToCoast',
        type: 'hidden',
        value: '',
      },
    ],
  },
  clients: {
    key: 'clients',
    dependenciesLoaded: (options) => checkDependencies(['countries'], options),
    items: null,
    fields: [
      {
        id: 'name',
        name: 'name',
        type: 'text',
        cellProps: {
          nowrap: true,
        },
        value: '',
        label: 'products.admin.clients.tableCols.name',
        validation: Yup.string().required(() => utils.form.getValidationLabel('products.admin.clients.tableCols.name', 'required')),
        gridSize: { xs: 12, sm: 12 },
      },
      {
        id: 'street',
        name: 'street',
        type: 'text',
        value: '',
        label: 'products.admin.insureds.tableCols.street',
        gridSize: { xs: 12, md: 4 },
      },
      {
        id: 'city',
        name: 'city',
        type: 'text',
        value: '',
        label: 'products.admin.insureds.tableCols.city',
        gridSize: { xs: 12, sm: 4, md: 4 },
      },
      {
        id: 'zipCode',
        name: 'zipCode',
        type: 'text',
        value: '',
        label: 'products.admin.insureds.tableCols.zipCode',
        gridSize: { xs: 12, sm: 4, md: 4 },
      },
      {
        id: 'county',
        name: 'county',
        type: 'text',
        value: '',
        label: 'products.admin.insureds.tableCols.county',
        gridSize: { xs: 12, sm: 4 },
      },
      {
        id: 'state',
        name: 'state',
        type: 'text',
        value: '',
        label: 'products.admin.insureds.tableCols.state',
        gridSize: { xs: 12, sm: 4 },
      },
      {
        id: 'country',
        name: 'country',
        type: 'autocompletemui',
        value: null,
        options: [],
        optionKey: 'value',
        optionLabel: 'label',
        optionsDynamicKey: 'countries',
        label: 'products.admin.insureds.tableCols.country',
        validation: Yup.object()
          .nullable()
          .required(() => utils.form.getValidationLabel('products.admin.insureds.tableCols.country', 'required')),
        gridSize: { xs: 12, sm: 4 },
      },
    ],
  },
  // start
  carriers: {
    key: 'carriers',
    dependenciesLoaded: () => true,
    items: null,
    fields: [
      {
        id: 'name',
        name: 'name',
        type: 'text',
        cellProps: {
          nowrap: true,
        },
        value: '',
        label: 'products.admin.carriers.tableCols.name',
        validation: Yup.string().required(() => utils.form.getValidationLabel('products.admin.carriers.tableCols.name', 'required')),
        gridSize: { xs: 12, sm: 6 },
      },
    ],
  },
  facilities: {
    key: 'facilities',
    dependenciesLoaded: (options) => checkDependencies(['products', 'carriers'], options),
    items: null,
    fields: [
      {
        id: 'name',
        name: 'name',
        type: 'text',
        defaultValue: '',
        cellProps: {
          nowrap: true,
        },
        label: 'products.admin.facilities.tableCols.name',
        validation: Yup.string().required(() => utils.form.getValidationLabel('products.admin.facilities.tableCols.name', 'required')),
        gridSize: { xs: 12, md: 4 },
      },
      {
        id: 'brokerCode',
        name: 'brokerCode',
        cellProps: {
          nowrap: true,
        },
        type: 'text',
        label: 'products.admin.facilities.tableCols.brokerCode',
        defaultValue: '',
        validation: Yup.string().required(() =>
          utils.form.getValidationLabel('products.admin.facilities.tableCols.brokerCode', 'required')
        ),
        gridSize: { xs: 5, sm: 4, md: 2 },
      },
      {
        id: 'carrierId',
        name: 'carrierId',
        transform: 'option',
        type: 'select',
        defaultValue: '',
        options: [],
        optionsDynamicKey: 'carriers',
        label: 'products.admin.facilities.tableCols.carrierId',
        validation: Yup.string().required(() => utils.form.getValidationLabel('products.admin.facilities.tableCols.carrierId', 'required')),
        gridSize: { xs: 12, sm: 6, md: 3 },
      },
      {
        id: 'productCode',
        name: 'productCode',
        transform: 'option',
        type: 'select',
        defaultValue: '',
        options: [],
        optionKey: 'value',
        optionLabel: 'label',
        optionsDynamicKey: 'products',
        label: 'products.admin.facilities.tableCols.productCode',
        validation: Yup.string().required(() =>
          utils.form.getValidationLabel('products.admin.facilities.tableCols.productCode', 'required')
        ),
        gridSize: { xs: 12, sm: 6, md: 3 },
      },
      {
        id: 'capacity',
        name: 'capacity',
        transform: 'currency',
        defaultValue: '',
        type: 'number',
        label: 'products.admin.facilities.tableCols.capacity',
        validation: Yup.number()
          .currency(<Translate label="validation.number.format" options={config.ui.format.currency} />)
          .nullable()
          .required(() => utils.form.getValidationLabel('products.admin.facilities.tableCols.capacity', 'required'))
          .transform((value) => (Number.isNaN(value) ? null : value)),
        gridSize: { xs: 7, sm: 8, md: 4 },
      },
      {
        id: 'quoteValidDays',
        name: 'quoteValidDays',
        cellProps: {
          nowrap: true,
        },
        type: 'number',
        label: 'products.admin.facilities.tableCols.quoteValidDays',
        defaultValue: '',
        validation: Yup.number()
          .nullable()
          .min(0)
          .transform((value) => (Number.isNaN(value) ? null : value))
          .required(() => utils.form.getValidationLabel('products.admin.facilities.tableCols.quoteValidDays', 'required')),
        gridSize: { xs: 5, sm: 4, md: 2 },
      },
      {
        id: 'liveFrom',
        name: 'liveFrom',
        transform: 'date',
        cellProps: {
          nowrap: true,
        },
        type: 'datepicker',
        label: 'products.admin.facilities.tableCols.liveFrom',
        icon: 'TodayIcon',
        defaultValue: null,
        muiComponentProps: {
          fullWidth: true,
        },
        validation: Yup.date()
          .nullable()
          .required(() => utils.form.getValidationLabel('products.admin.facilities.tableCols.liveFrom', 'required')),
        gridSize: { xs: 6, md: 3 },
      },
      {
        id: 'liveTo',
        name: 'liveTo',
        transform: 'date',
        defaultValue: null,
        cellProps: {
          nowrap: true,
        },
        type: 'datepicker',
        label: 'products.admin.facilities.tableCols.liveTo',
        muiComponentProps: {
          fullWidth: true,
        },
        validation: Yup.date()
          .nullable()
          .required(() => utils.form.getValidationLabel('products.admin.facilities.tableCols.liveTo', 'required')),
        gridSize: { xs: 6, md: 3 },
      },
      {
        id: 'broker',
        name: 'broker',
        type: 'text',
        defaultValue: '',
        cellProps: {
          nowrap: true,
        },
        label: 'products.admin.facilities.tableCols.broker',
        validation: Yup.string().required(() => utils.form.getValidationLabel('products.admin.facilities.tableCols.broker', 'required')),
        gridSize: { xs: 12, md: 4 },
        displayColumn: false,
      },
      {
        id: 'coverholderName',
        name: 'coverholderName',
        type: 'text',
        defaultValue: '',
        cellProps: {
          nowrap: true,
        },
        label: 'products.admin.facilities.tableCols.coverholderName',
        validation: Yup.string().required(() =>
          utils.form.getValidationLabel('products.admin.facilities.tableCols.coverholderName', 'required')
        ),
        gridSize: { xs: 12, md: 4 },
        displayColumn: false,
      },
      {
        id: 'coverholderPin',
        name: 'coverholderPin',
        type: 'text',
        defaultValue: '',
        cellProps: {
          nowrap: true,
        },
        label: 'products.admin.facilities.tableCols.coverholderPin',
        validation: Yup.string().required(() =>
          utils.form.getValidationLabel('products.admin.facilities.tableCols.coverholderPin', 'required')
        ),
        gridSize: { xs: 12, md: 4 },
        displayColumn: false,
      },
      {
        id: 'umr',
        name: 'umr',
        type: 'text',
        defaultValue: '',
        cellProps: {
          nowrap: true,
        },
        label: 'products.admin.facilities.tableCols.umr',
        validation: Yup.string().required(() => utils.form.getValidationLabel('products.admin.facilities.tableCols.umr', 'required')),
        gridSize: { xs: 12, md: 4 },
        displayColumn: false,
      },
      {
        id: 'agreementNumber',
        name: 'agreementNumber',
        type: 'text',
        defaultValue: '',
        cellProps: {
          nowrap: true,
        },
        label: 'products.admin.facilities.tableCols.agreementNumber',
        validation: Yup.string().required(() =>
          utils.form.getValidationLabel('products.admin.facilities.tableCols.agreementNumber', 'required')
        ),
        gridSize: { xs: 12, md: 4 },
        displayColumn: false,
      },
      {
        id: 'pricerCode',
        name: 'pricerCode',
        transform: 'option',
        type: 'select',
        cellProps: {
          nowrap: true,
        },
        defaultValue: '',
        options: [],
        optionsDynamicKey: 'pricerModule',
        label: 'products.admin.facilities.tableCols.pricerModule',
        gridSize: { xs: 12, sm: 6 },
        displayColumn: false,
      },
      {
        id: 'permissionToBindGroups',
        name: 'permissionToBindGroups',
        label: 'products.admin.facilities.tableCols.permissionToBind',
        value: fixedOptions,
        type: 'autocompletemui',
        options: permissionOptions,
        gridSize: { xs: 12, sm: 6 },
        innerComponentProps: {
          isMulti: true,
          allowEmpty: true,
          maxMenuHeight: 120,
        },

        muiComponentProps: {
          multiple: true,
          variant: 'outlined',
          filterSelectedOptions: true,
        },
      },
      {
        id: 'notifiedUsers',
        name: 'notifiedUsers',
        type: 'autocompletemui',
        value: [],
        options: [],
        optionsDynamicKey: 'notifiedUsers',
        optionKey: 'email',
        optionLabel: 'name',
        label: 'products.admin.facilities.tableCols.notifiedUsers',
        gridSize: { xs: 12, sm: 6 },
        innerComponentProps: {
          isMulti: true,
          allowEmpty: true,
          maxMenuHeight: 120,
        },

        muiComponentProps: {
          multiple: true,
          filterSelectedOptions: true,
        },
      },
      {
        id: 'permissionToDismissIssuesGroups',
        name: 'permissionToDismissIssuesGroups',
        label: 'products.admin.facilities.tableCols.permissionToDismiss',
        value: fixedOptions,
        type: 'autocompletemui',
        options: permissionOptions,
        gridSize: { xs: 12, sm: 6 },
        innerComponentProps: {
          isMulti: true,
          allowEmpty: true,
          maxMenuHeight: 120,
        },

        muiComponentProps: {
          multiple: true,
          variant: 'outlined',
          filterSelectedOptions: true,
        },
      },
      {
        id: 'preBind',
        name: 'preBind',
        type: 'checkbox',
        value: false,
        label: 'products.admin.facilities.tableCols.preBindInfo',
        gridSize: { xs: 6, sm: 6 },
      },
    ],
  },
};

const schemasProductAdmin = {
  getSchema: (key) => (schema[key] ? schema[key] : {}),
};

export default schemasProductAdmin;
