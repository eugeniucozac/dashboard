import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

// app
import { OpeningMemoSearchView } from './OpeningMemoSearch.view';
import {
  searchOpeningMemoList,
  selectOpeningMemo,
  createOpeningMemo,
  resetOpeningMemoPostSuccess,
  selectOpeningMemoPostSuccess,
  selectUserDepartmentId,
} from 'stores';
import * as utils from 'utils';

OpeningMemoSearch.propTypes = {
  routeWithId: PropTypes.bool.isRequired,
  route: PropTypes.string.isRequired,
  origin: PropTypes.shape({
    path: PropTypes.string.isRequired,
    id: PropTypes.number,
  }),
};

OpeningMemoSearch.defaultProps = {
  origin: {},
};

export default function OpeningMemoSearch({ route, origin, routeWithId }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const departmentId = useSelector(selectUserDepartmentId);
  const openingMemo = useSelector(selectOpeningMemo);
  const postSuccess = useSelector(selectOpeningMemoPostSuccess);
  const isCreatable = origin.path === 'department';

  const createableMethods = {
    isValidNewOption: (inputValue, selectValue, selectOptions) => shouldHideCreate(inputValue, selectOptions),
    onCreateOption: (id) => handleCreate(id),
  };

  const field = {
    id: 'openingMemoSearch',
    name: 'uniqueMarketReference',
    placeholder: utils.string.t('placement.openingMemo.search'),
    hint: isCreatable ? utils.string.t('openingMemo.searchExplanation') : '',
    value: [],
    options: [],
    optionKey: 'id',
    type: 'autocomplete',
    optionLabel: 'uniqueMarketReference',
    handleUpdate: (id, value) => {
      if (value[0] && typeof value[0] === 'object') {
        redirect(value[0].id);
      }
    },
    innerComponentProps: {
      isCreatable,
      isClearable: false,
      allowEmpty: true,
      noOptionsFoundMessage: isCreatable ? utils.string.t('openingMemo.searchHintCreate') : utils.string.t('openingMemo.searchHint'),
      async: {
        handler: (type, query) => {
          const { path, id } = origin;
          return dispatch(
            searchOpeningMemoList({
              type,
              query,
              origin: {
                path,
                id: path === 'department' ? departmentId : id,
              },
            })
          );
        },
        type: 'uniqueMarketReference',
      },
      customStyles: {
        size: 'xs',
      },
      ...(isCreatable && { ...createableMethods }),
    },
  };

  useEffect(
    () => {
      if (!postSuccess) return;
      redirect(openingMemo.id);
      return () => dispatch(resetOpeningMemoPostSuccess());
    },
    [openingMemo.id] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const redirect = (id) => {
    const redirectPath = routeWithId ? `${route}/${origin.id}/${id}` : `${route}/${id}`;
    history.push(redirectPath);
  };

  const shouldHideCreate = (inputValue, selectOptions) => {
    return (
      inputValue.length > 3 &&
      selectOptions.filter((option) => inputValue.toLowerCase() === option.uniqueMarketReference.toLowerCase()).length === 0
    );
  };

  const handleCreate = (uniqueMarketReference) => {
    dispatch(createOpeningMemo(uniqueMarketReference, departmentId));
  };

  return <OpeningMemoSearchView onCreate={handleCreate} field={field} />;
}
