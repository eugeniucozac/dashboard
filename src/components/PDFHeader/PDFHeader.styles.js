export const styles = () => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    'page-break-before': 'always',
    justifyContent: 'space-between',
    height: '10mm',
    marginBottom: '5mm',
  },
  logo: ({ logoSize }) => ({
    height: logoSize,
  }),
});

export default styles;
