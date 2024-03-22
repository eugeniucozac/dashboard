import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import get from 'lodash/get';

// app
import { QuoteBindDraftRiskView } from './QuoteBindDraftRisk.view';
import {
  getDraftList,
  selectProductsSorted,
  showModal,
  deleteDraft,
  selectDraftListItems,
  selectDraftListPagination,
  selectDraftListSort,
  selectDraftRiskListLoading,
} from 'stores';
import { usePagination } from 'hooks';
import * as utils from 'utils';

export default function QuoteBindDraftRisk() {
  const dispatch = useDispatch();
  const brand = useSelector((state) => state.ui.brand);
  const riskProducts = useSelector(selectProductsSorted);
  const draftItems = useSelector(selectDraftListItems);
  const draftRiskListLoading = useSelector(selectDraftRiskListLoading);
  const riskDraftPagination = useSelector(selectDraftListPagination);
  const draftSort = useSelector(selectDraftListSort);
  const draftList = useSelector((state) => state.risk.draftList);

  // draft pagination
  const handleDraftChangePage = (newPage) => {
    dispatch(getDraftList({ page: newPage + 1 }));
  };

  const handleDraftChangeRowsPerPage = (rowsPerPage) => {
    dispatch(getDraftList({ size: rowsPerPage }));
  };

  const draftPagination = usePagination(draftItems, riskDraftPagination, handleDraftChangePage, handleDraftChangeRowsPerPage);

  useEffect(
    () => {
      dispatch(getDraftList());
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const popoverActions = [
    {
      id: 'edit-draft-risk',
      label: 'app.edit',
      callback: (popoverData) => handleEditdraftRisk(popoverData),
    },
    {
      id: 'delete-draft-risk',
      label: 'app.delete',
      callback: (popoverData) => handleDeleteDraftRisk(popoverData),
    },
  ];

  const handleDeleteDraftRisk = (popoverData) => {
    dispatch(
      showModal({
        component: 'CONFIRM_DELETE',
        props: {
          title: 'products.tabs.draftRisks.deleteDraftRisk',
          fullWidth: true,
          maxWidth: 'xs',
          disableAutoFocus: true,
          componentProps: {
            submitHandler: () => {
              dispatch(deleteDraft(get(popoverData, 'id'), false));
            },
          },
        },
      })
    );
  };

  const handleEditdraftRisk = (popoverData) => {
    const draftId = popoverData.id;
    const riskData = popoverData.risk;
    let product = {};
    riskProducts.forEach((rp) => {
      if (rp.value.toLowerCase() === riskData.riskType.toLowerCase()) {
        product = rp;
      }
    });
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
            riskData,
            draftId,
          },
        },
      })
    );
  };

  return (
    <>
      <Helmet>
        <title>{`${utils.string.t('products.title')} - ${utils.app.getAppName(brand)} - ${utils.string.t(
          'products.tabs.draftRisks.label'
        )}`}</title>
      </Helmet>
      <QuoteBindDraftRiskView
        pagination={draftPagination.obj}
        listDraftRisk={draftList}
        draftRiskListLoading={draftRiskListLoading}
        popoverActions={popoverActions}
        riskProducts={riskProducts}
        sort={draftSort}
        handlers={{
          handleDoubleClickRow: handleEditdraftRisk,
          changePage: draftPagination.handlers.handleChangePage,
          changeRowsPerPage: draftPagination.handlers.handleChangeRowsPerPage,
        }}
      />
    </>
  );
}
