import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// app
import { AdvancedSearchView } from './AdvancedSearch.view';
import { selectSearchResults, selectSearchResultsTerm, selectSearchIsLoading, selectSearchError } from 'stores';

AdvancedSearch.propTypes = {
  handlers: PropTypes.shape({
    onClick: PropTypes.func,
  }),
  nestedClasses: PropTypes.shape({
    root: PropTypes.string,
  }),
};

AdvancedSearch.defaultProps = {
  handlers: {},
  nestedClasses: {},
};

export default function AdvancedSearch(props) {
  const searchResults = useSelector(selectSearchResults);
  const searchResultsTerm = useSelector(selectSearchResultsTerm) || '';
  const searchIsLoading = useSelector(selectSearchIsLoading);
  const searchError = useSelector(selectSearchError);

  return (
    <AdvancedSearchView {...props} results={searchResults} query={searchResultsTerm.trim()} loading={searchIsLoading} error={searchError} />
  );
}
