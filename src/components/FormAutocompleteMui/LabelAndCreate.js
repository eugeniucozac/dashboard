import { useDispatch } from 'react-redux';
import { Button } from 'components';
import { Add } from '@material-ui/icons';
import VisibilityIcon from '@material-ui/icons/Visibility';

// app
import * as utils from 'utils';
import { showModal } from 'stores';

const LabelAndCreate = ({ label, name, setValue, value, targetField }) => {
  const dispatch = useDispatch();
  const hasValueSet = value ? true : false;

  const handleCreate = {
    clientId: () => {
      hasValueSet
        ? dispatch(
            showModal({
              component: 'EDIT_PRODUCTS_CLIENT',
              props: {
                title: 'products.admin.clients.edit',
                fullWidth: true,
                maxWidth: 'lg',
                componentProps: {
                  id: value?.value,
                  isCreateClientModal: true,
                  isEdit: true,
                  submitHandler: (response) => {
                    utils.generic.isFunction(setValue) && setValue(targetField, response);
                  },
                },
              },
            })
          )
        : dispatch(
            showModal({
              component: 'ADD_PRODUCTS_CLIENT',
              props: {
                title: 'risks.createdNewClient',
                fullWidth: true,
                maxWidth: 'lg',
                componentProps: {
                  isCreateClientModal: true,
                  submitHandler: (response) => {
                    const value = {
                      value: response.id,
                      label: response?.name ? response.name : '',
                    };
                    utils.generic.isFunction(setValue) && setValue(name, value);
                    utils.generic.isFunction(setValue) && setValue(targetField, response);
                  },
                },
              },
            })
          );
    },
    insuredId: () => {
      hasValueSet
        ? dispatch(
            showModal({
              component: 'EDIT_PRODUCTS_INSURED',
              props: {
                title: 'products.admin.insureds.edit',
                fullWidth: true,
                maxWidth: 'lg',
                componentProps: {
                  id: value?.value,
                  reInsured: false,
                  isCreateInsuredModal: true,
                  isEdit: true,
                  submitHandler: (response) => {
                    utils.generic.isFunction(setValue) && setValue(targetField, response);
                  },
                },
              },
            })
          )
        : dispatch(
            showModal({
              component: 'ADD_INSURED',
              props: {
                title: 'risks.createdNewInsured',
                fullWidth: true,
                maxWidth: 'lg',
                componentProps: {
                  submitHandler: (response) => {
                    const value = {
                      value: response.id,
                      label: response?.name ? response.name : '',
                    };
                    utils.generic.isFunction(setValue) && setValue(name, value);
                    utils.generic.isFunction(setValue) && setValue(targetField, response);
                  },
                },
              },
            })
          );
    },
    reinsuredId: () => {
      hasValueSet
        ? dispatch(
            showModal({
              component: 'EDIT_PRODUCTS_INSURED',
              props: {
                title: 'products.admin.reInsureds.edit',
                fullWidth: true,
                maxWidth: 'lg',
                componentProps: {
                  id: value?.value,
                  reInsured: true,
                  isCreateInsuredModal: true,
                  isEdit: true,
                  submitHandler: (response) => {
                    utils.generic.isFunction(setValue) && setValue(targetField, response);
                  },
                },
              },
            })
          )
        : dispatch(
            showModal({
              component: 'ADD_INSURED',
              props: {
                title: 'risks.createdNewReInsured',
                fullWidth: true,
                maxWidth: 'lg',
                componentProps: {
                  reInsured: true,
                  submitHandler: (response) => {
                    const value = {
                      value: response.id,
                      label: response?.name ? response.name : '',
                    };
                    utils.generic.isFunction(setValue) && setValue(name, value);
                    utils.generic.isFunction(setValue) && setValue(targetField, response);
                  },
                },
              },
            })
          );
    },
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
      <span>{label}</span>

      <Button
        icon={hasValueSet ? VisibilityIcon : Add}
        size="xsmall"
        text={hasValueSet ? `View` : `Add new`}
        variant="contained"
        color="primary"
        onClick={() => utils.generic.isFunction(handleCreate[name]) && handleCreate[name]()}
      />
    </div>
  );
};

export default LabelAndCreate;
