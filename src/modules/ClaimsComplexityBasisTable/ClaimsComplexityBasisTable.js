import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

//app
import { ClaimsComplexityBasisTableView } from './ClaimsComplexityBasisTable.view';
import * as utils from 'utils';
import { getComplexityBasisValue } from 'stores';

ClaimsComplexityBasisTable.prototypes = {
  complexityBasisValueData: PropTypes.object.isRequired,
  handleEditComplexityRule: PropTypes.func.isRequired,
};
export default function ClaimsComplexityBasisTable({ complexityBasisValueData, handleEditComplexityRule }) {
  const dispatch = useDispatch();
  const [activeItem, setActiveItem] = useState({});

  const columns = [
    {
      id: 'createdDate',
      label: utils.string.t('claims.complexityRulesManagementDetails.complexityBasisValues.basisValues'),
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
    dispatch(getComplexityBasisValue({ page: newPage }));
    setActiveItem({});
    handleEditComplexityRule({});
  };

  const handleChangeRowsPerPage = (rowsPerPage) => {
    dispatch(getComplexityBasisValue({ size: rowsPerPage }));
    setActiveItem({});
    handleEditComplexityRule({});
  };

  const handleSort = (by, dir) => {
    dispatch(getComplexityBasisValue({ sortBy: by, direction: dir.toUpperCase() }));
    setActiveItem({});
    handleEditComplexityRule({});
  };

  const handleValueSelect = (val) => {
    setActiveItem(val);
    handleEditComplexityRule(val);
  };

  return (
    <ClaimsComplexityBasisTableView
      activeItem={activeItem}
      cols={columns}
      rows={complexityBasisValueData?.items || []}
      sort={{
        ...complexityBasisValueData?.sort,
        direction: complexityBasisValueData?.sort?.direction.toLowerCase(),
        type: 'id',
      }}
      pagination={{
        page: complexityBasisValueData?.page,
        rowsTotal: complexityBasisValueData?.itemsTotal,
        rowsPerPage: complexityBasisValueData?.pageSize,
      }}
      handlers={{
        handleSort,
        handleChangePage,
        handleChangeRowsPerPage,
        handleValueSelect,
      }}
    />
  );
}
