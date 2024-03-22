const styles = (theme) => ({
  btn: {
    minWidth: 'auto',
    '& svg:first-child': {
      marginLeft: -4,
      marginRight: 4,
    },
    '& svg:last-child': {
      marginLeft: 4,
      marginRight: -4,
    },
  },

  // size
  btnXs: {
    minHeight: 24,
    fontSize: theme.typography.pxToRem(11),
    lineHeight: theme.typography.lineHeight['20/11'],
    padding: '2px 8px',
    '&$btnOutlined': {
      padding: '1px 7px',
    },
    '&$btnIconOnly': {
      minWidth: 24,
    },
    '& svg:first-child': {
      marginRight: 2,
    },
    '& svg:last-child': {
      marginLeft: 2,
    },
    '&$btnIconWide': {
      '& svg:first-child': {
        marginLeft: 0,
        marginRight: 6,
      },
      '& svg:last-child': {
        marginLeft: 6,
        marginRight: 0,
      },
    },
  },
  btnSm: {
    minHeight: 30,
    padding: '4px 10px',
    '&$btnOutlined': {
      padding: '3px 9px',
    },
    '&$btnIconOnly': {
      minWidth: 30,
    },
    '&$btnIconWide': {
      '& svg:first-child': {
        marginLeft: 0,
        marginRight: 8,
      },
      '& svg:last-child': {
        marginLeft: 8,
        marginRight: 0,
      },
    },
  },
  btnMd: {
    minHeight: 36,
    padding: '6px 12px',
    '&$btnOutlined': {
      padding: '5px 11px',
    },
    '&$btnIconOnly': {
      minWidth: 36,
    },
    '& svg:first-child': {
      marginLeft: -6,
    },
    '& svg:last-child': {
      marginRight: -6,
    },
    '&$btnIconWide': {
      '& svg:first-child': {
        marginLeft: -2,
        marginRight: 8,
      },
      '& svg:last-child': {
        marginLeft: 8,
        marginRight: -2,
      },
    },
  },
  btnLg: {
    minHeight: 42,
    padding: '8px 16px',
    lineHeight: theme.typography.lineHeight['26/15'],
    '&$btnOutlined': {
      padding: '7px 15px',
    },
    '&$btnIconOnly': {
      minWidth: 42,
    },
    '& svg:first-child': {
      marginLeft: -6,
    },
    '& svg:last-child': {
      marginRight: -6,
    },
    '&$btnIconWide': {
      '& svg:first-child': {
        marginLeft: -4,
        marginRight: 8,
      },
      '& svg:last-child': {
        marginLeft: 8,
        marginRight: -4,
      },
    },
  },

  // special
  btnOutlined: {},
  btnIconWide: {},
  btnLightPrimary: {
    color: theme.palette.primary.main,

    '&:hover': {
      color: theme.palette.primary.dark,
    },
  },
  btnLightSecondary: {
    color: theme.palette.secondary.main,

    '&:hover': {
      color: theme.palette.secondary.dark,
    },
  },
  btnLightDefault: {
    color: theme.palette.neutral.main,

    '&:hover': {
      color: theme.palette.neutral.dark,
    },
  },
  btnDanger: {
    backgroundColor: theme.palette.error.main,

    '&:hover': {
      backgroundColor: theme.palette.error.dark,
    },
  },
  btnDangerText: {
    color: theme.palette.error.main,

    '&:hover': {
      color: theme.palette.error.dark,
      backgroundColor: 'rgba(233, 61, 76, 0.04)',
    },
  },
  btnDangerOutline: {
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,

    '&:hover': {
      color: theme.palette.error.dark,
      borderColor: theme.palette.error.dark,
      backgroundColor: 'rgba(233, 61, 76, 0.04)',
    },
  },
  btnIconOnly: {
    padding: '2px 2px !important',
  },

  // icon
  icon: {
    color: theme.palette.neutral.main,

    '&:hover': {
      color: theme.palette.neutral.dark,
    },
  },

  // icon size
  iconXs: {
    fontSize: theme.typography.pxToRem(16),
  },
  iconSm: {
    fontSize: theme.typography.pxToRem(18),
  },
  iconMd: {
    fontSize: theme.typography.pxToRem(20),
  },
  iconLg: {
    fontSize: theme.typography.pxToRem(24),
  },

  // icon special
  iconOnly: {
    padding: 0,
    marginLeft: '0 !important',
    marginRight: '0 !important',
  },
});

export default styles;
