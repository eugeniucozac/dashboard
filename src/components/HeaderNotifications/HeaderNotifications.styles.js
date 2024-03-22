const styles = (theme) => ({
  messageAvatar: {
    color: `${theme.palette.secondary.light} !important`,
  },
  clearAvatar: {
    color: `${theme.palette.neutral.dark} !important`,
    fontSize: 12,
    cursor: 'pointer',
  },
  clearAll: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '8px 12px 0px 0px',
  },
  notificationDueDateIcon: {
    fontSize: 13,
  },
  expiryDateContainer: {
    display: 'flex',
    justifyContent: 'left',
    flexWrap: 'wrap',
    marginTop: theme.spacing(1),
  },
  notificationHeaderSmallLabel: {
    flex: '0 1 auto',
    marginRight: 4,
    marginLeft: -2,
    cursor: 'pointer',
    marginTop: theme.spacing(0.6),
  },
  expiryDate: {
    fontSize: 10,
    color: theme.palette.neutral.dark,
    cursor: 'pointer',
  },
  clearNotification: ({ isMobile }) => ({
    marginLeft: isMobile ? theme.spacing(8) : theme.spacing(16),
  }),
  description: {
    cursor: 'pointer',
  },
});

export default styles;
