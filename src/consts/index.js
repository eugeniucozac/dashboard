// currency
export const CURRENCY_USD = 'USD';
export const CURRENCY_GBP = 'GBP';
// origin
export const ORIGIN_GXB = 'GXB';
export const ORIGIN_EDGE = 'OMS';
//  Premium Processing Office Type
export const BACK_OFFICE = 'Back Office';
export const MIDDLE_OFFICE = 'Middle Office';
// organisations
export const ORGANIZATIONS = {
  mphasis: {
    id: 1,
    name: 'mphasis',
    label: 'Mphasis',
    complexity: 'Non-Complex',
  },
  ardonagh: {
    id: 2,
    name: 'ardonagh',
    label: 'Ardonagh',
    complexity: 'Complex',
  },
};
// status
export const STATUS_MARKET_PENDING = 'Pending';
export const STATUS_MARKET_QUOTED = 'Quoted';
export const STATUS_MARKET_DECLINED = 'Declined';
export const STATUS_PLACEMENT_BOUND = 'Bound';
export const STATUS_PLACEMENT_NTU = 'NTU';
export const STATUS_POLICY_NTU = 'Not Taken Up';
export const STATUS_UNAUTHORIZED = 'Unauthorized';
export const STATUS_NOT_APPLICABLE = 'NA';
export const STATUS_CLAIMS_DRAFT = 'Draft';
export const STATUS_CLAIMS_IN_PROGRESS = 'In-Progress';
export const STATUS_CLAIMS_GXBSYNCED = 'GXBSynced';
export const STATUS_CLAIMS_SUBMITTED = 'Submitted';

// role
export const ROLE_BROKER = 'BROKER';
export const ROLE_COVERHOLDER = 'COVERHOLDER';
export const ROLE_COBROKER = 'COBROKER';
export const ROLE_UNDERWRITER = 'UNDERWRITER';
export const ROLE_ADMIN = 'ADMIN';
export const ROLE_JUNIOR_TECHNICIAN = 'Junior Technician';
export const ROLE_SENIOR_TECHNICIAN = 'Senior Technician';
export const ROLE_TECHNICIAN_MANAGER = 'Technician Manager';
export const ROLE_FRONT_END_CONTACT = 'Front-End Contact';
export const ROLE_OPERATIONS_LEAD = 'Operations Lead';
// brands
export const BRAND_PRICEFORBES = 'priceforbes';
export const BRAND_PRICEFORBES_NAME = 'Price Forbes';
export const BRAND_PRICEFORBES_APPNAME = 'EDGE Price Forbes Online';
export const BRAND_BISHOPSGATE = 'bishopsgate';
export const BRAND_BISHOPSGATE_NAME = 'Bishopsgate';
export const BRAND_BISHOPSGATE_APPNAME = 'EDGE Bishopsgate Online';
// Q&B
export const QUOTE_PREMIUM_PRECISION = 6;
export const PRODUCT_STATUS_ERROR = 'ERROR';
export const PRODUCT_STATUS_WARN = 'WARN';
export const PRODUCT_STATUS_OK = 'OK';
// risks
export const RISK_DEFINITION_GENERAL = 'GENERAL';
export const RISK_DEFINITION_PARTY = 'PARTY';
export const RISK_DEFINITION_EFFECTIVE = 'EFFECTIVE';
export const RISK_STATUS_BOUND = 'BOUND';
export const RISK_QUOTE_STATUS_QUOTING = 'QUOTING';
export const RISK_QUOTE_STATUS_DRAFT = 'DRAFT';
export const RISK_QUOTE_STATUS_QUOTED = 'QUOTED';
export const RISK_QUOTE_STATUS_REFERRED = 'REFERRED';
export const RISK_QUOTE_STATUS_DECLINED = 'DECLINED';
export const RISK_QUOTE_STATUS_BOUND = 'BOUND';
export const RISK_QUOTE_STATUS_NTU = 'NTU';
export const RISK_QUOTE_STATUS_BLOCKED = 'BLOCKED';
export const RISK_QUOTE_STATUS_REJECTED = 'REJECTED';
export const RISK_QUOTE_PREBIND = 'PRE_BIND';
export const RISK_ISSUE_WAITING = 'WAITING';
export const RISK_LOCATIONS_ACCURACY = ['ROOFTOP', 'RANGE_INTERPOLATED', 'GEOMETRIC_CENTER'];
export const WIND_HAIL_TEMPLATE_PATH = 'https://edgeassets.blob.core.windows.net/templates/Edge Q&B W&H buildings template.xlsx';
// risk issues
export const RISK_ISSUE_SANCTIONS_BLOCKED = 'SANCTIONS_BLOCKED';
export const RISK_ISSUE_STATUS_PASSED = 'PASSED';
// key
export const KEYCODE = {
  Tab: 9,
  Enter: 13,
  Shift: 16,
  Escape: 27,
  Space: 32,
  ArrowLeft: 37,
  ArrowUp: 38,
  ArrowRight: 39,
  ArrowDown: 40,
};
// file extension
export const FILE_EXTENSION = {
  'application/json': 'json',
  'application/msexcel': 'xlsx',
  'application/msword': 'doc',
  'application/pdf': 'pdf',
  'application/rtf': 'rtf',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.oasis.opendocument.presentation': 'odp',
  'application/vnd.oasis.opendocument.spreadsheet': 'ods',
  'application/vnd.oasis.opendocument.text': 'odt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/xml': 'xml',
  'application/zip': 'zip',
  'text/plain': 'txt',
  'text/xml': 'xml',
};
// policy file upload
export const POLICY_FILE_UPLOAD_MAX_FILES = 5;
export const POLICY_FILE_UPLOAD_MAX_FILE_SIZE = 2 * 1073741824; // 1073741824 is 1GB in binary format
export const POLICY_FILE_UPLOAD_ALLOW_MULTIPLE = true;
export const POLICY_FILE_UPLOAD_ALLOWED_FILE_EXT =
  '.zip, .pdf, .txt, .doc, .docx, .xls, .xlsx, .msg, .ppt, .pptx, .png, .gif, .jpg, .jpeg, .tiff';
// processing instruction file upload
export const PROCESSING_INSTRUCTION_FILE_UPLOAD_MAX_FILES = 5;
export const PROCESSING_INSTRUCTION_DETAILS_FILE_UPLOAD_MAX_FILES = 1;
export const PROCESSING_INSTRUCTION_FILE_UPLOAD_MAX_FILE_SIZE = 10485760; // 10485760 is 10MB in binary format
export const PROCESSING_INSTRUCTION_FILE_UPLOAD_ALLOW_MULTIPLE = true;
export const PROCESSING_INSTRUCTION_FILE_UPLOAD_ALLOWED_FILE_EXT =
  '.zip,.pdf,.txt,.doc,.docx,.xls,.xlsx,.msg,.ppt,.pptx,.png,.gif,.jpg,.jpeg,.tiff';
// application type
export const APPLICATION_TYPE_JSON = 'application/json';
export const APPLICATION_TYPE_TEXT = 'text/plain';
// placement
export const PLACEMENT_DECLARATION = 'DECLARATION';
export const PLACEMENT_OPEN_MARKET = 'OPEN_MARKET';
export const PLACEMENT_LINESLIP = 'LINESLIP';
export const PLACEMENT_BINDER = 'BINDER';
export const FOLDER_MODELLING = 'MODELLING';
export const FOLDER_SUBMISSIONS = 'SUBMISSIONS';
export const FOLDER_CORRESPONDENCE = 'CORRESPONDENCE';
// order/group markets by statusId in this order
export const MARKETS_STATUS_ID_ORDER = [2, 1, 3, null];
export const MARKET_COLORS = [null, '#EDAC00', '#2CC6AB', '#E93D4C'];
// Format excel data
export const COUNTRY_RATES = 'COUNTRY_RATES';
// Bulk select
export const SELECTED = 'YES';
export const DESELECTED = 'NO';
export const SELECTALL = 'ALL';
// Hotjar
export const HOTJAR_ID = 2416850;
export const HOTJAR_VERSION = 6;
// Modelling
export const MODELLING_QUOTING = 'QUOTING';
export const MODELLING_BOUND = 'BOUND';
//EMS
export const EMS_TO = 'TO';
export const EMS_CC = 'CC';
export const EMS_NO_REPLY_AVATAR = 'N';
//EMS Email Type
export const EMS_EMAIL_TYPE_CLIENT = 'Clients';
export const EMS_EMAIL_TYPE_NON_BUREAU = 'NonBureau';
// EMS Contexts
export const EMS_CONTEXT_CASE = 'case';
// Premium Processing
export const PREMIUM_PROCESSING_TAB_BUREAU = 'bureau';
export const PREMIUM_PROCESSING_TAB_CASE_DETAILS = 'case-details';
export const PREMIUM_PROCESSING_TAB_CLIENT = 'client';
export const PREMIUM_PROCESSING_TAB_DOCUMENTS = 'documents';
export const PREMIUM_PROCESSING_TAB_HISTORY = 'history';
export const PREMIUM_PROCESSING_TAB_ISSUE_DOCUMENTS = 'issue-documents';
export const PREMIUM_PROCESSING_TAB_NEW_RFI = 'new';
export const PREMIUM_PROCESSING_TAB_NON_BUREAU = 'non-bureau';
export const PREMIUM_PROCESSING_TAB_NOTES = 'notes';
export const PREMIUM_PROCESSING_TAB_RFI = 'rfi';
export const WORKLIST = 'WL';
export const WORKBASKET = 'WB';
export const ALL_CASES = 'AC';
export const RFI = 'RFI';
export const QC_FLAG = 'QUALITY CONTROL';
export const QC_BPM_FLAG = 'QC';
export const RP_FLAG = 'REJECT - PENDING';
export const RESUBMITTED_FLAG = 'RESUBMITTED';
export const REJECTCLOSE_FLAG = 'REJECT – CLOSED';
export const RFI_FLAG_R = 'R';
export const RFI_STATUS_RESPONSE = 'RFIResponse';
export const SENIOR_MANAGER = 'Senior Manager';
export const JUNIOR_TECHNICIAN = 'Junior Technician';
export const ADMIN = 'Admin';
export const FDO = 'FDO';
export const BORDEREAU = 'BORDEREAU';
export const ENDORSEMENT = 'ENDORSEMENT';
export const OUTSIDE_COMPANIES = 'Outside Companies';
export const BUREAU_RFITYPE = 'Bureau';
export const INTERNAL_RFITYPE = 'Internal';
export const BUREAU_RESPONSE_RECEIVED = 'Response Received';
export const ENDORSEMENT_NON_PREMIUM = 'ENDORSEMENT|Non-Premium';
export const SEND_TO_FEC = 'Send to FEC';
export const RESOLVE = 'Resolve';
export const INTERNALRFI = 'InternalRFI';
export const RFITYPE = {
  INTERNAL: 1,
  EXTERNAL: 2,
};
export const RFI_STATUS = {
  OPEN: 'Open',
  RESPONSE_RECEIVED: 'Response Received',
  RESOLVED: 'Resolved',
};
export const SUCCESS_STATUS_CASE_ASSIGN = 1;
export const FAILURE_STATUS_CASE_ASSIGN = 0;
export const NOTES_API_SUCCESS_STATUS = 'OK';
export const NOTES_STAGECODE = 'PI';
export const RESOLVE_SENDTOFEC_YES = 1;
export const RESOLVE_SENDTOFEC_NO = 0;
// Source Ids
export const SOURCE_ID_PP = 'BP1';
export const SOURCE_ID_CLAIMS = 'BP2';
export const SOURCE_ID_IBA = 'BP3';
// Notifications Reference Types
export const NOTIFICATIONS_REF_TYPE_PI = 'PI';
export const NOTIFICATIONS_REF_TYPE_TASK = 'TSK';
export const NOTIFICATIONS_REF_TYPE_RFI = 'RFI';
export const NOTIFICATION_REF_TYPE_CLIENT = 'CLIENT';
// Premium Processing BPM Stage Codes
export const BPM_STAGE_UNASSIGNED = 'UA';
export const BPM_STAGE_PREPARE_NON_PREMIUM_PROCESSING = 'PNP';
export const BPM_STAGE_PREPARE_PREMIUM_PROCESSING = 'PPP';
export const BPM_STAGE_PREPARE_BORDEREAU_PROCESSING = 'PBP';
export const BPM_STAGE_COMMIT_TRANSACTION = 'CT';
export const BPM_STAGE_ISSUE_DOCUMENTS = 'ID';
export const BPM_STAGE_WORK_IN_PROGRESS = 'IP';
export const BPM_STAGE_WORK_IN_QUERIED = 'QD';
export const BPM_STAGE_COMPLETED = 'CD';
export const BPM_STAGE_QUERIED = 'QD';
export const BPM_STAGE_REJECTED = 'RD';
export const BPM_STAGE_REJECTED_PENDING_ACTION = 'RP';
export const BPM_STAGE_CANCELLED = 'CN';
// Processing Instructions
export const PI_MAX_RISK_REF_LIMIT = 60;
export const PI_PREFIX = 'PI';
export const ACCOUNT_EXECUTIVE = 'Account Executive';
export const AUTHORISED_SIGNATORY = 'Authorised Signatory';
export const FRONT_END_CONTACT = 'Front-End Contact';
export const OPERATIONS_LEAD = 'Operations Lead';
export const PRODUCING_BROKER = 'Producing Broker';
//checklist tabs
export const GENERAL = 'general';
export const PRE_PLACING = 'pre-placing';
export const MRC = 'mrc';
export const OTHER_DETAILS = 'other-details';
export const RISK_REFERENCES = 'risk-references';
export const DEFAULT_WARRANTY = 'Default Warranty';

//  Processing Instruction Table dropdown list values
export const PAYMENT_BASIS_OPTIONS = [
  { id: '1', code: 'cash', name: 'Cash' },
  { id: '2', code: 'quaterly', name: 'Quaterly' },
  { id: '3', code: 'otherDeferred', name: 'Other Deferred' },
];

export const PPW_PPC_OPTIONS = [
  { id: '1', code: 'ppw', name: 'PPW', value: 1 },
  { id: '2', code: 'ppc', name: 'PPC', value: 2 },
  { id: '3', code: 'na', name: 'N/A', value: 3 },
];

// Processing Instruction Type ids
export const PROCESS_TYPE_ID_CLOSING = 1;
export const PROCESS_TYPE_ID_ENDORSEMENT = 2;
export const PROCESS_TYPE_ID_FDO = 3;
export const PROCESS_TYPE_ID_BORDEREAU = 4;
export const PROCESS_TYPE_ID_FEE_AND_AMENDMENT = 5;
// Processing Instruction Types
export const PROCESS_TYPE_CLOSING = 'Closing';
export const PROCESS_TYPE_ENDORSEMENT = 'Endorsement';
export const PROCESS_TYPE_FDO = 'Fdo';
export const PROCESS_TYPE_BORDEREAU = 'Bordereau';
export const PROCESS_TYPE_FEE_AND_AMENDMENT = 'Fee And Amendment';
export const PROCESS_TYPE_CHECK_SIGNING = 'CHECK SIGNING';
// Processing Instruction Statuses
export const PI_STATUS_DRAFT = 1;
export const PI_STATUS_REJECTED_DRAFT = 2;
export const PI_STATUS_SUBMITTED_AUTHORISED_SIGNATORY = 3;
export const PI_STATUS_SUBMITTED_PROCESSING = 4;
export const PI_STATUS_DRAFT_POST_SUBMISSION = 5;
// Processing Instructions document types
export const PI_PREMIUM_CALCULATION_SHEET = 'Premium Calculation Sheet';
export const PI_MARKET_SIGNED_SLIP = 'Market Signed Slip';
// Processing Instructions process types document info works only for london instance will make it as dynamic data in phase-2
export const PI_ENDORSEMENT_TYPE_DOCUMENT = {
  documentTypeDescription: 'Endorsement',
  sectionKey: 'Policy',
};
export const PI_FABORDER_TYPE_DOCUMENT = {
  documentTypeDescription: 'Correspondence',
  sectionKey: 'Policy',
};
export const PI_CLOSING_FDO_TYPE_DOCUMENT = {
  documentTypeDescription: 'SignedSlip',
  sectionKey: 'Policy',
};
export const PI_PREMIUM_CALCULATION_SHEET_TYPE_DOCUMENT = {
  documentTypeDescription: 'Premium Calculation Sheet',
  sectionKey: 'Instruction',
  sourceID: 0,
};
export const PI_MARKET_SIGNED_SLIP_TYPE_DOCUMENT = {
  documentTypeDescription: 'Market Signed Slip',
  sectionKey: 'Instruction',
  sourceID: 0,
};
export const PI_GENERATE_PDF_SUBMIT = {
  documentTypeDescription: 'Processing Instruction',
  sectionKey: 'Instruction',
  sourceID: 0,
};
// Processing Instruction Last Visited page
export const PI_CHECKLIST_PAGE = '2';
export const PI_RISK_REFERENCE_PAGE = '0';
export const SAVE_NEXT = 'saveNext';
// Edge Business Process Ids
export const BUSINESS_PROCESS_PREMIUM_PROCESSING_ID = 1;
export const BUSINESS_PROCESS_CLAIMS_ID = 2;
export const BUSINESS_PROCESS_INSURANCE_BROKER_ACCOUNTING_ID = 3;
export const BUSINESS_PROCESS_BUSINESS_ENTITIES_ID = 4;
export const BUSINESS_PROCESS_FACILITIES_ID = 5;
export const BUSINESS_PROCESS_OPEN_MARKET_ID = 6;
export const BUSINESS_PROCESS_CLAIMS_NAME = 'Claims';
// Business Process
export const BP2 = 'BP2';
export const REPORTING_EXTENDED_GROUP_ABBREVATION_INSURANCE_BROKER_ACCOUNTING = 'Insurance Broker Accounting';
export const REPORTING_EXTENDED_GROUP_ABBREVATION_BUSINESS_ENTITIES = 'Business Entities';
// Claims GXB loss indentifier
export const GXB_LOSS_ID_IDENTIFIER = 'GXB0000';
// Claims Creation
export const CLAIM_SECTION_ENABLED_UG = ['Non-Proportional Treaty', 'Broker Binder', 'Third Party Binder'];
export const CLAIM_POLICY_SECTION_DEFAULT = '-1';
export const CLAIM_LOSS_DATE_DISABLED_QUALIFIERS = ['TBA', 'Various', 'Not Advised'];
// Claims Complexity Management
export const CLAIM_COMPLEXITY_MANAGEMENT_TABS = ['contractPolicyRef', 'insured', 'division', 'complexityValues', 'referralValues'];
export const CLAIM_DIVISIONS_MATRIX_PRIMARY_KEY = 'departmentName';
export const CLAIM_DIVISIONS_MATRIX_PRIMARY_KEY_ID = 'departmentID';
export const CLAIM_DIVISIONS_MATRIX_CHECKBOX_VALUE_KEY = 'isComplex';
export const CLAIM_DIVISIONS_MATRIX_COLUMN_EXCEPTIONS = ['UAE'];
// Claims Processing
export const CLAIM_PROCESSING_REQ_TYPES = { search: 'search', filter: 'filter', both: 'both', default: '' };
export const CLAIM_TEAM_TYPE = { myClaims: 'myClaims', myTeamClaims: 'myTeamClaims', allClaims: 'all' };
export const TASKS_PROCESSING_TYPE = ['Claims'];
export const TASK_TEAM_TYPE = { myTask: 'myTask', myTeam: 'myTeam', taskHistory: 'taskHistory' };
export const TEAM_TASKS_SPECIFIC_COLUMNS = 'assignee';
export const REASSIGN_ENABLED_TASK_STATUSES = ['New', 'In-Progress'];
export const CREATE_ADHOC_TASK_STATUS_NEW = 'New';
export const CREATE_ADHOC_TASK_STATUS_IN_PROGRESS = 'In-Progress';
export const CREATE_ADHOC_TASK_STATUS_COMPLETED = 'Completed';
export const CREATE_ADHOC_TASK_PRIORITY_MEDIUM = 'Medium';
export const CLAIM_STATUS_CLOSED = 'closed';
export const CLAIM_STATUS_CLOSE = 'Closed';
export const CLAIM_STATUS_IN_PROGRESS = 'In-Progress';
export const TASK_ROW_TYPE = { rfi: 'RFI' };
export const CURRENCY_PURCHASED_STATUS = { Yes: 'Yes', No: 'No', notRequired: 'Not Required for this Settlement' };
export const SAMPLE_RFI_DOC = 'Sample Document.pdf';
export const TASK_CHECKLIST_WARNINGS = {
  all: ['mandatoryWarning', 'nextTaskNavigationWarning', 'completeTaskWarning'],
  type: {
    mandatory: 'mandatoryWarning',
    nextTask: 'nextTaskNavigationWarning',
    completeTask: 'completeTaskWarning',
  },
};
export const SANCTIONS_CHECK_STATUSES = { approved: 'approved', rejected: 'rejected' };
export const SANCTIONS_CHECK_KEY = 'SanctionsCheck';
export const ACTIVITIES_WITH_SANCTIONS_CHECK = [
  'FirstAdvice',
  'firstAdviceFeedback',
  'InterimAdvice',
  'InterimAdviceFeedback',
  'AdviceAndSettlement',
  'MonitorCollectionStatus',
  'AdviceAndSettlementFeedback',
  'ReviewClosure',
  'Payment',
];
export const PRIORITIES_ID = ['1', '2', '3'];
//Claims Roles
export const TECHNICIAN_MPHASIS = 'Technician - Mphasis';
export const TECHNICIAN_ARDONAGH = 'Technician - Ardonagh';
//Tasks RFI
export const RFI_ON_CLAIMS = 'claim';
export const RFI_ON_TASKS = 'task';
export const RFI_ON_LOSS = 'loss';
export const RFI_ORIGIN_TYPES_FROM_CAMUNDA = { loss: 'loss', claim: 'claim', task: 'task' };
export const WEEKOFF_DAYS = {
  sat: { weekday: 6, addDays: 2 },
  sun: { weekday: 0, addDays: 1 },
};
export const REMINDER_DEFAULT = '1D';
export const REMINDER_VALUES = [
  { id: '1D', days: 1, name: 'Remind me 1 day before' },
  { id: '2D', days: 2, name: 'Remind me 2 days before' },
  { id: '3D', days: 3, name: 'Remind me 3 days before' },
  { id: '4D', days: 4, name: 'Remind me 4 days before' },
  { id: '1W', days: 7, name: 'Remind me 1 week before' },
  { id: '2W', days: 14, name: 'Remind me 2 weeks before' },
  { id: 'NA', days: 0, name: 'No Reminder' },
];
export const REMINDER_NOT_REQUIRED = 'NA';
export const CREATE_RFI_FORM = 'createRfiForm';
export const RFI_TYPE_FOR_QUERY_CODE = 1;
export const RFI_TYPE_FOR_BUREAU_QUERY_CODE = 2;
export const RFI_TYPE_FOR_BUREAU_RESOLUTION_CODE = 2;
// ClaimRef Tasks Tab
export const TASK_TAB_INPROGRESS_STATUS = 'In-Progress';
export const TASK_TAB_COMPLETED_STATUS = 'Completed';
// Claims Processing search option
export const CLAIMS_SEARCH_OPTION_CLAIM_REF = 'claimRef';
export const CLAIMS_SEARCH_OPTION_POLICY_REF = 'policyRef';
export const CLAIMS_SEARCH_OPTION_INSURED = 'insured';
export const CLAIMS_SEARCH_OPTION_ASSIGNED_TO = 'assignedTo';
export const CLAIMS_SEARCH_OPTION_LOSS_REF = 'lossRef';
export const CLAIMS_SEARCH_OPTION_DIVISION = 'Division';
//claims FNOL policy searchby option
export const CLAIMS_POLICY_SEARCH_OPTION = {
  policyRef: 'policyRef',
  insured: 'assured',
  claimant: 'claimant',
  clientName: 'clientName',
  riskDetails: 'riskDetails',
  umr: 'umr',
  reinsured: 'reInsured',
  coverholder: 'coverHolder',
};
export const CLAIM_POLICY_SEARCH_REQ_TYPES = { search: 'search', filter: 'filter', both: 'both', default: '' };
// claims processing task search options
export const TASKS_SEARCH_OPTION_PROCESS_REF = 'processRef';
export const TASKS_SEARCH_OPTION_DESCRIPTION = 'description';
export const TASKS_SEARCH_OPTION_TASKI_REF = 'taskRef';
export const TASKS_SEARCH_OPTION_ASSIGNED_TO = 'assignee';
export const TASKS_SEARCH_OPTION_WORK_PACKAGE_REFERENCE = 'workPackageReference';
export const TASKS_SEARCH_OPTION_TASKS_NAME = 'taskType';
export const TASKS_SEARCH_OPTION_ASSIGNED = 'assignee';
export const TASKS_SEARCH_OPTION_PRIORITY = 'priority';
// Claims Processing Navigations
export const CLAIMS_PROCESSING_TAB_SELECTION = 'tasks';
// Claims RFI Tab
export const RFI_INPROGRESS_STATUS = 'In-Progress';
export const RFI_COMPLETED_STATUS = 'Completed';
// Dms SRC Application type
export const DMS_SRC_APPLICATION_EDGE = 'EDGE';
// Dms Meta data
export const DMS_DEFAULT_XB_INSTANCE = 'XB_London';
// Dms doc sharepath source
export const DMS_SHAREPATH_SOURCES = { gxb: 'GXB', edge: 'EDGE', hDrive: 'HDRIVE' };
// Dms Contexts
export const DMS_CONTEXT_CASE = 'Case';
export const DMS_CONTEXT_CLAIM = 'Claim';
export const DMS_CONTEXT_LOSS = 'Loss';
export const DMS_CONTEXT_POLICY = 'Policy';
export const DMS_CONTEXT_TASK = 'Task';
export const DMS_CONTEXT_PROCESSING_INSTRUCTION = 'Processing Instruction';
export const DMS_CONTEXT_INSTRUCTION = 'Instruction';
export const DMS_CONTEXT_RFI = 'RFI';
export const DMS_CLAIMS_CONTEXT_TYPES = [DMS_CONTEXT_LOSS, DMS_CONTEXT_CLAIM, DMS_CONTEXT_TASK];
export const DMS_PAGINATION_DEFAULT_PAGE = 0;
export const DMS_DEFAULT_ROWS_PER_PAGE = 10;
// Dms Task Context types
export const DMS_TASK_CONTEXT_TYPE_NATIVE = 'NativeTask';
export const DMS_TASK_CONTEXT_TYPE_ADHOC = 'AdhocTask';
export const DMS_TASK_CONTEXT_TYPE_RFI = 'RfiTask';
export const DMS_TASK_CONTEXT_TYPE_RFI_RESPONSE = 'RfiResponse';
export const DMS_TASK_CONTEXT_ALL_TYPES = [
  DMS_TASK_CONTEXT_TYPE_NATIVE,
  DMS_TASK_CONTEXT_TYPE_ADHOC,
  DMS_TASK_CONTEXT_TYPE_RFI,
  DMS_TASK_CONTEXT_TYPE_RFI_RESPONSE,
];
// Dms reference fields
export const DMS_CONTEXT_CASE_ID = 'caseId';
export const DMS_CONTEXT_CLAIM_ID = 'claimRef';
export const DMS_CONTEXT_LOSS_ID = 'lossRef';
export const DMS_CONTEXT_POLICY_ID = 'policyRef';
export const DMS_CONTEXT_TASK_ID = 'taskId';
export const DMS_CONTEXT_PI_RISKREF_ID = 'riskRefId';

// Dms View Constants
export const DMS_VIEW_TAB_VIEW = 'viewDocuments';
export const DMS_VIEW_TAB_SEARCH = 'search';
export const DMS_CLAIM_SOURCE_ID = 0;
export const DMS_EDGE_DOC_TYPE_SOURCE = 'Edge';

// Dms Search constants
export const DMS_SEARCH_TABLE_DEFAULT_ROWS = 5;
export const DMS_SEARCH_TABLE_FNOL_DEFAULT_ROWS = 10;

// Dms Document Types
export const DMS_DOCUMENT_TYPE_SECTION_KEYS = {
  policy: 'Policy',
  claim: 'Claim',
  instruction: 'Instruction',
  // TODO below to be moved to another constant
  piClosingFdo: 'PiClosingFdo',
  piEndorsement: 'PiEndorsement',
  piFABorder: 'PiFABorder',
  piPremiumCalculation: 'PiPremiumCalculation',
  piMarketSigned: 'PiMarketSigned',
  piGeneratePdfSubmit: 'PiGeneratePdfSubmit',
};
// export const DMS_DOCUMENT_TYPE_PAYMENT = 'PaymentRequisition';
export const DMS_DOCUMENT_TYPE_PAYMENT = 'Payment';
export const DMS_DOCUMENT_TYPE_PAYMENT_PROPS = {
  paymentReference: 'Payment Reference',
  lossPayee: 'Loss Payee',
  amount: 'Amount',
  currency: 'Currency',
  paymentDate: 'Payment date',
};
export const DMS_UPLOAD_FORBIDDEN_CHAR = /[/:*?<>|+""&#%[\]]+/;
export const MS_OFFICE_DOC_VIEWER_URL = 'https://view.officeapps.live.com/op/embed.aspx?src=';
export const MS_OFFICE_DOC_TYPES = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
export const DMS_DOC_VIEW_FORBIDDEN_FORMATS = ['rtf', 'msg', 'avi', 'mpg', 'mov', '3g2', '3gp', 'tiff', 'svg', 'zip', 'rar', '7z'];
export const DMS_DOC_VIEW_FORMATS = {
  pdf: { category: 'application', type: 'application/pdf' },
  txt: { category: 'text', type: 'text/plain' },

  rtf: { category: 'application', type: 'application/rtf' },
  doc: { category: 'application', type: 'application/msword' },
  docx: { category: 'application', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  xls: { category: 'application', type: 'application/vnd.ms-excel' },
  xlsx: { category: 'application', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
  ppt: { category: 'application', type: 'application/vnd.ms-powerpoint' },
  pptx: { category: 'application', type: 'application/vnd.openxmlformats-officedocument.presentationml.pr' },
  msg: { category: 'application', type: 'application/vnd.ms-outlook' },

  flv: { category: 'video', type: 'video/x-flv' },
  mp4: { category: 'video', type: 'video/mp4' },
  mov: { category: 'video', type: 'video/quicktime' },
  avi: { category: 'video', type: 'video/x-msvideo' },
  wmv: { category: 'video', type: 'video/x-ms-wmv' },
  m3u8: { category: 'video', type: 'application/x-mpegURL' },
  ts: { category: 'video', type: 'video/MP2T' },
  '3gp': { category: 'video', type: 'video/3gpp' },

  mp3: { category: 'audio', type: 'audio/mpeg' },
  wav: { category: 'audio', type: 'audio/wav' },

  png: { category: 'image', type: 'image/png' },
  bmp: { category: 'image', type: 'image/bmp' },
  tif: { category: 'image', type: 'image/tiff' },
  tiff: { category: 'image', type: 'image/tiff' },
  jpg: { category: 'image', type: 'image/jpeg' },
  jpeg: { category: 'image', type: 'image/jpeg' },
  gif: { category: 'image', type: 'image/gif' },

  zip: { category: 'miscellaneous', type: 'application/zip' },
  '7z': { category: 'miscellaneous', type: 'application/x-7z-compressed' },
  rar: { category: 'miscellaneous', type: 'application/vnd.rar' },
};
// API Response/Status Codes
export const API_RESPONSE_SUCCESS_STATUS = 200;
export const API_RESPONSE_NO_CONTENT_STATUS = 204;
export const API_STATUS_BAD_REQUEST = 400;
export const API_STATUS_NOT_FOUND = 404;
export const API_STATUS_CONFLICT = 409;
export const API_STATUS_INTERNAL_SERVER_ERROR = 500;
export const API_RESPONSE_SUCCESS = 'SUCCESS';
export const API_RESPONSE_OK = 'OK';
// Processing Instruction 3rd page constants
export const PI_TOGGLE_ID_YES = 1;
export const PI_TOGGLE_ID_NO = 0;
export const PI_TOGGLE_ID_NA = -1;
export const SIGNED_LINES_CALCULATION_SHEET_ATTACHED = 'signedLinesCalculationSheetAttached';
export const PREMIUM_TAX_CALCULATION_SHEET_ATTACHED = 'premiumTaxCalculationSheetAttached';
export const GROSS_PREMIUM_AMOUNT = 'grossPremiumAmount';
export const SLIP_ORDER = 'slipOrder';
export const TOTAL_BROKERAGE = 'totalBrokerage';
export const FEES = 'fees';
export const OTHER_DEDUCTIONS = 'otherDeductions';
export const SETTLEMENT_CURRENCY_CODE_ID = 'settlementCurrencyCodeId';
export const PAYMENT_BASIS = 'paymentBasis';
export const PPW_PPC = 'ppwOrPpc';
export const CLIENT_DISCOUNT = 'clientDiscount';
export const THIRD_PARTY = 'thirdParty';
export const PF_INTERNAL = 'pfinternal';
export const RETAINED_BROKERAGE = 'retainedBrokerage';
export const CHECKLIST_WITH_SIGNED_DATE = ['quotesPutUp', 'dutyOfDisclosure', 'dateOfOrder'];
export const CHECKLIST = 'checklist';
export const DETAILS = 'details';
export const FINANCIAL_CHECKLIST = 'financialChecklist';
export const RISK_REFERENCE = 'riskReference';
export const CHECKLIST_DATA_LIST = {
  quotesPutUp: true,
  dutyOfDisclosure: true,
  demandsNeeds: true,
  slipsSigned: true,
  dateOfOrder: true,
  atlas: true,
  bars: true,
  allWrittenLines: true,
  allUnderwriter: true,
  informationClearlyStated: true,
  allMarketsApproved: true,
  paymentTerms: true,
  subscriptionAgreement: true,
  riskCodes: true,
  marketSheet: true,
  confirmSanctioned: true,
  thirdParty: true,
  contractCertainty: true,
};
export const FINANCIAL_CHECKLIST_DATA_LIST = { signedLinesCalculationSheetAttached: true, premiumTaxCalculationSheetAttached: true };
// Processing Instruction statuses label
export const PI_STATUS_SUBMITTED_PROCESSING_LABEL = 'SUBMITTED_FOR_PROCESSING';
export const ASSINGED_TO_SUCCESS_STATUS = 'SUCCESS';
export const ASSINGED_TO_FAIL_STATUS = 'FAIL';
export const ASSINGED_TO_FAIL_JUNIOR_TECHNICIAN_STATUS = 'FAIL_JUNIOR_TECHNICIAN';
export const ASSINGED_TO_CROSS_USER_STATUS = 'CROSS_USER_ASSIGNMENT';
// task dashboard
export const ADVICE_AND_SETTLEMENT = 'AdviceAndSettlement';
export const REVIEW_CLOSURE = 'ReviewClosure';
export const CLOSE_CLAIM = 'CloseClaim';
export const AWAITING_MOVEMENT = 'AwaitingMovement';
export const FIRST_ADVICE_FEEDBACK = 'FAFeedback';
export const SYNC_GXB_MANUAL = 'SyncGXBMaunal';
export const UPLOAD_DOCS_MANUAL = 'UploadDocsMaunal';
export const CLAIM_ADHOC_TASK = 'claimAdhocTask';

// task category
export const TASK_TYPES_NATIVE = 'Native';
export const TASK_TYPES_ADHOC = 'Adhoc';
//task processing
export const TASK_STATUS = [
  { id: 'in-progress', status: 'In-Progress' },
  { id: 'completed', status: 'Completed' },
];
// loss & claim page => Task Table => automated BPM tasks
export const AUTOMATED_TASK_DEF_KEYS = ['CaptureClaimData', 'SyncClaimGXB', 'UploadDocsGXB'];

// Reporting group extended constants
export const REPORTING_EXTENDED_GROUP_TAB_PREMIUM_PROCESSING = 'premiumProcessing';
export const REPORTING_EXTENDED_GROUP_TAB_CLAIMS = 'claims';
export const REPORTING_EXTENDED_GROUP_TAB_MIDDLE_OFFICE = 'middleOffice';
export const REPORTING_EXTENDED_GROUP_TAB_INSURANCE_BROKER_ACCOUNTING = 'insuranceBrokerAccounting';
export const REPORTING_EXTENDED_GROUP_TAB_BUSINESS_ENTITIES = 'businessEntities';
export const REPORTING_EXTENDED_GROUP_TAB_FACILITIES = 'facilities';
export const REPORTING_EXTENDED_GROUP_TAB_OPEN_MARKET = 'openMarket';

// Reporting extended breadcrumb constants
export const REPORTING_EXTENDED_BREADCRUMB_REPORT = 'report';
export const REPORTING_EXTENDED_BREADCRUMB_REPORT_DETAILS = 'report-details';

// Reporting extended constants
export const REPORTING_EXTENDED_DUPLICATE_REPORT_NAME = 'Report Name Already Exist';

//Edit meta data
export const DMS_EDIT_PAYMENT_TYPE = 'Payment';
export const DMS_EDIT_PAYMENT_DATE = 'Payment date';
export const DMS_EDIT_PAYMENT_REFERENCE = 'Payment Reference';
export const DMS_EDIT_PAYMENT_LOSS_PAYEE = 'Loss Payee';
export const DMS_EDIT_PAYMENT_AMOUNT = 'Amount';
export const DMS_EDIT_PAYMENT_CURRENCY = 'Currency';
export const DMS_EDIT_PAYMENT_PAYLOAD = {
  amount: 'Amount',
  currency: 'Currency',
  lossPayee: 'Loss Payee',
  paymentDate: 'Payment date',
  paymentReference: 'Payment Reference',
};

//XB Instance Edge
export const EDGE_XB_INSTANCE = 'XB_Edge';

export const CLAIMS_FNOL_PUSH_BACK_ROUTES = {
  routes: {
    lossAndClaims: 'Loss & claims',
    lossDashboard: 'Loss Dashboard',
    claimsDashboard: 'Claim Dashboard',
  },
};
//Claims Tab
export const CLAIMS_TAB_REQ_TYPES = { search: 'search', filter: 'filter' };
export const CLAIMS_TAB_SEARCH_OPTION_CLAIM_REF = 'claimRef';
export const CLAIMS_TAB_SEARCH_OPTION_POLICY_REF = 'policyRef';
export const CLAIMS_TAB_SEARCH_OPTION_INSURED = 'insured';
export const CLAIMS_TAB_SEARCH_OPTION_LOSS_REF = 'lossRef';
export const CLAIMS_TAB_SEARCH_OPTION_DIVISION = 'division';
// Search Filter Request types
export const REQ_TYPES = {
  search: 'search',
  filter: 'filter',
  both: 'both',
  default: '',
};
//processTypes
export const CLAIM_MAIN_PROCESS = 'ClaimMainProcess';
export const CLAIM_LOSS_PROCESS_TYPE_NAME = 'ClaimsLoss';

//Advance Search
export const ADVANCE_SEARCH_FILTER_DATE_FIELDS = [
  'lossFromDate',
  'lossToDate',
  'claimReceivedDateTime',
  'claimLossFromDate',
  'claimLossToDate',
];
export const ADVANCE_SEARCH_SEARCH_BY = 'lossName';

// Respond RFI Upload Document
export const DMS_ATTACH_DOCS_TAB_DOCUMENT = 'attachDocuments';
export const DMS_ATTACH_DOCS_TAB_SEARCH = 'search';

// claim complexities
export const CLAIM_COMPLEXITY_COMPLEX = 'Complex';
export const CLAIM_COMPLEXITY_NON_COMPLEX = 'Non-Complex';
export const CLAIM_COMPLEXITY_UNSURE = 'Unsure';
