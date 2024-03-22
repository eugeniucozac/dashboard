import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useFieldArray } from 'react-hook-form';
import classnames from 'classnames';
import omit from 'lodash/omit';
import mapValues from 'lodash/mapValues';

// app
import styles from './AddRiskColumn.styles';
import { Button, FormGrid, FormLegend } from 'components';
import { AddRiskFormField } from 'modules';
import * as utils from 'utils';

// mui
import { Box, Divider, makeStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import isString from 'lodash/isString';

AddRiskColumnView.propTypes = {
  field: PropTypes.object.isRequired,
  formProps: PropTypes.object.isRequired,
};

export function AddRiskColumnView({ field, formProps }) {
  const classes = makeStyles(styles, { name: 'AddRiskColumn' })();

  const validFields = ['text', 'number', 'datepicker', 'select', 'autocomplete', 'radio', 'checkbox', 'toggle', 'hidden', 'spacer'];

  const { fields, append, remove } = useFieldArray({
    control: formProps.control,
    name: field.name,
  });

  const getEmptyObject = () => {
    return mapValues(omit(fields[0], ['id']), () => '');
  };

  const appendHandler = () => {
    append(getEmptyObject());
  };

  const removeHandler = (idx) => {
    if (fields && fields.length === 1 && idx === 0) {
      formProps.setValue(field.name, [getEmptyObject()]);
    } else {
      remove(idx);
    }
  };

  return (
    <>
      {fields.map((item, index) => {
        return (
          <Fragment key={item.id}>
            {fields.length > 1 && index > 0 && (
              <Box mt={4.5} mb={3.5}>
                <Divider classes={{ root: classes.divider }} />
              </Box>
            )}

            <FormGrid container spacing={4}>
              {field.arrayItemDef.map((def, idx) => {
                if (!validFields.includes(def.type)) return null;

                const condition = utils.risk.getCondition(def, field.arrayItemDef);
                const conditionValue = condition && formProps.watch(`${field.name}[${index}].${condition.name}`);
                const isValid = !condition || (condition && utils.risk.isConditionValid(condition, conditionValue));
                const hasLegend = isString(def.header);

                const classesHighlight = classnames({
                  [classes.highlight]: condition,
                });

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
                    {isValid && (
                      <FormGrid item xs={12} {...(def.gridSize || {})}>
                        <div className={classesHighlight}>
                          <AddRiskFormField
                            field={{
                              ...def,
                              name: `${field.name}[${index}].${def.name}`,
                              defaultValue: item[def.name],
                            }}
                            formProps={formProps}
                          />
                        </div>
                      </FormGrid>
                    )}
                  </Fragment>
                );
              })}
            </FormGrid>

            <Box mt={2} mb={4.5}>
              <Button
                danger
                disabled={fields.length === 1}
                icon={HighlightOffIcon}
                variant={'outlined'}
                size="small"
                text={utils.string.t('app.delete')}
                onClick={() => removeHandler(index)}
                data-testid="btn-delete"
              />
            </Box>
          </Fragment>
        );
      })}

      <Box mt={2} mb={5}>
        <Button
          color="secondary"
          size="small"
          icon={AddIcon}
          text={utils.string.t('risks.add', { name: field.name })}
          onClick={appendHandler}
        />
      </Box>
    </>
  );
}
