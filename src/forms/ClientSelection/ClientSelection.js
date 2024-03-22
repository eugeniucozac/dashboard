import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import kebabCase from 'lodash/kebabCase';
import get from 'lodash/get';

// app
import { ClientSelectionView } from './ClientSelection.view';
import { getParentList } from 'stores';
import * as utils from 'utils';
import config from 'config';

ClientSelection.propTypes = {
  nestedClasses: PropTypes.object,
};

ClientSelection.defaultProps = {
  size: 'md',
};

export default function ClientSelection({ size, nestedClasses }) {
  const [uuid, setUuid] = useState(new Date().getTime());
  const dispatch = useDispatch();
  const history = useHistory();
  const parentList = useSelector((state) => get(state, 'parent.list')) || [];

  useEffect(
    () => {
      if (!parentList || !parentList.length > 0) {
        dispatch(getParentList());
      }
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const fields = [
    {
      name: 'client',
      type: 'autocomplete',
      value: [],
      defaultValue: [],
      placeholder: utils.string.t('app.client'),
      optionKey: 'id',
      optionLabel: 'name',
      muiComponentProps: {
        'data-testid': 'client-dropdown',
      },
      options: parentList || [],
      innerComponentProps: {
        isClearable: false,
        blurInputOnSelect: true,
        customStyles: {
          size,
        },
        noOptionsFoundMessage: utils.string.t('client.clientNotFound'),
      },
      callback: (values) => {
        const value = values && get(values, '[0]');
        const officeId = value && value.id;
        const officeSlug = value && value.name ? `/${kebabCase(value.name)}` : '';

        if (officeId) {
          setUuid(new Date().getTime());
          history.push(`${config.routes.client.item}/${officeId}${officeSlug}`);
        }
      },
    },
  ];

  return <ClientSelectionView key={uuid} fields={fields} nestedClasses={nestedClasses} />;
}
