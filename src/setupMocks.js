export const mockClasses = {};

export const mockContext = {
  login: () => 'login',
  logout: () => 'logout',
  handleCallback: () => 'handleCallback',
};

export const mockEvent = {
  preventDefault: () => {},
  stopPropagation: () => {},
};

export const mockHistory = {
  match: {
    params: {},
  },
  location: {},
  history: {
    push: () => {},
  },
};

export const mockMarket = {
  selected: {
    id: 1,
  },
};

export const mockParent = {
  selected: null,
  list: [],
  offices: [],
  placements: [],
};

export const mockT = (key) => key;

export const mockTheme = {
  breakpoints: {
    keys: ['xs', 'sm', 'md', 'lg', 'xl'],
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  direction: 'ltr',
  mixins: {
    header: {
      height: 64,
    },
    toolbar: {
      minHeight: 64,
    },
    nav: {
      width: {
        default: 240,
        collapsed: 67,
      },
    },
    width: {
      xs: 280,
      sm: 420,
      md: 640,
      lg: 920,
      xl: 1160,
    },
  },
  overrides: {
    MuiAppBar: {},
    MuiDrawer: {},
    MuiList: {},
    MuiTypography: {},
    MuiIconButton: {},
    MuiTooltip: {},
    MuiTableCell: {},
    MuiTablePagination: {},
    MuiTouchRipple: {},
  },
  palette: {
    common: {},
    type: 'light',
    primary: {},
    secondary: {},
    neutral: {},
    error: {},
    tooltip: {},
    grey: {},
    contrastThreshold: 3,
    tonalOffset: 0.2,
    text: {},
    divider: 'rgba(0, 0, 0, 0.12)',
    background: {},
    action: {},
    success: {},
    info: {},
    alert: {},
    new: {},
    unknown: {},
    light: {},
  },
  props: {},
  shadows: [],
  typography: {
    fontSize: {},
    lineHeight: {},
  },
  shape: {},
  shadow: {},
  transitions: {},
  zIndex: {},
};

export const mockTrip = {
  addresses: [],
  leads: [],
  list: {
    items: [],
    itemsTotal: 0,
    page: 1,
    pageSize: 10,
    pageTotal: 0,
    query: '',
    sortBy: 'id',
    sortType: 'numeric',
    sortDirection: 'desc',
  },
  selected: {
    title: '',
    visits: [],
  },
};

export const mockUi = {
  loader: {
    queue: [],
  },
  nav: {
    expanded: null,
  },
};

export const mockUser = {
  id: 1,
  firstName: 'Mr',
  lastName: 'Smith',
  fullName: '',
  emailId: '',
  departmentIds: [],
  departmentSelected: null,
  role: '',
  auth: {},
  accessToken: null,
  idToken: null,
  expiresAt: 0,
  error: null,
};
