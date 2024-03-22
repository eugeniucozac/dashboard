const styles = (theme) => ({
  root: {
    width: '100%',
    height: 'auto',
    minHeight: '100%',
    position: 'relative',
  },
  stepper: {
    width: '100%',
    paddingRight: 0,
    paddingLeft: 0,
  },
  step: ({ size }) => ({
    ...(size === 'sm' && { paddingLeft: 2, paddingRight: 2 }),
    ...(size === 'md' && { paddingLeft: 4, paddingRight: 4 }),
    ...(size === 'lg' && { paddingLeft: 8, paddingRight: 8 }),
  }),
  connector: ({ size }) => ({
    position: 'absolute',
    ...(size === 'sm' && { top: 10, left: 'calc(-50% + 5px)', right: 'calc(+50% + 5px)' }),
    ...(size === 'md' && { top: 12, left: 'calc(-50% + 6px)', right: 'calc(+50% + 6px)' }),
    ...(size === 'lg' && { top: 16, left: 'calc(-50% + 8px)', right: 'calc(+50% + 8px)' }),
  }),
  labelRoot: ({ isMobile, size }) => ({
    position: 'relative',
    zIndex: 1,

    '& svg': {
      ...(size === 'sm' && { fontSize: isMobile ? '18px' : '20px' }),
      ...(size === 'md' && { fontSize: isMobile ? '21px' : '24px' }),
      ...(size === 'lg' && { fontSize: isMobile ? '24px' : '32px' }),
    },
  }),
  label: ({ size }) => ({
    marginTop: '5px !important',
    '& .MuiTypography-h4:first-child': { marginTop: theme.spacing(1.2) },
    ...(size === 'sm' && { letterSpacing: '-0.6px' }),
    ...(size === 'md' && { letterSpacing: '-0.4px' }),
    ...(size === 'lg' && { letterSpacing: '-0.2px' }),
  }),
  completed: {
    '& > svg[class*="completed"]': {},
  },
  icon: {
    background: 'white',
  },
  title: ({ isMobile, size }) => ({
    fontWeight: theme.typography.fontWeightRegular,
    marginBottom: 0,
    ...(size === 'sm' && { fontSize: isMobile ? '8px' : '10px' }),
    ...(size === 'md' && { fontSize: isMobile ? '9px' : '12px' }),
    ...(size === 'lg' && { fontSize: isMobile ? '10px' : '14px' }),
  }),
  titleForRejectedStep: ({ isMobile, size }) => ({
    fontWeight: theme.typography.fontWeightRegular,
    color: theme.palette.error.light,
    marginBottom: 0,
    ...(size === 'sm' && { fontSize: isMobile ? '8px' : '10px' }),
    ...(size === 'md' && { fontSize: isMobile ? '9px' : '12px' }),
    ...(size === 'lg' && { fontSize: isMobile ? '10px' : '14px' }),
  }),
  wrapper: {
    minHeight: '100%',
  },
});

export default styles;
