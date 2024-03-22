const styles = (theme) => {
  const values = {
    minHeight: {
      xsmall: 24,
      small: 30,
    },
    fontSize: {
      xsmall: 11,
      small: 13,
    },
  };

  return {
    root: ({ colorMode, collapsed, noBorder }) => {
      return {
        minWidth: 150,
        color: colorMode === 'light' ? theme.palette.neutral.darker : 'white',
        fontSize: theme.typography.pxToRem(11),
        boxShadow: colorMode === 'light' ? (noBorder || collapsed ? 'none' : theme.shadows[1]) : theme.shadows[1],
        background: colorMode === 'light' ? 'white' : theme.palette.primary.main,
        border: colorMode === 'light' && !noBorder ? `1px solid ${theme.palette.neutral.medium}` : 0,
        borderRadius: 4,
        zIndex: 1,
      };
    },
    hint: ({ colorMode }) => {
      return {
        color: colorMode === 'light' ? theme.palette.neutral.main : theme.palette.primary.lightest,
        fontSize: theme.typography.pxToRem(11),
        padding: 8,
        margin: 0,
      };
    },
    itemName: {
      flex: 1,
    },
    selectAll: ({ hasAvatar, avatarSize }) => {
      return {
        flex: 1,
        paddingLeft: hasAvatar ? avatarSize + 4 : 0,
      };
    },
    selectAllLi: {
      paddingTop: '0px !important',
      paddingBottom: '6px !important',
      marginTop: -6,
    },
    switch: {
      marginTop: 1,
      marginRight: -4,
    },
    list: ({ hasSwitch }) => {
      return {
        maxHeight: 250,
        overflowY: 'auto',
        margin: 0,
        padding: 10,
        listStyle: 'none',
        '& li': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: hasSwitch ? '2px 0' : '4px 0',
        },
        '& li:last-child': {
          paddingBottom: 0,
        },
      };
    },
    avatar: {
      marginRight: 6,
    },
    button: ({ colorMode }) => {
      return {
        width: colorMode === 'light' ? 'calc(100% + 2px)' : '100%',
        margin: colorMode === 'light' ? -1 : 0,
      };
    },
    buttonIcon: ({ colorMode, collapsed }) => {
      return {
        color: colorMode === 'light' ? theme.palette.neutral.dark : 'white',
        transform: collapsed ? 'scaleY(1)' : 'scaleY(-1)',
        transition: theme.transitions.create(['transform']),
      };
    },
    buttonTitle: ({ colorMode }) => {
      return {
        color: colorMode === 'light' ? theme.palette.neutral.dark : 'white',
        flex: 1,
        justifyContent: 'space-between',
      };
    },
    title: ({ colorMode, size }) => {
      return {
        display: 'flex',
        alignItems: 'center',
        color: colorMode === 'light' ? theme.palette.neutral.dark : 'white',
        fontWeight: theme.typography.fontWeightMedium,
        fontSize: theme.typography.pxToRem(values.fontSize[size]),
        textTransform: 'uppercase',
        padding: size === 'xsmall' ? '2px 8px' : '6px 10px',
        minHeight: values.minHeight[size],
        ...(size === 'xsmall' && { lineHeight: theme.typography.lineHeight['20/11'] }),
        margin: colorMode === 'light' ? -1 : 0,
        width: colorMode === 'light' ? 'calc(100% + 2px)' : '100%',
      };
    },
  };
};

export default styles;
