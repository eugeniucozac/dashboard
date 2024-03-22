import React from 'react';
import PropTypes from 'prop-types';

// app
import { Button, ErrorMessage } from 'components';
import * as utils from 'utils';

// mui
import { Box, Grid, makeStyles } from '@material-ui/core';
import RiskRowItem from './RiskRowItem';
import LocationAutocomplete from './LocationAutocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import GetAppIcon from '@material-ui/icons/GetApp';
import FileCopyIcon from '@material-ui/icons/FileCopy';

const useStyles = makeStyles((theme) => ({
  buttonAdding: {
    paddingLeft: '30px!important',
  },
  buttonProgress: {
    position: 'absolute',
    top: 15,
    left: 20,
  },
}));

AddRiskRowMultipleView.propTypes = {
  field: PropTypes.object.isRequired,
  cols: PropTypes.array.isRequired,
  validFields: PropTypes.array.isRequired,
  formProps: PropTypes.object.isRequired,
  overflow: PropTypes.bool,
  formatData: PropTypes.string,
  handlers: PropTypes.shape({
    launchPasteFromExcelModal: PropTypes.func.isRequired,
    closePasteFromExcelModal: PropTypes.func.isRequired,
  }),
};

const RenderObjectCards = ({ fields, removeHandler, copyHandler, formProps, definitionsFields }) => {
  return (
    <>
      <Grid container spacing={3} data-testid="grid-container-object-cards">
        {fields.map((item, index) => {
          return (
            <Grid container xs={12} sm={6} md={4} item key={item.id || `${item?.streetAddress}`}>
              <RiskRowItem
                index={index}
                removeHandler={removeHandler}
                copyHandler={copyHandler}
                formProps={formProps}
                definitionsFields={definitionsFields}
              />
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export function AddRiskRowMultipleView({ isAdding, field, formProps, handlers, errors, fields }) {
  const classes = useStyles();

  return (
    <>
      <Box display="flex" alignItems="center" mb={2}>
        <LocationAutocomplete handleAdd={handlers.handleAddNewObj} componentRestrictions={field?.componentRestrictions} />
        <Box position="relative" display="flex">
          <Box ml={1.5} mt={1}>
            <Button
              color="primary"
              size="small"
              variant="outlined"
              icon={isAdding ? null : FileCopyIcon}
              text={isAdding ? utils.string.t('app.addingLocations') : utils.string.t('app.pasteFromExcel')}
              disabled={isAdding}
              nestedClasses={isAdding ? { btn: classes.buttonAdding } : {}}
              onClick={() =>
                handlers.launchPasteFromExcelModal({
                  name: field.name,
                  headers: field.arrayItemDef.reduce((acc, def) => {
                    return def.type === 'hidden' ? [...acc] : [...acc, { key: def.name, value: '' }];
                  }, []),
                  handlers: {
                    submit: (data) => {
                      handlers.appendHandler(data, true);
                      handlers.closePasteFromExcelModal();
                    },
                  },
                })
              }
            />
          </Box>
          <Box ml={1.5} mt={1}>
            <Button
              color="secondary"
              size="small"
              variant="outlined"
              icon={GetAppIcon}
              text={utils.string.t('app.downloadExcelTemplate')}
              onClick={() => handlers.handleDownloadExcelTeamplate()}
            />
          </Box>
          {isAdding ? <CircularProgress color="primary" size={16} className={classes.buttonProgress} /> : null}
        </Box>
      </Box>

      {errors[field?.name]?.type === 'required' ? (
        <Box mb={2}>
          <ErrorMessage size="lg" hint={errors[field?.name].message} error={{}} />
        </Box>
      ) : null}

      <Box>
        <RenderObjectCards
          fields={fields}
          removeHandler={handlers.removeHandler}
          copyHandler={handlers.copyHandler}
          formProps={formProps}
          definitionsFields={field}
        />
      </Box>
    </>
  );
}
