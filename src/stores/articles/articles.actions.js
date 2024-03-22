export const updateTopics = (topics, initialLoad) => (dispatch, getState) => {
  dispatch(updateTopicsSuccess(topics));
  if (initialLoad) {
    dispatch(initialLoadSuccess());
  }
};

export const updateTopicsSuccess = (topics) => {
  return {
    type: 'ARTICLES_UPDATE_TOPICS_SUCCESS',
    payload: topics,
  };
};

export const initialLoadSuccess = () => {
  return {
    type: 'ARTICLES_INITIAL_LOAD_SUCCESS',
  };
};

export const setFnolSelectedTab = (tab) => {
  return {
    type: 'CLAIMS_FNOL_SELECT_TAB',
    payload: tab,
  };
};
