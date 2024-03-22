import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

// app
import { showModal } from 'stores';
import { Button, Translate, FormGrid, Tooltip } from 'components';
import styles from './AddQuoteBind.styles';

// mui
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import AddIcon from '@material-ui/icons/Add';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorIcon from '@material-ui/icons/Error';
import { Box } from '@material-ui/core';

import { PRODUCT_STATUS_ERROR, PRODUCT_STATUS_WARN, PRODUCT_STATUS_OK } from 'consts';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const AddQuoteBind = ({ products }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [product, setProduct] = useState('');
  const cssClasses = makeStyles(styles, { name: 'AddQuoteBind' })();

  useEffect(() => {
    if (products?.length === 1) {
      setProduct(products?.[0]);
    }
  }, [products, products?.length]);

  const handleChange = (event) => {
    setProduct(event.target.value);
  };

  const productStatus = product?.status || PRODUCT_STATUS_OK;
  const isDisabled = product ? (productStatus === PRODUCT_STATUS_ERROR ? true : false) : true;
  const addButtonIcon = productStatus === PRODUCT_STATUS_OK ? AddIcon : productStatus === PRODUCT_STATUS_WARN ? WarningIcon : ErrorIcon;

  // ADD_EDIT_QUOTE_BIND
  const handleAddQuoteBind = () => {
    dispatch(
      showModal({
        component: 'ADD_EDIT_QUOTE_BIND',
        props: {
          title: product.label,
          fullWidth: true,
          disableBackdropClick: true,
          enableFullScreen: true,
          maxWidth: 'xl',
          componentProps: {
            product,
          },
        },
      })
    );
  };
  return (
    <FormGrid container spacing={2}>
      <FormGrid item xs={12}>
        <FormControl className={classes.formControl}>
          {products?.length === 1 ? (
            <Box className={cssClasses.defaultMenuItem}>
              <MenuItem>{products?.[0]?.label}</MenuItem>{' '}
            </Box>
          ) : (
            <Select
              labelId="select-product"
              name="select-product"
              displayEmpty
              id="select-product"
              value={product}
              onChange={handleChange}
              label="Product"
              disabled={products?.length > 0 ? false : true}
              style={{
                width: 200,
              }}
            >
              <MenuItem value="" disabled>
                <em>Select Product</em>
              </MenuItem>
              {products.map((product) => (
                <MenuItem key={product.value} value={product}>
                  {product.label}
                </MenuItem>
              ))}
            </Select>
          )}
        </FormControl>

        <Tooltip title={product?.message} placement="top" rich>
          <Button
            style={{ marginTop: 8 }}
            icon={addButtonIcon}
            color="primary"
            size="small"
            text={<Translate label="risks.addRisk" />}
            data-testid="risk-add-button"
            onClick={() => handleAddQuoteBind()}
            disabled={isDisabled}
          />
        </Tooltip>
      </FormGrid>
    </FormGrid>
  );
};

AddQuoteBind.propTypes = {
  products: PropTypes.array.isRequired,
};

export default AddQuoteBind;
