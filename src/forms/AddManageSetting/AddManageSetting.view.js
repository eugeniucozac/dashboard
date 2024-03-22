import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';

// app
import styles from './AddManageSetting.styles';
import * as utils from 'utils';
import { showModal, hideModal } from 'stores';
import {
  FormFileDrop,
  FormGrid,
  FormFields,
  Button,
  TableHead,
  TableCell,
  FormText,
  FormHidden,
  FormContainer,
  FormActions,
  Warning,
  FormAutocompleteMui,
  Overflow,
} from 'components';
import get from 'lodash/get';

// mui
import { makeStyles, Box, Table, TableBody, TableRow, Typography, Divider } from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

AddManageSettingView.propTypes = {
  riskRef: PropTypes.object.isRequired,
  cols: PropTypes.array.isRequired,
  actions: PropTypes.array.isRequired,
  warnings: PropTypes.object.isRequired,
  fields: PropTypes.array.isRequired,
  endorseFaBorderProcessType: PropTypes.bool,
  handlers: PropTypes.shape({
    getFileKey: PropTypes.func.isRequired,
    onFilesAdded: PropTypes.func.isRequired,
    onFilesRemoved: PropTypes.func.isRequired,
  }).isRequired,
};

export function AddManageSettingView({
  riskRef,
  cols,
  actions,
  warnings,
  handlers,
  fields,
  documentTypeField,
  endorseFaBorderProcessType,
}) {
  const classes = makeStyles(styles, { name: 'AddManageSetting' })();
  const dispatch = useDispatch();
  const defaultValues = utils.form.getInitialValues(fields);
  const cancel = actions && actions.find((action) => action.name === 'cancel' && action.handler);
  const submit = actions && actions.find((action) => action.name === 'submit' && action.handler);
  const validationSchema = utils.form.getValidationSchema(fields);
  const hasTooManyFilesErrors = Boolean(warnings?.tooManyFiles?.message);
  const hasWarnings = Boolean(Object.values(warnings).some((w) => w.message));
  const { control, reset, errors, handleSubmit, formState } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });
  const {
    fields: fieldsArray,
    append: appendFieldArray,
    remove: removeFieldArray,
  } = useFieldArray({
    control,
    name: 'files',
  });

  const cancelModal = () => {
    if (utils.generic.isValidArray(fieldsArray, true)) {
      dispatch(
        showModal({
          component: 'CONFIRM',
          props: {
            fullWidth: true,
            title: utils.string.t('app.confirmation'),
            maxWidth: 'xs',
            componentProps: {
              confirmLabel: utils.string.t('app.ok'),
              cancelLabel: utils.string.t('app.goBack'),
              confirmMessage: utils.string.t('processingInstructions.documentsWillNotBeSaved'),
              buttonColors: { confirm: 'secondary', cancel: 'primary' },
              submitHandler: () => {
                dispatch(hideModal());
              },
              cancelHandler: () => {},
              handleClose: () => {},
            },
          },
        })
      );
    } else {
      dispatch(hideModal());
    }
  };

  useEffect(
    () => {
      reset(defaultValues);
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <div className={classes.root}>
      <Overflow>
        <FormContainer onSubmit={handleSubmit(submit.handler)} nestedClasses={{ root: classes.margin0 }}>
          <FormFields nestedClasses={{ root: classes.padding_0_30 }}>
            <FormGrid item xs={12}>
              <Box my={2}>
                <FormFileDrop
                  {...utils.form.getFieldProps(fields, 'filesUpload')}
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
              </Box>
            </FormGrid>
            <FormGrid item xs={12}>
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

              {utils.generic.isValidArray(fieldsArray, true) && (
                <Box>
                  <Typography className={classes.subTitle}>
                    {utils.string.t('processingInstructions.manageDocuments.documentsAddedGxbForRiskRef', {
                      riskRefId: riskRef?.riskRefId,
                    })}
                  </Typography>
                  <Divider />
                  <div className={classes.enableScroll}>
                    <Table>
                      <TableHead columns={cols} nestedClasses={{ tableHead: classes.tableHead }} />
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
                              {endorseFaBorderProcessType && (
                                <TableCell compact>
                                  <FormAutocompleteMui
                                    {...documentTypeField}
                                    control={control}
                                    name={`files.${index}.type`}
                                    error={get(errors, `files[${index}].type`)}
                                  />
                                </TableCell>
                              )}
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
                  </div>
                </Box>
              )}
            </FormGrid>
          </FormFields>
          <FormActions type="dialog">
            {cancel && (
              <Button
                text={cancel.label}
                variant="text"
                disabled={formState.isSubmitting}
                onClick={() => {
                  cancelModal();
                }}
              />
            )}
            {submit && (
              <Button
                text={submit.label}
                type="submit"
                disabled={fieldsArray.length === 0 || formState.isSubmitting || hasTooManyFilesErrors}
                color="primary"
              />
            )}
          </FormActions>
        </FormContainer>
      </Overflow>
    </div>
  );
}
