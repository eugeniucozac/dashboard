import React, { useState, useEffect } from 'react';
import { useWatch, useFormContext } from 'react-hook-form';
import merge from 'lodash/merge';
import isString from 'lodash/isString';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import FileCopyIcon from '@material-ui/icons/FileCopy';

import * as utils from 'utils';

import { FormLegend, Tooltip, ModalDialog } from 'components';
import { AddRiskFormField } from 'modules';

const useStyles = makeStyles((theme) => ({
  root: { marginBottom: 20, width: '100%' },
  text: {
    color: 'black!important',
    fontWeight: 'bold',
  },
  error: {
    color: `${theme.palette.error.main}!important`,
  },
  valid: {
    color: 'black!important',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  legend: {
    '&:not(:first-child) > legend': {
      marginTop: '10px !important',
    },
    '& > legend': {
      marginBottom: 0,
    },
  },
}));

const renderValue = (field, value) => {
  let prefix = '';
  let suffix = '';
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
    case 'autocompletemui': {
      newValue = value?.label || '';
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

const EditForm = ({ item, definitionsFields, index, formProps, setValue }) => {
  const classes = useStyles();
  const visibleDefs = definitionsFields.arrayItemDef.filter((f) => f.type !== 'hidden');
  const hiddenDefs = definitionsFields.arrayItemDef.filter((f) => f.type === 'hidden');

  useEffect(() => {
    if (definitionsFields.itemTitleField && definitionsFields.itemTitle) {
      const fieldName = `${definitionsFields.name}[${index}].${definitionsFields.itemTitleField}`;
      const fieldValue = `${definitionsFields.itemTitle} ${index + 1}`;
      setValue(fieldName, fieldValue);
    }
  }, [definitionsFields.itemTitle, definitionsFields.itemTitleField, definitionsFields.name, index, setValue]);

  return (
    <Grid container spacing={2} data-testid="grid-container" style={{ overflowY: 'auto' }}>
      <Grid item xs={12} key={item.id} style={{ margin: '20px 30px' }}>
        {hiddenDefs.map((def) => {
          return (
            <AddRiskFormField
              field={{
                ...def,
                name: `${definitionsFields.name}[${index}].${def.name}`,
                defaultValue: item[def.name],
              }}
              formProps={formProps}
            />
          );
        })}
        <Grid container spacing={3} data-testid="grid-container">
          {visibleDefs.map((def, defIndex) => {
            const { label, ...fieldProps } = def;
            const condition = utils.risk.getCondition(def, definitionsFields.arrayItemDef);
            const conditionValue = condition && formProps.watch(`${definitionsFields.name}[${index}].${condition.name}`);

            const isValid = !condition || (condition && utils.risk.isConditionValid(condition, conditionValue));
            const isDisabled = condition && !isValid;
            const hasLegend = isString(def.header);

            return (
              <>
                {hasLegend && (
                  <Grid item xs={12} className={classes.legend}>
                    <FormLegend text={def.header} />
                  </Grid>
                )}
                {isValid ? (
                  <Grid item xs={6} sm={6} md={4} key={`visible-${item.id}`}>
                    <AddRiskFormField
                      field={{
                        ...fieldProps,
                        label: label,
                        name: `${definitionsFields.name}[${index}].${def.name}`,
                        defaultValue: item[def.name],
                        muiComponentProps: merge(fieldProps.muiComponentProps || {}, {
                          ...(['text', 'number'].includes(def.type) && { InputProps: { disabled: isDisabled || def.disabled } }),
                        }),
                      }}
                      formProps={formProps}
                    />
                  </Grid>
                ) : null}
              </>
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default function RiskRowItem({ index, definitionsFields, removeHandler, copyHandler, formProps }) {
  const [isBuildingEditOpen, setIsBuildingEditOpen] = useState(false);
  const classes = useStyles();

  const { errors, setValue } = useFormContext();
  const data = useWatch({
    control: formProps?.control,
    name: definitionsFields.name,
  });

  const item = data && data[index];

  const actions = [
    {
      name: 'ok',
      type: 'ok',
      color: 'secondary',
      label: utils.string.t('app.confirm'),
    },
  ];

  const handleOpenEdit = () => {
    setIsBuildingEditOpen(true);
  };

  const handleCloseEdit = () => {
    setIsBuildingEditOpen(false);
  };

  const visibleDefs = definitionsFields.arrayItemDef.filter((f) => f.type !== 'hidden');

  return (
    <Card raised elevation={2} className={classes.root}>
      <CardHeader
        action={
          <>
            <Tooltip title={`Duplicate ${definitionsFields?.itemTitle}`} placement="top">
              <IconButton aria-label="Duplicate" size="small" onClick={() => copyHandler(index)}>
                <FileCopyIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={`Edit ${definitionsFields?.itemTitle}`} placement="top">
              <IconButton aria-label="Edit" size="small" onClick={handleOpenEdit}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={`Delete ${definitionsFields?.itemTitle}`} placement="top">
              <IconButton aria-label="Delete" size="small" onClick={() => removeHandler(index)}>
                <DeleteForeverIcon />
              </IconButton>
            </Tooltip>
          </>
        }
        title={`${definitionsFields?.itemTitle} ${index + 1}`}
        subheader=""
      />
      <ModalDialog
        actions={actions}
        title={`Edit ${item?.buildingTitle ? item.buildingTitle : ''}`}
        fullWidth
        disableBackdropClick
        enableFullScree={false}
        maxWidth="lg"
        cancelHandler={handleCloseEdit}
        hideModal={handleCloseEdit}
        visible={isBuildingEditOpen}
      >
        <EditForm
          definitionsFields={definitionsFields}
          item={item}
          index={index}
          formProps={formProps}
          classes={classes}
          setValue={setValue}
          errors={errors}
        />
      </ModalDialog>

      <CardContent>
        {visibleDefs.map((def) => {
          const isFieldInValid =
            errors &&
            errors[definitionsFields.name] &&
            errors[definitionsFields.name][index] &&
            utils.generic.isValidObject(errors[definitionsFields.name][index], def.name);

          const condition = utils.risk.getCondition(def, definitionsFields.arrayItemDef);
          const conditionValue = condition && formProps.watch(`${definitionsFields.name}[${index}].${condition.name}`);

          const isValid = !condition || (condition && utils.risk.isConditionValid(condition, conditionValue));

          return isValid ? (
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={6} sm={6}>
                <Typography variant="body2" component="p" classes={{ root: isFieldInValid ? classes.error : classes.valid }}>
                  {def.label}:
                </Typography>
              </Grid>
              <Grid item xs={6} sm={6}>
                <Typography variant="body2" component="p" classes={{ root: classes.text }}>
                  {item && renderValue(def, item[def.name])}
                </Typography>
              </Grid>
            </Grid>
          ) : null;
        })}
      </CardContent>
    </Card>
  );
}
