import { createSelector } from 'reselect';
import get from 'lodash/get';
import flatten from 'lodash/flatten';
import orderBy from 'lodash/orderBy';

export const selectAdminOffices = createSelector(
  (state) => get(state, 'admin.parentOfficeListAll.items') || [],
  (parents) => {
    if (!parents.length) return;
    const offices = parents.map((parent) => {
      return parent.offices.map((office) => ({
        id: office.id,
        name: `${parent.name} - ${office.name}`,
      }));
    });
    return flatten(offices);
  }
);
export const selectProgrammesCarriersSorted = createSelector(
  (state) => get(state, 'admin.programmesCarriersList.items') || [],
  (items) => orderBy(items, ['name'], ['asc'])
);

export const selectProgrammesClientsSorted = createSelector(
  (state) => get(state, 'admin.programmesClientList.items') || [],
  (items) => orderBy(items, ['name'], ['asc'])
);

export const selectProgrammesProductsSorted = createSelector(
  (state) => get(state, 'admin.programmesProductsList.items') || [],
  (items) => orderBy(items, ['name'], ['asc'])
);
