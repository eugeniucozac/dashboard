import React from 'react';
import PropTypes from 'prop-types';

// app
import { InfoView } from './Info.view';
import { useHistory } from 'react-router';

Info.propTypes = {
  avatarText: PropTypes.string,
  avatarImage: PropTypes.string,
  avatarIcon: PropTypes.object,
  avatarBg: PropTypes.string,
  avatarBorder: PropTypes.bool,
  avatarSize: PropTypes.number,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  title: PropTypes.node,
  content: PropTypes.node,
  subtitle: PropTypes.node,
  description: PropTypes.node,
  ellipsis: PropTypes.bool,
  verticalAlign: PropTypes.bool,
  showSkeleton: PropTypes.bool,
  nestedClasses: PropTypes.shape({
    root: PropTypes.string,
    avatar: PropTypes.string,
    details: PropTypes.string,
    content: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
  }),
  'data-testid': PropTypes.string,
  link: PropTypes.string,
  tooltip: PropTypes.string,
  subTitleTooltip: PropTypes.string,
  descriptionTooltip: PropTypes.string,
};

Info.defaultProps = {
  size: 'sm',
  nestedClasses: {},
  tooltip: '',
  subTitleTooltip: '',
  descriptionTooltip: '',
};

export function Info({
  avatarText,
  avatarImage,
  avatarIcon,
  avatarBg,
  avatarBorder,
  avatarSize,
  size,
  title,
  subtitle,
  content,
  description,
  ellipsis,
  verticalAlign,
  showSkeleton,
  nestedClasses,
  link,
  tooltip,
  subTitleTooltip,
  descriptionTooltip,
  'data-testid': dataTestId,
}) {
  const history = useHistory();

  const handleLinkClick = () => {
    if (!link) return;
    history.push(link);
  };

  return (
    <InfoView
      handleLinkClick={handleLinkClick}
      avatarText={avatarText}
      avatarImage={avatarImage}
      avatarIcon={avatarIcon}
      avatarBg={avatarBg}
      avatarBorder={avatarBorder}
      avatarSize={avatarSize}
      size={size}
      title={title}
      subtitle={subtitle}
      content={content}
      description={description}
      ellipsis={ellipsis}
      verticalAlign={verticalAlign}
      showSkeleton={showSkeleton}
      nestedClasses={nestedClasses}
      link={link}
      dataTestId={dataTestId}
      tooltip={tooltip}
      subTitleTooltip={subTitleTooltip}
      descriptionTooltip={descriptionTooltip}
    />
  );
}

export default Info;
