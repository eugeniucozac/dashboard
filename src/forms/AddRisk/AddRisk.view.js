import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import classnames from 'classnames';
import get from 'lodash/get';
import has from 'lodash/has';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import isString from 'lodash/isString';
import startCase from 'lodash/startCase';

// app
import styles from './AddRisk.styles';
import {
  Button,
  FormActions,
  FormContainer,
  FormAutocomplete,
  FormAutocompleteMui,
  FormCheckbox,
  FormDate,
  FormFields,
  FormGrid,
  FormHidden,
  FormLegend,
  FormRadio,
  FormSelect,
  FormText,
  FormToggle,
  Tabs,
  Translate,
} from 'components';
import { AddRiskColumn, AddRiskObject, AddRiskObjectAddress, AddRiskFormField, AddRiskRow } from 'modules';
import * as utils from 'utils';
import { RISK_DEFINITION_GENERAL, RISK_DEFINITION_PARTY, RISK_DEFINITION_EFFECTIVE } from 'consts';

// mui
import { Box, Divider, Grid, makeStyles } from '@material-ui/core';

AddRiskView.propTypes = {
  fields: PropTypes.array.isRequired,
  defaultValues: PropTypes.object.isRequired,
  validationSchema: PropTypes.object.isRequired,
  isTablet: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handlePostRisk: PropTypes.func.isRequired,
};

export function AddRiskView({ fields, defaultValues, validationSchema, isTablet, handleClose, handlePostRisk }) {
  const classes = makeStyles(styles, { name: 'AddRisk' })();
  const { control, register, watch, errors, handleSubmit, setValue, trigger, formState } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  const conditionalErrors = Object.entries(errors)
    .filter((e) => e[1].type === 'is-conditional-group' || e[1].type === 'is-conditional-field')
    .map((e) => e[0])
    .sort();

  // This is a workaround to force a form validation.
  // Apparently, this is a performance feature of React-Hook-Form, to minimize re-renders,
  // but when field validation is processed for a group or related fields, those dependant
  // fields/errors are not validated.
  //
  // For example, if within a group of 3 fields (A, B, C) at least one is required and you try
  // to submit, all 3 fields will have an error - which is correct. But if the user fills field A,
  // that error would disappear, but fields B and C would still incorrectly display an error.
  //
  // This forces a form validation and clears the errors which should have been cleared onChange.
  useEffect(
    () => {
      if (formState.isSubmitted) {
        trigger();
      }
    },
    [conditionalErrors.join('|')] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const groups = utils.risk.getGroups(fields);

  const generalFields = pick(groups, [RISK_DEFINITION_GENERAL]);
  const partyFields = pick(groups, [RISK_DEFINITION_PARTY]);
  const effectiveFields = pick(groups, [RISK_DEFINITION_EFFECTIVE]);
  const otherFields = omit(groups, [RISK_DEFINITION_GENERAL, RISK_DEFINITION_PARTY, RISK_DEFINITION_EFFECTIVE]);

  const hasGeneralFields = utils.generic.isValidObject(generalFields, RISK_DEFINITION_GENERAL);
  const hasPartyFields = utils.generic.isValidObject(partyFields, RISK_DEFINITION_PARTY);
  const hasEffectiveFields = utils.generic.isValidObject(effectiveFields, RISK_DEFINITION_EFFECTIVE);
  const hasGenericPolicyFields = hasGeneralFields || hasPartyFields || hasEffectiveFields;
  const hasSpecificPolicyFields = utils.generic.isValidArray(Object.entries(otherFields), true);

  const fieldMap = {
    text: FormText,
    number: FormText,
    datepicker: FormDate,
    select: FormSelect,
    autocomplete: FormAutocomplete,
    autocompletemui: FormAutocompleteMui,
    radio: FormRadio,
    checkbox: FormCheckbox,
    toggle: FormToggle,
    hidden: FormHidden,
    label: FormLegend,
  };

  const objectMap = {
    address: AddRiskObjectAddress,
    object: AddRiskObject,
  };

  const tabsErrors = (fields) => {
    return Object.keys(errors).filter((error) => fields.map((field) => field.name).includes(error)).length;
  };

  const tabs = Object.entries(otherFields).map((group) => {
    return { value: group[0], label: utils.string.startCase(group[0]), errors: tabsErrors(group[1]) };
  });

  const tabsOptions = {
    swipeable: true,
    compact: true,
    componentProps: {
      enableMouseEvents: false,
    },
    nestedClasses: {
      tabs: {
        content: classes.tabsContent,
      },
    },
  };

  const renderTabs = (groups, options = {}) => {
    return Object.entries(groups).map((group, index) => {
      const groupName = startCase(group[0]);
      const groupFields = group[1];

      return (
        <div className={classes.content} key={`${index}-${groupName}`}>
          {renderFields(groupFields, options)}
        </div>
      );
    });
  };

  const renderFields = (fieldsArray, options = {}) => {
    return (
      <FormGrid container spacing={4}>
        {fieldsArray.map((field, idx) => {
          const condition = utils.risk.getCondition(field, fields);
          const isValid = !condition || (condition && utils.risk.isConditionValid(condition, watch(condition.name)));
          const hasLegend = isString(field.header);

          const gridField = field.gridSize || get(options, 'gridSize') || {};
          const gridDefault = { xs: 12, sm: 6, md: 4, lg: 3, xl: 2 };
          const gridDefaultValues = Object.values(gridDefault);
          const gridArray = Object.entries(gridDefault).reduce(
            (acc, [prop, item], index) => {
              const value = gridField[prop];
              const hasCustomValue = has(gridField, prop);

              return hasCustomValue ? [...acc.fill(value, index, acc.length)] : acc;
            },
            [...gridDefaultValues]
          );

          const grid = {
            xs: gridArray[0],
            sm: gridArray[1],
            md: gridArray[2],
            lg: gridArray[3],
            xl: gridArray[4],
          };

          const classesHighlight = classnames({
            [classes.highlight]: condition,
          });

          // grid spacer
          if (utils.risk.isGridSpacer(field)) {
            return (
              <FormGrid
                item
                xs={12}
                {...field.gridSize}
                nestedClasses={{ root: classes.spacer }}
                key={`${field.group}-spacer-${idx}`}
                data-testid={`spacer-${field.group}-${idx}`}
              >
                <span />
              </FormGrid>
            );
          }

          // column
          if (utils.risk.isArrayColumn(field)) {
            return (
              isValid && (
                <FormGrid item xs={12} key={`${field.group}-${field.name}`}>
                  <AddRiskColumn field={field} formProps={{ control, register, watch, errors, setValue, trigger }} />
                </FormGrid>
              )
            );
          }

          // row
          if (utils.risk.isArrayTable(field)) {
            return (
              isValid && (
                <FormGrid item xs={12} key={`${field.group}-${field.name}`}>
                  <Box mb={5}>
                    <AddRiskRow field={field} formProps={{ control, register, watch, errors, setValue, trigger }} />
                  </Box>
                </FormGrid>
              )
            );
          }

          // object
          if (utils.risk.isObject(field)) {
            const ObjectComponent = objectMap[field.type];
            return (
              isValid && (
                <FormGrid item xs={12} key={`${field.group}-${field.name}`}>
                  <ObjectComponent field={field} formProps={{ control, register, watch, errors, setValue, trigger }} />
                </FormGrid>
              )
            );
          }

          // abort
          if (!fieldMap[field.type]) return null;

          // field
          return (
            <Fragment key={`${field.group}-${field.name}`}>
              {hasLegend && (
                <FormGrid item xs={12} nestedClasses={{ root: classes.legend }}>
                  <FormLegend text={field.header} />
                </FormGrid>
              )}
              {isValid && (
                <FormGrid item xs={12} {...grid}>
                  <div className={classesHighlight}>
                    <AddRiskFormField field={field} formProps={{ control, register, watch, errors, setValue, trigger }} />
                  </div>
                </FormGrid>
              )}
            </Fragment>
          );
        })}
      </FormGrid>
    );
  };

  return (
    <div className={classes.root}>
      <FormContainer type="dialog" onSubmit={handleSubmit(handlePostRisk)} autoComplete="off" data-testid="risk-form">
        <FormFields type="dialog">
          <Grid container spacing={isTablet ? 6 : 8} data-testid="grid-container">
            {hasGenericPolicyFields && (
              <Grid item xs={12} data-testid="grid-generic">
                <Grid container spacing={6}>
                  {hasGeneralFields && (
                    <Grid item xs={12} sm={hasPartyFields ? (hasEffectiveFields ? 4 : 6) : 12}>
                      <Tabs
                        tabs={[
                          {
                            value: 'tab1',
                            label: utils.string.t('risks.groups.general'),
                            errors: tabsErrors(Object.values(generalFields).flat()),
                          },
                        ]}
                        {...tabsOptions}
                      >
                        {renderTabs(generalFields, { gridSize: { xs: 12, xl: 4 } })}
                      </Tabs>
                    </Grid>
                  )}

                  {hasPartyFields && (
                    <Grid item xs={12} sm={hasGeneralFields ? (hasEffectiveFields ? 4 : 6) : 12}>
                      <Tabs
                        tabs={[
                          {
                            value: 'tab2',
                            label: utils.string.t('risks.groups.partys'),
                            errors: tabsErrors(Object.values(partyFields).flat()),
                          },
                        ]}
                        {...tabsOptions}
                      >
                        {renderTabs(partyFields, { gridSize: { xs: 12, lg: 6 } })}
                      </Tabs>
                    </Grid>
                  )}

                  {hasEffectiveFields && (
                    <Grid item xs={12} sm={hasPartyFields ? (hasGeneralFields ? 4 : 6) : 12}>
                      <Tabs
                        tabs={[
                          {
                            value: 'tab3',
                            label: utils.string.t('risks.groups.effective'),
                            errors: tabsErrors(Object.values(effectiveFields).flat()),
                          },
                        ]}
                        {...tabsOptions}
                      >
                        {renderTabs(effectiveFields, { gridSize: { xs: 12, lg: 6 } })}
                      </Tabs>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            )}

            {hasGenericPolicyFields && hasSpecificPolicyFields && (
              <Grid item xs={12} data-testid="grid-divider">
                <Box mt={-0.5} mb={2}>
                  <Divider />
                </Box>
              </Grid>
            )}

            {hasSpecificPolicyFields && (
              <Grid item xs={12} data-testid="grid-specific">
                <Tabs tabs={tabs} {...tabsOptions}>
                  {renderTabs(otherFields)}
                </Tabs>
              </Grid>
            )}
          </Grid>
        </FormFields>

        <FormActions type="dialog">
          <Button text={<Translate label="app.cancel" />} variant="text" disabled={formState.isSubmitting} onClick={handleClose} />
          <Button text={<Translate label="app.submit" />} type="submit" disabled={formState.isSubmitting} color="primary" />
        </FormActions>
      </FormContainer>
    </div>
  );
}
