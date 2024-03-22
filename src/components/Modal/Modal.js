import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import get from 'lodash/get';

// app
import styles from './Modal.styles';
import * as utils from 'utils';
import { hideModal, fullScreenModal } from 'stores';
import { Button, Confirm, Translate } from 'components';
import {
  AddRiskContainer,
  DmsVersionHistory,
  PasteFromExcel,
  PolicyDocuments,
  PortfolioMap,
  CreateAdhocTask as CreateAdhocTaskWizard,
} from 'modules';
import {
  AddAssignee,
  AddClaimTaskNote,
  AddComplexity,
  AddDepartmentMarket,
  AddEditClaimRefNotes,
  AddEditClientOffice,
  AddEditMarkets,
  AddEditUmr,
  AddEditUser,
  AddEditQuoteBind,
  AddInsured,
  AddLayer,
  AddManageSetting,
  AddMarket,
  AddPlacementLayer,
  AddPlacementLayerMarket,
  AddPlacementMarket,
  AddProductsClient,
  AddProductsCarrier,
  AddProductsFacility,
  AddProductsInsured,
  AddReferral,
  AddRiskQuote,
  AddRiskRefAdvancedSearch,
  AddLossNotes,
  BulkAssignClaims,
  BulkUpdateLayer,
  BulkUpdatePolicy,
  ChangePriority,
  ChangeComplexityPriorityAssignment,
  CheckListAlerts,
  ComplexityManagementAddPolicy,
  ComplexManagementInsured,
  ComplexityManagementDivisionReset,
  ConfirmClaimSubmission,
  ConfirmDecline,
  ConfirmDelete,
  ConfirmWithComment,
  CreateRFI,
  ClaimsCreateRFIStepper,
  CreateEditUser,
  CreateInWhitespace,
  DmsEditMetadata,
  DmsLinkToLossAndClaim,
  DmsUploadFiles,
  DocumentUpload,
  DownloadBordereaux,
  DownloadFiles,
  DmsUploadFilesClient,
  EditClaimTaskNote,
  EditClaimInformation,
  EditClaimRefNotesRow,
  EditDepartmentMarket,
  EditLossInformation,
  EditPlacement,
  EditPlacementLayer,
  EditPlacementMarketsLayers,
  EditPolicy,
  EditProductsFacility,
  EditProductsFacilityLimits,
  EditProductsInsured,
  EditProductsClient,
  EditQuote,
  EditRiskQuote,
  EditTripBrokers,
  EditLossNotesRow,
  ModellingTask,
  NewEnquiry,
  PlacementPDF,
  ProcessingInstructionsManageDocuments,
  PremiumTaxSignedLinesDocumentUpload,
  RemoveClaimsComplexityRuleValue,
  RfiQueryResponse,
  RfiQueryResponseLogs,
  AddEditReport,
  EditReportGroup,
  AddReportGroup,
  SelectInterest,
  SetTaskPriority,
  SetClaimPriority,
  SetClaimsTaskSelection,
  SignDown,
  SingleAssignClaim,
  UpdateStatus,
  PreBindQuote,
  ViewClaimInformation,
  PremiumProcessingCheckSigning,
  PremiumProcessingCheckSigningReject,
  ReportGroupExtendedAddEdit,
  ReportsExtendedAddEdit,
  ClaimsRegisterNewLoss,
  CreateAdHocTask,
} from 'forms';

// mui
import CloseIcon from '@material-ui/icons/Close';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import { withStyles, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider } from '@material-ui/core';

// state
const mapStateToProps = (state) => ({
  uiModal: state.ui.modal,
  fullScreen: state.ui.fullScreen,
});

// dispatch
const mapDispatchToProps = {
  hideModal,
  fullScreenModal,
};

export class Modal extends Component {
  static propTypes = {
    uiModal: PropTypes.arrayOf(
      PropTypes.shape({
        visible: PropTypes.bool,
        type: PropTypes.string,
        props: PropTypes.shape({
          title: PropTypes.string,
          subtitle: PropTypes.string,
          fullWidth: PropTypes.bool,
          hideCompOnBlur: PropTypes.bool,
          fullScreen: PropTypes.bool,
          maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
          componentProps: PropTypes.shape({
            buttonColors: PropTypes.shape({
              cancel: PropTypes.string,
              confirm: PropTypes.string,
            }),
            cancelLabel: PropTypes.string,
            confirmLabel: PropTypes.string,
            confirmMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
            hideCancelButton: PropTypes.bool,
            cancelHandler: PropTypes.func,
            submitHandler: PropTypes.func,
          }),
        }),
        actions: PropTypes.arrayOf(
          PropTypes.shape({
            type: PropTypes.string,
            label: PropTypes.string,
            variant: PropTypes.string,
            color: PropTypes.string,
            callback: PropTypes.func,
          })
        ),
      })
    ).isRequired,
    hideModal: PropTypes.func.isRequired,
  };

  // we're mapping modal type(s) to the component to use for each
  components = {
    ADD_ASSIGNEE: AddAssignee,
    ADD_CLAIM_TASK_NOTE: AddClaimTaskNote,
    ADD_COMPLEXITY: AddComplexity,
    ADD_DEPARTMENT_MARKET: AddDepartmentMarket,
    ADD_EDIT_CLAIM_REF_NOTES: AddEditClaimRefNotes,
    ADD_EDIT_CLIENT_OFFICE: AddEditClientOffice,
    ADD_EDIT_MARKETS: AddEditMarkets,
    ADD_EDIT_UMR: AddEditUmr,
    ADD_EDIT_USER: AddEditUser,
    ADD_EDIT_QUOTE_BIND: AddEditQuoteBind,
    ADD_INSURED: AddInsured,
    ADD_LAYER: AddLayer,
    ADD_MARKET: AddMarket,
    ADD_PLACEMENT_LAYER: AddPlacementLayer,
    ADD_PLACEMENT_LAYER_MARKET: AddPlacementLayerMarket,
    ADD_PLACEMENT_MARKET: AddPlacementMarket,
    ADD_PRODUCTS_CLIENT: AddProductsClient,
    ADD_PRODUCTS_CARRIER: AddProductsCarrier,
    ADD_PRODUCTS_FACILITY: AddProductsFacility,
    ADD_PRODUCTS_INSURED: AddProductsInsured,
    ADD_REFERRAL: AddReferral,
    ADD_REPORT_GROUP: AddReportGroup,
    ADD_RISK: AddRiskContainer,
    ADD_RISK_QUOTE: AddRiskQuote,
    ADD_RISK_REF_ADVANCED_SEARCH: AddRiskRefAdvancedSearch,
    ADD_MANAGE_DOCUMENT_SETTING: AddManageSetting,
    ADD_LOSS_NOTES: AddLossNotes,
    BULK_ASSIGN_CLAIMS: BulkAssignClaims,
    BULK_UPDATE_LAYER: BulkUpdateLayer,
    BULK_UPDATE_POLICY: BulkUpdatePolicy,
    CHANGE_PRIORITY: ChangePriority,
    CHANGE_COMPLEXITY_PRIORITY_ASSIGNMENT: ChangeComplexityPriorityAssignment,
    CHECK_LIST_ALERTS: CheckListAlerts,
    COMPLEXITY_MANAGEMENT_ADD_POLICY: ComplexityManagementAddPolicy,
    COMPLEXITY_MANAGEMENT_INSURED: ComplexManagementInsured,
    COMPLEXITY_MANAGEMENT_DIVISION_RESET: ComplexityManagementDivisionReset,
    COMPLEXITY_MANAGEMENT_REMOVE_RULE_VALUE: RemoveClaimsComplexityRuleValue,
    CONFIRM: Confirm,
    CONFIRM_CLAIM_SUBMISSION: ConfirmClaimSubmission,
    CONFIRM_DECLINE_RISK: ConfirmDecline,
    CONFIRM_DELETE: ConfirmDelete,
    CONFIRM_WITH_COMMENT: ConfirmWithComment,
    CREATE_AD_HOC_TASK: CreateAdHocTask,
    CREATE_AD_HOC_TASK_WIZARD: CreateAdhocTaskWizard,
    CREATE_EDIT_USER: CreateEditUser,
    CREATE_IN_WHITESPACE: CreateInWhitespace,
    CREATE_RFI: CreateRFI,
    CLAIMS_CREATE_RFI_STEPPER: ClaimsCreateRFIStepper,
    DMS_UPLOAD_FILES: DmsUploadFiles,
    DOCUMENT_UPLOAD: DocumentUpload,
    DMS_VERSION_HISTORY: DmsVersionHistory,
    DMS_EDIT_META_DATA: DmsEditMetadata,
    DMS_LINK_TO_LOSS_AND_CLAIM: DmsLinkToLossAndClaim,
    DMS_UPLOAD_FILES_CLIENT_SIDE: DmsUploadFilesClient,
    DOWNLOAD_BORDEREAUX: DownloadBordereaux,
    DOWNLOAD_FILES: DownloadFiles,
    EDIT_CLAIM_TASK_NOTE: EditClaimTaskNote,
    EDIT_CLAIM_INFORMATION: EditClaimInformation,
    EDIT_CLAIMREF_NOTES_ROW: EditClaimRefNotesRow,
    EDIT_DEPARTMENT_MARKET: EditDepartmentMarket,
    EDIT_LOSS_INFORMATION: EditLossInformation,
    EDIT_LOSS_NOTES_ROW: EditLossNotesRow,
    EDIT_PLACEMENT_LAYER: EditPlacementLayer,
    EDIT_PLACEMENT_MARKETS_LAYERS: EditPlacementMarketsLayers,
    EDIT_POLICY: EditPolicy,
    EDIT_PLACEMENT: EditPlacement,
    EDIT_PRODUCTS_FACILITY: EditProductsFacility,
    EDIT_PRODUCTS_FACILITY_LIMITS: EditProductsFacilityLimits,
    EDIT_PRODUCTS_CLIENT: EditProductsClient,
    EDIT_PRODUCTS_INSURED: EditProductsInsured,
    EDIT_QUOTE: EditQuote,
    EDIT_REPORT: AddEditReport,
    EDIT_REPORT_GROUP: EditReportGroup,
    EDIT_RISK_QUOTE: EditRiskQuote,
    EDIT_TRIP_BROKERS: EditTripBrokers,
    MODELLING_TASK: ModellingTask,
    NEW_ENQUIRY: NewEnquiry,
    PASTE_FROM_EXCEL: PasteFromExcel,
    PI_MANAGE_DOCUMENTS: ProcessingInstructionsManageDocuments,
    PLACEMENT_PDF: PlacementPDF,
    POLICY_DOCUMENTS: PolicyDocuments,
    PORTFOLIO_MAP: PortfolioMap,
    PREMIUM_TAX_SIGNED_LINES_DOCUMENT_UPLOAD: PremiumTaxSignedLinesDocumentUpload,
    RFI_QUERY_RESPONSE: RfiQueryResponse,
    RFI_QUERY_RESPONSE_LOGS: RfiQueryResponseLogs,
    SELECT_INTEREST: SelectInterest,
    SET_PRIORITY: SetTaskPriority,
    SET_CLAIM_PRIORITY: SetClaimPriority,
    SET_CLAIM_TASK_SELECTION: SetClaimsTaskSelection,
    SIGN_DOWN: SignDown,
    SINGLE_ASSIGN_CLAIM: SingleAssignClaim,
    UPDATE_STATUS: UpdateStatus,
    VIEW_CLAIM_INFORMATION: ViewClaimInformation,
    PRE_BIND_QUOTE: PreBindQuote,
    PREMIUM_PROCESSING_CHECK_SIGNING: PremiumProcessingCheckSigning,
    PREMIUM_PROCESSING_CHECK_SIGNING_REJECT: PremiumProcessingCheckSigningReject,
    REPORT_GROUP_EXTENDED_ADD_EDIT: ReportGroupExtendedAddEdit,
    REPORTS_EXTENDED_ADD_EDIT: ReportsExtendedAddEdit,
    CLAIM_REGISTER_NEW_LOSS: ClaimsRegisterNewLoss,
  };

  handleClose =
    (type, closeModalOnClickOutside = true, cancelHandler, clickOutSideHandler) =>
      (event, reason) => {
        if (reason === 'backdropClick' && !closeModalOnClickOutside) {
          return;
        } else if (utils.generic.isFunction(clickOutSideHandler)) {
          clickOutSideHandler();
        } else {
          this.props.hideModal(type);
          utils.generic.isFunction(cancelHandler) && cancelHandler();
        }
      };

  handleCloseX = (type, cancelHandler, clickXHandler) => (event) => {
    if (utils.generic.isFunction(clickXHandler)) {
      clickXHandler();
    } else {
      this.props.hideModal(type);
      utils.generic.isFunction(cancelHandler) && cancelHandler();
    }
  };

  handleFullScreen = () => {
    this.props.fullScreenModal();
  };

  render() {
    if (!get(this.props, 'uiModal[0].type')) return null;

    const { uiModal, classes, fullScreen } = this.props;

    return (
      <>
        {uiModal.map((modal) => {
          const ModalContent = this.components[modal.type];
          const hasMaxWidth = get(modal, 'props.maxWidth');
          const closeModalOnClickOutside = get(modal, 'props.hideCompOnBlur', true);
          const cancelHandler = get(modal, 'props.componentProps.cancelHandler', null);
          const enableFullScreen = get(modal, 'props.enableFullScreen', false);

          const clickOutSideHandler = get(modal, 'props.componentProps.clickOutSideHandler', null);
          const clickXHandler = get(modal, 'props.componentProps.clickXHandler', null);

          return (
            <Dialog
              data-testid="modal-dialog"
              key={modal.type}
              open={modal.visible}
              onClose={this.handleClose(modal.type, closeModalOnClickOutside, cancelHandler, clickOutSideHandler)}
              fullWidth={modal.props.fullWidth}
              fullScreen={fullScreen || modal.props.fullScreen}
              maxWidth={modal.props.maxWidth}
              disableAutoFocus={modal.props.disableAutoFocus}
              aria-labelledby="modal-title"
              classes={{
                ...(!hasMaxWidth && { paper: classes.paper }),
              }}
            >
              {enableFullScreen ? (
                <Button
                  icon={FullscreenIcon}
                  variant="text"
                  onClick={this.handleFullScreen}
                  nestedClasses={{ btn: classes.fullScreen }}
                  data-testid="modal-fullscreen-button"
                />
              ) : null}

              <Button
                icon={CloseIcon}
                variant="text"
                onClick={this.handleCloseX(modal.type, cancelHandler, clickXHandler, clickOutSideHandler)}
                nestedClasses={{ btn: classes.close }}
                data-testid="modal-close-button"
              />

              {(modal.props.title || modal.props.titleChildren) && (
                <Fragment>
                  <DialogTitle disableTypography id="modal-title" data-testid="modal-title" className={modal.props.titleChildren ? classes.titleChildren : ''}>
                    {modal.props.titleChildren ? (
                      modal.props.titleChildren
                    ) : (
                      <>
                        <Translate label={modal.props.title} variant="h2" className={classes.title} />
                        {modal.props.subtitle && <Translate label={modal.props.subtitle} variant="h6" className={classes.subtitle} />}
                      </>
                    )}
                  </DialogTitle>
                  <Divider />
                </Fragment>
              )}

              <DialogContent className={classes.content}>
                {modal.props.hint && (
                  <DialogContentText className={classes.hint} data-testid="modal-hint">
                    {utils.string.t(modal.props.hint)}
                  </DialogContentText>
                )}

                {get(modal, 'props.children') ? (
                  get(modal, 'props.children')
                ) : (
                  <ModalContent fullScreen={fullScreen} {...modal.props.componentProps} handleClose={this.handleClose(modal.type)} />
                )}
              </DialogContent>

              {get(modal, 'actions', []).length > 0 && (
                <Fragment>
                  <Divider />
                  <DialogActions data-testid="modal-actions">
                    {modal.actions.map((action, idx) => {
                      let btnAction = null;

                      if (action.type === 'ok' || action.type === 'cancel') {
                        btnAction = this.handleClose(modal.type, true, action.callback);
                      } else {
                        btnAction = action.callback;
                      }

                      return (
                        <Button
                          key={idx}
                          {...(btnAction && { onClick: btnAction })}
                          {...(action.variant && { variant: action.variant })}
                          {...(action.color && { color: action.color })}
                          text={<Translate label={action.label} />}
                          data-testid={`modal-btn-${action.type}`}
                        />
                      );
                    })}
                  </DialogActions>
                </Fragment>
              )}
            </Dialog>
          );
        })}
      </>
    );
  }
}

export default compose(connect(mapStateToProps, mapDispatchToProps), withStyles(styles))(Modal);
