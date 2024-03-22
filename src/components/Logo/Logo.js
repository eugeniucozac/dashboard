import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import get from 'lodash/get';

// app
import { LogoView } from './Logo.view';
import * as constants from 'consts';
import { ReactComponent as LogoPriceForbes } from '../../assets/svg/logo-edge-priceforbes.svg';
import { ReactComponent as LogoBishopsgate } from '../../assets/svg/logo-edge-bishopsgate.svg';

Logo.propTypes = {
  height: PropTypes.number,
};

Logo.defaultProps = {
  height: 20,
};

export default function Logo({ height, className }) {
  const uiBrand = useSelector((state) => get(state, 'ui.brand'));

  let component;

  if (uiBrand === constants.BRAND_PRICEFORBES) {
    component = LogoPriceForbes;
  }

  if (uiBrand === constants.BRAND_BISHOPSGATE) {
    component = LogoBishopsgate;
  }

  // abort
  if (!component) return null;

  return <LogoView component={component} height={height} nestedClasses={className} />;
}
