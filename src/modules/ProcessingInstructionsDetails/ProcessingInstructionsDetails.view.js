import React, { useEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import isEqual from 'lodash/isEqual';
import config from 'config';

// app
import styles from './ProcessingInstructionsDetails.styles';
import stylesParent from '../../pages/ProcessingInstructionsSteps/ProcessingInstructionsSteps.styles';
import {
  Button,
  FormFields,
  FormGrid,
  FormSelect,
  FormText,
  FormLabel,
  FormCheckbox,
  FormContainer,
  FormPopoverMenuRHF,
  FormDate,
  Translate,
  FormToggle,
  SaveBar,
  Link,
  PreventNavigation,
  FormFileDrop,
  Warning,
} from 'components';
import * as utils from 'utils';
import { useMedia } from 'hooks';
import * as constants from 'consts';

// mui
import { Box, Divider, Fade, Grid, Typography, makeStyles } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

const ProcessingInstructionsDetailsView = forwardRef(
  (
    {
      documents,
      fields,
      defaultValues,
      retainedBrokerageAmount,
      convertedBrokerage,
      premiumCurrency,
      sumTotal,
      riskRefId,
      isEditable,
      isReadOnly,
      instructionId,
      documentNotUploadedError,
      checkListMandatoryDataStatus,
      handlers,
    },
    ref
  ) => {
    const classes = makeStyles(styles, { name: 'ProcessingInstructionsDetails' })();
    const classesParent = makeStyles(stylesParent)();

    const { mobile, tablet, desktop, wide, extraWide, desktopUp } = useMedia();

    const referenceData = useSelector((state) => state.referenceData);

    const { watch, reset, control, register, setValue } = useForm({ defaultValues });
    const formValues = watch();

    const retainedBrokerageCurrencyCodeField = utils.form.getFieldProps(fields, 'retainedBrokerageCurrencyCodeString');

    const defaultValuesToString = Object.entries(defaultValues).reduce((acc, [key, value]) => {
      return { ...acc, [key]: value?.toString() || '' };
    }, {});

    const formValuesToString = Object.entries(formValues).reduce((acc, [key, value]) => {
      return { ...acc, [key]: value?.toString() || '' };
    }, {});

    // we have to force values toString otherwise we can't compare
    // string values returned from API with numeric values from form, or vice-versa
    const isPageEdited = !checkListMandatoryDataStatus && !isEqual(defaultValuesToString, formValuesToString);

    const options = utils.form.getSelectOptions(retainedBrokerageCurrencyCodeField.optionsKey, {
      ...referenceData,
      premiumCurrency: utils.processingInstructions.getRetainedBrokerageCurrencies(),
    });

    const premiumTaxDocument = documents?.premiumTaxDocument;
    const signedLinesDocument = documents?.signedLinesDocument;
    const premiumTaxCalculationSheetAttached = formValues?.premiumTaxCalculationSheetAttachedNumber;
    const signedLinesCalculationSheetAttached = formValues?.signedLinesCalculationSheetAttachedNumber;
    const grossPremiumAmount = formValues?.grossPremiumAmountNumber;
    const slipOrder = formValues?.slipOrderNumber;
    const retainedBrokerage = formValues?.retainedBrokerageNumber;
    const retainedBrokerageCurrencyCode =
      formValues?.retainedBrokerageCurrencyCodeString ||
      retainedBrokerageCurrencyCodeField?.defaultValue ||
      retainedBrokerageCurrencyCodeField?.value;
    const clientDiscount = formValues?.clientDiscountNumber;
    const thirdPartyCommissionSharing = formValues?.thirdPartyNumber;
    const pfinternalCommissionSharing = formValues?.pfinternalNumber;

    useEffect(() => {
      handlers.getRetainedBrokerageAmount({
        grossPremiumAmount,
        slipOrder,
        retainedBrokerage,
        retainedBrokerageCurrencyCode,
        retainedBrokerageAmount,
      });
    }, [grossPremiumAmount, slipOrder, retainedBrokerage, retainedBrokerageCurrencyCode, retainedBrokerageAmount]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
      handlers.getTotalAmount({ clientDiscount, thirdPartyCommissionSharing, pfinternalCommissionSharing, retainedBrokerage });
    }, [clientDiscount, thirdPartyCommissionSharing, pfinternalCommissionSharing, retainedBrokerage]); // eslint-disable-line react-hooks/exhaustive-deps

    const documentTitleLength = mobile ? 10 : tablet ? 15 : desktop ? 25 : wide ? 30 : extraWide ? 35 : 40;

    const gridPropsLeft = { xs: 4, sm: 4, md: 3, lg: 3 };
    const gridPropsRight = { xs: 8, sm: 6, md: 3, lg: 3 };

    return (
      <Box width={1} mt={5} data-testid="processing-instruction-details">
        {checkListMandatoryDataStatus && (
          <Box my={6} className={classes.formErrorMessage}>
            <Warning
              backGround={'white'}
              hasboxShadowColor
              text={utils.string.t('processingInstructions.checklistMandatoryFieldErrorMessage')}
              type="error"
              align="center"
              size="large"
              border
              icon
            />
          </Box>
        )}
        <FormContainer ref={ref} resetFunc={reset} values={formValues} data-testid="form-processing-instructions-details">
          <FormFields>
            <Box py={1.5}>
              <FormGrid container direction="row">
                <FormGrid item xs={8} sm={9} md={10}>
                  <Typography className={classes.subTitle}>{utils.string.t('processingInstructions.details.piAllRiskRefs')}</Typography>
                </FormGrid>
                <FormGrid item xs={4} sm={3} md={2}>
                  <Typography className={classes.subTitle}>
                    {utils.string.t('processingInstructions.details.authorisedSignatory')}
                  </Typography>
                </FormGrid>
              </FormGrid>
            </Box>

            <Divider />

            <Box py={1.5}>
              <FormGrid container>
                <FormGrid item>
                  <FormCheckbox {...utils.form.getFieldProps(fields, 'highPriority', control)} />
                </FormGrid>
                <FormGrid item>
                  <FormCheckbox {...utils.form.getFieldProps(fields, 'frontEndSendDocs', control)} />
                </FormGrid>
              </FormGrid>
            </Box>

            <Divider />

            <Box py={1.5}>
              <FormGrid container direction="row" alignItems="center">
                <FormGrid item xs={10}>
                  <FormGrid container alignItems="center" direction="row">
                    <FormGrid item xs={12} md={6}>
                      <FormGrid container alignItems="center">
                        <FormGrid item xs={12} md={7}>
                          <FormLabel
                            label={utils.string.t('processingInstructions.details.premiumTaxCalculationSheetAttached', {
                              required: (isEditable && premiumTaxCalculationSheetAttached === 1 && '*') || '',
                            })}
                            align={desktopUp ? 'right' : 'left'}
                          />
                        </FormGrid>
                        <FormGrid item xs={12} md={5}>
                          <FormToggle {...utils.form.getFieldProps(fields, 'premiumTaxCalculationSheetAttachedNumber', control)} />
                        </FormGrid>
                      </FormGrid>
                    </FormGrid>
                    <FormGrid item xs={12} md={6}>
                      <FormGrid container alignItems="center" spacing={1}>
                        <FormGrid item>
                          {isEditable && premiumTaxCalculationSheetAttached === 1 && !premiumTaxDocument && (
                            <FormGrid item>
                              <FormFileDrop
                                name="file"
                                attachedFiles=""
                                showUploadPreview={false}
                                showButton={false}
                                componentProps={{
                                  multiple: false,
                                }}
                                dragLabel={utils.string.t('dms.upload.fileUploadTitleCombine')}
                                onChange={handlers.uploadPremiumTaxSignedLinesModal(
                                  constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piPremiumCalculation
                                )}
                                error={
                                  (formValues.premiumTaxCalculationSheetAttachedNumber === 1 &&
                                    !documents.premiumTaxDocument &&
                                    documentNotUploadedError.premiumTaxDocument && {
                                      message: utils.string.t('processingInstructions.details.missingPremiumTaxCalculationSheet'),
                                    }) ||
                                  {}
                                }
                              />
                            </FormGrid>
                          )}
                          {premiumTaxDocument && premiumTaxCalculationSheetAttached === 1 && (
                            <FormGrid item>
                              <FormGrid container spacing={1} alignItems="center" direction="row">
                                <FormGrid item>
                                  <Link
                                    color="secondary"
                                    text={utils.app.getEllipsisString(premiumTaxDocument?.name, documentTitleLength)}
                                    tooltip={
                                      premiumTaxDocument?.name.length > documentTitleLength ? { title: premiumTaxDocument?.name } : null
                                    }
                                    handleClick={() => {
                                      handlers.download(premiumTaxDocument);
                                    }}
                                  />
                                </FormGrid>
                                {isEditable && (
                                  <FormGrid item>
                                    <Button
                                      icon={HighlightOffIcon}
                                      variant="text"
                                      danger
                                      tooltip={{ title: utils.string.t('app.remove') }}
                                      size="small"
                                      onClick={() => {
                                        handlers.confirmRemoveDocumentModal(
                                          premiumTaxDocument,
                                          constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piPremiumCalculation
                                        );
                                      }}
                                    />
                                  </FormGrid>
                                )}
                              </FormGrid>
                            </FormGrid>
                          )}
                        </FormGrid>
                      </FormGrid>
                    </FormGrid>
                  </FormGrid>
                </FormGrid>
                <FormGrid item xs={2} align="center">
                  <FormCheckbox
                    {...utils.form.getFieldProps(fields, 'premiumTaxCalculationSheetAttachedCheckbox', control)}
                    register={register}
                  />
                </FormGrid>
              </FormGrid>
            </Box>

            <Divider />

            <Box py={1.5}>
              <FormGrid container direction="row" alignItems="center">
                <FormGrid item xs={10}>
                  <FormGrid container alignItems="center" direction="row">
                    <FormGrid item xs={12} md={6}>
                      <FormGrid container alignItems="center">
                        <FormGrid item xs={12} md={7}>
                          <FormLabel
                            label={utils.string.t('processingInstructions.details.signedLinesCalculationAttached', {
                              required: (isEditable && signedLinesCalculationSheetAttached === 1 && '*') || '',
                            })}
                            align={desktopUp ? 'right' : 'left'}
                          />
                        </FormGrid>
                        <FormGrid item xs={12} md={5}>
                          <FormToggle {...utils.form.getFieldProps(fields, 'signedLinesCalculationSheetAttachedNumber', control)} />
                        </FormGrid>
                      </FormGrid>
                    </FormGrid>
                    <FormGrid item xs={12} md={6}>
                      <FormGrid container alignItems="center" spacing={1}>
                        <FormGrid item>
                          {isEditable && signedLinesCalculationSheetAttached === 1 && !signedLinesDocument && (
                            <FormGrid item>
                              <FormFileDrop
                                name="file"
                                attachedFiles=""
                                showUploadPreview={false}
                                showButton={false}
                                componentProps={{
                                  multiple: false,
                                }}
                                dragLabel={utils.string.t('dms.upload.fileUploadTitleCombine')}
                                onChange={handlers.uploadPremiumTaxSignedLinesModal(
                                  constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piMarketSigned
                                )}
                                error={
                                  (formValues.signedLinesCalculationSheetAttachedNumber === 1 &&
                                    !documents.signedLinesDocument &&
                                    documentNotUploadedError.signedLinesDocument && {
                                      message: utils.string.t('processingInstructions.details.missingSignedLinesCalculation'),
                                    }) ||
                                  {}
                                }
                              />
                            </FormGrid>
                          )}
                          {signedLinesDocument && signedLinesCalculationSheetAttached === 1 && (
                            <FormGrid item>
                              <FormGrid container spacing={1} alignItems="center" direction="row">
                                <FormGrid item>
                                  <Link
                                    color="secondary"
                                    text={utils.app.getEllipsisString(signedLinesDocument?.name, documentTitleLength)}
                                    tooltip={
                                      signedLinesDocument?.name.length > documentTitleLength ? { title: signedLinesDocument?.name } : null
                                    }
                                    handleClick={() => {
                                      handlers.download(signedLinesDocument);
                                    }}
                                  />
                                </FormGrid>
                                {isEditable && (
                                  <FormGrid item>
                                    <Button
                                      icon={HighlightOffIcon}
                                      variant="text"
                                      danger
                                      tooltip={{ title: utils.string.t('app.remove') }}
                                      size="small"
                                      onClick={() => {
                                        handlers.confirmRemoveDocumentModal(
                                          signedLinesDocument,
                                          constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piMarketSigned
                                        );
                                      }}
                                    />
                                  </FormGrid>
                                )}
                              </FormGrid>
                            </FormGrid>
                          )}
                        </FormGrid>
                      </FormGrid>
                    </FormGrid>
                  </FormGrid>
                </FormGrid>

                <FormGrid item xs={2} align="center">
                  <FormCheckbox
                    {...utils.form.getFieldProps(fields, 'signedLinesCalculationSheetAttachedCheckbox', control)}
                    register={register}
                  />
                </FormGrid>
              </FormGrid>
            </Box>

            <Divider />

            <Box py={2}>
              <Typography className={classes.subTitle}>
                {utils.string.t('processingInstructions.details.piDetailsLeadRiskFacilityRef', { riskRefId })}
              </Typography>
            </Box>

            <Divider />

            <Box py={1.5}>
              <FormGrid container direction="row" alignItems="center">
                <FormGrid item xs={10}>
                  <FormGrid container alignItems="center">
                    <FormGrid item {...gridPropsLeft}>
                      <FormLabel label={utils.string.t('processingInstructions.details.grossPremium')} align="right" />
                    </FormGrid>
                    <FormGrid item {...gridPropsRight}>
                      <FormText {...utils.form.getFieldProps(fields, 'grossPremiumAmountNumber', control)} />
                    </FormGrid>
                  </FormGrid>
                </FormGrid>
                <FormGrid item xs={2} align="center">
                  <FormCheckbox {...utils.form.getFieldProps(fields, 'grossPremiumAmountCheckbox', control)} register={register} />
                </FormGrid>
              </FormGrid>
            </Box>

            <Divider />

            <Box py={1.5}>
              <FormGrid container direction="row" alignItems="center">
                <FormGrid item xs={10}>
                  <FormGrid container alignItems="center">
                    <FormGrid item {...gridPropsLeft}>
                      <FormLabel label={utils.string.t('processingInstructions.details.slipOrder')} align="right" />
                    </FormGrid>
                    <FormGrid item {...gridPropsRight}>
                      <FormText {...utils.form.getFieldProps(fields, 'slipOrderNumber', control)} />
                    </FormGrid>
                  </FormGrid>
                </FormGrid>
                <FormGrid item xs={2} align="center">
                  <FormCheckbox {...utils.form.getFieldProps(fields, 'slipOrderCheckbox', control)} register={register} />
                </FormGrid>
              </FormGrid>
            </Box>

            <Divider />

            <Box py={1.5}>
              <FormGrid container direction="row" alignItems="center">
                <FormGrid item xs={10}>
                  <FormGrid container alignItems="center">
                    <FormGrid item {...gridPropsLeft}>
                      <FormLabel label={utils.string.t('processingInstructions.details.totalBrokerage')} align="right" />
                    </FormGrid>
                    <FormGrid item {...gridPropsRight}>
                      <FormText {...utils.form.getFieldProps(fields, 'totalBrokerageNumber', control)} />
                    </FormGrid>
                  </FormGrid>
                </FormGrid>
                <FormGrid item xs={2} align="center">
                  <FormCheckbox {...utils.form.getFieldProps(fields, 'totalBrokerageCheckbox', control)} register={register} />
                </FormGrid>
              </FormGrid>
            </Box>

            <Divider />
            <Box pt={4}>
              <Typography className={classes.subTitle}>{utils.string.t('processingInstructions.details.splitBrokerageAs')}</Typography>
              <Box />
              <Divider />
              <Box py={1.5}>
                <FormGrid container direction="row" alignItems="center">
                  <FormGrid item xs={10}>
                    <FormGrid container alignItems="center">
                      <FormGrid item {...gridPropsLeft}>
                        <FormLabel label={utils.string.t('processingInstructions.details.clientDiscount')} align="right" />
                      </FormGrid>
                      <FormGrid item {...gridPropsRight}>
                        <FormText {...utils.form.getFieldProps(fields, 'clientDiscountNumber', control)} />
                      </FormGrid>
                    </FormGrid>
                  </FormGrid>
                  <FormGrid item xs={2} align="center">
                    <FormCheckbox {...utils.form.getFieldProps(fields, 'clientDiscountCheckbox', control)} register={register} />
                  </FormGrid>
                </FormGrid>
              </Box>

              <Divider />

              <Box py={1.5}>
                <FormGrid container direction="row" alignItems="center">
                  <FormGrid item xs={10}>
                    <FormGrid container alignItems="center" direction="row">
                      <FormGrid item xs={12} md={6}>
                        <FormGrid container alignItems="center">
                          <FormGrid item xs={4} sm={4} md={6}>
                            <FormLabel label={utils.string.t('processingInstructions.details.thirdPartyCommissionSharing')} align="right" />
                          </FormGrid>
                          <FormGrid item xs={8} sm={6} md={6}>
                            <FormText {...utils.form.getFieldProps(fields, 'thirdPartyNumber', control)} />
                          </FormGrid>
                        </FormGrid>
                      </FormGrid>
                      <FormGrid item xs={12} md={6}>
                        <Fade in={Boolean(thirdPartyCommissionSharing)}>
                          <div>
                            <FormGrid container alignItems="center">
                              <FormGrid item xs={4} sm={4} md={6}>
                                <FormLabel label={utils.string.t('processingInstructions.details.thirdParty')} align="right" />
                              </FormGrid>
                              <FormGrid item xs={8} sm={6} md={6}>
                                <FormSelect {...utils.form.getFieldProps(fields, 'thirdPartyString', control)} />
                              </FormGrid>
                            </FormGrid>
                          </div>
                        </Fade>
                      </FormGrid>
                    </FormGrid>
                  </FormGrid>
                  <FormGrid item xs={2} align="center">
                    <FormCheckbox {...utils.form.getFieldProps(fields, 'thirdPartyCheckbox', control)} register={register} />
                  </FormGrid>
                </FormGrid>
              </Box>

              <Divider />

              <Box py={1.5}>
                <FormGrid container direction="row" alignItems="center">
                  <FormGrid item xs={10}>
                    <FormGrid container alignItems="center" direction="row">
                      <FormGrid item xs={12} md={6}>
                        <FormGrid container alignItems="center">
                          <FormGrid item xs={4} sm={4} md={6}>
                            <FormLabel label={utils.string.t('processingInstructions.details.pfinternalCommissionSharing')} align="right" />
                          </FormGrid>
                          <FormGrid item xs={8} sm={6} md={6}>
                            <FormText {...utils.form.getFieldProps(fields, 'pfinternalNumber', control)} />
                          </FormGrid>
                        </FormGrid>
                      </FormGrid>
                      <FormGrid item xs={12} md={6}>
                        <Fade in={Boolean(pfinternalCommissionSharing)}>
                          <div>
                            <FormGrid container alignItems="center">
                              <FormGrid item xs={4} sm={4} md={6}>
                                <FormLabel label={utils.string.t('processingInstructions.details.pfInternalDepartment')} align="right" />
                              </FormGrid>
                              <FormGrid item xs={8} sm={6} md={6}>
                                <FormSelect {...utils.form.getFieldProps(fields, 'pfinternalString', control)} />
                              </FormGrid>
                            </FormGrid>
                          </div>
                        </Fade>
                      </FormGrid>
                    </FormGrid>
                  </FormGrid>
                  <FormGrid item xs={2} align="center">
                    <FormCheckbox {...utils.form.getFieldProps(fields, 'pfinternalCheckbox', control)} register={register} />
                  </FormGrid>
                </FormGrid>
              </Box>

              <Divider />

              <Box py={1.5}>
                <FormGrid container direction="row" alignItems="center">
                  <FormGrid item xs={10}>
                    <FormGrid container alignItems="center">
                      <FormGrid item {...gridPropsLeft}>
                        <FormLabel label={utils.string.t('processingInstructions.details.retainedBrokerage')} align="right" />
                      </FormGrid>
                      <FormGrid item {...gridPropsRight}>
                        <FormText {...utils.form.getFieldProps(fields, 'retainedBrokerageNumber', control)} />
                      </FormGrid>
                    </FormGrid>
                  </FormGrid>
                  <FormGrid item xs={2} align="center">
                    <FormCheckbox {...utils.form.getFieldProps(fields, 'retainedBrokerageCheckbox', control)} register={register} />
                  </FormGrid>
                </FormGrid>
              </Box>

              <Divider />

              <Box py={1.5}>
                <FormGrid container direction="row" alignItems="center">
                  <FormGrid item xs={10}>
                    <FormGrid container alignItems="baseline">
                      <FormGrid item {...gridPropsLeft}>
                        <Grid container direction="column" alignItems="flex-end">
                          <Grid item>
                            <FormLabel label={utils.string.t('processingInstructions.details.retainedBrokerageAmount')} align="right" />
                          </Grid>
                          <Grid item>
                            <FormPopoverMenuRHF
                              control={control}
                              name={retainedBrokerageCurrencyCodeField.name}
                              placeholder={utils.string.t('app.select')}
                              text={premiumCurrency}
                              size="xsmall"
                              icon={ArrowDropDownIcon}
                              iconPosition="right"
                              isUseFormHook
                              disabled={isReadOnly || checkListMandatoryDataStatus}
                              anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                              }}
                              nestedClasses={{ btn: classes.popoverButton }}
                              items={options.map(({ id, label }) => ({
                                id,
                                label,
                                callback: () => setValue(retainedBrokerageCurrencyCodeField.name, id, { shouldDirty: true }),
                              }))}
                              data-testid="retainedBrokerageAmount"
                            />
                          </Grid>
                        </Grid>
                      </FormGrid>
                      <FormGrid item {...gridPropsRight}>
                        <div className={classes.brokerage}>
                          <Translate
                            label="format.currency"
                            options={{ value: { number: retainedBrokerageAmount, currency: premiumCurrency } }}
                          />
                          {convertedBrokerage && (
                            <>
                              <br />
                              <Translate
                                label="format.currency"
                                options={{ value: { number: convertedBrokerage.value, currency: 'GBP' } }}
                              />{' '}
                              @
                              <Translate
                                label="format.number"
                                options={{ value: { number: convertedBrokerage.rate, format: { trimMantissa: false } } }}
                              />
                            </>
                          )}
                        </div>
                      </FormGrid>
                    </FormGrid>
                  </FormGrid>
                  <FormGrid item xs={2} align="center">
                    <FormCheckbox
                      {...utils.form.getFieldProps(fields, 'retainedBrokerageCurrencyCodeCheckbox', control)}
                      register={register}
                    />
                  </FormGrid>
                </FormGrid>
              </Box>

              <Divider />

              <Box py={3}>
                <FormGrid container direction="row" alignItems="center">
                  <FormGrid item xs={10}>
                    <FormGrid container alignItems="center">
                      <FormGrid item {...gridPropsLeft}>
                        <FormLabel label={utils.string.t('processingInstructions.details.total')} align="right" />
                      </FormGrid>
                      <FormGrid item {...gridPropsRight}>
                        <div className={classes.brokerage}>{sumTotal}</div>
                      </FormGrid>
                    </FormGrid>
                  </FormGrid>
                </FormGrid>
              </Box>
              <Divider />
            </Box>
            <Box py={1.5}>
              <FormGrid container direction="row" alignItems="center">
                <FormGrid item xs={10}>
                  <FormGrid container alignItems="center">
                    <FormGrid item {...gridPropsLeft}>
                      <FormLabel label={utils.string.t('processingInstructions.details.fees')} align="right" />
                    </FormGrid>
                    <FormGrid item {...gridPropsRight}>
                      <FormText {...utils.form.getFieldProps(fields, 'feesNumber', control)} />
                    </FormGrid>
                  </FormGrid>
                </FormGrid>
                <FormGrid item xs={2} align="center">
                  <FormCheckbox {...utils.form.getFieldProps(fields, 'feesCheckbox', control)} register={register} />
                </FormGrid>
              </FormGrid>
            </Box>

            <Divider />

            <Box py={1.5}>
              <FormGrid container direction="row" alignItems="center">
                <FormGrid item xs={10}>
                  <FormGrid container alignItems="center">
                    <FormGrid item {...gridPropsLeft}>
                      <FormLabel label={utils.string.t('processingInstructions.details.otherDeductions')} align="right" />
                    </FormGrid>
                    <FormGrid item {...gridPropsRight}>
                      <FormText {...utils.form.getFieldProps(fields, 'otherDeductionsNumber', control)} />
                    </FormGrid>
                  </FormGrid>
                </FormGrid>
                <FormGrid item xs={2} align="center">
                  <FormCheckbox {...utils.form.getFieldProps(fields, 'otherDeductionsCheckbox', control)} register={register} />
                </FormGrid>
              </FormGrid>
            </Box>

            <Divider />

            <Box py={1.5}>
              <FormGrid container direction="row" alignItems="center">
                <FormGrid item xs={10}>
                  <FormGrid container alignItems="center">
                    <FormGrid item {...gridPropsLeft}>
                      <FormLabel label={utils.string.t('processingInstructions.details.settlementCurrency')} align="right" />
                    </FormGrid>
                    <FormGrid item {...gridPropsRight}>
                      <FormSelect {...utils.form.getFieldProps(fields, 'settlementCurrencyCodeIdNumber', control)} />
                    </FormGrid>
                  </FormGrid>
                </FormGrid>
                <FormGrid item xs={2} align="center">
                  <FormCheckbox {...utils.form.getFieldProps(fields, 'settlementCurrencyCodeIdCheckbox', control)} register={register} />
                </FormGrid>
              </FormGrid>
            </Box>

            <Divider />

            <Box py={1.5}>
              <FormGrid container direction="row" alignItems="center">
                <FormGrid item xs={10}>
                  <FormGrid container alignItems="center">
                    <FormGrid item {...gridPropsLeft}>
                      <FormLabel label={utils.string.t('processingInstructions.details.paymentBasis')} align="right" />
                    </FormGrid>
                    <FormGrid item {...gridPropsRight}>
                      <FormSelect {...utils.form.getFieldProps(fields, 'paymentBasisNumber', control)} />
                    </FormGrid>
                  </FormGrid>
                </FormGrid>
                <FormGrid item xs={2} align="center">
                  <FormCheckbox {...utils.form.getFieldProps(fields, 'paymentBasisCheckbox', control)} register={register} />
                </FormGrid>
              </FormGrid>
            </Box>

            <Divider />

            <Box py={1.5}>
              <FormGrid container direction="row" alignItems="center">
                <FormGrid item xs={10}>
                  <FormGrid container alignItems="center">
                    <FormGrid item {...gridPropsLeft}>
                      <Grid container direction="column" alignItems="flex-end">
                        <Grid item>
                          <FormLabel label={utils.string.t('processingInstructions.details.ppwPPC')} align="right" />
                        </Grid>
                        <Grid item>
                          <FormDate
                            {...utils.form.getFieldProps(fields, 'ppwOrPpcDate', control)}
                            plainText
                            nestedClasses={{ root: classes.datePickerLabel, input: classes.datePickerInput }}
                          />
                        </Grid>
                      </Grid>
                    </FormGrid>
                    <FormGrid item {...gridPropsRight}>
                      <FormSelect {...utils.form.getFieldProps(fields, 'ppwOrPpcString', control)} />
                      {fields?.find((a) => a.name === 'ppwOrPpcString')?.displayError && (
                        <Typography className={classes.errorMessage}>
                          {utils.string.t('processingInstructions.details.warrantyErrorMessage')}
                        </Typography>
                      )}
                    </FormGrid>
                  </FormGrid>
                </FormGrid>
                <FormGrid item xs={2} align="center">
                  <FormCheckbox {...utils.form.getFieldProps(fields, 'ppwOrPpcCheckbox', control)} register={register} />
                </FormGrid>
              </FormGrid>
            </Box>

            <Divider />

            <Box pt={4} pb={1}>
              <Typography className={classes.subTitle}>{utils.string.t('processingInstructions.details.specialInstructions')}</Typography>
            </Box>

            <Divider />
            <Box pt={4}>
              <FormGrid container>
                <FormGrid item xs={12} md={5}>
                  <Box mb={3}>
                    <FormText {...utils.form.getFieldProps(fields, 'notes', control)} />
                  </Box>
                </FormGrid>
              </FormGrid>
            </Box>
          </FormFields>
        </FormContainer>
        <SaveBar show nestedClasses={{ root: classesParent.saveBar }}>
          <Box display="flex" justifyContent="space-between">
            <Box flex="1 1 auto" textAlign="left">
              <Button
                text={utils.string.t('app.back')}
                onClick={handlers.back}
                disabled={isPageEdited}
                color="primary"
                size="small"
                variant="outlined"
                icon={NavigateBeforeIcon}
                iconPosition="left"
                nestedClasses={{ btn: classesParent.button }}
              />
            </Box>
            <Box flex="1 1 auto" textAlign="right">
              {isPageEdited && isEditable && (
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
                disabled={checkListMandatoryDataStatus}
                color="primary"
                size="small"
                icon={NavigateNextIcon}
                iconPosition="right"
                nestedClasses={{ btn: classesParent.button }}
              />
            </Box>
          </Box>
        </SaveBar>
        <PreventNavigation dirty={isPageEdited} allowedUrls={[`${config.routes.processingInstructions.steps}/${instructionId}/`]} />
      </Box>
    );
  }
);

ProcessingInstructionsDetailsView.propTypes = {
  documents: PropTypes.object.isRequired,
  fields: PropTypes.array.isRequired,
  defaultValues: PropTypes.object.isRequired,
  retainedBrokerageAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  convertedBrokerage: PropTypes.shape({
    value: PropTypes.number.isRequired,
    rate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }),
  premiumCurrency: PropTypes.string.isRequired,
  sumTotal: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  riskRefId: PropTypes.string.isRequired,
  isEditable: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  instructionId: PropTypes.number.isRequired,
  documentNotUploadedError: PropTypes.object.isRequired,
  checkListMandatoryDataStatus: PropTypes.bool.isRequired,
  handlers: PropTypes.shape({
    back: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    next: PropTypes.func.isRequired,
    getRetainedBrokerageAmount: PropTypes.func.isRequired,
    getTotalAmount: PropTypes.func.isRequired,
    uploadPremiumTaxSignedLinesModal: PropTypes.func.isRequired,
    confirmRemoveDocumentModal: PropTypes.func.isRequired,
    download: PropTypes.func.isRequired,
  }).isRequired,
};

export default ProcessingInstructionsDetailsView;
