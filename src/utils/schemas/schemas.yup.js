import * as yup from 'yup';
import mapValues from 'lodash/mapValues';

const componentSchema = yup.object().shape({
  type: yup.string(),
  value: yup.mixed(),
  optionsKey: yup.string(),
});

const cellSchema = yup.object().shape({
  label: yup.boolean(),
  name: yup.string(),
  cellProps: yup.object(),
  component: componentSchema,
});

const columnHeaders = yup.object().shape({
  id: yup.string().required(),
  align: yup.string(),
});

const rowSchema = yup.object().shape({
  rowKey: yup.string().required(),
  rowStyles: yup.object(),
  cells: yup.array().of(cellSchema),
});

const tabTableSchema = yup.object().shape({
  tabNames: yup.array().of(yup.string().required()).required(),
  columnHeaders: yup.array().of(columnHeaders).required(),
  defaultTab: yup.string(),
  columnToCount: yup.string(),
  i18nPath: yup.string().required(),
  content: yup.lazy((obj) => yup.object().shape(mapValues(obj, () => yup.array().of(rowSchema)))),
});

const articleSchema = yup.object().shape({
  id: yup.string().required(),
  heading: yup.string().required(),
  excerpt: yup.string().required(),
  external_url: yup.string().required(),
  organisation_logo_url: yup.string().required(),
  featured_image_url: yup.string(),
  date: yup.date().required(),
  topics: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required(),
        id: yup.string().required(),
      })
    )
    .required(),
});

export { tabTableSchema, articleSchema };
