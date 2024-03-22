import * as React from 'react';
import startCase from 'lodash/startCase';
import toLower from 'lodash/toLower';

import get from 'lodash/get';

// app
import styles from './RiskData.styles';
import { FormGrid } from 'components';

import * as utils from 'utils';
import { RISK_DEFINITION_GENERAL } from 'consts';
// mui
import Skeleton from '@material-ui/lab/Skeleton';
import { Box, makeStyles, Typography } from '@material-ui/core';

export const renderValue = (field, value, valuesByID = [], countryOfOrigin = []) => {
  let prefix = '';
  let suffix = '';
  let newValue = value;

  switch (field.type) {
    case 'DOUBLE':
      const isPercent = field && field.validation && field.validation.percent;
      newValue = utils.string.t(`format.${isPercent ? 'percent' : 'currency'}`, { value: { number: value } });
      break;
    case 'BOOLEAN':
      newValue =
        value === 'true' || value === true
          ? utils.string.t('app.yes')
          : value === 'false' || value === false
          ? utils.string.t('app.no')
          : '';
      break;

    case 'DATE':
      newValue = utils.string.t(`format.date`, { value: { date: value } });
      break;
    case 'ID':
      newValue = valuesByID[field.name]?.id === value ? valuesByID[field.name]?.name : '';
      break;

    case 'SELECT': {
      if (field.autocomplete) {
        if (utils.generic.isValidArray(value)) {
          newValue = '';
          for (const singleValue of value) {
            newValue = newValue + `${singleValue?.label || singleValue},`;
          }
          newValue = newValue.slice(0, -1);
        } else newValue = value?.label || value;
      } else {
        const options =
          field.name === 'countryOfOrigin' ? countryOfOrigin : utils.generic.isValidArray(field.options, true) ? field.options : [];
        const option = options.find((o) => String(o.value) === String(value)) || {};

        newValue = option?.label !== 'Select...' ? option.label : value ? value : '';
      }
      break;
    }
    case 'RADIO': {
      newValue = value || '';
      break;
    }

    default:
      break;
  }

  // add prefix/suffix for specific fields
  if (field.name === 'distanceToCoast' && value) {
    suffix = ` ${utils.string.t('map.unit.miles')}`;
  }
  // the extra <span /> is used to prevent Material-UI complaining about not receiving a ReactNode
  // this happens if the value is true/false/undefined/null...
  // this workaround prevents errors in case some invalid values fall through the cracks
  return utils.generic.isValidObject(newValue) ? null : (
    <span>
      {prefix}
      {newValue}
      {suffix}
    </span>
  );
};

const RiskData = ({ riskIsLoading, riskValues, groups, definitionsFields, valuesByID, countryOfOrigin, locationKey }) => {
  const classes = makeStyles(styles, { name: 'RiskData' })();

  return (
    <>
      <Box mb={1} display="flex" alignItems="center" data-testid="risk-data">
        <Typography variant="h3">{utils.string.t('risks.data')}</Typography>
      </Box>
      <FormGrid container spacing={2}>
        {riskIsLoading || !utils.generic.isValidObject(riskValues) ? (
          <FormGrid item xs={12} sm={6} md={4} lg={3} data-testid="risk-data-loading">
            <Box className={classes.card}>
              <Box p={2} className={classes.cardTitle}>
                <Skeleton animation="wave" width="100%" height={40} />
              </Box>
              <Box p={2}>
                <Skeleton animation="wave" height={20} style={{ marginBottom: 6 }} />
                <Skeleton animation="wave" height={20} style={{ marginBottom: 6 }} />
                <Skeleton animation="wave" height={20} style={{ marginBottom: 6 }} />
                <Skeleton animation="wave" height={20} />
              </Box>
            </Box>
          </FormGrid>
        ) : (
          groups.map((group, index) => {
            const fields = utils.risk.getFieldsByGroup(definitionsFields, group) || [];

            return group === RISK_DEFINITION_GENERAL ? (
              <FormGrid item xs={12} sm={6} md={4} lg={3} data-testid={`risk-data-${group}`} key={group}>
                <Box className={classes.card}>
                  <Box p={2} className={classes.cardTitle}>
                    <Typography variant="h3" className={classes.cardTitleHeading}>
                      {startCase(toLower(group))}
                    </Typography>
                  </Box>
                  <Box p={2}>
                    <FormGrid container spacing={1}>
                      {fields.map((field) => {
                        const value = riskValues[field?.name] || null;
                        const condition = utils.risk.getCondition(field, fields);
                        const refValueCondition = condition && get(riskValues, `${condition.name}`);
                        const isConditionValid = condition && utils.risk.isConditionValid(condition, refValueCondition);
                        const isHidden = utils.risk.isHiddenField(field);

                        return !isHidden && (condition === undefined || (condition && isConditionValid)) ? (
                          <FormGrid item xs={12} sm={12} key={`${field.label}-${value}`}>
                            <FormGrid container spacing={1}>
                              <FormGrid item xs={6}>
                                <Typography variant="body2" component="span">
                                  {field.label}
                                </Typography>
                              </FormGrid>
                              <FormGrid item xs={6}>
                                <Typography variant="body2" component="span" style={{ fontWeight: 'bold' }}>
                                  {renderValue(field, value, valuesByID, countryOfOrigin)}
                                </Typography>
                              </FormGrid>
                            </FormGrid>
                          </FormGrid>
                        ) : (
                          <FormGrid item xs={12} sm={4} key={`${field.label}-${value}`} />
                        );
                      })}
                    </FormGrid>
                  </Box>
                </Box>
              </FormGrid>
            ) : (
              <>
                {locationKey === toLower(group) ? null : (
                  <FormGrid item xs={12} sm={6} md={4} lg={3} data-testid={`risk-data-${group}`} key={group}>
                    <Box className={classes.card}>
                      <Box p={2} className={classes.cardTitle}>
                        <Typography variant="h3" className={classes.cardTitleHeading}>
                          {startCase(toLower(group))}
                        </Typography>
                      </Box>
                      <Box p={2}>
                        {fields
                          .filter((field) => Boolean(field.name) && field.type !== 'label')
                          .map((field, idx) => {
                            const value = riskValues[field.name];
                            const isArrayColumn = utils.risk.isArrayColumn(field) && utils.generic.isValidArray(value);
                            const isArrayTable = utils.risk.isArrayTable(field) && utils.generic.isValidArray(value);
                            const isObject = utils.risk.isObject(field) && utils.generic.isValidObject(value);
                            const valueArray = isArrayColumn || isArrayTable ? value : [value];
                            const arrayKey = isArrayColumn || isArrayTable ? 'arrayItemDef' : isObject ? 'objectDef' : '';
                            const condition = utils.risk.getCondition(field, fields);
                            const refValueCondition = condition && get(riskValues, `${condition.name}`);
                            const isConditionValid = condition && utils.risk.isConditionValid(condition, refValueCondition);
                            const isHidden = utils.risk.isHiddenField(field);

                            if (isArrayColumn || isArrayTable || isObject) {
                              return condition === undefined || (condition && isConditionValid) ? (
                                <FormGrid spacing={2} container key={`${field.label}-${field.label}`}>
                                  {!isObject ? (
                                    <FormGrid item xs={12}>
                                      {field.label}
                                    </FormGrid>
                                  ) : null}

                                  {valueArray.map((v, index) => {
                                    return (
                                      <FormGrid item xs={12} key={`key-${index}`}>
                                        <Box className={valueArray?.length > 1 ? `${classes.card} ${classes.cardArray}` : ``}>
                                          {field[arrayKey]
                                            .filter((f) => Boolean(f.name))
                                            .map((arrayField) => {
                                              const isHidden = utils.risk.isHiddenField(arrayField);
                                              const isTitle = utils.risk.isTitleField(arrayField);

                                              return !isHidden || isTitle ? (
                                                <FormGrid spacing={1} container key={`${arrayField.name}-${arrayField.label}`}>
                                                  <FormGrid item xs={6}>
                                                    <Typography variant="body2" component="span">
                                                      {arrayField.label}
                                                    </Typography>
                                                  </FormGrid>
                                                  <FormGrid item xs={6}>
                                                    <Typography variant="body2" component="span" style={{ fontWeight: 'bold' }}>
                                                      {renderValue(arrayField, v[arrayField.name], valuesByID, countryOfOrigin)}
                                                    </Typography>
                                                  </FormGrid>
                                                </FormGrid>
                                              ) : null;
                                            })}
                                        </Box>
                                      </FormGrid>
                                    );
                                  })}
                                </FormGrid>
                              ) : null;
                            }

                            return !isHidden && (condition === undefined || (condition && isConditionValid)) ? (
                              <FormGrid container spacing={2} key={`${field.name}-${field.label}`}>
                                <FormGrid item xs={6}>
                                  <Typography variant="body2" component="span">
                                    {field.label || field.title}
                                  </Typography>
                                </FormGrid>
                                <FormGrid item xs={6}>
                                  <Typography variant="body2" component="span" style={{ fontWeight: 'bold' }}>
                                    {renderValue(field, value, valuesByID, countryOfOrigin)}
                                  </Typography>
                                </FormGrid>
                              </FormGrid>
                            ) : null;
                          })}
                      </Box>
                    </Box>
                  </FormGrid>
                )}
              </>
            );
          })
        )}
      </FormGrid>
    </>
  );
};

export default RiskData;
