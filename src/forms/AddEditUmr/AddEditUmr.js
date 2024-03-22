import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import get from 'lodash/get';

// app
import styles from './AddEditUmr.styles';
import { AddEditUmrView } from './AddEditUmr.view';
import { searchOpeningMemoList, patchOpeningMemo } from 'stores';
import * as utils from 'utils';
import { KEYCODE } from 'consts';

// mui
import { makeStyles } from '@material-ui/core';

AddEditUmr.propTypes = {
  origin: PropTypes.shape({
    path: PropTypes.string.isRequired,
    id: PropTypes.number,
  }),
  openingMemo: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default function AddEditUmr({ origin, openingMemo = {}, handleClose }) {
  const classes = makeStyles(styles, { name: 'AddEditUmr' })();

  const dispatch = useDispatch();
  const umr = get(openingMemo, 'uniqueMarketReference') || '';
  const btnRef = useRef(null);
  const [umrList, setUmrList] = useState(umr.split(','));
  const [error, setError] = useState(null);
  const [search, setSearch] = useState({ query: '', valid: false });

  const addUmr = (id) => {
    if (id && !umrList.includes(id)) {
      setUmrList([...umrList, id]);
      setError('');
    }
  };

  const removeUmr = ([{ value }]) => {
    setUmrList(umrList.filter((umr) => umr !== value));
  };

  const resetUmr = () => {
    setSearch({});
  };

  const handleSubmit = () => {
    if (!umrList || !utils.generic.isValidArray(umrList, true)) {
      setError(utils.string.t('openingMemo.addEditUmr.errorEmptyList'));
      return;
    }

    return dispatch(patchOpeningMemo({ uniqueMarketReference: umrList.join(',') }, openingMemo.id));
  };

  const handleCancel = () => {
    if (utils.generic.isFunction(handleClose)) {
      handleClose();
    }
  };

  const checkIfUmrExist = (value) => {
    const { path, id } = origin;
    const searchList = async () => {
      const res = await dispatch(
        searchOpeningMemoList({
          type: 'uniqueMarketReference',
          query: value,
          origin: {
            path,
            id: path === 'department' ? openingMemo.departmentId : id,
          },
        })
      );

      if (utils.generic.isValidArray(res)) {
        setSearch({
          query: value,
          valid:
            res.filter((r) => {
              const umr = r.uniqueMarketReference || '';
              return umr.split(',').includes(value);
            }).length !== 1,
        });
      }
    };

    if (value) {
      searchList();
    } else {
      setSearch({
        query: '',
        valid: false,
      });
    }

    return value ? value.toUpperCase() : '';
  };

  const fields = [
    {
      name: 'umr',
      type: 'text',
      label: utils.string.t('openingMemo.addEditUmr.label'),
      value: '',
      muiComponentProps: {
        autoFocus: true,
        onKeyDown: (event) => {
          if (event.keyCode === KEYCODE.Enter) {
            event.preventDefault();
            event.stopPropagation();
            btnRef.current.click();
          }
        },
        classes: {
          root: classes.textField,
        },
        'data-testid': 'umr',
      },
      onChange: checkIfUmrExist,
    },
  ];

  const actions = [
    {
      name: 'submit',
      label: utils.string.t('app.save'),
      handler: handleSubmit,
    },
    {
      name: 'cancel',
      label: utils.string.t('app.cancel'),
      handler: handleCancel,
    },
  ];

  return (
    <AddEditUmrView
      actions={actions}
      fields={fields}
      list={umrList}
      query={search.query}
      valid={search.valid}
      error={error}
      refs={{
        btn: btnRef,
      }}
      handlers={{
        add: addUmr,
        remove: removeUmr,
        reset: resetUmr,
      }}
    />
  );
}
