import React from 'react';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import { Avatar, Card, Link } from 'components';
import { CardHeader, CardMedia, CardContent, CardActions, Typography } from '@material-ui/core';
import LaunchIcon from '@material-ui/icons/Launch';
import TheatersIcon from '@material-ui/icons/Theaters';
import { makeStyles } from '@material-ui/core';

export default {
  title: 'Card',
  component: Card,
  decorators: [withKnobs],
};

export const Default = () => {
  return (
    <Card
      title={text('Title', 'The Matrix')}
      subheader={text('Subheader', 'Action, Sci-fi (1999)')}
      text={text('Text', 'The Matrix is a computer-generated virtual world...')}
      compact={boolean('Compact', false)}
      fullwidth={boolean('Fullwidth', false)}
      active={boolean('Active', false)}
      disabled={boolean('Disabled', false)}
    />
  );
};

export const Custom = () => {
  const classes = makeStyles(() => ({
    media: {
      height: 0,
      paddingTop: '56.25%',
    },
    link: {
      textTransform: 'uppercase',
      fontWeight: 600,
      padding: '5px 7px',
    },
    icon: {
      margin: '0 5px',
      fontSize: 12,
    },
  }))();

  const title = text('Title', 'The Matrix');
  const subheader = text('Subheader', 'Action, Sci-fi (1999)');
  const avatar = boolean('Avatar', true);
  const image = boolean('Image', true);
  const content = text(
    'Content',
    'Thomas A. Anderson is a man living two lives. By day he is an average computer programmer and by night a hacker known as Neo. Neo has always questioned his reality, but the truth is far beyond his imagination...'
  );
  const link = boolean('Link', true);
  const fullwidth = boolean('Fullwidth', true);
  const compact = boolean('Compact', false);
  const active = boolean('Active', false);
  const disabled = boolean('Disabled', false);

  return (
    <Card compact={compact} active={active} disabled={disabled} fullwidth={fullwidth}>
      <CardHeader avatar={avatar ? <Avatar icon={TheatersIcon} size={32} border /> : undefined} title={title} subheader={subheader} />

      {image && (
        <CardMedia
          image="https://resizing.flixster.com/3_BjWHNMSAZwo-NZTIeOIpLuIvU=/740x380/v1.bjszMTk4OTI7ajsxODYzMzsxMjAwOzM2NzI7MTgzNg"
          className={classes.media}
        />
      )}

      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {content}
        </Typography>
      </CardContent>

      <CardActions disableSpacing>
        {link && (
          <Link
            target="_blank"
            rel="noopener"
            nestedClasses={{
              link: classes.link,
              icon: classes.icon,
            }}
            icon={LaunchIcon}
            iconPosition="right"
            href="https://www.imdb.com/title/tt0133093/"
            color="primary"
            text="Link"
          />
        )}
      </CardActions>
    </Card>
  );
};
