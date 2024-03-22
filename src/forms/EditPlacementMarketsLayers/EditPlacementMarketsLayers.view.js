import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import get from 'lodash/get';

// app
import styles from './EditPlacementMarketsLayers.styles';
import {
  Button,
  Empty,
  FormActions,
  FormAutocompleteMui,
  FormCheckbox,
  FormContainer,
  FormDate,
  FormFields,
  FormGrid,
  FormHidden,
  FormSelect,
  FormText,
  PreventNavigation,
} from 'components';
import { ReactComponent as IconSearchFile } from '../../assets/svg/line-icon-search-file.svg';
import AddIcon from '@material-ui/icons/Add';
import { useFormActions, useMedia } from 'hooks';
import * as utils from 'utils';

// mui
import { makeStyles, Box, Collapse } from '@material-ui/core';

EditPlacementMarketsLayersView.propTypes = {
  fields: PropTypes.array,
  actions: PropTypes.array,
  hasLayers: PropTypes.bool,
  handlers: PropTypes.shape({
    isStatusDeclined: PropTypes.func,
    isStatusQuoted: PropTypes.func,
    handleAddLayerClick: PropTypes.func,
  }),
};

export function EditPlacementMarketsLayersView({ fields, actions, hasLayers, handlers }) {
  const classes = makeStyles(styles, { name: 'EditPlacementMarketsLayers' })();
  const media = useMedia();

  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);

  const { control, errors, watch, register, reset, handleSubmit, formState } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  // DO NO REMOVE!!!
  // formState needs to be read/invoked before render otherwise it isn't updated
  // https://react-hook-form.com/api/#formState
  const [dirtyFields] = useState(formState.dirtyFields);

  const layerValue = watch('layer');

  useEffect(() => {
    layerValue?.id === 0 && handlers.resetLayer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layerValue]);

  const { submit, secondary } = useFormActions(actions, reset, dirtyFields);
  const closeAction = (actions && actions.find((action) => action.name === 'close')) || {};
  const resetAction = (actions && actions.find((action) => action.name === 'reset')) || {};

  const isMarketStatusDeclined = handlers.isStatusDeclined(watch('market_statusId'));
  const isLayerMarketStatusDeclined = handlers.isStatusDeclined(watch('layerMarket_statusId'));

  return (
    <div className={classes.root}>
      <FormContainer type="dialog" onSubmit={handleSubmit(submit.handler)} data-testid="edit-placement-market">
        <FormFields type="dialog">
          <div className={classes.container}>
            <Box pr={4} className={classes.left}>
              <FormGrid container spacing={3}>
                <FormGrid item xs={12}>
                  <FormAutocompleteMui {...utils.form.getFieldProps(fields, 'market', control, errors)} disabled={formState.isDirty} />
                </FormGrid>

                <FormGrid item xs={12} sm={5}>
                  <FormSelect {...utils.form.getFieldProps(fields, 'market_statusId', control, errors)} />
                </FormGrid>

                <FormGrid item xs={12} sm={7}>
                  <FormAutocompleteMui {...utils.form.getFieldProps(fields, 'market_rationales', control, errors)} />
                </FormGrid>

                <FormGrid item xs={12} nestedClasses={isMarketStatusDeclined ? {} : { root: classes.declinature }}>
                  <Collapse in={isMarketStatusDeclined}>
                    <FormAutocompleteMui {...utils.form.getFieldProps(fields, 'market_declinatures', control, errors)} />
                  </Collapse>
                </FormGrid>

                <FormGrid item xs={12}>
                  <FormAutocompleteMui {...utils.form.getFieldProps(fields, 'market_underwriter', control, errors)} />
                </FormGrid>

                <FormGrid item xs={12}>
                  <FormText {...utils.form.getFieldProps(fields, 'market_notes', control, errors)} />
                </FormGrid>
              </FormGrid>
            </Box>
            <Box pl={4} className={classes.right}>
              {hasLayers ? (
                <FormGrid container spacing={3}>
                  <FormGrid item xs={12}>
                    <FormAutocompleteMui {...utils.form.getFieldProps(fields, 'layer', control, errors)} disabled={formState.isDirty} />
                  </FormGrid>

                  <FormGrid item xs={5}>
                    <FormSelect {...utils.form.getFieldProps(fields, 'layerMarket_statusId', control, errors)} />
                  </FormGrid>

                  <FormGrid item xs={7} style={{ paddingTop: media.desktopUp ? 38 : 16 }}>
                    <FormCheckbox
                      {...utils.form.getFieldProps(fields, 'layerMarket_quoteOptions', control, errors)}
                      register={register}
                      watch={watch}
                    />
                  </FormGrid>

                  <FormGrid item xs={12} nestedClasses={isLayerMarketStatusDeclined ? {} : { root: classes.declinature }}>
                    <Collapse in={isLayerMarketStatusDeclined}>
                      <FormAutocompleteMui {...utils.form.getFieldProps(fields, 'layerMarket_declinatures', control, errors)} />
                    </Collapse>
                  </FormGrid>

                  <FormGrid item xs={12} sm={9}>
                    <FormAutocompleteMui
                      {...utils.form.getFieldProps(fields, 'layerMarket_uniqueMarketReference', control)}
                      error={get(errors, 'layerMarket_uniqueMadd LaarketReference.id')}
                    />
                  </FormGrid>

                  <FormGrid item xs={12} sm={3}>
                    <FormText {...utils.form.getFieldProps(fields, 'layerMarket_section', control, errors)} />
                  </FormGrid>

                  <FormGrid item xs={3}>
                    <FormText {...utils.form.getFieldProps(fields, 'layerMarket_currency', control, errors)} />
                  </FormGrid>

                  <FormGrid item xs={6}>
                    <FormAutocompleteMui {...utils.form.getFieldProps(fields, 'layerMarket_premium', control, errors)} />
                  </FormGrid>

                  <FormGrid item xs={3}>
                    <FormText {...utils.form.getFieldProps(fields, 'layerMarket_writtenLinePercentage', control, errors)} />
                  </FormGrid>

                  <FormGrid item xs={6}>
                    <FormDate {...utils.form.getFieldProps(fields, 'layerMarket_quoteDate', control, errors)} />
                  </FormGrid>

                  <FormGrid item xs={6}>
                    <FormDate {...utils.form.getFieldProps(fields, 'layerMarket_validUntilDate', control, errors)} />
                  </FormGrid>

                  <FormGrid item xs={12}>
                    <FormText {...utils.form.getFieldProps(fields, 'layerMarket_subjectivities', control, errors)} />
                  </FormGrid>
                  <FormHidden {...utils.form.getFieldProps(fields, 'layerMarket', control, errors)} />
                </FormGrid>
              ) : (
                <Empty
                  width={300}
                  title={utils.string.t('placement.marketing.noLayerTitle')}
                  text={`${utils.string.t('placement.marketing.noLayerHint')}`}
                  button={{
                    text: utils.string.t('placement.marketing.addLayer'),
                    disabled: formState.isSubmitting || formState.isDirty,
                    icon: AddIcon,
                    action: handlers.handleAddLayerClick,
                  }}
                  icon={<IconSearchFile />}
                  padding
                />
              )}
            </Box>
          </div>
        </FormFields>

        <FormActions type="dialog">
          {closeAction && !formState.isDirty && (
            <Button text={closeAction.label} variant="text" disabled={formState.isSubmitting} onClick={closeAction.callback} />
          )}
          {resetAction && formState.isDirty && (
            <Button text={resetAction.label} variant="text" disabled={formState.isSubmitting} onClick={resetAction.callback(reset)} />
          )}
          {secondary && (
            <Button
              text={secondary.label}
              type="submit"
              disabled={formState.isSubmitting || !formState.isDirty}
              onClick={handleSubmit(secondary.handler)}
              color="secondary"
            />
          )}
          {submit && (
            <Button
              text={submit.label}
              type="submit"
              disabled={formState.isSubmitting || !formState.isDirty}
              onClick={handleSubmit(submit.handler)}
              color="primary"
            />
          )}
        </FormActions>
      </FormContainer>
      <PreventNavigation dirty={formState.isDirty} />
    </div>
  );
}
