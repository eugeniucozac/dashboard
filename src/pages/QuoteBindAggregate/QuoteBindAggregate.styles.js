const styles = (theme) => ({
  pageContainer: {
    maxWidth: 1400,
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    border: `1px solid ${theme.palette.neutral.light}`,
    borderTop: 0,
  },
  headerLabel: {
    fontSize: '16px!important',
  },
  headerRoot: {
    height: '30px!important',
  },
  headerDivision: ({ media }) => ({
    borderBottom: `1px solid ${theme.palette.neutral.light}`,
  }),
  contentWrapper: ({ media }) => ({
    border: `1px solid ${theme.palette.neutral.light}`,
    marginLeft: media?.mobile ? '50px' : '100px',
    marginRight: media?.mobile ? '50px' : '100px',
    marginBottom: media?.mobile ? '50px' : '20px',
  }),
  tootlTip: {
    display: 'block',
    border: '1px solid #E9DCC9',
    borderRadius: '10px',
    background: '#FFFFFF',
    padding: '8px',
  },
  paperPopOver: {
    width: '400px!important',
  },
  titleDiv: ({ media }) => ({
    paddingTop: media?.mobile ? '10px' : '50px',
    paddingBottom: media?.mobile ? '0px' : '10px',
    paddingLeft: media?.mobile ? '50px' : '100px',
  }),
});
export default styles;
