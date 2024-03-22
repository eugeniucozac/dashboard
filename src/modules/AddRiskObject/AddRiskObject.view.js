import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isString from 'lodash/isString';

// app
import styles from './AddRiskObject.styles';
import { FormGrid, FormLegend } from 'components';
import { AddRiskFormField } from 'modules';
import * as utils from 'utils';

// mui
import { Collapse, makeStyles } from '@material-ui/core';

AddRiskObjectView.propTypes = {
  field: PropTypes.object.isRequired,
  formProps: PropTypes.object.isRequired,
};

export function AddRiskObjectView({ field, formProps }) {
  const classes = makeStyles(styles, { name: 'AddRiskObjectView' })();

  const validFields = [
    'text',
    'number',
    'datepicker',
    'select',
    'autocomplete',
    'autocompletemuiAsync',
    'radio',
    'checkbox',
    'toggle',
    'hidden',
    'spacer',
    'label',
  ];

  return (
    <FormGrid container spacing={4}>
      {field.objectDef.map((def, idx) => {
        if (!validFields.includes(def.type)) return null;

        const condition = utils.risk.getCondition(def, field.objectDef);
        const conditionValue = condition && formProps.watch(`${field.name}.${condition.name}`);
        const isValid = !condition || (condition && utils.risk.isConditionValid(condition, conditionValue));
        const hasLegend = isString(def.header);

        const gridClasses = {
          root: classnames({
            [classes.grid]: true,
            [classes.gridCollapsed]: Boolean(condition && !isValid),
          }),
        };

        // grid spacer
        if (utils.risk.isGridSpacer(def)) {
          return (
            <FormGrid
              item
              xs={12}
              {...def.gridSize}
              nestedClasses={{ root: classes.spacer }}
              key={`${field.name}-spacer-${idx}`}
              data-testid={`spacer-${field.name}-${idx}`}
            >
              <span />
            </FormGrid>
          );
        }

        return (
          <Fragment key={def.name}>
            {hasLegend && (
              <FormGrid item xs={12} nestedClasses={{ root: classes.legend }}>
                <FormLegend text={def.header} />
              </FormGrid>
            )}
            {utils.risk.isHiddenField(def) ? (
              <AddRiskFormField
                field={{
                  ...def,
                  name: `${field.name}.${def.name}`,
                  defaultValue: def.value,
                }}
                formProps={formProps}
              />
            ) : (
              <FormGrid item xs={12} {...def.gridSize} nestedClasses={gridClasses}>
                <Collapse in={isValid}>
                  <AddRiskFormField
                    field={{
                      ...def,
                      name: `${field.name}.${def.name}`,
                      defaultValue: def.value,
                    }}
                    formProps={formProps}
                  />
                </Collapse>
              </FormGrid>
            )}
          </Fragment>
        );
      })}
    </FormGrid>
  );
}
