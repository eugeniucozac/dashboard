import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import orderBy from 'lodash/orderBy';

// app
import { usePagination } from 'hooks';
import { getArticles, selectAllTopics, updateTopics, selectArticlePagination } from 'stores';
import * as utils from 'utils';
import { IndustryNewsView } from './IndustryNews.view';

export function IndustryNews() {
  const dispatch = useDispatch();

  const brand = useSelector((state) => state.ui.brand);
  const articles = useSelector((state) => state.articles.list.items);
  const isLoading = useSelector((state) => state.articles.isLoading);
  const initialLoad = useSelector((state) => state.articles.initialLoad);
  const departmentIds = useSelector((state) => state.user.departmentIds);
  const selectedTopics = useSelector((state) => state.articles.list.topics);
  const allTopics = useSelector(selectAllTopics);
  const articlePagination = useSelector(selectArticlePagination);
  const selectedTopicIds = (selectedTopics || []).map((topic) => topic.value);

  const selectField = {
    type: 'select',
    value: '__placeholder__',
    size: 'sm',
    muiComponentProps: {
      fullWidth: false,
    },
    options: allTopics
      ? [
          { label: utils.string.t('industryNews.selectATopic'), value: '__placeholder__', placeholder: true },
          ...allTopics.filter((topic) => !selectedTopicIds.includes(topic.value)),
        ]
      : [{ label: utils.string.t('industryNews.selectATopic'), value: '__placeholder__', placeholder: true }],
    name: 'filter',
    handleUpdate: (name, topicValue) => {
      dispatch(updateTopics(orderBy([...selectedTopics, allTopics.find((topic) => topic.value === topicValue)], 'label')));
    },
  };

  useEffect(
    () => {
      if (!selectedTopics || !initialLoad) return;
      dispatch(getArticles({ selectedTopics, page: 0 }));
    },
    [selectedTopics, initialLoad] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(
    () => {
      if (!departmentIds.length || !allTopics || initialLoad) return;
      // Pre-select topics mapped to departmentIds only first load
      const topics = allTopics.filter((topic) => departmentIds.includes(topic.value));
      dispatch(updateTopics(topics, true));
    },
    [departmentIds, allTopics] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleRemoveTopics = (removedTopics) => {
    const topicIds = removedTopics.map((topic) => topic.value);
    dispatch(updateTopics(selectedTopics.filter((topic) => !topicIds.includes(topic.value))));
  };

  const handleChangePage = (newPage) => {
    dispatch(getArticles({ page: newPage }));
  };

  const handleChangeRowsPerPage = (rowsPerPage) => {
    dispatch(getArticles({ size: rowsPerPage, page: 0 }));
  };

  const pagination = usePagination(articles, articlePagination, handleChangePage, handleChangeRowsPerPage);

  return (
    <>
      <Helmet>
        <title>{`${utils.string.t('industryNews.title')} - ${utils.app.getAppName(brand)}`}</title>
      </Helmet>

      <IndustryNewsView
        handleChangePage={pagination.handlers.handleChangePage}
        handleChangeRowsPerPage={pagination.handlers.handleChangeRowsPerPage}
        pagination={pagination.obj}
        initialLoad={initialLoad}
        handleRemoveTopics={handleRemoveTopics}
        selectedTopics={selectedTopics}
        isLoading={isLoading}
        articles={utils.schemas.parseArticles(articles)}
        selectField={selectField}
      />
    </>
  );
}

export default IndustryNews;
