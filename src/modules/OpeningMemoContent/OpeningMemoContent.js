import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router';

// app
import { OpeningMemoContentView } from './OpeningMemoContent.view';
import { createFields } from './OpeningMemoContent.fields';
import { openingMemoSchema } from 'schemas';
import { useMedia } from 'hooks';
import * as utils from 'utils';
import {
  selectRefDataNewRenewalBusinesses,
  selectOpeningMemo,
  getOpeningMemo,
  resetOpeningMemo,
  updateOpeningMemo,
  updateOpeningMemoDirty,
  selectRefDataDepartments,
} from 'stores';

export default function OpeningMemoContent() {
  const [selectedTab, setSelectedTab] = useState();
  const [defaultValues, setDefaultValues] = useState();
  const [schemaData, setSchemaData] = useState({});
  const [fields, setFields] = useState([]);
  const media = useMedia();

  const departments = useSelector(selectRefDataDepartments);
  const newRenewalRefData = useSelector(selectRefDataNewRenewalBusinesses);
  const openingMemo = useSelector(selectOpeningMemo);

  const { openingMemoId } = useParams();
  const dispatch = useDispatch();

  useEffect(
    () => {
      dispatch(getOpeningMemo(openingMemoId));
      return () => dispatch(resetOpeningMemo());
    },
    [openingMemoId] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(
    () => {
      if (!openingMemo.id || !newRenewalRefData.length) return;
      const schema = utils.schemas.parseOpeningMemo(openingMemoSchema, openingMemo);
      const fields = createFields(openingMemo, newRenewalRefData, departments);
      setFields(fields);
      setDefaultValues({ lineItems: utils.form.getNestedInitialValues(schema.rows, 'columnName'), ...utils.form.getInitialValues(fields) });
      setSchemaData(schema);
      if (!selectedTab) setSelectedTab(schema.defaultTab);
    },
    [openingMemo, newRenewalRefData] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleTabChange = (ref) => (tab) => {
    const el = ref.current;
    const header = utils.app.getElement('#header');

    setSelectedTab(tab);

    // scroll to top of form if...
    if (media.mobile) {
      window.scroll({ top: el.offsetTop, left: 0, behavior: 'smooth' });
    } else if (el.getBoundingClientRect().top < header.getBoundingClientRect().height) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSave = (data) => {
    dispatch(updateOpeningMemo(data, openingMemoId));
  };

  const handleFormDirty = (data) => {
    dispatch(updateOpeningMemoDirty(data));
  };

  return defaultValues ? (
    <OpeningMemoContentView
      onTabChange={handleTabChange}
      onSave={handleSave}
      fields={fields}
      rows={schemaData.rows}
      defaultValues={defaultValues}
      selectedTab={selectedTab}
      tabs={schemaData.tabs}
      columnHeaders={schemaData.columnHeaders}
      handleFormDirty={handleFormDirty}
    />
  ) : null;
}
