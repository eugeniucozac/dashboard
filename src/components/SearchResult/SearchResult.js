import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import classnames from 'classnames';

// app
import styles from './SearchResult.styles';
import { Translate } from 'components';
import * as utils from 'utils';

// mui
import { withStyles, Typography, Link } from '@material-ui/core';

export class SearchResult extends PureComponent {
  static propTypes = {
    count: PropTypes.number.isRequired,
    query: PropTypes.string.isRequired,
    category: PropTypes.string,
    handleSearchReset: PropTypes.func,
    nestedClasses: PropTypes.shape({
      root: PropTypes.string,
      text: PropTypes.string,
    }),
  };

  static defaultProps = {
    nestedClasses: {},
  };

  render() {
    const { count, query, category, handleSearchReset, nestedClasses, classes } = this.props;

    const label = category ? 'app.searchResultIn' : 'app.searchResult';

    // abort if no search query made
    if (!query) return null;

    return (
      <div className={classnames(classes.root, nestedClasses.root)}>
        <Typography
          variant="body2"
          className={classnames(classes.text, nestedClasses.text)}
          dangerouslySetInnerHTML={{
            __html: utils.string.t(label, { count: count, query: query, category: category }),
          }}
        />

        {count === 0 && handleSearchReset && (
          <Typography variant="body2" className={classes.noResults}>
            <Link onClick={handleSearchReset} className={classes.noResultsLink}>
              <Translate label="app.searchClear" />
            </Link>
          </Typography>
        )}
      </div>
    );
  }
}

export default compose(withStyles(styles))(SearchResult);
