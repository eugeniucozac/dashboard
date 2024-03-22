const styles = (theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  wrapper: {
    '&:not(:first-child)': {
      marginLeft: -7,

      '& > span > div': {
        textIndent: 1,
      },
    },
  },
  avatar: {
    display: 'inline-flex',
    margin: '1px 2px 1px 0',
    border: (props) => (props.single ? 0 : '2px solid white'),
  },
  avatarPlus: {
    backgroundColor: `${theme.palette.neutral.light} !important`,
    marginLeft: -8,
  },
});

export default styles;
