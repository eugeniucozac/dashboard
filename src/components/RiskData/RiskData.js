import { useFormContext, useWatch } from 'react-hook-form';
import startCase from 'lodash/startCase';
import toLower from 'lodash/toLower';
import get from 'lodash/get';

// app
import styles from './RiskData.styles';
import { FormGrid, Tooltip } from 'components';
import * as utils from 'utils';
import { RISK_DEFINITION_GENERAL } from 'consts';

// mui
import { Box, Grid, makeStyles, Typography, IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

const RiskData = ({ handleStep, groups, definitionsFields, riskDataValues, isReQuote }) => {
  const classes = makeStyles(styles, { name: 'RiskData' })();
  const { control } = useFormContext();

  const riskValues = useWatch({
    control,
  });

  const checkIsFieldEdited = (name) => {
    const previousValue = get(riskDataValues, `${name}`);
    const currentValue = get(riskValues, `${name}`);

    // TODO check array, multi autocomplete value vs BE values
    if (previousValue || currentValue)
      return utils.generic.isValidObject(currentValue)
        ? `${previousValue}` !== `${currentValue?.value}`
        : `${previousValue}` !== `${currentValue}` || false;

    return false;
  };

  const fieldEditedValues = (name, field) => {
    const previousValue = get(riskDataValues, `${name}`);
    const currentValue = get(riskValues, `${name}`);

    return previousValue || currentValue ? (
      <Box minWidth={150}>
        <Grid container spacing={1}>
          <Grid item xs={3} align="left">
            <Typography variant="body2" align="left" component="span">
              {utils.string.t('products.wasLabel')}:
            </Typography>
          </Grid>
          <Grid item xs={9} align="left">
            <Typography variant="body2" align="left" component="span" className={classes.quoteValue}>
              {previousValue || previousValue === false ? renderValue(field, previousValue) : null}
            </Typography>
          </Grid>
          <Grid item xs={3} align="left">
            <Typography variant="body2" align="left" component="span">
              {utils.string.t('products.nowLabel')}:
            </Typography>
          </Grid>
          <Grid item xs={9} align="left">
            <Typography variant="body2" align="left" component="span" className={classes.quoteValue}>
              {currentValue || currentValue === false ? renderValue(field, currentValue) : null}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    ) : null;
  };

  const renderValue = (field, v) => {
    let prefix = '';
    let suffix = '';
    const value = typeof v !== 'undefined' ? v : riskValues[field.name];
    let newValue = value;

    switch (field.type) {
      case 'number':
        newValue = utils.string.t(`format.number`, { value: { number: value } });
        break;
      case 'toggle':
        newValue =
          value === 'true' || value === true
            ? utils.string.t('app.yes')
            : value === 'false' || value === false
            ? utils.string.t('app.no')
            : '';
        break;
      case 'datepicker':
        newValue = utils.string.t(`format.date`, { value: { date: value } });
        break;
      case 'select': {
        const options = utils.generic.isValidArray(field.options, true) ? field.options : [];
        const option = options.find((o) => String(o.value) === String(value)) || {};

        newValue = option?.label !== 'Select...' ? option.label : '';
        break;
      }
      case 'radio': {
        newValue = value || '';
        break;
      }
      case 'autocompletemui': {
        const options = utils.generic.isValidArray(field.options, true) ? field.options : [];
        const option = options.find((o) => String(o.value) === String(value)) || {};

        newValue = utils.generic.isValidObject(value) ? value?.label : option?.label ? option?.label : value;
        break;
      }
      case 'autocompletemuiAsync': {
        if (utils.generic.isValidArray(value)) {
          newValue = '';
          for (const singleValue of value) {
            newValue = newValue + `${singleValue?.label || singleValue},`;
          }
          newValue = newValue.slice(0, -1);
        } else newValue = value?.label || value;
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

  return (
    <FormGrid container spacing={3} data-testid="risk-data">
      {groups.map((group, index) => {
        const fields = utils.risk.getFieldsByGroup(definitionsFields, group) || [];

        return group === RISK_DEFINITION_GENERAL ? (
          <FormGrid item xs={12} data-testid={`risk-data-${group}`} key={group}>
            <Box className={classes.card}>
              <Box p={2} className={classes.cardTitle}>
                <Typography variant="h3" className={classes.cardTitleHeading}>
                  {startCase(toLower(group))}
                </Typography>
                <IconButton onClick={handleStep(index)} size="small" aria-label="edit">
                  <EditIcon className={classes.editIcon} />
                </IconButton>
              </Box>
              <Box p={2}>
                <FormGrid container spacing={1}>
                  {fields.map((field) => {
                    const value = riskValues[field.name] || null;
                    const condition = utils.risk.getCondition(field, fields);
                    const refValueCondition = condition && riskValues && get(riskValues, `${condition.name}`);
                    const isConditionValid = condition && utils.risk.isConditionValid(condition, refValueCondition);
                    const isFieldEdited = isReQuote && checkIsFieldEdited(field.name);
                    const isHidden = utils.risk.isHiddenField(field);

                    return !isHidden ? (
                      condition === undefined || (condition && isConditionValid) ? (
                        <FormGrid item xs={12} sm={4} key={`${field.label}-${value}`}>
                          <FormGrid container spacing={1} key={field.label}>
                            <FormGrid item xs={6}>
                              <Typography variant="body2" component="span">
                                {field.label}
                              </Typography>
                            </FormGrid>
                            <FormGrid item xs={6} classes={{ root: classes.flexGrid }}>
                              <Typography
                                variant="body2"
                                component="div"
                                style={{ fontWeight: 'bold' }}
                                classes={{ root: isFieldEdited ? classes.edited : '' }}
                              >
                                {renderValue(field)}
                              </Typography>
                              {isFieldEdited ? (
                                <Tooltip title={fieldEditedValues(field.name, field)} placement="top" rich style={{ marginLeft: 5 }}>
                                  <InfoOutlinedIcon fontSize="small" />
                                </Tooltip>
                              ) : null}
                            </FormGrid>
                          </FormGrid>
                        </FormGrid>
                      ) : (
                        <FormGrid item xs={12} sm={4} key={`${field.label}-${value}`} />
                      )
                    ) : null;
                  })}
                </FormGrid>
              </Box>
            </Box>
          </FormGrid>
        ) : (
          <FormGrid item xs={12} sm={6} md={4} data-testid={`risk-data-${group}`} key={group}>
            <Box className={classes.card}>
              <Box p={2} className={classes.cardTitle}>
                <Typography variant="h3" className={classes.cardTitleHeading}>
                  {startCase(toLower(group))}
                </Typography>
                <IconButton onClick={handleStep(index)} size="small" aria-label="edit">
                  <EditIcon className={classes.editIcon} />
                </IconButton>
              </Box>
              <Box p={2}>
                {fields
                  .filter((field) => Boolean(field.name) && field.type !== 'label')
                  .map((field, idx) => {
                    const value = riskValues[field.name] || null;
                    const isArrayColumn = utils.risk.isArrayColumn(field) && utils.generic.isValidArray(value);
                    const isArrayTable = utils.risk.isArrayTable(field) && utils.generic.isValidArray(value);
                    const isObject = utils.risk.isObject(field) && utils.generic.isValidObject(value);
                    const valueArray = isArrayColumn || isArrayTable ? value : [value];
                    const arrayKey = isArrayColumn || isArrayTable ? 'arrayItemDef' : isObject ? 'objectDef' : '';

                    const condition = utils.risk.getCondition(field, fields);
                    const refValueCondition = condition && riskValues && get(riskValues, `${condition.name}`);
                    const isConditionValid = condition && utils.risk.isConditionValid(condition, refValueCondition);

                    if (isArrayColumn || isArrayTable || isObject) {
                      return condition === undefined || (condition && isConditionValid) ? (
                        <FormGrid spacing={2} container key={`${field.label}-${field.label}`}>
                          <FormGrid item xs={12}>
                            {field.label}
                          </FormGrid>

                          {valueArray.map((v, index) => {
                            return (
                              <FormGrid item xs={12} key={`key-${index}`}>
                                <Box className={valueArray?.length > 1 ? `${classes.card} ${classes.cardArray}` : ''}>
                                  {field[arrayKey]
                                    .filter((f) => Boolean(f.name))
                                    .map((arrayField) => {
                                      const fieldName = isObject
                                        ? `${field.name}.${arrayField.name}`
                                        : `${field.name}[${index}].${arrayField.name}`;

                                      const isFieldEdited = isReQuote && checkIsFieldEdited(fieldName);
                                      const isHidden = utils.risk.isHiddenField(arrayField);
                                      const isTitle = utils.risk.isTitleField(arrayField);

                                      return !isHidden || isTitle ? (
                                        <FormGrid spacing={1} container key={`${arrayField.name}-${arrayField.label}`}>
                                          <FormGrid item xs={6}>
                                            <Typography variant="body2" component="span">
                                              {arrayField.label}
                                            </Typography>
                                          </FormGrid>
                                          <FormGrid item xs={6} classes={{ root: classes.flexGrid }}>
                                            <Typography
                                              variant="body2"
                                              component="span"
                                              style={{ fontWeight: 'bold' }}
                                              classes={{ root: isFieldEdited ? classes.edited : '' }}
                                            >
                                              {renderValue(arrayField, v[arrayField.name])}
                                            </Typography>
                                            {isFieldEdited ? (
                                              <Tooltip
                                                title={fieldEditedValues(fieldName, arrayField)}
                                                placement="top"
                                                rich
                                                style={{ marginLeft: 5 }}
                                              >
                                                <InfoOutlinedIcon fontSize="small" />
                                              </Tooltip>
                                            ) : null}
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
                    const isFieldEdited = isReQuote && checkIsFieldEdited(field.name);
                    const isHidden = utils.risk.isHiddenField(field);

                    return !isHidden && (condition === undefined || (condition && isConditionValid)) ? (
                      <FormGrid container spacing={2} key={`${field.name}-${field.label}`}>
                        <FormGrid item xs={6}>
                          <Typography variant="body2" component="span">
                            {field.label || field.title}
                          </Typography>
                        </FormGrid>
                        <FormGrid item xs={6} classes={{ root: classes.flexGrid }}>
                          <Typography
                            variant="body2"
                            component="span"
                            style={{ fontWeight: 'bold' }}
                            classes={{ root: isFieldEdited ? classes.edited : '' }}
                          >
                            {renderValue(field)}
                          </Typography>
                          {isFieldEdited ? (
                            <Tooltip title={fieldEditedValues(field.name, field)} placement="top" rich style={{ marginLeft: 5 }}>
                              <InfoOutlinedIcon fontSize="small" />
                            </Tooltip>
                          ) : null}
                        </FormGrid>
                      </FormGrid>
                    ) : null;
                  })}
              </Box>
            </Box>
          </FormGrid>
        );
      })}
    </FormGrid>
  );
};

export default RiskData;
