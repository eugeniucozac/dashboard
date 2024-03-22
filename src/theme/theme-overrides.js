import defaults from './theme-defaults';
import mixins from './theme-mixins';

const { palette, transitions, shadows, shape, typography, width } = defaults;
const spacingDefault = 40;

const themeOverrides = {
  MuiCssBaseline: {
    '@global': {
      '*::-webkit-scrollbar': {
        width: '0.4em',
      },
      '*::-webkit-scrollbar-track': {
        '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)',
      },
      '*::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(0,0,0,.1)',
        outline: '1px solid slategrey',
      },
    },
  },
  MuiAccordion: {
    root: {
      '&$expanded': {
        margin: '8px 0',
      },
    },
  },
  MuiAppBar: {
    root: {
      ...mixins.header.default,
      zIndex: 1210, // above drawer z-index of 1200
    },
    colorPrimary: {
      backgroundColor: '#fafafa',
    },
  },
  MuiAutocomplete: {
    root: {
      '@media (pointer: fine)': {
        '&:hover': {
          '& .MuiAutocomplete-clearIndicatorDirty': {
            opacity: 1,
          },
        },
      },
    },
    inputRoot: {
      '&[class*="MuiOutlinedInput-root"]': {
        padding: 0,
        backgroundColor: 'white',

        '& .MuiAutocomplete-input': {
          paddingLeft: 10,

          '&:first-child': {
            padding: '13.5px 0px 11.5px 14px',

            '&::-webkit-input-placeholder': {
              opacity: '0.42 !important',
            },
          },
        },
      },
      '&[class*="MuiOutlinedInput-root"][class*="MuiOutlinedInput-marginDense"]': {
        padding: 0,

        '& .MuiAutocomplete-input': {
          '&:first-child': {
            padding: '9.5px 0px 7.5px 14px',
          },
        },
      },
      '&$focused': {
        '& .MuiAutocomplete-tag svg': {
          color: palette.neutral.main,
        },
      },
    },
    option: {
      '@media (min-width: 600px)': {
        minHeight: 36,
      },
    },
    paper: {
      fontSize: typography.pxToRem(13),
      lineHeight: typography.lineHeight['16/13'],
      boxShadow: shadows[3],
    },
    clearIndicator: {
      opacity: 0,
      transition: `opacity ${transitions.duration.shortest}ms ${transitions.easing.easeOut}`,
    },
    tag: {
      '&.MuiChip-outlined': {
        margin: '0px 0px 4px 8px',
        height: 28,
        lineHeight: '28px',
        backgroundColor: palette.neutral.lighter,
        border: `1px solid ${palette.neutral.light}`,
        borderRadius: 4,
        fontSize: typography.pxToRem(11),
      },
    },
  },
  MuiAvatar: {
    root: {
      fontSize: '0.75rem',
      color: 'white',
      transition: `
        width ${transitions.duration.short}ms ${transitions.easing.easeOut},
        height ${transitions.duration.short}ms ${transitions.easing.easeOut},
        font-size ${transitions.duration.short}ms ${transitions.easing.easeOut}
      `,
    },
  },
  MuiButton: {
    root: {
      color: palette.neutral.dark,
      '&:hover': {
        color: palette.neutral.darker,
      },
      transition: `
        color ${transitions.duration.shortest}ms ${transitions.easing.easeOut} 0ms,
        border ${transitions.duration.shortest}ms ${transitions.easing.easeOut} 0ms,
        box-shadow ${transitions.duration.shortest}ms ${transitions.easing.easeOut} 0ms,
        background-color ${transitions.duration.shortest}ms ${transitions.easing.easeOut} 0ms
      `,
    },
    textPrimary: {
      '&:hover': {
        color: palette.primary.dark,
      },
    },
    textSecondary: {
      '&:hover': {
        color: palette.secondary.dark,
      },
    },
    outlined: {
      border: `1px solid ${palette.neutral.medium}`,
    },
    outlinedPrimary: {
      '&:hover': {
        color: palette.primary.dark,
      },
    },
    outlinedSecondary: {
      '&:hover': {
        color: palette.secondary.dark,
      },
    },
    contained: {
      boxShadow: '0px 1px 1px 0px rgba(0,0,0,0.2)',
    },
    containedPrimary: {
      color: 'white',
      boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.2)',
      '&:hover': {
        color: 'white',
      },
    },
    containedSecondary: {
      color: 'white',
      boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.2)',
      '&:hover': {
        color: 'white',
      },
    },
  },
  MuiCardContent: {
    root: {
      '&:last-child': {
        paddingBottom: 16,
      },

      '& + .MuiCardActions-root': {
        paddingTop: 0,
        marginTop: -4,
      },

      '& .MuiTypography-root': {
        color: palette.neutral.main,
      },
    },
  },
  MuiCardHeader: {
    root: {
      '&:last-child': {
        paddingBottom: 16,
      },

      '& + .MuiCardContent-root': {
        paddingTop: 0,
      },
    },
    avatar: {
      marginRight: 12,
    },
    title: {
      fontSize: typography.pxToRem(12),
      fontWeight: 600,
      lineHeight: 1.4,
      margin: 0,
    },
    subheader: {
      fontSize: typography.pxToRem(11.5),
      color: palette.neutral.main,
      lineHeight: 1.4,
      margin: 0,
      marginTop: 1,
    },
  },
  MuiCheckbox: {
    root: {
      padding: 8,
    },
    colorPrimary: {
      '&$disabled': {
        color: palette.neutral.light,
      },
    },
    colorSecondary: {
      color: palette.secondary.main,
      '&:hover': {
        color: palette.secondary.main,
      },
      '&$disabled': {
        color: palette.neutral.light,
      },
    },
  },
  MuiDialog: {
    paper: {
      margin: 0,
      height: '100%',
      borderRadius: 0,

      '@media (min-width: 600px)': {
        margin: spacingDefault,
        height: 'auto',
        borderRadius: shape.borderRadius,
      },
    },
    paperScrollPaper: {
      maxHeight: 'none',

      '@media (min-width: 600px)': {
        maxHeight: `calc(100% - ${spacingDefault * 2}px)`,
      },
    },
    paperFullWidth: {
      width: '100%',
    },
    paperWidthXs: {
      '@media (min-width: 600px)': {
        maxWidth: width.xs,
      },
    },
    paperWidthSm: {
      '@media (min-width: 600px)': {
        maxWidth: width.sm,
      },
    },
    paperWidthMd: {
      '@media (min-width: 600px)': {
        maxWidth: width.md,
      },
    },
    paperWidthLg: {
      '@media (min-width: 600px)': {
        maxWidth: width.lg,
      },
    },
    paperWidthXl: {
      '@media (min-width: 600px)': {
        maxWidth: width.xl,
      },
    },
  },
  MuiDialogContent: {
    root: {
      padding: 0,
    },
  },
  MuiDialogContentText: {
    root: {
      fontSize: '0.875rem',
      marginBottom: 16,
    },
  },
  MuiDialogActions: {
    root: {
      margin: 0,
      padding: `24px 32px`,
    },
    spacing: {
      margin: '0 8px',

      '&:first-child': {
        marginLeft: 0,
      },
      '&:last-child': {
        marginRight: 0,
      },
    },
  },
  MuiDialogTitle: {
    root: {
      padding: '16px 32px 14px',
      backgroundColor: '#fafafa',
    },
  },
  MuiDrawer: {
    paper: {
      width: '90%',
      maxWidth: 320,
    },
  },
  MuiFab: {
    primary: {
      color: 'white',
      '&:hover': {
        color: 'white',
      },
    },
    secondary: {
      color: 'white',
      '&:hover': {
        color: 'white',
      },
    },
  },
  MuiFormControl: {
    marginNormal: {
      marginBottom: 0,
      paddingBottom: 12,

      '&:first-child': {
        marginTop: 0,
      },

      '&:last-child': {
        paddingBottom: 0,
      },
    },
    marginDense: {
      marginBottom: 0,
      paddingBottom: 6,

      '&:first-child': {
        marginTop: 0,
      },

      '&:last-child': {
        paddingBottom: 0,
      },
    },
  },
  MuiFormControlLabel: {
    root: {
      marginRight: 'auto',

      '& .MuiTypography-root': {
        fontSize: typography.pxToRem(13),
      },
    },
  },
  MuiFormGroup: {
    root: {
      '& + p': {
        marginTop: 4,
        marginBottom: 1,
      },
    },
    row: {
      '& .MuiFormControlLabel-root': {
        marginRight: 24,

        '&:last-child': {
          marginRight: 0,
        },

        '& .MuiCheckbox-root': {
          marginRight: -2,
        },

        '& .MuiRadio-root': {
          marginRight: -2,
        },
      },
    },
  },
  MuiFormHelperText: {
    root: {
      fontSize: typography.pxToRem(10),
      marginTop: 4,
      marginLeft: 2,
      marginBottom: -1,
      whiteSpace: 'normal',
    },
    contained: {
      marginTop: 4,
      marginLeft: 2,
      marginBottom: -1,
    },
  },
  MuiFormLabel: {
    root: {
      fontSize: typography.pxToRem(13),
      color: palette.neutral.darker,
    },
  },
  MuiIconButton: {
    root: {
      padding: '8px 10px',
      color: defaults.palette.neutral.dark,
      borderRadius: shape.borderRadius,
      transition: `
        color ${transitions.duration.shortest}ms ${transitions.easing.easeOut} 0ms,
        background-color ${transitions.duration.shortest}ms ${transitions.easing.easeOut} 0ms
      `,
      '&:hover': {
        color: defaults.palette.neutral.darker,
      },
    },
  },
  MuiInputAdornment: {
    root: {
      color: palette.neutral.main,
      fontSize: 24,

      '& > svg': {
        transition: `color ${transitions.duration.shortest}ms ${transitions.easing.easeInOut} 0ms`,
        color: defaults.palette.neutral.medium,
        fontSize: 'inherit',
      },
    },
    positionStart: {
      marginLeft: 2,
    },
  },
  MuiInputBase: {
    root: {
      fontSize: typography.pxToRem(13),
      color: palette.neutral.dark,
      lineHeight: '19px',
    },
    inputMultiline: {
      '&::placeholder': {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'noWrap',
      },
    },
    input: {
      '&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus, &:-webkit-autofill:active': {
        '-webkit-box-shadow': '0 0 0 20rem white inset !important',
      },
    },
    adornedStart: {
      '&$focused': {
        '& svg': {
          color: palette.neutral.dark,
        },
      },
    },
    adornedEnd: {
      '&$focused': {
        '& svg': {
          color: palette.neutral.dark,
        },
      },
    },
  },
  MuiInputLabel: {
    outlined: {
      position: 'static',
      top: 'auto',
      left: 'auto',
      marginBottom: 6,
      marginLeft: 2,
      lineHeight: 1,
      color: palette.neutral.darker,
      transform: 'none',
      zIndex: 'auto',
      pointerEvents: 'auto',

      '&$shrink': {
        transform: 'none',
      },
    },
    formControl: {
      fontWeight: typography.fontWeightRegular,
      color: palette.neutral.medium,
    },
  },
  MuiLink: {
    root: {
      '&:hover': {
        cursor: 'pointer',
      },
    },
  },
  MuiListItem: {
    root: {
      paddingTop: 10,
      paddingBottom: 10,
    },
    button: {
      color: defaults.palette.neutral.main,

      '&:hover': {
        color: defaults.palette.neutral.dark,
      },
    },
  },
  MuiListItemText: {
    root: {
      marginTop: 0,
      marginBottom: 0,
    },
  },
  MuiMenuItem: {
    root: {
      color: defaults.palette.neutral.dark,
      height: 16,
      minHeight: 36,
      fontSize: typography.pxToRem(13),

      '@media (min-width: 600px)': {
        minHeight: 36,
      },
    },
  },
  MuiOutlinedInput: {
    root: {
      '& $notchedOutline': {
        borderColor: 'rgba(0,0,0,0.2)',
      },
      '&$focused $notchedOutline': {
        borderWidth: 1,
        boxShadow: `0 0 3px 0 rgba(2, 67, 153, 0.25)`,
      },
      '&$disabled $notchedOutline': {
        borderColor: 'rgba(0,0,0,0.1)',
        backgroundColor: 'rgba(0,0,0,0.03)',
      },
    },
    input: {
      paddingTop: 13.5,
      paddingBottom: 11.5,
      paddingRight: 8,
      height: 19,
      borderRadius: 4,
      backgroundColor: 'white',

      '&$disabled': {
        cursor: 'not-allowed',
      },

      '&[type="number"]': {
        paddingRight: 14,
      },

      '&[type="number"]::-webkit-inner-spin-button': {
        margin: '-13.5px -13px -11.5px 0',
        padding: 1,
      },
    },
    inputMarginDense: {
      paddingTop: 13.5,
      paddingBottom: 11.5,
    },
    multiline: {
      paddingTop: 13.5,
      paddingBottom: 12.5,
      paddingRight: 8,
    },
    notchedOutline: {
      top: 0,

      '& > legend': {
        display: 'none',
      },
    },
    adornedStart: {
      paddingLeft: 8,
    },
    adornedEnd: {
      paddingRight: 8,
    },
  },
  MuiPaper: {
    rounded: {
      borderRadius: 3,
    },
  },
  MuiPickersBasePicker: {
    pickerView: {
      minHeight: 275,
    },
  },
  MuiPickersCalendarHeader: {
    iconButton: {
      padding: 8,

      '&:first-child': {
        marginLeft: 8,
      },

      '&:last-child': {
        marginRight: 8,
      },
    },
  },
  MuiPickersDay: {
    current: {
      color: defaults.palette.secondary.dark,
      backgroundColor: 'rgba(68, 179, 208, 0.1)',
    },
    daySelected: {
      '&:hover': {
        color: 'white',
      },
    },
  },
  MuiPickersModal: {
    dialog: {
      '& + .MuiDialogActions-root': {
        padding: 8,
        marginLeft: 0,
      },
    },
    dialogRoot: {
      height: 'auto',
    },
  },
  MuiPickersToolbarText: {
    toolbarBtnSelected: {
      marginBottom: 0,
      lineHeight: 1.25,
      fontSize: typography.pxToRem(30),
      fontWeight: typography.fontWeightRegular,
    },
  },
  MuiPickersYear: {
    root: {
      fontSize: typography.pxToRem(16),
    },
    yearSelected: {
      fontSize: typography.pxToRem(20),
    },
  },
  MuiPickersYearSelection: {
    container: {
      height: 270,
    },
  },
  MuiPickersMonth: {
    root: {
      height: 65,
      fontSize: typography.pxToRem(16),
    },
    monthSelected: {
      fontSize: typography.pxToRem(20),
    },
  },
  MuiSelect: {
    root: {
      '&:hover $icon': {
        color: palette.neutral.dark,
      },
    },
    icon: {
      right: 8,
      color: palette.neutral.medium,
      transition: `color ${transitions.duration.shortest}ms ${transitions.easing.easeOut} 0ms`,

      '&:hover': {
        color: palette.neutral.dark,
        transition: `color ${transitions.duration.leavingScreen}ms ${transitions.easing.easeOut} 0ms`,
      },
    },
    select: {
      paddingRight: '40px !important',
      backgroundColor: 'white',

      '&:focus': {
        backgroundColor: 'transparent',
      },
    },
  },
  MuiSnackbar: {
    anchorOriginTopCenter: {
      '@media (min-width: 600px)': {
        left: '50%',
        right: 'auto',
        transform: 'translateX(-50%)',
      },
    },
    anchorOriginBottomCenter: {
      '@media (min-width: 600px)': {
        left: '50%',
        right: 'auto',
        transform: 'translateX(-50%)',
      },
    },
    anchorOriginTopRight: {
      '@media (min-width: 600px)': {
        left: 'auto',
        top: spacingDefault,
        right: spacingDefault,
      },
    },
    anchorOriginBottomRight: {
      '@media (min-width: 600px)': {
        left: 'auto',
        bottom: spacingDefault,
        right: spacingDefault,
      },
    },
    anchorOriginTopLeft: {
      '@media (min-width: 600px)': {
        right: 'auto',
        top: spacingDefault,
        left: spacingDefault,
      },
    },
    anchorOriginBottomLeft: {
      '@media (min-width: 600px)': {
        right: 'auto',
        bottom: spacingDefault,
        left: spacingDefault,
      },
    },
  },
  MuiSnackbarContent: {
    root: {
      padding: '6px 24px',
      fontSize: typography.pxToRem(12),

      '@media (min-width: 600px)': {
        minWidth: 288,
        maxWidth: 568,
        borderRadius: shape.borderRadius,
      },
      '@media (max-width: 599.95px)': {
        flexGrow: 1,
      },
    },
    action: {
      marginRight: -16,
    },
  },
  MuiStepIcon: {
    root: {
      color: palette.grey[400],
      fontSize: 32,
    },
  },
  MuiStepLabel: {
    iconContainer: {
      marginBottom: '-8px !important',
    },
    label: {
      fontSize: 11,
    },
  },
  MuiSwitch: {
    colorSecondary: {
      color: palette.secondary.darker,

      '&:hover': {
        color: palette.secondary.light,
      },
    },
    switchBase: {
      borderRadius: '50%',

      '&:hover': {
        color: palette.grey[50],
      },
    },
  },
  MuiTableCell: {
    root: {
      padding: '12px 16px 12px 4px',
      borderBottomColor: palette.grey[200],

      '&:first-child': {
        paddingLeft: 8,
      },

      '&:last-child': {
        paddingRight: 8,
      },
    },
    head: {
      fontSize: 11,
      paddingTop: 24,
      paddingBottom: 12,
      lineHeight: typography.pxToRem(15),
      verticalAlign: 'bottom',

      '&$sizeSmall': {
        paddingTop: 24,
        paddingBottom: 8,
      },
    },
    body: {
      fontSize: 12,
    },
    sizeSmall: {
      padding: '8px 0',
      paddingRight: 12,

      '&:first-child': {
        paddingLeft: 4,
      },

      '&:last-child': {
        paddingRight: 4,
      },
    },
  },
  MuiTableRow: {
    head: {
      height: 48,
    },
  },
  MuiTablePagination: {
    root: {
      color: palette.neutral.main,
      fontSize: '0.75rem',
    },
    select: {
      paddingRight: '40px !important',
      minHeight: '2.125em',
      lineHeight: '2.125em',
      paddingTop: '8px',
    },
    selectRoot: {
      borderRadius: shape.borderRadius,
    },
    selectIcon: {
      top: '52%',
      transform: 'translateY(-50%)',
    },
    toolbar: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  MuiTab: {
    root: {
      minWidth: 72,

      '@media (min-width: 600px)': {
        minWidth: 72,
      },

      '@media (min-width: 960px)': {
        minWidth: 72,
      },

      fontWeight: typography.fontWeightRegular,
      color: palette.neutral.darker,
      borderRadius: '3px 3px 0 0',
      borderLeft: `1px solid ${palette.neutral.light}`,
      borderTop: `1px solid ${palette.neutral.light}`,
      borderBottom: 'none',
      textTransform: 'none',
      '&:last-child': {
        borderRight: `1px solid ${palette.neutral.light}`,
      },
      '&:hover': {
        color: 'white',
        backgroundColor: palette.primary.dark,
        opacity: 1,
      },
      '&$selected': {
        color: 'white',
        backgroundColor: palette.primary.main,
      },
      '&$textColorInherit': {
        color: 'rgba(0, 0, 0, 0.625)',
        opacity: 1,
      },
    },
  },
  MuiTabs: {
    root: {
      borderBottom: `1px solid ${palette.neutral.light}`,
    },
    scrollButtons: {
      ...mixins.tab.scroll.buttons,
      ...mixins.tab.scroll.buttonsAnimated,
    },
  },
  MuiToggleButton: {
    root: {
      height: 36,

      '&$selected': {
        color: 'white',
        backgroundColor: palette.primary.main,

        '&.Mui-disabled': {
          color: 'white',
          backgroundColor: palette.neutral.light,
        },

        '&:hover': {
          backgroundColor: palette.primary.main,
        },
      },
    },
    sizeSmall: {
      height: 30,
    },
    sizeLarge: {
      height: 42,
    },
  },
  MuiTooltip: {
    tooltip: {
      backgroundColor: palette.tooltip.bg,
    },
    arrow: {
      color: palette.tooltip.bg,
    },
    tooltipPlacementTop: {
      margin: '12px 0',

      '@media (min-width: 600px)': {
        margin: '10px 0',
      },
    },
    tooltipPlacementRight: {
      margin: '0 12px',

      '@media (min-width: 600px)': {
        margin: '0 10px',
      },
    },
    tooltipPlacementBottom: {
      margin: '12px 0',

      '@media (min-width: 600px)': {
        margin: '10px 0',
      },
    },
    tooltipPlacementLeft: {
      margin: '0 12px',

      '@media (min-width: 600px)': {
        margin: '0 10px',
      },
    },
  },
  MuiTouchRipple: {
    child: {
      borderRadius: shape.borderRadius,
    },
    rippleVisible: {
      transform: 'scale(1.5)',
    },
  },
  MuiTypography: {
    root: {
      color: palette.neutral.darker,
    },
    gutterBottom: {
      marginBottom: '1em',
    },
    h1: {
      fontSize: '1.5rem',
      fontWeight: 300,
      lineHeight: 1.4,
      margin: '0.2em 0 0.6em',

      '@media (max-width: 599.95px)': {
        fontSize: '1.3rem',
      },

      '&:first-child': {
        marginTop: 0,
      },
    },
    h2: {
      fontSize: '1.25rem',
      fontWeight: 300,
      lineHeight: 1.4,
      margin: '0.2em 0 0.6em',

      '@media (max-width: 599.95px)': {
        fontSize: '1.15rem',
      },

      '&:first-child': {
        marginTop: 0,
      },
    },
    h3: {
      fontSize: '1.125rem',
      fontWeight: 300,
      lineHeight: 1.4,
      margin: '0.2em 0 0.6em',

      '@media (max-width: 599.95px)': {
        fontSize: '1rem',
      },

      '&:first-child': {
        marginTop: 0,
      },
    },
    h4: {
      fontSize: '1rem',
      fontWeight: 300,
      lineHeight: 1.4,
      margin: '0.2em 0 0.6em',

      '@media (max-width: 599.95px)': {
        fontSize: '0.9rem',
      },

      '&:first-child': {
        marginTop: 0,
      },
    },
    h5: {
      fontSize: '0.875rem',
      fontWeight: 300,
      lineHeight: 1.4,
      margin: '0.2em 0 0.6em',

      '@media (max-width: 599.95px)': {
        fontSize: '0.8rem',
      },

      '&:first-child': {
        marginTop: 0,
      },
    },
    h6: {
      fontSize: '0.75rem',
      fontWeight: 300,
      lineHeight: 1.4,
      margin: '0.2em 0 0.6em',

      '@media (max-width: 599.95px)': {
        fontSize: '0.65rem',
      },

      '&:first-child': {
        marginTop: 0,
      },
    },
    body1: {
      fontSize: '0.875rem',

      '&:first-child': {
        marginTop: '0em',
      },
    },
    body2: {
      fontSize: '0.75rem',
      lineHeight: 1.5,

      '&:first-child': {
        marginTop: '0em',
      },
    },
    subtitle1: {
      fontSize: '0.875rem',
    },
    subtitle2: {
      fontSize: '0.75rem',
    },
    caption: {
      display: 'block',
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 1.66,
      letterSpacing: '0.03333em',
    },
    overline: {
      display: 'block',
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 2.66,
      letterSpacing: '0.08333em',
      textTransform: 'uppercase',
    },
    button: {
      display: 'block',
    },
  },
};

export default themeOverrides;
