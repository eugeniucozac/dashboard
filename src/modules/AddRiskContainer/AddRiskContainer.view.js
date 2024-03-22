import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './AddRiskContainer.styles';
import { ReactComponent as IconSearchFile } from '../../assets/svg/line-icon-search-file.svg';
import { Empty, FormSelect } from 'components';
import { AddRisk } from 'forms';
import * as utils from 'utils';

// mui
import { Box, CircularProgress, Collapse, Fade, Typography, makeStyles } from '@material-ui/core';

AddRiskContainerView.propTypes = {
  productList: PropTypes.array.isRequired,
  productSelected: PropTypes.string.isRequired,
  fields: PropTypes.array.isRequired,
  hasCountryOfOrigin: PropTypes.bool,
  isLoading: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
  handleChangeProductType: PropTypes.func.isRequired,
};

export function AddRiskContainerView({
  productList,
  productSelected,
  fields,
  hasCountryOfOrigin,
  isLoading,
  handleClose,
  handleChangeProductType,
}) {
  const classes = makeStyles(styles, { name: 'AddRiskContainer' })({ loading: isLoading });
  const hasFields = Boolean(productSelected && utils.generic.isValidArray(fields, true) && hasCountryOfOrigin);

  return (
    <div className={classes.root}>
      <Fade in={!hasFields}>
        <Collapse in={!hasFields}>
          <Box mt={-14}>
            <Empty
              title={utils.string.t('risks.formHint.title')}
              text={utils.string.t('risks.formHint.text')}
              icon={<IconSearchFile />}
              bg={false}
              width={300}
            >
              <FormSelect
                name="product"
                value={productSelected || '__placeholder__'}
                options={[
                  {
                    label: (
                      <div className={classes.productLoading}>
                        <Fade timeout={300} in={isLoading}>
                          <Box mr={1.2} display="flex">
                            <CircularProgress size={18} className={classes.productLoadingCircular} />
                          </Box>
                        </Fade>
                        <div className={classes.productLoadingText}>
                          <Fade timeout={500} in={isLoading}>
                            <div>{isLoading && utils.string.t('app.loading').toLowerCase()}</div>
                          </Fade>
                          <Fade timeout={500} in={!isLoading}>
                            <div>{!isLoading && utils.string.t('risks.chooseProduct')}</div>
                          </Fade>
                        </div>
                      </div>
                    ),
                    value: '__placeholder__',
                    placeholder: true,
                  },
                  ...productList.map((product) => ({
                    label: product.label,
                    value: product.value,
                  })),
                ]}
                muiComponentProps={{
                  fullWidth: false,
                }}
                handleUpdate={handleChangeProductType}
                testid="select-product-type"
              />
              {productSelected && utils.generic.isValidArray(fields, true) ? (
                hasCountryOfOrigin ? null : (
                  <Typography variant="body2" color="error">
                    {`${utils.string.t('products.error.noCountryOfOrigin')}`}
                  </Typography>
                )
              ) : null}
            </Empty>
          </Box>
        </Collapse>
      </Fade>

      {hasFields && <AddRisk key={productSelected} fields={fields} type={productSelected} handleClose={handleClose} />}
    </div>
  );
}
