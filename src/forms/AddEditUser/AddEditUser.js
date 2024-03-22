import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import debounce from 'lodash/debounce';

// app
import { Loader } from 'components';
import config from 'config';
import {
  createUser,
  createUserProgrammes,
  editUser,
  getCarriersProgrammes,
  getClientsProgrammes,
  getParentOfficeListAll,
  getProductsProgrammes,
  selectAdminOffices,
  selectRefDataDepartments,
  getUserProgrammes,
  selectProgrammesCarriersSorted,
  selectProgrammesClientsSorted,
  selectProgrammesProductsSorted,
  emailSearch,
  patchUserProgrammes,
} from 'stores';
import { AddEditUserView } from './AddEditUser.view';
import * as utils from 'utils';

export default function AddUser({ handleClose, user = {} }) {
  const [userProgrammesData, setUserProgrammesData] = useState(null);
  const [programmesUserId, setProgrammesUserId] = useState(user?.programmesUserId);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingProgrammesUser, setIsLoadingProgrammesUser] = useState();

  const { emailId } = user;
  const dispatch = useDispatch();
  const refDataDepartments = useSelector(selectRefDataDepartments);
  const officeList = useSelector(selectAdminOffices);
  const isLoadingOffice = useSelector((state) => state.admin.parentOfficeListAll.loading);

  const userEdgeId = user?.id;

  const programmesProducts = useSelector(selectProgrammesProductsSorted) || [];
  const programmesClients = useSelector(selectProgrammesClientsSorted) || [];
  const programmesCarriers = useSelector(selectProgrammesCarriersSorted) || [];
  const isLoadingProducts = useSelector((state) => state.admin.programmesProductsList.loading);
  const isLoadingClients = useSelector((state) => state.admin.programmesClientList.loading);
  const isLoadingCarriers = useSelector((state) => state.admin.programmesCarriersList.loading);

  useEffect(() => {
    const allFieldsLoaded = [isLoadingOffice, isLoadingProducts, isLoadingClients, isLoadingCarriers, isLoadingProgrammesUser].every(
      (v) => v === false
    );
    setIsLoading(!allFieldsLoaded);
  }, [isLoadingOffice, isLoadingProducts, isLoadingClients, isLoadingCarriers, isLoadingProgrammesUser]);

  useEffect(
    () => {
      dispatch(getParentOfficeListAll());
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(
    () => {
      if (programmesUserId) {
        const getUserProgrammesData = async () => {
          const userData = await dispatch(getUserProgrammes(programmesUserId));
          const { carriers, clients, products, coverholder, id } = userData;
          setUserProgrammesData({ carriers, clients, products, coverholder, id });
          setIsLoadingProgrammesUser(false);
        };
        setIsLoadingProgrammesUser(true);
        getUserProgrammesData();
      } else setIsLoadingProgrammesUser(false);
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(
    () => {
      if (programmesUserId) {
        !utils.generic.isValidArray(programmesProducts, true) && dispatch(getProductsProgrammes());
        !utils.generic.isValidArray(programmesClients, true) && dispatch(getClientsProgrammes());
        !utils.generic.isValidArray(programmesCarriers, true) && dispatch(getCarriersProgrammes());
      }
    },
    [programmesUserId] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleAddToProgrammes = async () => {
    if (user.id) {
      const result = await dispatch(createUserProgrammes(user.id));
      setProgrammesUserId(result.programmesUserId);
    }
    return;
  };

  const handleSubmit = (updatedUser) => {
    if (user.id) {
      if (programmesUserId) {
        const { products, clients, carriers, coverholder, isAdmin, firstName, lastName, emailId, role } = updatedUser;
        const programmesData = {
          ...(products && { products: products.map((product) => product.value) }),
          ...(clients && { clients: clients.map((client) => client.id) }),
          ...(carriers && { carriers: carriers.map((carrier) => carrier.id) }),
          emailId,
          coverholder,
          fullName: `${firstName} ${lastName}`,
          isAdmin,
          role,
        };
        dispatch(patchUserProgrammes(programmesUserId, programmesData));
      }
      return dispatch(editUser(updatedUser, user));
    } else {
      return dispatch(createUser(updatedUser));
    }
  };

  const handleCancel = () => {
    if (utils.generic.isFunction(handleClose)) {
      handleClose();
    }
  };

  const emailCheck = async (value, resolve) => {
    if (!value) return resolve(false);
    if (value === emailId) return resolve(true);

    try {
      const existingAccounts = await dispatch(emailSearch(value));
      resolve(existingAccounts.length === 0);
    } catch (error) {
      resolve(false);
    }
  };

  const emailCheckDebounced = debounce(emailCheck, config.ui.autocomplete.delay);

  const userFields = [
    {
      name: 'firstName',
      label: utils.string.t('admin.form.firstName.label'),
      value: user.firstName || '',
      type: 'text',
      validation: Yup.string().required(utils.string.t('validation.required')),
    },
    {
      name: 'lastName',
      label: utils.string.t('admin.form.lastName.label'),
      value: user.lastName || '',
      type: 'text',
      validation: Yup.string().required(utils.string.t('validation.required')),
    },
    {
      name: 'departments',
      label: utils.string.t('admin.form.departments.label'),
      type: 'autocomplete',
      value: (user.departmentIds && user.departmentIds.map((id) => utils.referenceData.departments.getById(refDataDepartments, id))) || [],
      options: refDataDepartments,
      optionKey: 'id',
      optionLabel: 'name',
      muiComponentProps: {
        multiple: true,
        'data-testid': 'department',
      },
      innerComponentProps: {
        isMulti: true,
        maxMenuHeight: 120,
      },
    },
    {
      name: 'role',
      label: utils.string.t('admin.form.role.label'),
      value: user.role || '',
      type: 'select',
      options: utils.user.getRolesString(),
      validation: Yup.string().required(utils.string.t('validation.required')),
    },
    {
      name: 'isAdmin',
      type: 'switch',
      value: user.isAdmin || false,
      title: utils.string.t('admin.form.admin.label'),
    },
    {
      name: 'isReportAdmin',
      type: 'switch',
      value: user.isReportAdmin || false,
      title: utils.string.t('admin.form.reportsAdmin.label'),
    },
    {
      name: 'emailId',
      label: utils.string.t('admin.form.email.label'),
      value: user.emailId || '',
      type: 'text',
      validation: Yup.string()
        .email(utils.string.t('validation.email'))
        .required(utils.string.t('validation.required'))
        .test(
          'emailId',
          utils.string.t('validation.emailAlreadyInUse'),
          async (value) => new Promise((resolve) => emailCheckDebounced(value, resolve))
        ),
    },
    {
      name: 'contactPhone',
      label: utils.string.t('admin.form.phone.label'),
      value: user.contactPhone || '',
      type: 'text',
    },
    {
      name: 'offices',
      label: utils.string.t('admin.form.clientOffice.label'),
      type: 'autocomplete',
      value: (user.offices && user.offices.map((office) => utils.client.offices.getById(officeList, office.id))) || [],
      options: officeList,
      optionKey: 'id',
      optionLabel: 'name',
      muiComponentProps: {
        multiple: true,
        'data-testid': 'offices',
      },

      innerComponentProps: {
        isMulti: true,
        maxMenuHeight: 80,
      },
    },
  ];

  const userProgrammesProducts =
    userProgrammesData?.products && programmesProducts
      ? programmesProducts?.filter((product) => userProgrammesData.products.includes(product.value))
      : [];

  const userProgrammesClients =
    userProgrammesData?.clients && programmesClients
      ? programmesClients?.filter((client) => userProgrammesData.clients.includes(client.id))
      : [];

  const userProgrammesCarriers =
    userProgrammesData?.carriers && programmesCarriers
      ? programmesCarriers?.filter((carrier) => userProgrammesData.carriers.includes(carrier.id))
      : [];

  const programmesFields = [
    {
      name: 'coverholder',
      title: utils.string.t('admin.form.coverholderRole.label'),
      value: userProgrammesData?.coverholder ? true : false,
      type: 'switch',
    },
    {
      name: 'products',
      label: utils.string.t('admin.form.products.labelProducts'),
      type: 'autocomplete',
      key: `products-${programmesProducts.length}-${userProgrammesProducts.length}`,
      defaultValue: userProgrammesProducts,
      options: programmesProducts,
      optionKey: 'value',
      optionLabel: 'label',
      muiComponentProps: {
        multiple: true,
        'data-testid': 'products',
      },
      innerComponentProps: {
        isMulti: true,
        maxMenuHeight: 120,
      },
      validation: Yup.array().required(utils.string.t('validation.required')),
    },
    {
      key: `clients-${programmesClients.length}--${userProgrammesClients.length}`,
      name: 'clients',
      label: utils.string.t('admin.form.clients.label'),
      type: 'autocomplete',
      defaultValue: userProgrammesClients,
      options: programmesClients || [],
      optionKey: 'id',
      optionLabel: 'name',
      muiComponentProps: {
        multiple: true,
        'data-testid': 'clients',
      },
      innerComponentProps: {
        isMulti: true,
        maxMenuHeight: 120,
      },
      validation: Yup.array().test('clients', utils.string.t('validation.requiredClientOrCarrier'), function (value) {
        return utils.generic.isValidArray(this.options.parent.carriers, true) || utils.generic.isValidArray(value, true) ? true : false;
      }),
    },
    {
      key: `carriers-${programmesCarriers.length}--${userProgrammesCarriers.length}`,
      name: 'carriers',
      label: utils.string.t('admin.form.carriers.label'),
      type: 'autocomplete',
      defaultValue: userProgrammesCarriers,
      options: programmesCarriers || [],
      optionKey: 'id',
      optionLabel: 'name',
      muiComponentProps: {
        multiple: true,
        'data-testid': 'carriers',
      },
      innerComponentProps: {
        isMulti: true,
        maxMenuHeight: 120,
      },
      validation: Yup.array().test('carriers', utils.string.t('validation.requiredClientOrCarrier'), function (value) {
        return utils.generic.isValidArray(this.options.parent.clients, true) || utils.generic.isValidArray(value, true) ? true : false;
      }),
    },
  ];

  const actions = [
    {
      name: 'submit',
      label: user.id ? utils.string.t('app.save') : utils.string.t('app.create'),
      handler: handleSubmit,
    },
    {
      name: 'cancel',
      label: utils.string.t('app.cancel'),
      handler: handleCancel,
    },
  ];

  const fields = programmesUserId ? [...userFields, ...programmesFields] : [...userFields];

  return isLoading ? (
    <div style={{ height: 500 }}>
      <Loader visible={isLoading} absolute />
    </div>
  ) : (
    <AddEditUserView
      actions={actions}
      fields={fields}
      userId={userEdgeId}
      programmes={{ programmesUserId, handleAddToProgrammes }}
      isLoading={isLoading}
    />
  );
}
