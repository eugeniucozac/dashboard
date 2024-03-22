const styles = (theme) => ({
  root: (p) => ({
    ...(p.fullwidth && { width: '100%' }),
    ...(p.active && { borderColor: 'transparent' }),
    ...(p.disabled && { borderColor: theme.palette.neutral.lighter }),
    backgroundColor: p.disabled ? 'rgba(0, 0, 0, 0.04)' : p.active ? theme.palette.primary.main : 'white',
    cursor: p.disabled ? 'not-allowed' : p.clickable ? 'pointer' : 'default',
    transition: theme.transitions.create(['color', 'border-color', 'background-color'], {
      duration: theme.transitions.duration.shortest,
    }),

    '&:last-child': {
      marginRight: 0,
    },

    '&:hover': {
      ...(p.clickable && { borderColor: theme.palette.grey[400] }),
      ...(p.clickable && { backgroundColor: p.active ? theme.palette.primary.dark : theme.palette.grey[50] }),
    },

    '& .MuiCardHeader-root': {
      padding: (p) => (p.compact ? '6px 10px 5px' : theme.spacing(2)),
    },

    '& .MuiCardHeader-title': {
      ...(p.active && { color: 'white' }),
      ...(p.disabled && { color: theme.palette.neutral.main }),
    },

    '& .MuiCardHeader-subheader': {
      ...(p.active && { color: 'white' }),
      ...(p.disabled && { color: theme.palette.neutral.medium }),
    },

    '& .MuiCardContent-root': {
      ...(p.compact && { padding: '6px 10px 5px' }),

      '& li': {
        ...(p.active && { color: 'white' }),
        ...(p.disabled && { color: theme.palette.neutral.medium }),
      },

      '& .MuiTypography-root': {
        ...(p.active && { color: theme.palette.primary.lightest }),
        ...(p.disabled && { color: theme.palette.neutral.medium }),
      },
    },

    '& .MuiCardHeader-root + .MuiCardContent-root': {
      ...(p.compact && { marginTop: -1 }),
      ...(p.compact && { paddingTop: 0 }),
    },
  }),
});

export default styles;
