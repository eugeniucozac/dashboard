const SumTotalValues = ({ field, item, index, formProps }) => {
  const watchFields = item.valueFields.map((fieldItem) => `${field}[${index}].${fieldItem}`);
  const watchValues = formProps?.watch(watchFields);
  const result = Object.values(watchValues).reduce((a, b) => Number(a) + Number(b));

  return <>{result ? `${result} %` : ''}</>;
};

export default SumTotalValues;
