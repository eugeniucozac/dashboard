export const styles = (theme) => ({
  infoRow: {
    height: 34,
    backgroundColor: `${theme.palette.neutral.lightest} !important`,
    transition: theme.transitions.create('background-color', {
      duration: theme.transitions.duration.shortest,
    }),
    '& > th, & > td': {
      paddingTop: 2,
      paddingBottom: 2,
      textAlign: 'center',
      fontSize: theme.typography.pxToRem(11),
      borderBottomStyle: 'dashed',
      position: 'relative',

      '&:first-child:before, &:last-child:before': {
        content: '""',
        position: 'absolute',
        top: 0,
        height: '100%',
        width: 1,
        backgroundColor: theme.palette.grey[300],
      },

      '&:first-child:before': {
        left: 0,
      },

      '&:last-child:before': {
        right: 0,
      },
    },
  },
});

export default styles;
