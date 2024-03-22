// app
import { string, generic } from 'utils';
import { tabTableSchema, articleSchema } from './schemas.yup';

export const validateSchema = ({ schema }) => {
  return tabTableSchema.isValidSync(schema);
};

const createColumns = (columnHeaders, i18nPath) => {
  return columnHeaders.map((column) => ({
    ...column,
    label: string.t(`${i18nPath}.columnNames.${column.id}`),
  }));
};

const getCompletedCount = (rows, columnToCount) => {
  return rows
    .filter((row) => {
      const cell = row.cells.find((cells) => cells.columnName === columnToCount);
      return cell && cell.value;
    })
    .filter((i) => !!i).length;
};

const createContent = (tabNames, data, columnToCount, i18nPath, content) => {
  let rows = [];
  const tabs = tabNames.map((tabKey) => {
    const sectionRows = content[tabKey].map((row) => createRow(data, row, `${i18nPath}.${tabKey}.rows`, tabKey));
    const rowCount = getCompletedCount(rows, columnToCount);
    rows = [...rows, ...sectionRows];
    return {
      label: `${i18nPath}.${tabKey}.label`,
      value: tabKey,
      ...(columnToCount && { total: rows.length, complete: rowCount }),
    };
  });
  return { rows, tabs };
};

const createPiChecklistContent = (tabNames, data, columnToCount, i18nPath, content) => {
  let rows = [];
  const tabs = tabNames.map((tabKey) => {
    const sectionRows = content[tabKey].map((row) => createPiCheckListRow(data, row, `${i18nPath}.${tabKey}.rows`, tabKey));
    const rowCount = getCompletedCount(rows, columnToCount);
    rows = [...rows, ...sectionRows];
    return {
      label: `${i18nPath}.${tabKey}.label`,
      value: tabKey,
      ...(columnToCount && { total: rows.length, complete: rowCount }),
    };
  });
  return { rows, tabs };
};

const createPiCheckListRow = (data, { rowKey, rowStyles = {}, cells = [] }, labelPath, tabKey) => {
  return {
    rowKey,
    rowStyles,
    tabKey: tabKey,
    cells: cells.map((cell) => {
      const { component = {}, cellProps = {} } = cell;
      const selectedRiskRef = data?.riskReferences?.find((riskReference) => riskReference.leadPolicy);
      const item =
        (generic.isValidArray(data.checklist, true) && data.checklist.find((item) => item.checkListDetails === rowKey)) ||
        (generic.isValidArray(selectedRiskRef?.gxbAttributeDefaultValues?.checkListDefaultValues, true) &&
          selectedRiskRef?.gxbAttributeDefaultValues?.checkListDefaultValues.find((item) => item.checkListDetails === rowKey));

      return {
        ...(cell.label ? { label: `${labelPath}.${rowKey}.label` } : {}),
        columnName: cell.name,
        ...(cell.isError && { isError: cell.isError }),
        name: `checklist.${rowKey}.${cell.name}`,
        ...(component && { ...component }),
        ...(cellProps && { cellProps }),
        value: item
          ? component.type === 'datepicker'
            ? item[cell.name] || null
            : item[cell.name]
          : component.type === 'checkbox'
          ? ''
          : null,
      };
    }),
  };
};

const createRow = (data, { rowKey, rowStyles = {}, cells = [] }, labelPath, tabKey) => {
  return {
    rowKey,
    rowStyles,
    tabKey: tabKey,
    cells: cells.map((cell) => {
      const { component = {}, cellProps = {} } = cell;
      const item = data.lineItems && data.lineItems.find((item) => item.itemKey === rowKey);
      return {
        ...(cell.label ? { label: `${labelPath}.${rowKey}.label` } : {}),
        columnName: cell.name,
        name: `lineItems.${rowKey}.${cell.name}`,
        ...(component && { ...component }),
        ...(cellProps && { cellProps }),
        value: item ? item[cell.name] : component.defaultValue,
      };
    }),
  };
};

const formatArticle = (article) => {
  const { id, heading, organisation_logo_url, excerpt, featured_image_url, external_url, date, topics } = article;
  return { id, heading, organisation_logo_url, excerpt, featured_image_url, external_url, date, topics };
};

const utilsSchemas = {
  parseArticles: (articles) => {
    return articles.filter((article) => articleSchema.isValidSync(article)).map((article) => formatArticle(article));
  },

  parseOpeningMemo: (schema, data) => {
    if (!validateSchema({ schema })) return;
    const { tabNames, defaultTab, columnHeaders, columnToCount, i18nPath, content } = schema;
    const hydratedColumns = createColumns(columnHeaders, i18nPath);
    const { tabs, rows } = createContent(tabNames, data, columnToCount, i18nPath, content);
    return { tabs, defaultTab, columnHeaders: hydratedColumns, rows };
  },

  parsePiChecklist: (schema, data) => {
    if (!validateSchema({ schema })) return;

    const { tabNames, defaultTab, columnToCount, i18nPath, content } = schema;
    const { tabs, rows } = createPiChecklistContent(tabNames, data, columnToCount, i18nPath, content);

    return { tabs, defaultTab, rows };
  },

  removeIcons: (fields) => {
    if (generic.isInvalidOrEmptyArray(fields)) return [];

    return fields.map((field) => {
      const fieldCopy = { ...field };
      delete fieldCopy.icon;

      return fieldCopy;
    });
  },
};

export default utilsSchemas;
