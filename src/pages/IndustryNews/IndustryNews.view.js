import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './IndustryNews.styles';
import { Layout, SectionHeader, Link, Card, Loader, Pagination, Avatar, FilterChips, FormSelect } from 'components';
import * as utils from 'utils';
import config from 'config';
import { ReactComponent as LogoSlipcase } from '../../assets/svg/logo-slipcase.svg';

// mui
import { makeStyles, Grid, CardHeader, CardMedia, CardContent, CardActions, Typography, Fade } from '@material-ui/core';
import AssignmentIcon from '@material-ui/icons/Assignment';
import LaunchIcon from '@material-ui/icons/Launch';

IndustryNewsView.propTypes = {
  articles: PropTypes.array.isRequired,
  selectField: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  initialLoad: PropTypes.bool.isRequired,
  selectedTopics: PropTypes.array.isRequired,
  handleRemoveTopics: PropTypes.func.isRequired,
};

export function IndustryNewsView({
  handleChangePage,
  handleRemoveTopics,
  selectedTopics,
  handleChangeRowsPerPage,
  articles,
  selectField,
  isLoading,
  initialLoad,
  pagination,
}) {
  const classes = makeStyles(styles, { name: 'IndustryNews' })();
  return (
    <Layout testid="industryNews">
      <Layout main>
        <SectionHeader title={utils.string.t('industryNews.title')} icon={AssignmentIcon} testid="industry-news">
          {initialLoad && <FormSelect {...selectField} />}
        </SectionHeader>
        <FilterChips
          items={selectedTopics}
          handleRemoveItems={handleRemoveTopics}
          showRemoveAll={true}
          removeAllLabel={utils.string.t('industryNews.removeFilters')}
        />
        <Loader visible={isLoading} />
        <Fade timeout={400} in={!isLoading}>
          <>
            <Grid container spacing={3} alignItems="stretch">
              {articles.map((article) => (
                <Grid sm={12} md={4} item key={article.id}>
                  <Card nestedClasses={{ root: classes.card }}>
                    <CardHeader
                      classes={{ root: classes.cardHeader }}
                      avatar={
                        <Avatar
                          variant="square"
                          size={36}
                          src={article.organisation_logo_url}
                          aria-label="article"
                          className={classes.avatar}
                        />
                      }
                      title={article.heading}
                      subheader={utils.string.t('format.date', { value: { date: article.date, format: config.ui.format.date.text } })}
                    />
                    {article.featured_image_url ? (
                      <CardMedia classes={{ root: classes.media }} image={article.featured_image_url} title={article.heading} />
                    ) : (
                      <div className={classes.noMedia}>
                        <span className={classes.noMediaText}>{utils.string.t('industryNews.curatedBy')}</span>
                        <LogoSlipcase height={30} className={classes.noMediaIcon} />
                      </div>
                    )}
                    <CardContent classes={{ root: classes.cardContent }}>
                      <Typography variant="body2" color="textSecondary" component="p">
                        {article.excerpt}
                      </Typography>
                    </CardContent>
                    <CardActions disableSpacing>
                      <Link
                        target="_blank"
                        rel="noopener"
                        nestedClasses={{
                          link: classes.linkRoot,
                          icon: classes.linkIcon,
                        }}
                        icon={LaunchIcon}
                        iconPosition="right"
                        href={article.external_url}
                        color="primary"
                        text={utils.string.t('industryNews.readArticle')}
                      />
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Pagination
              page={pagination.page}
              count={pagination.rowsTotal}
              rowsPerPage={pagination.rowsPerPage}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </>
        </Fade>
      </Layout>
    </Layout>
  );
}
