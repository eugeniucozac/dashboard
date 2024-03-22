import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import get from 'lodash/get';

// app
import styles from './PolicyDocumentsUpload.styles';
import {
  Button,
  FormActions,
  FormContainer,
  FormDate,
  FormFields,
  FormFileDrop,
  FormGrid,
  FormHidden,
  FormLabel,
  FormRadio,
  FormText,
  FormAutocompleteMui,
  TableCell,
  TableHead,
  Warning,
} from 'components';
import * as utils from 'utils';
import { useFormActions, useMedia } from 'hooks';

// mui
import { makeStyles, Box, Table, TableBody, TableRow } from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

PolicyDocumentsUploadView.propTypes = {
  resetKey: PropTypes.string.isRequired,
  searchFields: PropTypes.array.isRequired,
  fields: PropTypes.array.isRequired,
  documentTypeField: PropTypes.object.isRequired,
  actions: PropTypes.array,
  searchReferenceType: PropTypes.string.isRequired,
  warnings: PropTypes.object.isRequired,
  isPolicyDataLoaded: PropTypes.bool.isRequired,
  handlers: PropTypes.shape({
    getFileKey: PropTypes.func.isRequired,
    onRadioClick: PropTypes.func.isRequired,
    onFetchPolicy: PropTypes.func.isRequired,
    onFilesAdded: PropTypes.func.isRequired,
    onFilesRemoved: PropTypes.func.isRequired,
  }).isRequired,
};

export function PolicyDocumentsUploadView({
  resetKey,
  searchFields,
  fields,
  documentTypeField,
  actions,
  searchReferenceType,
  warnings,
  isPolicyDataLoaded,
  handlers,
}) {
  const classes = makeStyles(styles, { name: 'PolicyDocumentsUpload' })();
  const media = useMedia();

  const defaultValues = utils.form.getInitialValues(fields);
  const defaultValuesSearch = utils.form.getInitialValues(searchFields);

  const validationSchema = utils.form.getValidationSchema(fields);

  const { control, reset, errors, handleSubmit, formState } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  const {
    control: controlSearch,
    watch: watchSearch,
    errors: errorsSearch,
  } = useForm({
    defaultValues: defaultValuesSearch,
  });

  const {
    fields: fieldsArray,
    append: appendFieldArray,
    remove: removeFieldArray,
  } = useFieldArray({
    control,
    name: 'files',
  });

  const { cancel, submit } = useFormActions(actions, reset);

  const isRisk = searchReferenceType === 'risk';
  const isClaim = searchReferenceType === 'claim';
  const isFetchEnabled = (isRisk && watchSearch('riskReference')) || (isClaim && watchSearch('claimReference'));

  const { label: labelRisk, ...riskProps } = utils.form.getFieldProps(searchFields, 'riskReference', controlSearch, errorsSearch);
  // const { label: labelClaim, ...claimProps } = utils.form.getFieldProps(searchFields, 'claimReference', controlSearch, errorsSearch);

  const cols = [
    { id: 'filename', label: utils.string.t('app.filename') },
    { id: 'documentType', style: { width: media.mobile || media.tablet ? '50%' : 300 }, label: utils.string.t('app.documentType') },
    { id: 'actions', empty: true, menu: true },
  ];

  const hasTooManyFilesErrors = Boolean(warnings?.tooManyFiles?.message);
  const hasWarnings = Boolean(Object.values(warnings).some((w) => w.message));

  useEffect(
    () => {
      reset(defaultValues);
    },
    [resetKey] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <div className={classes.root}>
      <FormContainer type="dialog" onSubmit={handleSubmit(submit.handler)} data-testid="form-PolicyDocumentsUpload">
        <FormFields type="dialog">
          <div className={classes.search}>
            <div className={classes.searchContent}>
              <div className={classes.searchContainer}>
                <FormRadio
                  name="radioRiskRef"
                  muiFormGroupProps={{
                    value: searchReferenceType,
                    onChange: handlers.onRadioClick,
                    nestedClasses: { root: classes.searchFieldRadioGroup },
                  }}
                  options={[{ name: 'risk', value: 'risk' }]}
                />
                <FormLabel label={labelRisk} nestedClasses={{ root: classes.searchFieldLabel }} />
                <div className={classes.searchFieldAutocomplete}>
                  <FormAutocompleteMui {...riskProps} />
                </div>
              </div>
              {/* <div className={classes.searchContainer}>
                <FormRadio
                  name="radioClaimRef"
                  muiFormGroupProps={{
                    value: searchReferenceType,
                    onChange: handlers.onRadioClick,
                    nestedClasses: { root: classes.searchFieldRadioGroup },
                  }}
                  options={[{ name: 'claim', value: 'claim' }]}
                />
                <FormLabel label={labelClaim} nestedClasses={{ root: classes.searchFieldLabel }} />
                <div className={classes.searchFieldAutocomplete}>
                  <FormAutocompleteMui {...riskProps} />
                </div>
              </div> */}
            </div>
            <div className={classes.searchButton}>
              <Button
                text={utils.string.t('fileUpload.fetch')}
                disabled={!isFetchEnabled}
                onClick={() => {
                  const referenceValue =
                    searchReferenceType === 'risk'
                      ? watchSearch('riskReference')
                      : searchReferenceType === 'claim'
                      ? watchSearch('claimReference')
                      : null;

                  handlers.onFetchPolicy(referenceValue);
                }}
                color="secondary"
              />
            </div>
          </div>

          {isPolicyDataLoaded && (
            <FormGrid container key={resetKey}>
              <FormGrid item xs={12} sm={6} md={4}>
                <FormAutocompleteMui {...utils.form.getFieldProps(fields, 'sectionType', control, errors)} />
              </FormGrid>
              <FormGrid item xs={12} sm={6} md={4} lg={2}>
                <FormDate {...utils.form.getFieldProps(fields, 'inceptionDate', control, errors)} />
              </FormGrid>
              <FormGrid item xs={12} sm={6} md={4} lg={2}>
                <FormDate {...utils.form.getFieldProps(fields, 'expiryDate', control, errors)} />
              </FormGrid>
              <FormGrid item xs={12} sm={6} md={4}>
                <FormAutocompleteMui {...utils.form.getFieldProps(fields, 'department', control, errors)} />
              </FormGrid>
              <FormGrid item xs={12} sm={6} md={4}>
                <FormText {...utils.form.getFieldProps(fields, 'insuredName', control, errors)} />
              </FormGrid>
              <FormGrid item xs={12} sm={6} md={4} lg={2}>
                <FormText {...utils.form.getFieldProps(fields, 'policyRef', control, errors)} />
              </FormGrid>
              <FormGrid item xs={12} sm={6} md={4} lg={2}>
                <FormText {...utils.form.getFieldProps(fields, 'umr', control, errors)} />
              </FormGrid>
              <FormGrid item xs={12} sm={6} md={4} lg={4}>
                <FormAutocompleteMui {...utils.form.getFieldProps(fields, 'xbInstance', control, errors)} />
              </FormGrid>
              <FormGrid item xs={12} sm={6} md={4} lg={4}>
                <FormAutocompleteMui {...utils.form.getFieldProps(fields, 'sourceSystem', control, errors)} />
              </FormGrid>
              <FormGrid item xs={12} sm={6} md={4} lg={2}>
                <FormDate {...utils.form.getFieldProps(fields, 'uploadDate', control, errors)} />
              </FormGrid>
              <FormGrid item xs={12} sm={6} md={6}>
                <FormAutocompleteMui {...utils.form.getFieldProps(fields, 'uploadBy', control, errors)} />
              </FormGrid>
              <FormGrid item xs={12}>
                <FormFileDrop
                  {...utils.form.getFieldProps(fields, 'filesUpload', control, errors)}
                  onChange={(files, rejectedFiles) => {
                    let hasDuplicates = false;

                    const uniqueFiles = files
                      .reduce((acc, cur) => {
                        const isDuplicate = fieldsArray.find((f) => {
                          return handlers.getFileKey(f.file) === handlers.getFileKey(cur);
                        });

                        if (isDuplicate) {
                          hasDuplicates = true;
                        }

                        return isDuplicate ? acc : [...acc, cur];
                      }, [])
                      .map((f) => ({ file: f, name: f.name, type: null }));

                    handlers.onFilesAdded([...fieldsArray, ...uniqueFiles], rejectedFiles, hasDuplicates);

                    if (utils.generic.isValidArray(uniqueFiles, true)) {
                      appendFieldArray(uniqueFiles);
                    }
                  }}
                />
              </FormGrid>
            </FormGrid>
          )}

          <FormHidden {...utils.form.getFieldProps(fields, 'policyID', control, errors)} />
          <FormHidden {...utils.form.getFieldProps(fields, 'insuredID', control, errors)} />

          <FormGrid container>
            {hasWarnings && (
              <FormGrid item xs={12}>
                <Box mb={-3} display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                  {Object.entries(warnings)
                    .filter(([type, obj]) => Boolean(obj.message))
                    .map(([type, obj]) => {
                      return (
                        <Box key={type} mb={1}>
                          <Warning icon border type={obj.type} text={obj.message} />
                        </Box>
                      );
                    })}
                </Box>
              </FormGrid>
            )}

            <FormGrid item xs={12}>
              {utils.generic.isValidArray(fieldsArray, true) && (
                <Table>
                  <TableHead columns={cols} />
                  <TableBody>
                    {fieldsArray.map(({ file, name, type }, index) => {
                      return (
                        <TableRow key={handlers.getFileKey(file)}>
                          <TableCell compact>
                            <FormText
                              control={control}
                              type="text"
                              name={`files.${index}.name`}
                              defaultValue={name}
                              muiComponentProps={{
                                size: 'small',
                                classes: { root: classes.filenameRoot },
                                InputProps: {
                                  readOnly: true,
                                  disabled: true,
                                  classes: { root: classes.filenameBase, input: classes.filenameInput },
                                },
                              }}
                              errors={errors}
                            />
                            <FormHidden type="hidden" control={control} name={`files.${index}.file`} defaultValue={file} />
                          </TableCell>
                          <TableCell compact>
                            <FormAutocompleteMui
                              {...documentTypeField}
                              control={control}
                              name={`files.${index}.type`}
                              error={get(errors, `files[${index}].type`)}
                            />
                          </TableCell>
                          <TableCell menu>
                            <Button
                              icon={HighlightOffIcon}
                              variant="text"
                              danger
                              size="small"
                              onClick={() => {
                                const updatedFilesArray = fieldsArray.filter((file, fileIndex) => {
                                  return fileIndex !== index;
                                });

                                handlers.onFilesRemoved(updatedFilesArray);
                                removeFieldArray(index);
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </FormGrid>
          </FormGrid>
        </FormFields>

        <FormActions type="dialog">
          {cancel && <Button text={cancel.label} variant="text" disabled={formState.isSubmitting} onClick={cancel.handler} />}
          {submit && (
            <Button
              text={submit.label}
              type="submit"
              disabled={fieldsArray.length === 0 || formState.isSubmitting || !isPolicyDataLoaded || hasTooManyFilesErrors}
              onClick={handleSubmit(submit.handler)}
              color="primary"
            />
          )}
        </FormActions>
      </FormContainer>
    </div>
  );
}
