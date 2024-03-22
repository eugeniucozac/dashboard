import React, { Fragment } from 'react';
import { useFormContext } from 'react-hook-form';
import isString from 'lodash/isString';
import classnames from 'classnames';
import get from 'lodash/get';

import * as utils from 'utils';

import { AddRiskColumn, AddRiskObject, AddRiskObjectAddress, AddRiskFormField, AddRiskRow, AddRiskRowMultiple } from 'modules';
import {
  FormAutocomplete,
  FormAutocompleteMui,
  FormAutocompleteMuiAsync,
  FormCheckbox,
  FormDate,
  FormGrid,
  FormHidden,
  FormLegend,
  FormRadio,
  FormSelect,
  FormText,
  FormToggle,
} from 'components';
import Box from '@material-ui/core/Box';

const RenderStep = ({ fieldsArray, fields, definitionsFields, classes, options = {} }) => {
  const { control, register, watch, errors, setValue, trigger } = useFormContext();

  const updateObject = (objName, values) => {
    if (utils.generic.isValidObject(values)) {
      setValue(objName, values);
    }
  };

  const fieldMap = {
    text: FormText,
    number: FormText,
    datepicker: FormDate,
    select: FormSelect,
    selectAsync: FormSelect,
    autocomplete: FormAutocomplete,
    autocompletemui: FormAutocompleteMui,
    autocompletemuiAsync: FormAutocompleteMuiAsync,
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

  return (
    <FormGrid container spacing={4}>
      {fieldsArray.map((field, idx) => {
        const condition = utils.risk.getCondition(field, fields);
        const isValid = !condition || (condition && utils.risk.isConditionValid(condition, watch(condition.name)));

        const hasLegend = isString(field.header);

        const gridField = field.gridSize || get(options, 'gridSize') || {};
        const gridDefault = { xs: 12, sm: 6, md: 4, lg: 4, xl: 4 };
        const grid = gridField
          ? {
              ...(gridField?.xs && { xs: gridField?.xs }),
              ...(gridField?.sm && { sm: gridField?.sm }),
              ...(gridField?.md && { md: gridField?.md }),
              ...(gridField?.lg && { lg: gridField?.lg }),
              ...(gridField?.xl && { xl: gridField?.xl }),
            }
          : gridDefault;

        const classesHighlight = classnames({
          [classes.highlight]: condition,
        });

        const classesLabel = classnames({
          [classes.gridLabel]: field.type === 'label',
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
                  {field.display === 'MULTICARD' ? (
                    <AddRiskRowMultiple
                      field={field}
                      definitionsFields={definitionsFields}
                      formProps={{ control, register, watch, errors, setValue, trigger }}
                      formatData="PROPERTY"
                    />
                  ) : (
                    <AddRiskRow field={field} formProps={{ control, register, watch, errors, setValue, trigger }} />
                  )}
                </Box>
              </FormGrid>
            )
          );
        }

        // object
        if (utils.risk.isObject(field)) {
          const ObjectComponent = objectMap[field.type];

          return field?.hidden ? (
            <>
              <ObjectComponent field={field} formProps={{ control, register, watch, errors, setValue, trigger }} />
            </>
          ) : isValid ? (
            <FormGrid item xs={12} key={`${field.group}-${field.name}`}>
              <ObjectComponent field={field} formProps={{ control, register, watch, errors, setValue, trigger }} />
            </FormGrid>
          ) : null;
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
            {isValid ? (
              utils.risk.isHiddenField(field) ? (
                <AddRiskFormField variant="outlined" field={field} formProps={{ control, register, watch, errors, setValue, trigger }} />
              ) : (
                <FormGrid item xs={12} {...grid} nestedClasses={{ root: classesLabel }}>
                  <div className={classesHighlight}>
                    <AddRiskFormField
                      variant="outlined"
                      field={field}
                      formProps={{ control, register, watch, errors, setValue, trigger }}
                      handleUpdateObject={updateObject}
                    />
                  </div>
                </FormGrid>
              )
            ) : null}
          </Fragment>
        );
      })}
    </FormGrid>
  );
};

export default RenderStep;
