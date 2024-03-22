import React from 'react';
import PropTypes from 'prop-types';

// app
import { TranslateView } from './Translate.view';
import * as utils from 'utils';

// mui
import { Typography } from '@material-ui/core';

Translate.propTypes = {
  label: PropTypes.string,
  options: PropTypes.object,
  variant: PropTypes.oneOf([
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'subtitle1',
    'subtitle2',
    'body1',
    'body2',
    'caption',
    'button',
    'overline',
    'srOnly',
    'inherit',
  ]),
  parseDangerousHtml: PropTypes.bool,
  component: PropTypes.element,
};

export default function Translate({ label, options, variant, parseDangerousHtml, component, ...rest }) {
  // abort
  if (!label) return null;

  const TextComponent = variant ? Typography : component;

  // default text content to render
  let content = utils.string.t(label, options);

  // if dangerous HTML, wrap in a span and parse HTML
  if (parseDangerousHtml) {
    content = <span dangerouslySetInnerHTML={{ __html: content }} />;
  }

  // if no variant or component defined, just return the content
  if (!variant && !component) {
    return content;
  }

  return <TranslateView content={content} component={TextComponent} componentProps={{ variant, ...rest }} />;
}
