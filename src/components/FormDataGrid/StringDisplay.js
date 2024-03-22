const StringDisplay = ({ field, item, index, formProps }) => {
  const watchFields = item.valueFields.map((fieldItem) => `${field}[${index}].${fieldItem}`);
  const watchValues = formProps?.watch(watchFields);
  const result = Object.values(watchValues).reduce((a, b) => `${a} ${b}`);

  return <div>{result}</div>;
};

export default StringDisplay;
