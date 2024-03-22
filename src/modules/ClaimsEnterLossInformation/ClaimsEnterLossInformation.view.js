import React, { useEffect, useLayoutEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';

// app
import styles from './ClaimsEnterLossInformation.styles';
import {
  ErrorMessage,
  FormAutocompleteMui,
  FormContainer,
  FormLabel,
  FormLegend,
  FormFields,
  FormGrid,
  FormText,
  FormDate,
  FormHidden,
  Tooltip,
  Skeleton,
} from 'components';
import { postLossInformation, postEditLossInformation } from 'stores';
import { ClaimsUploadViewSearchDocs, RegisterNewLossFixedBottomBar } from 'modules';
import { useMedia } from 'hooks';
import * as utils from 'utils';
import * as constants from 'consts';

// mui
import { makeStyles, Box } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

ClaimsEnterLossInformationView.propTypes = {
  fields: PropTypes.array.isRequired,
  isAllStepsCompleted: PropTypes.bool.isRequired,
  activeStep: PropTypes.number.isRequired,
  lastStep: PropTypes.bool.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleFinish: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  nestedClasses: PropTypes.shape({
    root: PropTypes.string,
  }),
  hasLossRef: PropTypes.bool.isRequired,
  isInflightLoss: PropTypes.bool.isRequired,
  lossInformation: PropTypes.object.isRequired,
  assignedToUserName: PropTypes.string,
  lossDocsList: PropTypes.array,
  lossSelected: PropTypes.object.isRequired,
  formattedCatCodes: PropTypes.array,
};

export function ClaimsEnterLossInformationView(props) {
  const {
    fields,
    handleSave,
    handleNext,
    handleCancel,
    hasLossRef,
    isInflightLoss,
    lossInformation,
    assignedToUserName,
    handleBack,
    lossDocsList,
    isWarningShow,
    validation,
    setValidation,
    handleFormStatus,
    lossProperties,
    lossSelected,
    formattedCatCodes,
  } = props;
  const media = useMedia();
  const classes = makeStyles(styles, { name: 'ClaimsEnterLossInformation' })({ isMobile: media.mobile, isTablet: media.tablet });

  const dispatch = useDispatch();
  const lossFocusRef = useRef();
  const firstUpdate = useRef(true);

  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);

  const { handleSubmit, errors, control, formState } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema), context: { validation } }),
  });

  const formIsDirty = formState.isDirty;

  useEffect(() => {
    if (formIsDirty && !Object.keys(errors)?.length > 0) {
      handleFormStatus();
    }
    if (Object.keys(errors)?.length > 0) {
      lossFocusRef?.current?.scrollIntoView();
    }
  }, [formIsDirty, errors]); // eslint-disable-line react-hooks/exhaustive-deps

  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
    } else {
      // do things after first render
      formState.isDirty = true;
    }
  }, [lossDocsList]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (validation) {
      if (formIsDirty) {
        handleSubmit(submitLossInformation)();
      }
    }
    setValidation(false);
  }, [validation]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSaveLoss = () => {
    handleSubmit(handleSave)();
    handleSubmit(submitLossInformation)();
  };

  const submitLossInformation = async (values) => {
    if (lossInformation?.lossDetailID && lossInformation?.isInflighLoss !== 1) {
      dispatch(postEditLossInformation(values)).then((response) => {
        if (typeof response?.data?.lossDetailID === 'number') {
          validation ? handleNext() : handleSave();
        }
      });
    } else if (lossInformation?.isInflighLoss === 1) {
      handleNext();
    } else {
      dispatch(postLossInformation(values)).then((response) => {
        if (typeof response?.lossDetailID === 'number') {
          validation ? handleNext() : handleSave();
        }
      });
    }
  };

  const firstContactDate = errors?.firstContactDate ? { ...errors?.firstContactDate, message: '' } : null;
  const firstContactTime = errors?.firstContactTime ? { ...errors?.firstContactTime, message: '' } : null;

  return (
    <Box overflow="hidden" display="flex" flexDirection="column">
      <Box flex="1 1 auto" className={classes.container}>
        <Box mt={4} ref={lossFocusRef}>
          <FormLegend text={utils.string.t('claims.lossInformation.title')} />
        </Box>

        <FormContainer data-testid="form-lossInformation">
          <FormFields type="blank">
            <FormGrid container spacing={3}>
              <FormGrid item xs={12} sm={8}>
                <FormGrid container spacing={3}>
                  <FormGrid item xs={6}>
                    <FormText {...utils.form.getFieldProps(fields, 'lossRef')} />
                  </FormGrid>
                  <FormGrid item xs={6}>
                    <FormDate {...utils.form.getFieldProps(fields, 'fromDate', control)} error={errors.fromDate} />
                  </FormGrid>
                  <FormGrid item xs={12}>
                    <FormText {...utils.form.getFieldProps(fields, 'lossName', control)} error={errors.lossName} />
                    {isWarningShow && (
                      <ErrorMessage
                        error={{ message: utils.string.t('claims.lossInformation.validation.lossNameWarning') }}
                        nestedClasses={{ root: classes.warningMessage }}
                      />
                    )}
                  </FormGrid>
                  <FormGrid item xs={12}>
                    <FormText {...utils.form.getFieldProps(fields, 'lossDescription', control)} error={errors.lossDescription} />
                  </FormGrid>
                  {utils.generic.isInvalidOrEmptyArray(formattedCatCodes) ? (
                    <Skeleton height={40} animation="wave" displayNumber={1} />
                  ) : (
                    <FormGrid item xs={12}>
                      <FormAutocompleteMui {...utils.form.getFieldProps(fields, 'catCodesID', control)} />
                    </FormGrid>
                  )}
                </FormGrid>
              </FormGrid>

              <FormGrid item xs={12} sm={4}>
                <FormGrid container spacing={3}>
                  <FormGrid item xs={12}>
                    <FormDate {...utils.form.getFieldProps(fields, 'toDate', control)} error={errors.toDate} />
                  </FormGrid>
                  <FormGrid item xs={12}>
                    <FormLabel
                      label={utils.string.t('claims.lossInformation.dateAndTime')}
                      nestedClasses={{ root: classes.dateTimeLabel }}
                    />
                    <FormGrid container spacing={2} alignItems="center">
                      <FormGrid item xs={7} sm={12} md={7}>
                        <FormDate {...utils.form.getFieldProps(fields, 'firstContactDate', control)} error={firstContactDate} />
                      </FormGrid>
                      <FormGrid item xs={5} sm={12} md={5} alignItems="center">
                        <Box className={classes.timeField}>
                          <Box className={classes.time}>
                            <FormText {...utils.form.getFieldProps(fields, 'firstContactTime', control)} error={firstContactTime} />
                          </Box>
                          <Tooltip title={utils.string.t('claims.lossInformation.firstContactTooltipMessage')} block placement="bottom">
                            <InfoOutlinedIcon classes={{ root: classes.timeIcon }} />
                          </Tooltip>
                        </Box>
                      </FormGrid>
                      <ErrorMessage
                        error={errors?.firstContactDate || errors?.firstContactTime}
                        nestedClasses={{ root: classes.warningMessageDate }}
                      />
                    </FormGrid>
                  </FormGrid>
                  <FormGrid item xs={12}>
                    <FormText
                      name="assignToReadonly"
                      label={utils.string.t('claims.lossInformation.assignedTo')}
                      value={isInflightLoss ? 'NA' : assignedToUserName || ''}
                      muiComponentProps={{
                        readOnly: true,
                        disabled: true,
                      }}
                    />
                  </FormGrid>
                  <FormHidden {...utils.form.getFieldProps(fields, 'assignedTo', control)} />
                </FormGrid>
              </FormGrid>
            </FormGrid>
          </FormFields>
        </FormContainer>

        <Box mt={6}>
          <ClaimsUploadViewSearchDocs
            refData={lossInformation}
            refIdName={constants.DMS_CONTEXT_LOSS_ID}
            dmsContext={constants.DMS_CONTEXT_LOSS}
            documentTypeKey={constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.claim}
            isTabView={false}
            fnolViewOptions={{
              isClaimsFNOL: true,
              isClaimsUploadDisabled: !hasLossRef,
              claimsUploadWarningMsg: !hasLossRef ? utils.string.t('claims.lossInformation.dms.fileUploadWarning') : '',
              claimsSearchDocumentsTxt: utils.string.t('claims.lossInformation.dms.searchDocuments'),
              uploadDocumentsTitle: utils.string.t('claims.lossInformation.dms.uploadDocuments'),
            }}
            docList={lossDocsList}
          />
        </Box>
      </Box>
      <Box flex="0 1 auto">
        <RegisterNewLossFixedBottomBar
          {...props}
          handleSave={onSaveLoss}
          next={lossProperties?.isNextDiabled || false}
          handleNextSubmit={() => setValidation(true)}
          save={!lossSelected?.isInflighLoss && !lossProperties?.isClaimSubmitted}
          handleBack={() => {
            handleBack(0);
          }}
          handleCancel={handleCancel}
        />
      </Box>
    </Box>
  );
}
