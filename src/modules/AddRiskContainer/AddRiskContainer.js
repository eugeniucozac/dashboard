import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

// app
import { AddRiskContainerView } from './AddRiskContainer.view';
import {
  getRiskProducts,
  getRiskDefinitions,
  selectRiskDefinitionsFieldsByType,
  selectRiskFieldOptionsByType,
  selectRiskProduct,
  resetRiskProduct,
  getClients,
  getInsureds,
  getReinsureds,
  selectPartyOptions,
} from 'stores';
import * as utils from 'utils';

AddRiskContainer.propTypes = {
  handleClose: PropTypes.func.isRequired,
};

AddRiskContainer.defaultProps = {
  handleClose: () => {},
};

export default function AddRiskContainer({ handleClose }) {
  const dispatch = useDispatch();
  const riskProducts = useSelector((store) => store.risk.products.items);
  const riskProductsSelected = useSelector((store) => store.risk.products.selected);
  const riskProductsLoading = useSelector((store) => store.risk.products.loading);
  const riskDefinitionsFieldsByType = useSelector(selectRiskDefinitionsFieldsByType(riskProductsSelected));
  const riskFieldOptionsByType = useSelector(selectRiskFieldOptionsByType(riskProductsSelected));
  const partyOptions = useSelector(selectPartyOptions);
  const countries = riskFieldOptionsByType?.countryOfOrigin ? riskFieldOptionsByType.countryOfOrigin : [];

  useEffect(
    () => {
      dispatch(getRiskProducts());
      dispatch(getClients({ size: 1000 }));
      dispatch(getInsureds({ size: 1000 }));
      dispatch(getReinsureds({ size: 1000 }));

      // cleanup
      return () => {
        dispatch(resetRiskProduct());
      };
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleChangeProductType = (name, value) => {
    const type = value === '__placeholder__' ? '' : value;

    dispatch(selectRiskProduct(type));
    if (type && (utils.generic.isInvalidOrEmptyArray(riskDefinitionsFieldsByType) || utils.generic.isInvalidOrEmptyArray(countries))) {
      dispatch(getRiskDefinitions(type));
    }
  };

  return (
    <AddRiskContainerView
      productList={riskProducts}
      productSelected={riskProductsSelected}
      fields={utils.risk.parseFields(riskDefinitionsFieldsByType, {
        ...partyOptions,
        countryOfOrigin: countries,
      })}
      hasCountryOfOrigin={countries.length ? true : false}
      isLoading={riskProductsLoading}
      handleClose={handleClose}
      handleChangeProductType={handleChangeProductType}
    />
  );
}
