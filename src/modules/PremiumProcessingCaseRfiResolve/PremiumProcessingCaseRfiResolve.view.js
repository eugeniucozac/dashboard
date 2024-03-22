import React, { useEffect,  useState} from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector } from 'react-redux';

//app
import styles from './PremiumProcessingCaseRfiResolve.styles';
import {
  Button,
  ContentHeader,
  DmsTable,
  FormActions,
  FormAutocompleteMui,
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
import * as utils from 'utils';
import * as constants from 'consts';
import { useFormActions } from 'hooks';
import { selectRefDataQueryCodes, selectRefDataResolutionCode } from 'stores';

// mui
import { Box, makeStyles, Divider, Typography, Grid } from '@material-ui/core';

PremiumProcessingCaseRfiResolveView.propTypes = {
  fields: PropTypes.array,
  actions: PropTypes.array,
  rfiDetails: PropTypes.shape({
    createdBy: PropTypes.string.isRequired,
    createdOn: PropTypes.string.isRequired,
    notes: PropTypes.string.isRequired,
    responseBy: PropTypes.string.isRequired,
    responseDate: PropTypes.string.isRequired,
    responseDescription: PropTypes.string.isRequired,
    rfiType: PropTypes.string.isRequired,
    queryCode: PropTypes.string.isRequired,
    queryId: PropTypes.string.isRequired,
    timeToDueDate: PropTypes.string,
    queryCodesRfi: PropTypes.object,
  }).isRequired,
  queryCode: PropTypes.shape({
    queryCodeID: PropTypes.number.isRequired,
    queryCodeDetails: PropTypes.string.isRequired,
    queryCodeDescription: PropTypes.string.isRequired,
  }).isRequired,
  dms: PropTypes.shape({
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
  isPageDirty: PropTypes.bool,
  isEditable: PropTypes.bool,
  handlers: PropTypes.shape({
    setIsPageDirty: PropTypes.func.isRequired,
    selectDmsTab: PropTypes.func.isRequired,
  }).isRequired,
};

export default function PremiumProcessingCaseRfiResolveView({
  fields,
  actions,
  rfiDetails,
  queryCode,
  dms,
  dmsTabs,
  selectedDmsTab,
  documents,
  isPageDirty,
  isEditable,
  handlers,
}) {
  const classes = makeStyles(styles, { name: 'PremiumProcessingCaseRfiResolve' })();
  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);
  const resolutionCodeRefData = useSelector(selectRefDataResolutionCode) || [];
  const queryCodeRefData = useSelector(selectRefDataQueryCodes) || [];
  const notesLength = 500;
  const [expanded, setExpanded] = useState([]);

  const { control, reset, handleSubmit, watch, formState, errors } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  const { submit, cancel } = useFormActions(actions);
  const typeYourResponseValue = watch('typeYourResponse');
  const resolutionCodeValue = watch('resolutionCode');

  const isBureauRfi = rfiDetails?.rfiType === constants.BUREAU_RFITYPE;

  useEffect(() => {
    handlers.setIsPageDirty(formState.isDirty);
  }, [typeYourResponseValue, resolutionCodeValue, formState.isDirty]); // eslint-disable-line react-hooks/exhaustive-deps

  const resolutionCodeTypeName =
    (utils.generic.isValidArray(resolutionCodeRefData, true) &&
      rfiDetails?.resolutionCode &&
      utils.referenceData.resolutionCodeTypes.getNameById(resolutionCodeRefData, rfiDetails.resolutionCode)) ||
    '';

  const queryCodeTypeName =
    (utils.generic.isValidArray(queryCodeRefData, true) &&
      rfiDetails?.queryCode &&
      utils.referenceData.queryCodeTypes.getNameById(queryCodeRefData, rfiDetails?.queryCode)) ||
    '';

    const handleClickExpandCollapse = (id, labelText) => () => {
      if (labelText === 'app.seeMore') {
        setExpanded([...expanded, id]);
      } else {
        setExpanded([...expanded?.filter((item) => item !== id)]);
      }
    };
  
    const toggle_button = (notesData, labelText) => (
      <Button
        size="xsmall"
        variant="text"
        text={<Translate label={labelText} />}
        onClick={handleClickExpandCollapse(notesData?.notesId, labelText)}
        nestedClasses={{ btn: classes.toggle, label: classes.label }}
      />
    );
  
    const rfiNotesTruncated = (noteMsg, notesId) => {
      const isCollapsed = !expanded.includes(notesId);
      const isTruncated = noteMsg?.length > notesLength;
      if (isTruncated && isCollapsed) {
        return (
          <>
            {noteMsg?.slice(0, notesLength - 20).trim()}
            ...
            {toggle_button({noteMsg, notesId}, 'app.seeMore')}
          </>
        );
      } else {
        return (
          <>
            {noteMsg}
            {isTruncated && <>{toggle_button({noteMsg, notesId}, 'app.seeLess')}</>}
          </>
        );
      }
    };

  return (
    <Box width={1} mt={5} data-testid="premium-processing-case-rfi-resolve">
      <ContentHeader title={utils.string.t('premiumProcessing.rfi.rfiDetails')} />

      <Grid container spacing={4}>
        <Grid item xs={3}>
          <Info title={utils.string.t('premiumProcessing.rfi.rfiType')} />
          {rfiDetails?.rfiType}
        </Grid>

        <Grid item xs={3}>
          <Info title={utils.string.t('premiumProcessing.rfi.from')} />
          <Tooltip title={rfiDetails?.createdByEmail} placement="top" rich>
            {rfiDetails?.createdBy} ({rfiDetails?.createdByRole})
          </Tooltip>
        </Grid>

        {isBureauRfi && (
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

        {!isBureauRfi && (
          <>
            <Grid item xs={3}>
              <Info title={utils.string.t('premiumProcessing.rfi.queryCode')} />
              {queryCode?.queryCodeDescription}
            </Grid>
            <Grid item xs={3}>
              <Info title={utils.string.t('premiumProcessing.rfi.sendTo')} />
              <Tooltip title={rfiDetails?.responseByEmail} placement="top" rich>
                {rfiDetails?.responseBy ? `${rfiDetails?.responseBy} (${rfiDetails?.responseByRole})` : rfiDetails?.sendTo}
              </Tooltip>
            </Grid>
          </>
        )}

        {isBureauRfi && (
          <>
            <Grid item xs={3}>
              <Info title={utils.string.t('premiumProcessing.rfi.workPackageReference')} />
              {rfiDetails?.workPackageRef}
            </Grid>
            <Grid item xs={3}>
              <Info title={utils.string.t('premiumProcessing.rfi.bureauNames')} />
              {rfiDetails?.bureauNames}
            </Grid>
            <Grid item xs={3}>
              <Info title={utils.string.t('premiumProcessing.rfi.riskReference')} />
              {rfiDetails?.riskReference}
            </Grid>
          </>
        )}
      </Grid>

      {isBureauRfi && (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <FormText {...utils.form.getFieldProps(fields, 'bureauQueryDescription', control, errors)} />
          </Grid>
        </Grid>
      )}

      <ContentHeader title={utils.string.t('premiumProcessing.rfi.rfiLoop')} />

      {rfiDetails?.createdBy && (
        <Tooltip title={rfiDetails?.createdByEmail} placement="top" rich>
          <Typography className={classes.author}>
            {utils.string.t('premiumProcessing.rfi.wrote', {
              user: rfiDetails?.createdBy,
              userRole: rfiDetails?.createdByRole,
            })}
          </Typography>
        </Tooltip>
      )}
      {rfiDetails?.createdOn && <Typography className={classes.date}>{rfiDetails?.createdOn}</Typography>}
      {rfiDetails?.notes && <Typography className={classes.textDescription}>{rfiNotesTruncated(rfiDetails?.notes, rfiDetails?.createdOn)}</Typography>}

      <Box mt={2} mb={2}>
        <Divider className={classes.loopDivider} />
      </Box>

      {rfiDetails?.responseBy && (
        <Typography className={classes.author}>
          {utils.string.t('premiumProcessing.rfi.wrote', { user: rfiDetails.responseBy, userRole: rfiDetails.responseByRole })}
        </Typography>
      )}

      {rfiDetails?.responseDate && <Typography className={classes.date}>{rfiDetails?.responseDate}</Typography>}
      {rfiDetails?.responseDescription && <Typography className={classes.textDescription}>{rfiNotesTruncated(rfiDetails?.responseDescription, rfiDetails?.responseDate)}</Typography>}

      {rfiDetails?.resolveBy && (
        <>
          <Box mt={2} mb={2}>
            <Divider className={classes.loopDivider} />
          </Box>
          <Tooltip title={rfiDetails?.resolveByEmail} placement="top" rich>
            <Typography className={classes.author}>
              {utils.string.t('premiumProcessing.rfi.wrote', { user: rfiDetails.resolveBy, userRole: rfiDetails.resolveByRole })}
            </Typography>
          </Tooltip>
        </>
      )}
      {rfiDetails?.resolveDate && <Typography className={classes.date}>{rfiDetails?.resolveDate}</Typography>}
      {rfiDetails?.resolutionComments && <Typography className={classes.textDescription}>{rfiNotesTruncated(rfiDetails?.resolutionComments, rfiDetails?.resolveDate)}</Typography>}
      {resolutionCodeTypeName && (
        <>
          <Typography className={classes.resolution}>
            {utils.string.html('premiumProcessing.rfi.resolutionCodeValue', { value: resolutionCodeTypeName })}
          </Typography>
        </>
      )}

      {isEditable && (
        <>
          <ContentHeader title={utils.string.t('premiumProcessing.rfi.rfiActions')} />
          <FormContainer values={typeYourResponseValue} onSubmit={handleSubmit(submit?.handler)}>
            <FormFields>
              <FormGrid container spacing={4}>
                <FormGrid item xs={12} sm={3}>
                  <FormAutocompleteMui {...utils.form.getFieldProps(fields, 'resolutionCode', control, errors)} />
                </FormGrid>
              </FormGrid>
              <FormGrid container>
                <FormGrid item xs={12} md={6}>
                  <FormText {...utils.form.getFieldProps(fields, 'typeYourResponse', control, errors)} />
                </FormGrid>
              </FormGrid>
            </FormFields>
          </FormContainer>
        </>
      )}

      <ContentHeader title={utils.string.t('app.attachDocuments')} subtitle={`(${utils.string.t('app.optional')})`} marginBottom={3} />

      <Tabs tabs={dmsTabs} value={selectedDmsTab} onChange={(tabName) => handlers.selectDmsTab(tabName)} />

      {selectedDmsTab === constants.DMS_VIEW_TAB_VIEW && (
        <DmsTable
          {...dms}
          showHeader={false}
          canSearch={false}
          canUpload={false}
          canUnlink={false}
          canDelete={false}
          columnsData={documents}
          handlers={{
            onSelectFile: handlers.onSelectDmsFile,
          }}
        />
      )}

      {isEditable && (
        <>
          <FormActions>
            {cancel && (
              <Button text={cancel.label} color="primary" variant="text" disabled={!isPageDirty} onClick={() => cancel.handler(reset)} />
            )}
            {submit && (
              <Button
                text={submit.label}
                type="submit"
                color="primary"
                disabled={!isPageDirty || !typeYourResponseValue || !resolutionCodeValue}
                onClick={handleSubmit(submit?.handler(reset))}
              />
            )}
          </FormActions>
          <PreventNavigation dirty={formState.isDirty} cancelLabel="app.cancel" confirmLabel="app.yes" />
        </>
      )}
    </Box>
  );
}
