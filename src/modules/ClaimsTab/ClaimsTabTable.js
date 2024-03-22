import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import xor from 'lodash/xor';

// app
import { ClaimsTabTableView } from './ClaimsTabTable.view';
import { selectClaimsTabPagination, setClaimsTabSelectedItem, selectClaimsTabData, showModal, hideModal } from 'stores';
import { useSort, usePagination } from 'hooks';
import * as utils from 'utils';
import config from 'config';

ClaimsTabTable.prototypes = {
  claims: PropTypes.array.isRequired,
  cols: PropTypes.array.isRequired,
  columnProps: PropTypes.object.isRequired,
  sort: PropTypes.object.isRequired,
  handlers: PropTypes.shape({
    changePage: PropTypes.object.isRequired,
    changeRowsPerPage: PropTypes.object.isRequired,
    sort: PropTypes.object.isRequired,
  }).isRequired,
  viewFields: PropTypes.array.isRequired,
  control: PropTypes.object.isRequired,
};

export function ClaimsTabTable({ claims, cols: colsArr, columnProps, sort: sortObj, handlers = {}, viewFields, control }) {
  const dispatch = useDispatch();
  const history = useHistory();

  const isFormDirtyRef = useRef(false);

  const claimsTabData = useSelector(selectClaimsTabData);
  const claimsTabPagination = useSelector(selectClaimsTabPagination);

  const [multiSelect, setMultiSelect] = useState(false);
  const [selected, setSelected] = useState([]);
  const [highlighted, setHighlighted] = useState([]);

  const { cols, sort } = useSort(colsArr, sortObj, handlers?.sort);
  const pagination = usePagination(claims || [], claimsTabPagination, handlers.changePage, handlers.changeRowsPerPage);

  const selectClaim = (claimObj) => () => {
    setHighlighted([]);

    if (claimObj?.processID) {
      setSelected(xor(selected, [claimObj.processID]));
    }
  };

  const clickEllipsis = (claimObj) => {
    if (claimObj?.processID) {
      setSelected([]);
      setHighlighted([claimObj.processID]);
    }
  };

  const clickClaim = (claimObj) => (event) => {
    event.stopPropagation();

    if (claimObj?.claimReference) {
      dispatch(setClaimsTabSelectedItem(claimObj, true));
      history.push(`${config.routes.claimsFNOL.claim}/${claimObj?.claimReference}`);
    }
  };

  const toggleMultiSelect = (name, value) => {
    setMultiSelect(value);
    setSelected([]);
    setHighlighted([]);
  };

  const setIsFormDirty = (isDirty) => {
    isFormDirtyRef.current = isDirty;
  };

  const confirmHideModal = (modalName) => {
    if (isFormDirtyRef.current) {
      dispatch(
        showModal({
          component: 'CONFIRM',
          props: {
            title: utils.string.t('navigation.form.subtitle'),
            hint: utils.string.t('navigation.form.title'),
            fullWidth: true,
            maxWidth: 'xs',
            componentProps: {
              cancelLabel: utils.string.t('app.no'),
              confirmLabel: utils.string.t('app.yes'),
              submitHandler: () => {
                dispatch(hideModal(modalName));
              },
            },
          },
        })
      );
    } else {
      dispatch(hideModal(modalName));
    }
  };

  const handleChangeComplexityPriorityAssignmentClaims = (claims) => {
    dispatch(
      showModal({
        component: 'CHANGE_COMPLEXITY_PRIORITY_ASSIGNMENT',
        props: {
          title: 'claims.processing.summary.buttons.changeComplexityPriorityAssignment',
          fullWidth: true,
          maxWidth: 'sm',
          hideCompOnBlur: false,
          componentProps: {
            claims: claims,
            setIsDirty: setIsFormDirty,
            clickXHandler: () => {
              confirmHideModal('CHANGE_COMPLEXITY_PRIORITY_ASSIGNMENT');
            },
            cancelHandler: () => {
              confirmHideModal('CHANGE_COMPLEXITY_PRIORITY_ASSIGNMENT');
            },
          },
        },
      })
    );
  };

  return (
    <ClaimsTabTableView
      claims={claims || []}
      selectedIds={selected}
      highlightedIds={highlighted}
      cols={cols}
      columnProps={columnProps}
      sort={sort}
      pagination={pagination}
      tabData={claimsTabData}
      multiSelect={multiSelect}
      viewFields={viewFields}
      control={control}
      handlers={{
        clickClaim,
        clickEllipsis,
        editClaims: handleChangeComplexityPriorityAssignmentClaims,
        selectClaim,
        sort: handlers.sort,
        toggleMultiSelect,
      }}
    />
  );
}
