const styles = (theme) => ({
  valueLabel: {
    display: 'flex',
  },
  label: {
    fontWeight: theme.typography.fontWeightBold,
    marginRight: 5,
  },
  map: {
    border: `solid 1px ${theme.palette.grey[300]}`,
    borderTop: 0,
  },
  mapKeyRoot: ({ levelOverride }) => ({
    position: 'absolute',
    right: 10,
    width: 200,
    top: levelOverride ? 135 : 115,
  }),
  toggleIcon: (props) => ({
    transform: props.showTable ? 'rotate(90deg)' : 'rotate(-90deg)',
  }),
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    background: 'white',
  },
  toggleButton: {
    width: '100%',
  },
  toggleButtonContainer: {
    textAlign: 'center',
  },
  tableContainer: {
    padding: theme.spacing(2),
  },
});

export default styles;
