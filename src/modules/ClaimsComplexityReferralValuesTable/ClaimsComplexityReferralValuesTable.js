import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

//app
import * as utils from 'utils';
import { ClaimsComplexityReferralValuesTableView } from './ClaimsComplexityReferralValuesTable.view';
import { getComplexityReferralValues } from 'stores';

ClaimsComplexityReferralValuesTable.prototypes = {
  complexityReferralValues: PropTypes.object.isRequired,
  handleEditComplexityRule: PropTypes.func.isRequired,
};
export default function ClaimsComplexityReferralValuesTable({ complexityReferralValues, handleEditComplexityRule }) {
  const dispatch = useDispatch();
  const [activeItem, setActiveItem] = useState({});

  const columns = [
    {
      id: 'createdDate',
      label: utils.string.t('claims.complexityRulesManagementDetails.referralValues'),
      sort: { type: '', direction: 'asc' },
    },
    {
      id: 'forCompany',
      label: utils.string.t('claims.complexityRulesManagementDetails.complexityBasisValues.forCompany'),
    },
    {
      id: 'forDivision',
      label: utils.string.t('claims.complexityRulesManagementDetails.complexityBasisValues.forDivision'),
    },
  ];

  const handleChangePage = (newPage) => {
    dispatch(getComplexityReferralValues({ page: newPage }));
    setActiveItem({});
    handleEditComplexityRule({});
  };

  const handleChangeRowsPerPage = (rowsPerPage) => {
    dispatch(getComplexityReferralValues({ size: rowsPerPage }));
    setActiveItem({});
    handleEditComplexityRule({});
  };

  const handleSort = (by, dir) => {
    dispatch(getComplexityReferralValues({ sortBy: by, direction: dir.toUpperCase() }));
    setActiveItem({});
    handleEditComplexityRule({});
  };

  const handleValueSelect = (val) => {
    setActiveItem(val);
    handleEditComplexityRule(val);
  };

  return (
    <>
      <ClaimsComplexityReferralValuesTableView
        activeItem={activeItem}
        cols={columns}
        rows={complexityReferralValues}
        sort={{
          ...complexityReferralValues.sort,
          direction: complexityReferralValues.sort.direction.toLowerCase(),
          type: 'id',
        }}
        pagination={{
          page: complexityReferralValues.page,
          rowsTotal: complexityReferralValues.itemsTotal,
          rowsPerPage: complexityReferralValues.pageSize,
        }}
        handleSort={handleSort}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        handleValueSelect={handleValueSelect}
      />
    </>
  );
}
