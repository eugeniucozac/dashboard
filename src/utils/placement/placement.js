import get from 'lodash/get';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import isString from 'lodash/isString';
import compact from 'lodash/compact';

// app
import * as utils from 'utils';
import config from 'config';
import groupBy from 'lodash/groupBy';
import toNumber from 'lodash/toNumber';

const utilsPlacement = {
  getInsureds: (placement) => {
    if (!placement || !utils.generic.isValidArray(placement.insureds, true)) return '';

    return placement.insureds
      .filter((insured) => insured.id && insured.name && insured.name.trim())
      .map((insured) => insured.name)
      .join(', ');
  },

  getClients: (placement) => {
    if (!placement || !utils.generic.isValidArray(placement.clients, true)) return [];

    return [...placement.clients]
      .filter((client) => client.name && isString(client.name) && client.name.trim())
      .map((client) => {
        const parentName = client.parent && client.parent.trim();
        const clientName = client.name && client.name.trim();

        return clientName.includes(parentName) ? clientName : [parentName, clientName].filter((i) => i).join(' ');
      });
  },

  getOffices: (placement) => {
    if (!placement || !utils.generic.isValidArray(placement.clients, true)) return [];

    return compact(
      uniq(
        placement.clients.reduce((acc, client) => {
          const offices = client.offices || [];
          return [...acc, ...offices.map((o) => o.name)];
        }, [])
      )
    );
  },

  getOfficeCobrokers: (placement) => {
    if (!placement || !utils.generic.isValidArray(placement.clients, true)) return [];

    const allCoBrokers = placement.clients.reduce((acc, client) => {
      if (client.type === 'office' && utils.generic.isValidArray(client.cobrokers, true)) {
        return [...acc, ...client.cobrokers];
      }

      return acc;
    }, []);

    return uniqBy(allCoBrokers, 'id');
  },

  getYear: (placement) => {
    if (!placement || !placement.inceptionDate) return '';

    const date = new Date(placement.inceptionDate);
    const year = date && date.getFullYear();

    return year || '';
  },

  getDepartmentName: (placement, depts) => {
    if (!placement || !placement.departmentId || !utils.generic.isValidArray(depts, true)) return '';

    const dept = utils.referenceData.departments.getById(depts, placement.departmentId);

    return dept ? dept.name : '';
  },

  // item could be layers or policies
  // it should work with both as their structure should be the same
  // departments without a valid id and/or name are excluded
  getTabsByBusinessTypeId: (items, department) => {
    if (!items || !department || !utils.generic.isValidArray(items, true)) return [];

    const groups = groupBy(items, (item) => item.businessTypeId);

    return Object.keys(groups)
      .map((group) => {
        const businessTypeId = toNumber(group);
        const businessTypeName = utils.referenceData.businessTypes.getNameById(department.businessTypes, businessTypeId);
        return {
          value: businessTypeId,
          label: businessTypeName,
        };
      })
      .filter((obj) => Boolean(obj.value && obj.label));
  },

  // layer OMS
  // false/false means we want the total gross premium amount
  // check that the default flags make sense
  // getPremiumByCurrency: (placement, currency, isSigned = false, toOrder = false) => {
  //   if (!placement || !currency || !utils.generic.isValidArray(placement.policies, true)) return {};
  //
  //   return placement.policies.reduce((acc, policy) => {
  //     const premiumsByCurrency = utils.policy.getPremiumByCurrency(policy, currency, isSigned, toOrder);
  //
  //     return utils.placement.mergePremiumsByCurrency(acc, premiumsByCurrency);
  //   }, {});
  // },

  // policy GXB
  // true/true means we want the premium value signed and ordered (based on markets %)
  getPremiumBySettlementCurrency: (placement, isSigned = true, toOrder = true) => {
    if (!placement || !utils.generic.isValidArray(placement.policies, true)) return {};

    return placement.policies.reduce((acc, policy) => {
      // only keep GXB policies
      if (!utils.policy.isOriginGxb(policy)) return acc;

      const premiumsByCurrency = utils.policy.getPremiumBySettlementCurrency(policy, isSigned, toOrder);
      return utils.placement.mergePremiumsByCurrency(acc, premiumsByCurrency);
    }, {});
  },

  mergePremiumsByCurrency: (acc, premiumsByCurrency) => {
    const obj = {};
    const keys = uniq([...Object.keys(premiumsByCurrency), ...Object.keys(acc)]);

    keys.forEach((key) => {
      obj[key] = (acc[key] || 0) + (premiumsByCurrency[key] || 0);
    });

    return obj;
  },

  isBound: (placement, statusBoundId) => {
    // this assumes the developer is passing the correct status ID for "bound"
    if (!placement || !statusBoundId) return false;

    return placement.statusId === statusBoundId;
  },

  getByYear: (placements, year, withPremium) => {
    if (!year || !placements || !utils.generic.isValidArray(placements, true)) return [];

    return placements.filter((placement) => {
      const isSameYear = year === utils.placement.getYear(placement);

      // Only keep placements with premiums
      if (withPremium) {
        return (
          isSameYear &&
          placement.policies.reduce((acc, policy) => {
            return acc || utils.policy.hasBoundPremium(policy);
          }, false)
        );
      } else {
        return isSameYear;
      }
    });
  },

  isPhysicalLoss: (placement) => {
    if (!utils.generic.isValidObject(placement) || !config.departments || !utils.generic.isValidArray(config.departments.physicalLoss))
      return false;

    const department = config.departments.physicalLoss.find((department) => department.id === placement.departmentId);
    return !!department;
  },

  getFilteredBreadcrumbs: ({ breadcrumbs, placement, isBroker, isDev, statusBoundId }) => {
    return breadcrumbs
      .map((breadcrumb) => ({
        ...breadcrumb,
        ...(placement && placement.id && { link: `${breadcrumb.route}/${placement.id}` }),
      }))
      .filter((breadcrumb) => {
        const { showForPhysicalLoss, showForIsBroker, showForIsDev } = breadcrumb;
        return (
          (breadcrumb.name !== 'bound' || utils.placement.isBound(placement, statusBoundId)) &&
          (!showForPhysicalLoss || (showForPhysicalLoss && utils.placement.isPhysicalLoss(placement))) &&
          (!showForIsBroker || (showForIsBroker && isBroker)) &&
          (!showForIsDev || (showForIsDev && isDev))
        );
      });
  },

  layer: {
    getById: (layers, id) => {
      if (!id || utils.generic.isInvalidOrEmptyArray(layers)) return;

      return layers.find((layer) => {
        return layer.id === id;
      });
    },
  },
  parsePlacements: (items) => {
    return items.map((placement) => {
      // structure clients (and offices) into array of objects
      if (placement.clients && placement.clients.length > 0) {
        const clientsArray = placement.clients.reduce((acc, client) => {
          if (client.offices && client.offices.length > 0) {
            client.offices.forEach((office) => {
              if (office.id && office.name) {
                acc.push({
                  id: client.id,
                  name: office.name,
                  cobrokers: office.cobrokers,
                  parent: get(office, 'parent.name') || '',
                  logoFileName: get(office, 'parent.logoFileName') || '',
                  type: 'office',
                });
              }
            });
          } else {
            if (client.id && client.name) {
              acc.push({
                id: client.id,
                name: client.name,
                type: 'client',
              });
            }
          }

          return acc;
        }, []);

        placement.clients = uniqBy(clientsArray, 'id');
      } else {
        placement.clients = [];
      }

      if (placement.config) {
        try {
          placement.config = JSON.parse(placement.config);
        } catch {
          placement.config = null;
        }
      }

      // Bound data now comes from a different source and is made to look like Edge data.
      // To minimise disruption below I swap the id for the notes.
      // This obviously isn't the DB record id but it is the most unique thing in the absence of in id.
      // It keeps the app performing as expected given how often an id is used as a key.
      if (placement && placement.policies) {
        placement.policies.forEach((p) => {
          if (!p.id) p.id = p.notes;

          if (utils.generic.isValidArray(p.markets, true)) {
            p.markets.forEach((m) => {
              if (!m.id) m.id = utils.market.getName(m);
            });
          }
        });
      }

      return placement;
    });
  },

  isSelected: (typeName, modellingAttachmentTypes) => {
    return modellingAttachmentTypes?.map((type) => type.modellingAttachmentTypeKey).includes(typeName);
  },

  renderFileTypeOptions: (modellingTypeValue, isNew, modellingAttachmentTypes) => {
    switch (modellingTypeValue) {
      case 'QUOTING':
        return [
          {
            label: utils.string.t('placement.modelling.sovAttached.label'),
            id: 'fileType.sovAttachedQuote',
            name: 'fileType.sovAttachedQuote',
            value: isNew ? false : utils.placement.isSelected('sovAttachedQuote', modellingAttachmentTypes) || false,
          },
          {
            label: utils.string.t('placement.modelling.expiringSlip.label'),
            id: 'fileType.expiringSlip',
            name: 'fileType.expiringSlip',
            value: isNew ? false : utils.placement.isSelected('expiringSlip', modellingAttachmentTypes) || false,
          },
        ];

      case 'BOUND':
        return [
          {
            label: utils.string.t('placement.modelling.sovAttached.label'),
            id: 'fileType.sovAttachedBound',
            name: 'fileType.sovAttachedBound',
            value: isNew ? false : utils.placement.isSelected('sovAttachedBound', modellingAttachmentTypes) || false,
          },
          {
            label: utils.string.t('placement.modelling.boundUmrSlip.label'),
            id: 'fileType.boundUmrSlip',
            name: 'fileType.boundUmrSlip',
            value: isNew ? false : utils.placement.isSelected('boundUmrSlip', modellingAttachmentTypes) || false,
          },
        ];
      default:
        return [];
    }
  },
  checkAllTruthyValues: (fileTypeValue) => Object.values(fileTypeValue).every((item) => item),
};

export default utilsPlacement;
