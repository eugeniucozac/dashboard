import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import kebabCase from 'lodash/kebabCase';
import get from 'lodash/get';

// app
import { MarketSelectionView } from './MarketSelection.view';
import { getMarketParentListAll } from 'stores';
import * as utils from 'utils';
import config from 'config';

MarketSelection.propTypes = {
  nestedClasses: PropTypes.object,
};

MarketSelection.defaultProps = {
  size: 'md',
};

export default function MarketSelection({ size, nestedClasses }) {
  const [uuid, setUuid] = useState(new Date().getTime());
  const dispatch = useDispatch();
  const history = useHistory();
  const marketParentList = useSelector((state) => get(state, 'marketParent.listAll.items')) || [];

  useEffect(
    () => {
      if (!marketParentList || !marketParentList.length > 0) {
        dispatch(getMarketParentListAll());
      }
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const fields = [
    {
      name: 'market',
      type: 'autocomplete',
      value: [],
      defaultValue: [],
      placeholder: utils.string.t('app.market'),
      optionKey: 'id',
      optionLabel: 'name',
      muiComponentProps: {
        'data-testid': 'market-dropdown',
      },
      options: marketParentList || [],
      innerComponentProps: {
        isClearable: false,
        blurInputOnSelect: true,
        customStyles: {
          size,
        },
        noOptionsFoundMessage: utils.string.t('market.marketNotFound'),
      },
      callback: (values) => {
        const value = values && get(values, '[0]');
        const officeId = value && value.id;
        const officeSlug = value && value.name ? `/${kebabCase(value.name)}` : '';

        if (officeId) {
          setUuid(new Date().getTime());
          history.push(`${config.routes.market.item}/${officeId}${officeSlug}`);
        }
      },
    },
  ];

  return <MarketSelectionView key={uuid} fields={fields} nestedClasses={nestedClasses} />;
}
