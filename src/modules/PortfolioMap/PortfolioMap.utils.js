import groupBy from 'lodash/groupBy';
import flatten from 'lodash/flatten';
import sortBy from 'lodash/sortBy';
import sumBy from 'lodash/sumBy';
import sum from 'lodash/sum';
import get from 'lodash/get';
import keyBy from 'lodash/keyBy';
import moment from 'moment';

// app
import * as utils from 'utils';
import config from 'config';

export const getEarliestInceptionDate = (placement) =>
  placement.policies.reduce((date, policy) => {
    if (!date) return policy.inceptionDate;
    return moment(policy.inceptionDate).isBefore(date, 'day') ? policy.inceptionDate : date;
  }, null);

export const getLatestExpiryDate = (placement) =>
  placement.policies.reduce((date, policy) => {
    if (!date) return policy.expiryDate;
    return moment(policy.expiryDate).isAfter(date, 'day') ? policy.expiryDate : date;
  }, null);

export const getWithValidDate = (placement) => {
  if (!placement.policies.length) return false;

  const earliestInceptionDate = getEarliestInceptionDate(placement);
  const latestExpiryDate = getLatestExpiryDate(placement);
  const today = utils.date.today();

  if (!earliestInceptionDate && !latestExpiryDate) return true;
  if (!earliestInceptionDate && latestExpiryDate) return moment(today).isBefore(latestExpiryDate, 'day');
  if (earliestInceptionDate && !latestExpiryDate) return moment(today).isSameOrAfter(earliestInceptionDate, 'day');

  return moment(today).isBetween(earliestInceptionDate, latestExpiryDate, undefined, '[)');
};

export const getFilteredPlacements = (placements) => {
  const physicalLossDepartments = config.departments.physicalLoss.map((dep) => dep.id);
  const physicalLossPlacements = placements.filter((placement) => physicalLossDepartments.includes(placement.departmentId));

  return physicalLossPlacements.filter((placement) => getWithValidDate(placement));
};

// Returns filtered account list to populate map key
export const filterAccounts = (filteredPlacementIds, allAccounts, existingFilteredAccounts) => {
  const accountsMapped = keyBy(existingFilteredAccounts, 'id');
  return sortBy(
    allAccounts
      .map((account) => ({
        ...account,
        checked: accountsMapped[account.id] ? accountsMapped[account.id].checked : true,
        placements: account.placements.filter((placement) => filteredPlacementIds.includes(placement.id.toString())),
      }))
      .filter((account) => account.placements.length),
    'label'
  );
};

export const groupAccounts = (placements, departments) => {
  const filteredPlacements = placements.filter((placement) => placement.insureds && placement.insureds.length);
  const groupedByAccount = groupBy(filteredPlacements, (placement) => placement.insureds[0].id);
  return Object.keys(groupedByAccount).map((id, index) => {
    const label = get(groupedByAccount[id], '[0].insureds[0].name');
    return {
      id,
      checked: true,
      label,
      color: utils.color.random(label, 'bright'),
      placements: groupedByAccount[id].map((placement) => ({
        id: placement.id,
        departmentId: placement.departmentId,
        label: utils.placement.getDepartmentName(placement, departments),
      })),
    };
  });
};

export const addMapData = (locations, filteredAccounts, filteredDepartments) => {
  if (
    !utils.generic.isValidArray(locations) ||
    !utils.generic.isValidArray(filteredAccounts) ||
    !utils.generic.isValidArray(filteredDepartments)
  )
    return;

  const selectedAccounts = filteredAccounts.filter((item) => item.checked);
  const selectedPlacementIds = flatten(
    selectedAccounts.map((item) =>
      item.placements
        .filter((placement) => filteredDepartments.includes(placement.departmentId))
        .map((placement) => placement.id.toString())
    )
  );

  return locations
    .map((location) => {
      const filteredPlacements = location.placements.filter((placement) => selectedPlacementIds.includes(placement.placementId.toString()));

      if (!filteredPlacements.length) return null;

      const { address, lat, lng, count } = location;
      const accounts = hydrateAccounts(filteredPlacements, filteredAccounts);
      const data = accounts.map((account) => sumBy(account.placements, 'amount'));
      return {
        address,
        lat,
        lng,
        locationsFound: count,
        tivTotal: sum(data),
        accounts,
        properties: {
          data,
          backgroundColor: accounts.map((account) => account.color),
        },
      };
    })
    .filter((account) => !!account);
};

export const hydratePlacements = (filteredPlacements, filteredAccounts) => {
  if (!utils.generic.isValidArray(filteredPlacements) || !utils.generic.isValidArray(filteredAccounts)) return;

  return filteredPlacements
    .map((placement) => {
      const foundAccount = filteredAccounts
        .map((account) => {
          const foundPlacement = account.placements.find((p) => p.id.toString() === placement.placementId.toString());
          return foundPlacement ? { ...account, foundPlacement } : null;
        })
        .filter((acc) => !!acc);

      if (!foundAccount.length) return null;

      const { color, id, label, foundPlacement } = foundAccount[0];
      return { color, id, label, placement: { ...foundPlacement, amount: placement.tiv } };
    })
    .filter((loc) => !!loc);
};

export const hydrateAccounts = (filteredPlacements, filteredAccounts) => {
  if (!utils.generic.isValidArray(filteredPlacements)) return;

  const hydratedPlacements = hydratePlacements(filteredPlacements, filteredAccounts);
  const groupedAccounts = groupBy(hydratedPlacements, (placement) => placement.id);

  return Object.keys(groupedAccounts).map((id, index) => {
    const { placement, ...rest } = groupedAccounts[id][0];
    return {
      ...rest,
      placements: groupedAccounts[id].map((account) => account.placement),
    };
  });
};
