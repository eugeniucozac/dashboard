import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import get from 'lodash/get';
import config from 'config';
import * as constants from 'consts';

//app
import styles from './ProcessingInstructionsRiskRefs.styles';
import stylesParent from '../../pages/ProcessingInstructionsSteps/ProcessingInstructionsSteps.styles';
import {
  Button,
  FormContainer,
  FormFields,
  FormAutocompleteMui,
  Overflow,
  TableHead,
  TableCell,
  FormRadio,
  FormDate,
  FormSelect,
  SaveBar,
  Warning,
  PreventNavigation,
} from 'components';
import * as utils from 'utils';
import { useMedia } from 'hooks';
import { showModal, getEndorsementValues, enqueueNotification } from 'stores';

// mui
import { makeStyles, Checkbox, Typography, TableContainer, Table, TableBody, TableRow, Grid, Box, Divider } from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

ProcessingInstructionsRiskRefsView.propTypes = {
  searchFields: PropTypes.array.isRequired,
  searchReferenceType: PropTypes.string.isRequired,
  searchInsuredType: PropTypes.string.isRequired,
  columns: PropTypes.array.isRequired,
  isStatusSubmittedProcessing: PropTypes.bool,
  isStatusReopened: PropTypes.bool,
  isAuthorizrdSignatory: PropTypes.bool,
  isPageEdited: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  isEditable: PropTypes.bool,
  isEndorsement: PropTypes.bool,
  isClosing: PropTypes.bool,
  isFdo: PropTypes.bool,
  isFeeAndAmendment: PropTypes.bool,
  isRiskRefMessageShown: PropTypes.bool,
  instructionId: PropTypes.number.isRequired,
  handlers: PropTypes.shape({
    next: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
    advancedSearch: PropTypes.func.isRequired,
    riskRefFetch: PropTypes.func.isRequired,
    riskRefChangeLead: PropTypes.func.isRequired,
    riskRefRemove: PropTypes.func.isRequired,
  }).isRequired,
};

export default function ProcessingInstructionsRiskRefsView({
  riskRefs,
  searchFields,
  searchReferenceType,
  searchInsuredType,
  columns,
  isStatusSubmittedProcessing,
  isStatusReopened,
  isPageEdited,
  isReadOnly,
  isEditable,
  isEndorsement,
  isClosing,
  isFdo,
  isFeeAndAmendment,
  instructionId,
  isAuthorizrdSignatory,
  isRiskRefMessageShown,
  handlers,
}) {
  const media = useMedia();
  const dispatch = useDispatch();
  const classes = makeStyles(styles, { name: 'ProcessingInstructionsRiskRefs' })({ isMobile: media.mobile });
  const classesParent = makeStyles(stylesParent)();

  const selectedProcessRefinementColumns = isEndorsement || isFeeAndAmendment;

  const defaultValuesSearch = utils.form.getInitialValues(searchFields);

  const {
    control: controlSearch,
    watch: watchSearch,
    errors: errorsSearch,
    setValue,
  } = useForm({
    defaultValues: defaultValuesSearch,
  });

  const isMaxRiskRefsExceeded = riskRefs?.length >= constants.PI_MAX_RISK_REF_LIMIT;

  const isRisk = searchReferenceType === 'risk';
  const isInsuredCoverHolder = searchInsuredType === 'insuredCoverHolder';
  const isFetchEnabledRisk = isRisk && watchSearch('riskReference');
  const searchButtonEnabled = isInsuredCoverHolder && watchSearch('insuredCoverHolderName');
  const endorseValue = useSelector((state) => get(state, 'processingInstructions.endorsementNonPremium')) || {};
  const endorsementRefIdField = {
    name: 'endorsementRef',
    type: 'select',
    optionKey: 'id',
    optionLabel: 'value',
    size: 'sm',
    muiComponentProps: {
      disabled: isStatusSubmittedProcessing || isReadOnly || isStatusReopened,
    },
  };

  const invalidRiskRefModal = (riskRef) => {
    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          fullWidth: true,
          title: utils.string.t('processingInstructions.addRiskReference.duplicateWarning.title'),
          maxWidth: 'xs',
          componentProps: {
            confirmLabel: utils.string.t('app.yes'),
            cancelLabel: utils.string.t('app.no'),
            confirmMessage: (
              <span
                dangerouslySetInnerHTML={{
                  __html: `${utils.string.t('processingInstructions.addRiskReference.duplicateWarning.text', {
                    policyReference: riskRef.policyReference,
                    instructionId: riskRef.instructionId.join(', '),
                  })}`,
                }}
              />
            ),
            buttonColors: { confirm: 'secondary', cancel: 'primary' },
            submitHandler: () => {
              handlers.riskRefFetch(riskRef.policyReference);
            },
            cancelHandler: () => {},
            handleClose: () => {},
          },
        },
      })
    );
  };

  useEffect(() => {
    if (riskRefs?.length > 0 && (isEndorsement || isFeeAndAmendment)) {
      dispatch(
        getEndorsementValues(
          riskRefs?.map((r) => r.xbPolicyId),
          riskRefs?.map((r) => r.xbInstanceId)
        )
      );
    }
  }, [dispatch, riskRefs]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <FormContainer type="default" data-testid="processing-instructions-form-risk-references">
        <FormFields type="default">
          {isEditable && (
            <Box className={classes.searchContainer} data-testid="processing-instructions-search-container">
              <Box data-testid="processing-instructions-add-by-risk-references-id">
                <Typography className={classes.subTitle}>
                  {utils.string.t('processingInstructions.addRiskReference.addByRiskRefId')}
                </Typography>
                <Divider />
                <Box mt={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={11}>
                      <FormAutocompleteMui
                        {...utils.form.getFieldProps(searchFields, 'riskReference')}
                        error={errorsSearch.riskReference}
                        control={controlSearch}
                      />
                    </Grid>
                    <Grid item xs={12} md={1}>
                      <Box className={classes.searchBtnContainer}>
                        <Button
                          text={utils.string.t('app.add')}
                          nestedClasses={{ btn: classes.searchBtn }}
                          disabled={!isFetchEnabledRisk || isMaxRiskRefsExceeded}
                          size="small"
                          onClick={() => {
                            const refToAdd = searchReferenceType === 'risk' ? watchSearch('riskReference') : null;
                            if (riskRefs?.find((rr) => rr.riskRefId === refToAdd.policyReference)) {
                              return dispatch(enqueueNotification('processingInstructions.duplicateRiskRef', 'warning'));
                            } else if (!isEmpty(refToAdd?.status) && !isEmpty(refToAdd?.instructionId) && (isClosing || isFdo)) {
                              invalidRiskRefModal(refToAdd);
                            } else {
                              handlers.riskRefFetch(refToAdd.policyReference);
                            }
                          }}
                          color="primary"
                          data-testid="processing-instruction-risk-ref-add-button"
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
              <Box display="flex" my={2} alignItems="center" data-testid="processing-instructions-or">
                <Box flexGrow={1}>
                  <Divider />
                </Box>
                <Box p={2}>
                  <Typography className={classes.or}>{`(${utils.string.t('app.or')})`}</Typography>
                </Box>
                <Box flexGrow={1}>
                  <Divider />
                </Box>
              </Box>
              <Box data-testid="processing-instructions-advanced-search">
                <Typography className={classes.subTitle}>
                  {utils.string.t('processingInstructions.addRiskReference.advancedSearchLabel')}
                </Typography>
                <Divider />
                <Box mt={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={11}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <FormAutocompleteMui
                            {...utils.form.getFieldProps(searchFields, 'insuredCoverHolderName')}
                            error={errorsSearch.insuredCoverHolderName}
                            control={controlSearch}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <FormAutocompleteMui
                            {...utils.form.getFieldProps(searchFields, 'department')}
                            error={errorsSearch.department}
                            control={controlSearch}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <FormDate
                            {...utils.form.getFieldProps(searchFields, 'yearOfAccount')}
                            error={errorsSearch.yearOfAccount}
                            control={controlSearch}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} md={1}>
                      <Box className={classes.searchBtnContainer}>
                        <Button
                          text={utils.string.t('app.searchText')}
                          disabled={!searchButtonEnabled || isMaxRiskRefsExceeded}
                          color="primary"
                          size="small"
                          nestedClasses={{ btn: classes.searchBtn }}
                          onClick={() => {
                            let searchValues = {};
                            const insuredName = watchSearch('insuredCoverHolderName');
                            const depart = watchSearch('department');
                            const yoa = parseInt(moment(watchSearch('yearOfAccount')).format('YYYY'));
                            Object.assign(searchValues, { depart, insuredName });
                            !isNaN(yoa) && Object.assign(searchValues, { yoa });
                            handlers.advancedSearch(searchValues);
                          }}
                          data-testid="processing-instruction-risk-ref-search-button"
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Box>
          )}
          {isMaxRiskRefsExceeded && !isStatusSubmittedProcessing && isRiskRefMessageShown && !isStatusReopened && !isAuthorizrdSignatory && (
            <Box my={6} display="flex" justifyContent="center">
              <Warning
                text={utils.string.t('processingInstructions.maximumRiskRefAdded', { maxRiskRefsLimit: constants.PI_MAX_RISK_REF_LIMIT })}
                type="info"
                align="center"
                size="medium"
                border
                icon
              />
            </Box>
          )}
          {riskRefs?.length > 0 && (
            <div className={classes.tableStyling}>
              <Typography className={classes.subTitle}>{utils.string.t('processingInstructions.addRiskReference.tableTitle')}</Typography>
              <Divider />
              <Overflow>
                <TableContainer className={classes.tableContainer}>
                  <Table data-testid="processing-instruction-risk-ref-table" stickyHeader>
                    <TableHead
                      columns={columns}
                      nestedClasses={{ tableHead: classes.tableHead }}
                      data-testid="processing-instructions-step-1-table-head"
                    />
                    <TableBody>
                      {riskRefs?.map((riskRef, index) => {
                        return (
                          <TableRow key={riskRef.riskRefId}>
                            <TableCell compact minimal>
                              <FormRadio
                                name="leadRiskRef"
                                muiComponentProps={{
                                  value: riskRef.riskRefId,
                                  checked: Boolean(riskRef.leadPolicy),
                                  disabled: isStatusSubmittedProcessing || isReadOnly || isStatusReopened,
                                  onChange: (e) => handlers.riskRefChangeLead(e, riskRef.riskRefId),
                                }}
                                muiFormGroupProps={{
                                  nestedClasses: { root: classes.searchFieldRadioGroup },
                                }}
                              />
                            </TableCell>
                            <TableCell>{riskRef.riskRefId}</TableCell>
                            <TableCell>{riskRef.xbInstance}</TableCell>
                            <TableCell>{riskRef.assuredName}</TableCell>
                            <TableCell>{riskRef.yoa}</TableCell>
                            <TableCell>{riskRef.clientName}</TableCell>
                            <TableCell>{riskRef.status}</TableCell>
                            <TableCell>{riskRef.riskDetails}</TableCell>
                            {selectedProcessRefinementColumns ? (
                              <>
                                <TableCell>
                                  <FormSelect
                                    {...endorsementRefIdField}
                                    value={
                                      endorseValue[riskRef.xbPolicyId]?.endorsementNumbers?.find(
                                        (end) => end.value?.toString() === riskRef.endorsementNumber?.toString()
                                      )?.id || '0'
                                    }
                                    options={[
                                      { id: 0, value: 'Select' },
                                      ...(endorseValue[riskRef.xbPolicyId] ? endorseValue[riskRef.xbPolicyId].endorsementNumbers : []),
                                    ]}
                                    handleUpdate={(id, value) => {
                                      setValue(id, value);
                                      let endorsementId = endorseValue[riskRef.xbPolicyId]?.endorsementNumbers?.find(
                                        (end) => end.id === value
                                      )?.id;

                                      let isNonPremiumValueReceived = endorseValue[riskRef.xbPolicyId]?.nonPremiums?.find(
                                        (x) => x.id === endorsementId
                                      )?.value;

                                      let endorsementValueSelected = endorseValue[riskRef.xbPolicyId]?.endorsementNumbers?.find(
                                        (end) => end.id === value
                                      )?.value;

                                      let endorsementIdSelected = endorseValue[riskRef.xbPolicyId]?.endorsementIds?.find(
                                        (end) => end.id === endorsementId
                                      )?.value;

                                      let endorsementUIdSelected = endorseValue[riskRef.xbPolicyId]?.endorsementUids?.find(
                                        (end) => end.id === endorsementId
                                      )?.value;

                                      handlers.riskRefSet(
                                        riskRefs?.map((rr) => {
                                          if (rr.riskRefId === riskRef.riskRefId) {
                                            return {
                                              ...riskRef,
                                              endorsementNumber: value ? endorsementValueSelected : 0,
                                              isNonPremium: value ? isNonPremiumValueReceived : 'No',
                                              endorsementId: value ? endorsementIdSelected : 0,
                                              bulkEndorsementUid: value ? endorsementUIdSelected : null,
                                            };
                                          }

                                          return rr;
                                        })
                                      );
                                    }}
                                  />
                                </TableCell>
                                <TableCell center>
                                  <Checkbox color="primary" value={true} checked={riskRef.isNonPremium === 'Yes'} disabled />
                                </TableCell>
                              </>
                            ) : null}
                            {isEditable && (
                              <TableCell>
                                <Button
                                  danger
                                  icon={HighlightOffIcon}
                                  variant="text"
                                  size="small"
                                  tooltip={{ title: utils.string.t('app.remove') }}
                                  disabled={isStatusSubmittedProcessing || isStatusReopened}
                                  onClick={() => {
                                    handlers.riskRefRemove(index, riskRef.riskRefId);
                                  }}
                                  data-testid="risk-ref-delete-button"
                                />
                              </TableCell>
                            )}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Overflow>
            </div>
          )}
        </FormFields>
      </FormContainer>

      <SaveBar show nestedClasses={{ root: classesParent.saveBar }}>
        <Box display="flex" justifyContent="space-between">
          <Box flex="1 1 auto" textAlign="left" className={classes.buttonGroup} />
          <Box flex="1 1 auto" textAlign="right" className={classes.buttonGroup}>
            {isEditable && isPageEdited && (
              <>
                <Button
                  text={utils.string.t('app.cancel')}
                  onClick={handlers.cancel}
                  color="primary"
                  size="small"
                  variant="text"
                  nestedClasses={{ btn: classesParent.button }}
                />
                <Button
                  text={utils.string.t('app.save')}
                  onClick={handlers.save}
                  color="secondary"
                  size="small"
                  variant="outlined"
                  nestedClasses={{ btn: classesParent.button }}
                />
              </>
            )}
            <Button
              text={utils.string.t('app.next')}
              onClick={isPageEdited ? () => handlers.save(constants.SAVE_NEXT) : handlers.next}
              disabled={riskRefs?.length === 0}
              color="primary"
              icon={NavigateNextIcon}
              iconPosition="right"
              size="small"
              nestedClasses={{ btn: classesParent.button }}
            />
          </Box>
        </Box>
      </SaveBar>
      <PreventNavigation dirty={isPageEdited} allowedUrls={[`${config.routes.processingInstructions.steps}/${instructionId}/`]} />
    </div>
  );
}
