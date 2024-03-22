const tooltipRich = () => {
  return {
    '&.MuiTooltip-tooltipPlacementTop': {
      margin: '20px 0',

      '& > $arrowRich': {
        marginBottom: '-1.5em',

        '&:before': {
          transform: 'rotate(45deg) translate(-50%, -50%)',
        },
        '&:after': {
          bottom: 2,
          transform: 'rotate(45deg) translate(-50%, -50%)',
        },
      },
    },

    '&.MuiTooltip-tooltipPlacementRight': {
      margin: '0 20px',

      '& > $arrowRich': {
        marginLeft: '-1.5em',

        '&:before': {
          transform: 'rotate(45deg) translate(50%, -50%)',
        },
        '&:after': {
          top: 0,
          left: 2,
          transform: 'rotate(45deg) translate(50%, -50%)',
        },
      },
    },

    '&.MuiTooltip-tooltipPlacementBottom': {
      margin: '20px 0',

      '& > $arrowRich': {
        marginTop: '-1.5em',

        '&:before': {
          transform: 'rotate(45deg) translate(50%, 50%)',
        },

        '&:after': {
          top: 2,
          transform: 'rotate(45deg) translate(50%, 50%)',
        },
      },
    },

    '&.MuiTooltip-tooltipPlacementLeft': {
      margin: '0 20px',

      '& > $arrowRich': {
        marginRight: '-1.5em',

        '&:before': {
          transform: 'rotate(45deg) translate(-50%, 50%)',
        },
        '&:after': {
          top: 0,
          right: 2,
          transform: 'rotate(45deg) translate(-50%, 50%)',
        },
      },
    },
  };
};

const styles = (theme) => ({
  tooltipRich: {
    padding: `${theme.spacing(1.5)}px ${theme.spacing(2)}px`,
    color: theme.palette.neutral.darker,
    fontSize: theme.typography.pxToRem(12),
    fontWeight: theme.typography.fontWeightRegular,
    lineHeight: 1.5,
    backgroundColor: 'white',
    textAlign: 'center',
    boxShadow: `0px 1px 4px -1px ${theme.palette.neutral.medium}, 0px 1px 5px 0px ${theme.palette.neutral.light}, 0px 0px 10px 0px ${theme.palette.neutral.lighter}`,
    ...tooltipRich(),
  },

  arrowRich: {
    width: '1.5em !important',
    height: '1.5em !important',
    fontSize: theme.typography.pxToRem(16),

    '&:before': {
      position: 'relative',
      width: '100%',
      height: '100%',
      backgroundColor: theme.palette.grey[300],
      transformOrigin: '50% 50% !important',
    },

    '&:after': {
      content: '""',
      display: 'block',
      position: 'absolute',
      margin: 'auto',
      flip: false,
      width: '100%',
      height: '100%',
      borderWidth: 0,
      backgroundColor: 'white',
      transformOrigin: '50% 50% !important',
      transform: 'rotate(45deg) translate(50%, 50%)',
    },
  },

  // do not remove - used inside nested statements
  top: {},
  right: {},
  bottom: {},
  left: {},
});

export default styles;
