export const styles = (theme) => ({
  seeNotesRow: {
    '& > th, & > td': {
      fontSize: theme.typography.pxToRem(11),
      color: theme.palette.neutral.main,
      fontStyle: 'italic',
    },

    '&& > :first-child': {
      paddingLeft: 52,
    },
  },
});

export default styles;
