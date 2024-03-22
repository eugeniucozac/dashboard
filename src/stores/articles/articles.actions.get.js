import get from 'lodash/get';
import flatten from 'lodash/flatten';
import uniq from 'lodash/uniq';

// app
import config from 'config';
import * as utils from 'utils';
import { authLogout } from 'stores';

const departmentKeys = Object.keys(config.slipcase.mappings);

const getIds = (topics) => {
  const selectedSlipcaseTopics = topics
    .filter((topic) => !departmentKeys.includes(topic.value.toString()))
    .map((topic) => topic.slipcaseId);
  const derivedTopics = flatten(topics.map((department) => config.slipcase.mappings[department.value])).filter((topic) => !!topic);
  return uniq([...selectedSlipcaseTopics, ...derivedTopics]);
};

export const getArticles = (params) => (dispatch, getState) => {
  dispatch(getArticlesRequest());

  const state = getState();
  // prettier-ignore
  const { config: { vars: { endpoint }}} = state;
  const paramsLimit = params && params.size !== undefined ? params.size : get(state, 'articles.list.pageSize');
  const paramsOffset = params && params.page !== undefined ? params.page : get(state, 'articles.list.page');
  const paramsIncludeTopics = (params && params.selectedTopics) || get(state, 'articles.list.topics');

  return utils.api
    .get({
      endpoint: endpoint.slipcase,
      path: 'api/v1/feed/',
      headers: false,
      params: {
        apiKey: config.slipcase.apiKey,
        output: 'json',
        includePaywalled: 1,
        limit: paramsLimit,
        offset: paramsOffset * paramsLimit,
        ...(paramsIncludeTopics.length && { includeTopics: getIds(paramsIncludeTopics) }),
      },
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(
        getArticlesSuccess({
          items: data,
          page: paramsOffset,
          pageSize: paramsLimit,
        })
      );
    })
    .catch((err) => {
      const errorParams = {
        file: 'stores/articles.actions.get',
        message: 'API fetch error (articles.get)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getArticlesFailure(err));
      return err;
    });
};

export const getArticlesRequest = () => {
  return {
    type: 'ARTICLES_GET_REQUEST',
  };
};

export const getArticlesSuccess = (payload) => {
  return {
    type: 'ARTICLES_GET_SUCCESS',
    payload,
  };
};

export const getArticlesFailure = (error) => {
  return {
    type: 'ARTICLES_GET_FAILURE',
    payload: error,
  };
};
