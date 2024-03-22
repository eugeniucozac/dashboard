import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import styles from './OpeningMemoContent.styles';
import { OpeningMemoInfo, OpeningMemoSpecialInstructions, OpeningMemoTabs } from 'modules';
import { Button, DynamicTable, PreventNavigation, SaveBar, Sticky, Translate } from 'components';
import { useMedia } from 'hooks';
import * as utils from 'utils';

// mui
import { Box, Grid, useTheme, makeStyles } from '@material-ui/core';

OpeningMemoContentView.propTypes = {
  columnHeaders: PropTypes.array.isRequired,
  onTabChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  rows: PropTypes.array.isRequired,
  defaultValues: PropTypes.object.isRequired,
  tabs: PropTypes.array.isRequired,
  fields: PropTypes.array.isRequired,
};

export function OpeningMemoContentView({
  columnHeaders,
  onTabChange,
  onSave,
  rows,
  defaultValues,
  tabs,
  fields,
  selectedTab,
  handleFormDirty,
}) {
  const validationSchema = utils.form.getValidationSchema(fields);

  const { reset, handleSubmit, formState, ...formProps } = useForm({ defaultValues, validationSchema });

  const classes = makeStyles(styles, { name: 'OpeningMemoContent' })();
  const refStickyContent = useRef(null);
  const media = useMedia();
  const theme = useTheme();

  const stickyParent = media.tabletUp ? utils.app.getElement('#content') : null;
  const stickyOffset = media.tabletUp ? 0 : theme.mixins.header.height;

  useEffect(
    () => {
      if (!formState.isDirty) return;
      reset(defaultValues);
    },
    [defaultValues] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(
    () => {
      handleFormDirty(formState.isDirty);
    },
    [formState.isDirty] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <form onSubmit={handleSubmit(onSave)} autoComplete="off" data-testid="opening-memo-content">
      <OpeningMemoInfo formProps={formProps} fields={fields} />

      <Box mt={6}>
        <div ref={refStickyContent}>
          <Sticky parent={stickyParent} top={stickyOffset} nestedClasses={{ root: classes.sticky, rootSticky: classes.stickyActive }}>
            <OpeningMemoTabs tabs={tabs} onChange={onTabChange(refStickyContent)} />
          </Sticky>

          {['prePlacing', 'other', 'mrc', 'instructions'].map((key) => (
            <div key={`tabbed-content-${key}`} className={classnames({ [classes.hideContent]: selectedTab !== key })}>
              <DynamicTable formProps={formProps} rows={rows.filter((row) => row.tabKey === key)} columnHeaders={columnHeaders} />
            </div>
          ))}
        </div>
      </Box>

      <OpeningMemoSpecialInstructions formProps={formProps} fields={fields} />

      <SaveBar show={formState.isDirty}>
        <Grid container spacing={2}>
          <Grid item>
            <Button text={<Translate label="app.cancel" />} onClick={() => reset(defaultValues)} />
          </Grid>
          <Grid item>
            <Button color="primary" disabled={formState.isSubmitting} text={<Translate label="app.save" />} type="submit" />
          </Grid>
        </Grid>
      </SaveBar>
      <PreventNavigation dirty={formState.isDirty} />
    </form>
  );
}
