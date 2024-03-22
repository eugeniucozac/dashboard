import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector } from 'react-redux';

//app
import styles from './PremiumProcessingCaseRfiRespond.styles';
import {
  Button,
  ContentHeader,
  DmsSearch,
  DmsTable,
  FormActions,
  FormContainer,
  FormFields,
  FormGrid,
  FormText,
  Info,
  PreventNavigation,
  Tabs,
  Tooltip,
  Translate
} from 'components';
import { useFormActions } from 'hooks';
import * as utils from 'utils';
import * as constants from 'consts';
import { selectRefDataQueryCodes } from 'stores';

// mui
import { Box, makeStyles, Typography, Grid } from '@material-ui/core';

PremiumProcessingCaseRfiRespondView.propTypes = {
  fields: PropTypes.array,
  actions: PropTypes.array,
  caseDetails: PropTypes.object.isRequired,
  rfiDetails: PropTypes.object.isRequired,
  queryCodesRfi: PropTypes.object.isRequired,
  dmsObjTable: PropTypes.shape({
    context: PropTypes.string.isRequired,
    referenceId: PropTypes.string.isRequired,
  }).isRequired,
  dmsObjSearch: PropTypes.shape({
    context: PropTypes.string.isRequired,
    referenceId: PropTypes.string.isRequired,
  }).isRequired,
  dmsTabs: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedDmsTab: PropTypes.string.isRequired,
  documents: PropTypes.array.isRequired,
  isPageDirty: PropTypes.bool.isRequired,
  handlers: PropTypes.shape({
    setIsPageDirty: PropTypes.func.isRequired,
    selectDmsTab: PropTypes.func.isRequired,
    onSelectDmsFile: PropTypes.func.isRequired,
  }).isRequired,
};

export default function PremiumProcessingCaseRfiRespondView({
  fields,
  actions,
  caseDetails,
  rfiDetails,
  dmsObjTable,
  dmsObjSearch,
  dmsTabs,
  selectedDmsTab,
  documents,
  isPageDirty,
  handlers,
  queryCodesRfi,
}) {
  const classes = makeStyles(styles, { name: 'PremiumProcessingCaseRfiRespond' })();
  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);
  const queryCodeRefData = useSelector(selectRefDataQueryCodes) || [];
  const notesStrLength = 500;
  const [expanded, setExpanded] = useState([]);

  const { control, reset, handleSubmit, watch, formState, errors } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  const { submit, cancel } = useFormActions(actions);
  const typeYourResponseValue = watch('rfiResponse');

  const queryCodeTypeName =
    (utils.generic.isValidArray(queryCodeRefData, true) &&
      rfiDetails?.queryCode &&
      utils.referenceData.queryCodeTypes.getNameById(queryCodeRefData, rfiDetails?.queryCode)) ||
    '';

  useEffect(() => {
    handlers.setIsPageDirty(formState.isDirty);
  }, [typeYourResponseValue, formState.isDirty]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClickExpandCollapse = (labelText, note) => () => {
    if (labelText === 'app.seeMore') {
      setExpanded(note);
    } else {
      setExpanded(note.slice(0, notesStrLength).trim());
    }
  };
  
  const toggleButton = (labelText, note) => (
    <Button
      size="xsmall"
      variant="text"
      text={<Translate label={labelText} />}
      onClick={handleClickExpandCollapse(labelText, note)}
      nestedClasses={{ btn: classes.toggle, label: classes.label }}
    />
  );

  const rfiNotesTruncated = (notes) => {
    const isCollapsed = expanded === notes;
    const notesLength = notes.length;
    if (!isCollapsed && notesLength > notesStrLength) {
      return (
        <>
          {notes.slice(0, notesStrLength).trim()}
          ...
          {toggleButton('app.seeMore', notes)}
        </>
      );
    } else if (isCollapsed && notesLength > notesStrLength) {
      return (
        <>
          {notes}
          {toggleButton('app.seeLess', notes)}
        </>
      );
    } else {
      return <>{notes}</>;
    }
  };

  return (
    <Box width={1} mt={5} data-testid="premium-processing-case-rfi-respond">
      <ContentHeader title={utils.string.t('premiumProcessing.rfi.rfiDetails')} />

      <Grid container spacing={4}>
        <Grid item xs={3}>
          <Info title={utils.string.t('premiumProcessing.rfi.rfiType')} />
          {rfiDetails?.rfiType}
        </Grid>
        <Grid item xs={3}>
          <Tooltip title={rfiDetails?.createdByEmail} placement="top" rich>
            <Info title={utils.string.t('premiumProcessing.rfi.from')} />
            {rfiDetails?.createdBy} ({rfiDetails?.createdByRole})
          </Tooltip>
        </Grid>
        {!(rfiDetails?.rfiType === constants.BUREAU_RFITYPE) && (
          <Grid item xs={3}>
            <Info title={utils.string.t('premiumProcessing.rfi.queryCode')} />
            {queryCodesRfi?.queryCodeDescription}
          </Grid>
        )}
        {rfiDetails?.rfiType === constants.BUREAU_RFITYPE && (
          <Grid item xs={3}>
            <Info title={utils.string.t('premiumProcessing.rfi.queryCode')} />
            {queryCodeTypeName}
          </Grid>
        )}
        {rfiDetails?.timeToDueDate && (
          <Grid item xs={3}>
            <Info title={utils.string.t('premiumProcessing.rfi.expectedResponseDate')} />
            {rfiDetails.timeToDueDate}
          </Grid>
        )}
        <Grid item xs={3}>
          <Info title={utils.string.t('premiumProcessing.rfi.queryId')} />
          {rfiDetails?.queryId}
        </Grid>
        {rfiDetails?.rfiType === constants.BUREAU_RFITYPE && (
          <Grid item xs={3}>
            <Info title={utils.string.t('premiumProcessing.rfi.workPackageReference')} />
            {rfiDetails?.workPackageRef}
          </Grid>
        )}
        {rfiDetails?.rfiType === constants.BUREAU_RFITYPE && (
          <Grid item xs={3}>
            <Info title={utils.string.t('premiumProcessing.rfi.bureauNames')} />
            {rfiDetails?.bureauNames}
          </Grid>
        )}
        {rfiDetails?.rfiType === constants.BUREAU_RFITYPE && (
          <Grid item xs={3}>
            <Info title={utils.string.t('premiumProcessing.rfi.riskReference')} />
            {rfiDetails?.riskReference}
          </Grid>
        )}
      </Grid>

      {rfiDetails?.rfiType === constants.BUREAU_RFITYPE && (
        <Grid item xs={12} md={6}>
          <Box mt={3}>
            <FormText {...utils.form.getFieldProps(fields, 'bureauQueryDescription', control, errors)} />
          </Box>
        </Grid>
      )}

      <ContentHeader title={utils.string.t('premiumProcessing.rfi.rfiLoop')} />

      {rfiDetails?.createdBy && (
        <Tooltip title={rfiDetails?.createdByEmail} placement="top" rich>
          <Typography className={classes.author}>
            {utils.string.t('premiumProcessing.rfi.wrote', { user: rfiDetails?.createdBy, userRole: rfiDetails?.createdByRole })}
          </Typography>
        </Tooltip>
      )}
      {rfiDetails?.createdOn && <Typography className={classes.date}>{rfiDetails?.createdOn}</Typography>}
      {rfiDetails?.notes && <Typography className={classes.textDescription}>{rfiNotesTruncated(rfiDetails?.notes)}</Typography>}

      <ContentHeader title={utils.string.t('premiumProcessing.rfi.rfiActions')} />
      <FormContainer values={typeYourResponseValue} onSubmit={handleSubmit(submit?.handler)}>
        <FormFields>
          <FormGrid container spacing={4}>
            <FormGrid item xs={12} md={6}>
              <FormText {...utils.form.getFieldProps(fields, 'rfiResponse', control, errors)} />
            </FormGrid>
          </FormGrid>
        </FormFields>
      </FormContainer>

      <ContentHeader title={utils.string.t('app.attachDocuments')} subtitle={`(${utils.string.t('app.optional')})`} marginBottom={3} />

      <Tabs tabs={dmsTabs} value={selectedDmsTab} onChange={(tabName) => handlers.selectDmsTab(tabName)} />

      {selectedDmsTab === constants.DMS_VIEW_TAB_VIEW && (
        <DmsTable
          {...dmsObjTable}
          showHeader={false}
          canSearch={false}
          canUpload={true}
          canUnlink={false}
          canDelete={false}
          columnsData={documents}
          searchParamsAfterUpload={{ sectionType: dmsObjSearch.context, referenceId: dmsObjSearch.referenceId }}
          handlers={{
            onSelectFile: handlers.onSelectDmsFile,
          }}
        />
      )}
      {selectedDmsTab === constants.DMS_VIEW_TAB_SEARCH && <DmsSearch {...dmsObjSearch} referenceId={rfiDetails?.queryId?.toString()} />}

      <FormActions>
        {cancel && (
          <Button text={cancel.label} color="primary" variant="text" disabled={!isPageDirty} onClick={() => cancel.handler(reset)} />
        )}
        {submit && (
          <Button
            text={submit.label}
            type="submit"
            color="primary"
            disabled={!isPageDirty}
            onClick={handleSubmit(submit?.handler(reset))}
          />
        )}
      </FormActions>
      <PreventNavigation dirty={formState.isDirty} cancelLabel="app.cancel" confirmLabel="app.yes" />
    </Box>
  );
}
