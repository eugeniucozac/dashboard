import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import classnames from 'classnames';
import isEqual from 'lodash/isEqual';
import camelCase from 'lodash/camelCase';

//app
import styles from './ProcessingInstructionsChecklist.styles';
import stylesParent from '../../pages/ProcessingInstructionsSteps/ProcessingInstructionsSteps.styles';
import ProcessingInstructionsRiskRefTabTable from '../ProcessingInstructionsRiskRefTabTable/ProcessingInstructionsRiskRefTabTable';
import {
  Button,
  DynamicTable,
  FormContainer,
  FormFields,
  FormGrid,
  FormText,
  Info,
  Tabs,
  SaveBar,
  PreventNavigation,
  FormSelect,
  Sticky,
} from 'components';
import * as utils from 'utils';
import config from 'config';
import * as constants from 'consts';
import { useMedia } from 'hooks';

// mui
import { Box, Typography, useTheme, makeStyles, Divider } from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

const ProcessingInstructionsChecklistView = forwardRef(
  (
    {
      instruction,
      leadRef,
      defaultValues,
      columns,
      tabs,
      selectedTab,
      fields,
      schemaData,
      isRiskReferenceDocumentCountLoading,
      isFdo,
      isReadOnly,
      isEditable,
      isCheckboxesEditable,
      resetKey,
      handlers,
    },
    ref
  ) => {
    const classes = makeStyles(styles, { name: 'ProcessingInstructionsChecklist' })();
    const classesParent = makeStyles(stylesParent)();
    const media = useMedia();
    const theme = useTheme();

    const validationSchema = utils.form.getValidationSchema(fields);

    const { reset, handleSubmit, register, setValue, watch, getValues, formState, ...formProps } = useForm({
      defaultValues,
      ...(validationSchema && { resolver: yupResolver(validationSchema) }),
    });

    const { control, errors } = formProps;
    const formValues = watch();
    const isPageEdited = !isEqual(defaultValues, formValues);

    const rows = schemaData?.rows?.map((row) => {
      return {
        ...row,
        cells: row.cells.map((cell) => {
          switch (cell.columnName) {
            case 'signedDate':
              return {
                ...cell,
                disabled: isReadOnly,
              };
            case 'accountHandler':
              return {
                ...cell,
                disabled: isReadOnly,
                cellProps: { ...cell.cellProps, center: true },
              };
            case 'authorisedSignatory':
              return {
                ...cell,
                disabled: !isCheckboxesEditable,
                cellProps: { ...cell.cellProps, center: true },
              };
            default:
              return cell;
          }
        }),
      };
    });

    const onValid = () => {
      handlers.setTabs(tabs);
      handlers.next(0, { isNext: !isPageEdited, isSave: false, isSaveNext: isPageEdited });
    };

    const onInvalid = (data) => {
      handlers.next(Object.keys(data)?.length, { isNext: !isPageEdited, isSave: false, isSaveNext: isPageEdited });
    };

    const stickyParent = media.tabletUp ? utils.app.getElement('#content') : null;
    const stickyOffset = media.tabletUp ? 0 : theme.mixins.header.height;

    return (
      <Box width={1} mt={5} data-testid="processing-instructions-checklist">
        <Sticky parent={stickyParent} top={stickyOffset} nestedClasses={{ root: classes.sticky, rootSticky: classes.stickyActive }}>
          <Tabs tabs={tabs} overrideTab={selectedTab} onChange={handlers.toggleTab} />
        </Sticky>

        <FormContainer
          ref={ref}
          resetFunc={reset}
          values={formValues}
          autoComplete="off"
          data-testid="form-processing-instructions-checklist"
        >
          <FormFields>
            <div className={classnames({ [classes.hideContent]: !Boolean(selectedTab === 'general') })}>
              <Box pt={2} pb={4}>
                <Typography className={classes.subTitle}>{utils.string.t('processingInstructions.leadRiskRef')}</Typography>
                <Divider />
                <Box pt={2}>
                  <FormGrid container spacing={4}>
                    <FormGrid item xs={6} md={3}>
                      <Info
                        title={utils.string.t('processingInstructions.leadRiskRef')}
                        description={leadRef ? leadRef.riskRefId : '-'}
                        nestedClasses={{ root: classes.info }}
                      />
                    </FormGrid>
                    <FormGrid item xs={6} md={3}>
                      <Info
                        title={utils.string.t('app.department')}
                        description={leadRef ? leadRef.departmentName : '-'}
                        nestedClasses={{ root: classes.info }}
                      />
                    </FormGrid>
                    <FormGrid item xs={6} md={3}>
                      <Info
                        title={utils.string.t('app.reInsured')}
                        description={leadRef ? leadRef.assuredName : '-'}
                        nestedClasses={{ root: classes.info }}
                      />
                    </FormGrid>
                    <FormGrid item xs={6} md={3}>
                      <Info
                        title={utils.string.t('app.yearOfAccounts')}
                        description={leadRef ? leadRef.yoa : '-'}
                        nestedClasses={{ root: classes.info }}
                      />
                    </FormGrid>
                    <FormGrid item xs={6} md={3}>
                      <Info
                        title={utils.string.t('app.inceptionDate')}
                        description={leadRef ? leadRef.inceptionDate : '-'}
                        nestedClasses={{ root: classes.info }}
                      />
                    </FormGrid>
                    <FormGrid item xs={6} md={3}>
                      <Info
                        title={utils.string.t('app.expiryDate')}
                        description={leadRef ? leadRef.expiryDate : '-'}
                        nestedClasses={{ root: classes.info }}
                      />
                    </FormGrid>
                  </FormGrid>
                </Box>
              </Box>

              {isFdo && (
                <Box pt={2} pb={4}>
                  <Divider />
                  <Box pt={4}>
                    <FormGrid container spacing={4}>
                      <FormGrid item xs={12} sm={6}>
                        <FormText {...utils.form.getFieldProps(fields, 'businessType', control, errors)} />
                      </FormGrid>
                      <FormGrid item xs={12} sm={6}>
                        <FormSelect {...utils.form.getFieldProps(fields, 'facilityType', control, errors)} />
                      </FormGrid>
                    </FormGrid>
                  </Box>
                </Box>
              )}

              <Box pt={2} pb={4}>
                <Typography className={classes.subTitle}>{utils.string.t('app.client')}</Typography>
                <Divider />
                <Box pt={4}>
                  <FormGrid container spacing={4}>
                    <FormGrid item xs={12} sm={6} md={3}>
                      <FormText {...utils.form.getFieldProps(fields, 'invoicingClient', control, errors)} />
                    </FormGrid>
                    <FormGrid item xs={12} sm={6} md={3}>
                      <FormText {...utils.form.getFieldProps(fields, 'contactName', control, errors)} />
                    </FormGrid>
                    <FormGrid item xs={12} sm={6} md={3}>
                      <FormText {...utils.form.getFieldProps(fields, 'clientEmail', control, errors)} />
                    </FormGrid>
                    <FormGrid item xs={12} sm={6} md={3}>
                      <FormText {...utils.form.getFieldProps(fields, 'eocInvoiceContactName', control, errors)} />
                    </FormGrid>
                    <FormGrid item xs={12} sm={6} md={3}>
                      <FormText {...utils.form.getFieldProps(fields, 'eocInvoiceMail', control, errors)} />
                    </FormGrid>
                  </FormGrid>
                </Box>
              </Box>

              <Box pt={2} pb={4}>
                <Typography className={classes.subTitle}>{utils.string.t('app.broking')}</Typography>
                <Divider />
                <Box pt={4}>
                  <FormGrid container>
                    <FormGrid item xs={12} sm={6} key={`producingBroker-${resetKey}`}>
                      <FormSelect {...utils.form.getFieldProps(fields, 'producingBroker', control, errors)} />
                    </FormGrid>
                    <FormGrid item xs={12} sm={6} key={`accountExecutive-${resetKey}`}>
                      <FormSelect {...utils.form.getFieldProps(fields, 'accountExecutive', control, errors)} />
                    </FormGrid>
                  </FormGrid>
                </Box>
              </Box>
            </div>

            {['pre-placing', 'mrc', 'other-details'].map((item) => {
              const key = camelCase(item);

              return (
                <div key={`tabbed-content-${key}`} className={classnames({ [classes.hideContent]: selectedTab !== item })}>
                  <DynamicTable formProps={formProps} rows={rows?.filter((row) => row.tabKey === key)} columnHeaders={columns} />
                </div>
              );
            })}

            {selectedTab === 'risk-references' && (
              <Box>
                <ProcessingInstructionsRiskRefTabTable
                  instruction={instruction}
                  documentTypeKey={constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piClosingFdo}
                />
              </Box>
            )}
          </FormFields>
        </FormContainer>

        <SaveBar show nestedClasses={{ root: classesParent.saveBar }}>
          <Box display="flex" justifyContent="space-between">
            <Box flex="1 1 auto" textAlign="left">
              <Button
                text={utils.string.t('app.back')}
                onClick={handlers.back}
                disabled={isPageEdited}
                size="small"
                color="primary"
                variant="outlined"
                icon={NavigateBeforeIcon}
                iconPosition="left"
                nestedClasses={{ btn: classesParent.button }}
              />
            </Box>
            <Box flex="1 1 auto" textAlign="right">
              {isPageEdited && (isEditable || isCheckboxesEditable) && (
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
                    onClick={() => handlers.save({ isNext: false, isSave: true, isSaveNext: false })}
                    color="secondary"
                    size="small"
                    variant="outlined"
                    nestedClasses={{ btn: classesParent.button }}
                  />
                </>
              )}
              <Button
                text={utils.string.t('app.next')}
                onClick={handleSubmit(onValid, onInvalid)}
                disabled={isRiskReferenceDocumentCountLoading}
                color="primary"
                size="small"
                type="submit"
                icon={NavigateNextIcon}
                iconPosition="right"
                nestedClasses={{ btn: classesParent.button }}
              />
            </Box>
          </Box>
        </SaveBar>

        <PreventNavigation
          dirty={isPageEdited}
          allowedUrls={[
            `${config.routes.processingInstructions.steps}/${instruction?.id}/`,
            `${config.routes.processingInstructions.steps}/${instruction?.id}/checklist/${constants.GENERAL}`,
            `${config.routes.processingInstructions.steps}/${instruction?.id}/checklist/${constants.PRE_PLACING}`,
            `${config.routes.processingInstructions.steps}/${instruction?.id}/checklist/${constants.MRC}`,
            `${config.routes.processingInstructions.steps}/${instruction?.id}/checklist/${constants.OTHER_DETAILS}`,
            `${config.routes.processingInstructions.steps}/${instruction?.id}/checklist/${constants.RISK_REFERENCES}`,
          ]}
        />
      </Box>
    );
  }
);

ProcessingInstructionsChecklistView.propTypes = {
  instruction: PropTypes.object.isRequired,
  leadRef: PropTypes.object.isRequired,
  defaultValues: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  tabs: PropTypes.array.isRequired,
  selectedTab: PropTypes.string.isRequired,
  fields: PropTypes.array.isRequired,
  schemaData: PropTypes.object.isRequired,
  isRiskReferenceDocumentCountLoading: PropTypes.bool,
  isFdo: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  isEditable: PropTypes.bool,
  isCheckboxesEditable: PropTypes.bool,
  resetKey: PropTypes.number,
  handlers: PropTypes.shape({
    back: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    next: PropTypes.func.isRequired,
    toggleTab: PropTypes.func.isRequired,
    setTabs: PropTypes.func.isRequired,
  }),
};

export default ProcessingInstructionsChecklistView;
