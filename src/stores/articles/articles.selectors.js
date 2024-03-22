import { createSelector } from 'reselect';
import get from 'lodash/get';
import flatten from 'lodash/flatten';
import uniq from 'lodash/uniq';
import orderBy from 'lodash/orderBy';
import config from 'config';

// private
const _refDataDepartments = (state) => get(state, 'referenceData.departments') || [];

const slipcaseTopics = [
  { value: '_5', slipcaseId: 5, label: 'Accident & Health / Contingency' },
  { value: '_9', slipcaseId: 9, label: 'Aerospace / Aviation' },
  { value: '_92', slipcaseId: 92, label: 'Agriculture' },
  { value: '_12', slipcaseId: 12, label: 'Casualty' },
  { value: '_14', slipcaseId: 14, label: 'Construction' },
  { value: '_16', slipcaseId: 16, label: 'Cyber' },
  { value: '_17', slipcaseId: 17, label: 'Directors & Officers' },
  { value: '_97', slipcaseId: 97, label: 'Financial Institutions' },
  { value: '_162', slipcaseId: 162, label: 'Intellectual Property' },
  { value: '_23', slipcaseId: 23, label: 'Kidnap & Ransom' },
  { value: '_11', slipcaseId: 11, label: 'Marine Cargo' },
  { value: '_24', slipcaseId: 24, label: 'Marine Hull' },
  { value: '_6', slipcaseId: 6, label: 'Marine Liability' },
  { value: '_26', slipcaseId: 26, label: 'Mining' },
  { value: '_27', slipcaseId: 27, label: 'Motor (Commercial)' },
  { value: '_30', slipcaseId: 30, label: 'Offshore Energy' },
  { value: '_31', slipcaseId: 31, label: 'Onshore Energy' },
  { value: '_34', slipcaseId: 34, label: 'P I (E&O)' },
  { value: '_32', slipcaseId: 32, label: 'Political Risk & War' },
  { value: '_20', slipcaseId: 20, label: 'Private Client / Fine art' },
  { value: '_33', slipcaseId: 33, label: 'Product Recall' },
  { value: '_21', slipcaseId: 21, label: 'Property - International' },
  { value: '_29', slipcaseId: 29, label: 'Property - North America' },
  { value: '_39', slipcaseId: 39, label: 'Property - UK' },
  { value: '_35', slipcaseId: 35, label: 'Renewables' },
  { value: '_77', slipcaseId: 77, label: 'Superyachts' },
  { value: '_95', slipcaseId: 95, label: 'Supply Chain / Business Interruption' },
  { value: '_88', slipcaseId: 88, label: 'Takaful' },
  { value: '_40', slipcaseId: 40, label: 'Technology' },
  { value: '_37', slipcaseId: 37, label: 'Terrorism Risk' },
  { value: '_91', slipcaseId: 91, label: 'Trade Credit' },
];

// public
export const selectAllTopics = createSelector(_refDataDepartments, (departments) => {
  if (!departments.length) return;
  const mappedKeys = Object.keys(config.slipcase.mappings);
  const mappedSlipcaseTopics = uniq(flatten(mappedKeys.map((key) => config.slipcase.mappings[key])));
  const unmappedSlipcaseTopics = slipcaseTopics.filter((topic) => !mappedSlipcaseTopics.includes(topic.slipcaseId));
  const mappedDepartments = departments
    .filter((department) => mappedKeys.includes(department.id.toString()))
    .map((department) => ({ value: department.id, label: department.name }));
  return orderBy([...unmappedSlipcaseTopics, ...mappedDepartments], 'label');
});

export const selectArticlePagination = (state) => {
  const list = get(state, 'articles.list') || {};

  return {
    page: list.page ? list.page : 0,
    rowsTotal: list.itemsTotal || 0,
    rowsPerPage: list.pageSize || config.ui.pagination.default,
  };
};
