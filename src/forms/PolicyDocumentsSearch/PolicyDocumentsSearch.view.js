import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// app
import styles from './PolicyDocumentsSearch.styles';
import {
  Button,
  FormActions,
  FormContainer,
  FormDate,
  FormFields,
  FormGrid,
  FormAutocompleteMui,
  Link,
  Overflow,
  Pagination,
  TableCell,
  TableHead,
  Warning,
} from 'components';
import * as utils from 'utils';
import { useFormActions, useMedia } from 'hooks';

// mui
import { makeStyles, Collapse, Grid, Table, TableBody, TableRow, Box } from '@material-ui/core';

PolicyDocumentsSearchView.propTypes = {
  files: PropTypes.array.isRequired,
  pagination: PropTypes.shape({
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    rowsTotal: PropTypes.number,
  }).isRequired,
  maxResultsWarning: PropTypes.number.isRequired,
  fetched: PropTypes.bool,
  fields: PropTypes.array.isRequired,
  actions: PropTypes.array,
  searchReferenceType: PropTypes.string.isRequired,
  handlers: PropTypes.shape({
    changePage: PropTypes.func.isRequired,
    changeRowsPerPage: PropTypes.func.isRequired,
    download: PropTypes.func.isRequired,
  }).isRequired,
};

export function PolicyDocumentsSearchView({
  files,
  pagination,
  maxResultsWarning,
  fetched,
  fields,
  actions,
  searchReferenceType,
  handlers,
}) {
  const media = useMedia();
  const classes = makeStyles(styles, { name: 'PolicyDocumentsSearch' })({ isMobile: media.mobile, isTablet: media.tablet });

  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);

  const { control, watch, getValues, reset, errors, handleSubmit, formState } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  const { cancel, submit } = useFormActions(actions, reset);

  // todo will be used when "claims" is supported
  // const isRisk = searchReferenceType === 'risk';
  // const isClaim = searchReferenceType === 'claim';
  const isFormFilled = Object.values(watch()).some(Boolean);

  const cols = [
    { id: 'filename', label: utils.string.t('app.filename'), style: { width: '20%' } },
    { id: 'documentType', label: utils.string.t('app.documentType') },
    { id: 'documentVersion', label: utils.string.t('fileUpload.fields.documentVersion.label') },
    { id: 'riskRef', label: utils.string.t('fileUpload.fields.riskRef.label') },
    { id: 'insuredName', label: utils.string.t('app.insured') },
    { id: 'inceptionDate', label: utils.string.t('app.inceptionDate') },
    { id: 'department', label: utils.string.t('app.department') },
    { id: 'xbInstance', label: utils.string.t('app.xbInstance') },
    { id: 'uploadedBy', label: utils.string.t('app.uploadedBy') },
    { id: 'uploadedDate', label: utils.string.t('app.uploadedDate') },
  ];

  const xbInstance = getValues('xbInstance');
  const departmentOptions = utils.form.getFieldProps(fields, 'department')?.options || [];

  return (
    <div className={classes.root}>
      <FormContainer type="dialog" onSubmit={handleSubmit(submit.handler)} data-testid="form-PolicyDocumentsSearch">
        <FormFields type="dialog">
          <Collapse in={!fetched} timeout={500}>
            <FormGrid container>
              <FormGrid item xs={12}>
                <Box mt={0.5} mb={3.5}>
                  <Warning type="info" text={utils.string.t('fileUpload.searchHint')} />
                </Box>
              </FormGrid>
            </FormGrid>
          </Collapse>

          <FormGrid container>
            <FormGrid item xs={12} sm={6} md={6} lg={7}>
              <FormAutocompleteMui {...utils.form.getFieldProps(fields, 'riskReference', control, errors)} />
            </FormGrid>
            <FormGrid item xs={12} sm={6} md={6} lg={5}>
              <FormAutocompleteMui {...utils.form.getFieldProps(fields, 'insuredName', control, errors)} />
            </FormGrid>
            <FormGrid item xs={12} sm={6} md={3} lg={2}>
              <FormAutocompleteMui {...utils.form.getFieldProps(fields, 'xbInstance', control, errors)} />
            </FormGrid>
            <FormGrid item xs={12} sm={6} md={3} lg={5}>
              <FormAutocompleteMui
                key={`${xbInstance?.id}_${departmentOptions.map((o) => o.id).join('-')}`}
                {...utils.form.getFieldProps(fields, 'department', control, errors)}
              />
            </FormGrid>
            <FormGrid item xs={12} sm={7} md={3} lg={3}>
              <FormAutocompleteMui {...utils.form.getFieldProps(fields, 'documentType', control, errors)} />
            </FormGrid>
            <FormGrid item xs={12} sm={5} md={3} lg={2}>
              <FormDate {...utils.form.getFieldProps(fields, 'inceptionYear', control, errors)} />
            </FormGrid>
          </FormGrid>

          <FormGrid container>
            <FormGrid item xs={12}>
              {fetched && files?.length === 0 && (
                <Box mt={2} mb={1} display="flex" justifyContent="center">
                  <Warning type="alert" border icon text={utils.string.t('fileUpload.noResults')} />
                </Box>
              )}
              {fetched && files?.length > 0 && pagination?.rowsTotal > maxResultsWarning && (
                <Box mt={2} mb={2} display="flex" justifyContent="center">
                  <Warning type="alert" border icon text={utils.string.t('fileUpload.tooManyResults', { max: maxResultsWarning })} />
                </Box>
              )}
              {utils.generic.isValidArray(files, true) && (
                <>
                  <Overflow>
                    <Table data-testid="policyDocumentSearch-list">
                      <TableHead columns={cols} />
                      <TableBody>
                        {files.map((file, index) => {
                          // todo
                          // replace index with unique key
                          return (
                            <TableRow key={`${file.documentId}-${file.spdocumentID}-${index}`}>
                              <TableCell
                                compact
                                nestedClasses={{
                                  root: classes.cell,
                                }}
                              >
                                <span className={classes.linkWrapper}>
                                  <Link
                                    target="_blank"
                                    rel="noopener"
                                    color="secondary"
                                    text={file.documentName}
                                    title={file.documentName}
                                    onClick={() => {
                                      handlers.download(file);
                                    }}
                                    nestedClasses={{
                                      link: classes.link,
                                    }}
                                  />
                                </span>
                              </TableCell>
                              <TableCell
                                compact
                                nestedClasses={{
                                  root: classes.cell,
                                }}
                              >
                                {file.documentTypeDescription}
                              </TableCell>
                              <TableCell
                                compact
                                nestedClasses={{
                                  root: classes.cell,
                                }}
                              >
                                {file.documentVersion}
                              </TableCell>
                              <TableCell
                                compact
                                nestedClasses={{
                                  root: classes.cell,
                                }}
                              >
                                {file.policyRef}
                              </TableCell>
                              <TableCell
                                compact
                                nestedClasses={{
                                  root: classes.cell,
                                }}
                              >
                                {file.insuredName}
                              </TableCell>
                              <TableCell
                                compact
                                nowrap
                                nestedClasses={{
                                  root: classes.cell,
                                }}
                              >
                                {utils.string.t('format.date', { value: { date: file.inceptionDate } })}
                              </TableCell>
                              <TableCell
                                compact
                                nestedClasses={{
                                  root: classes.cell,
                                }}
                              >
                                {file.departmentName}
                              </TableCell>
                              <TableCell
                                compact
                                nestedClasses={{
                                  root: classes.cell,
                                }}
                              >
                                {file.xbinstance}
                              </TableCell>
                              <TableCell
                                compact
                                nestedClasses={{
                                  root: classes.cell,
                                }}
                              >
                                {file.uploadedby}
                              </TableCell>
                              <TableCell
                                compact
                                nowrap
                                nestedClasses={{
                                  root: classes.cell,
                                }}
                              >
                                {utils.string.t('format.date', { value: { date: file.uploadeddate } })}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </Overflow>
                  <Grid container>
                    <Grid item xs={12} sm={4} />
                    <Grid item xs={12} sm={8}>
                      <Pagination
                        page={pagination.page}
                        count={pagination.rowsTotal}
                        rowsPerPage={pagination.rowsPerPage}
                        onChangePage={handlers.changePage}
                        onChangeRowsPerPage={handlers.changeRowsPerPage}
                      />
                    </Grid>
                  </Grid>
                </>
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
              disabled={formState.isSubmitting || !isFormFilled}
              onClick={handleSubmit(submit.handler)}
              color="primary"
            />
          )}
        </FormActions>
      </FormContainer>
    </div>
  );
}
