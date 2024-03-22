import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import has from 'lodash/has';
import kebabCase from 'lodash/kebabCase';
import escapeRegExp from 'lodash/escapeRegExp';

// app
import styles from './AdvancedSearch.styles';
import { Loader } from 'components';
import * as utils from 'utils';
import config from 'config';

// mui
import { makeStyles, Box, Divider, List, ListItem, Paper, Typography } from '@material-ui/core';

AdvancedSearchView.propTypes = {
  results: PropTypes.shape({
    clients: PropTypes.object,
    clientOfficeParents: PropTypes.object,
    insureds: PropTypes.object,
    markets: PropTypes.object,
    policies: PropTypes.object,
    departments: PropTypes.object,
  }),
  query: PropTypes.string,
  loading: PropTypes.bool,
  error: PropTypes.string,
  handlers: PropTypes.shape({
    onClick: PropTypes.func,
  }),
  nestedClasses: PropTypes.shape({
    root: PropTypes.string,
  }),
};

AdvancedSearchView.defaultProps = {
  results: {},
};

export function AdvancedSearchView({ results, query, loading, error, handlers, nestedClasses }) {
  const classes = makeStyles(styles, { name: 'AdvancedSearch' })();

  const renderGroup = (type) => {
    const category = results[type] || {};
    const { total = 0, items } = category;
    const itemsFiltered = utils.generic.isValidArray(items) ? items.filter((item) => item.id && item.name) : [];
    const length = itemsFiltered.length;

    return (
      <Box mb={3} className={classes.category} data-testid={`advanced-search-group-${type}`}>
        <div className={classes.categoryTitle}>
          <Typography className={classes.categoryName} variant="subtitle2">
            {utils.string.t(`advancedSearch.categories.${type}`)}
          </Typography>
          {total > length && renderSeeAllLink(type)}
        </div>
        <Divider />
        {itemsFiltered.length > 0 && <List>{itemsFiltered.map((item) => renderItem({ ...item, type }))}</List>}
        {itemsFiltered.length <= 0 && <Typography className={classes.noResult}>{utils.string.t('advancedSearch.noResult')}</Typography>}
      </Box>
    );
  };

  const renderItem = ({ type, id, name = '', image }) => {
    const text = query ? name.replace(new RegExp(escapeRegExp(query), 'gi'), (match) => `<strong>${match}</strong>`) : name;
    const slug = name ? `/${kebabCase(name)}` : '';
    let link;

    switch (type) {
      // case 'clients':
      //   link = '/clients';
      //   break;
      case 'clientOfficeParents':
        link = `${config.routes.client.item}/${id}${slug}`;
        break;
      // case 'insureds':
      //   link = '/insureds';
      //   break;
      // case 'markets':
      //   link = '/markets';
      //   break;
      case 'policies':
        link = `${config.routes.policy.root}/${name}`;
        break;
      case 'departments':
        link = `${config.routes.department.root}/${id}/${kebabCase(name)}`;
        break;
      default:
        break;
    }

    const linkProps = {
      ...(link && { component: Link }),
      ...(link && { to: link }),
    };

    return (
      <ListItem key={id} button {...linkProps} dense className={classes.link} onClick={handlers.onClick}>
        {image && <img src={`${config.assets}/logo/${image}`} alt={`logo ${name}`} className={classes.logo} />}
        <Typography className={classes.linkText}>
          <span dangerouslySetInnerHTML={{ __html: text }} />
        </Typography>
      </ListItem>
    );
  };

  const renderSeeAllLink = (group) => {
    // temporarily remove the link until we have pages to handle "see all" links

    // let link = '';
    //
    // switch (group) {
    //   case 'clients':
    //     link = '/clients';
    //     break;
    //   case 'clientOfficeParents':
    //     link = '/clients';
    //     break;
    //   case 'insureds':
    //     link = '/insureds';
    //     break;
    //   case 'markets':
    //     link = '/markets';
    //     break;
    //   case 'policies':
    //     link = '/policies';
    //     break;
    //   case 'departments':
    //     link = '/departments';
    //     break;
    //   default:
    //     link = '/blank';
    //     break;
    // }

    return (
      <Typography className={classes.categorySeeAll}>
        ({/*<Link to={link} className={classes.categorySeeAllLink}>*/}
        <span>{utils.string.t('app.seeAll')}</span>
        {/*</Link>*/})
      </Typography>
    );
  };

  return (
    <div className={nestedClasses.root} data-testid="advanced-search">
      <Paper elevation={10} className={classes.paper}>
        {!error && (
          <div className={classes.container}>
            <Box className={classes.group} data-testid="advanced-search-box-left">
              {has(results, 'clientOfficeParents') && renderGroup('clientOfficeParents')}
              {has(results, 'clients') && renderGroup('clients')}
              {has(results, 'markets') && renderGroup('markets')}
            </Box>

            <Box className={classes.group} data-testid="advanced-search-box-right">
              {has(results, 'insureds') && renderGroup('insureds')}
              {has(results, 'departments') && renderGroup('departments')}
              {has(results, 'policies') && renderGroup('policies')}
            </Box>
          </div>
        )}

        {error && (
          <Box display="flex" width={1} alignItems="center">
            <Typography className={classes.error}>
              <span dangerouslySetInnerHTML={{ __html: error }} />
            </Typography>
          </Box>
        )}

        <Loader absolute visible={loading} />
      </Paper>
    </div>
  );
}
