import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// app
import styles from './Comments.styles';
import { selectUser, deleteComment } from 'stores';
import { Avatar, Button, FormContainer, FormText, Info, Translate } from 'components';
import * as utils from 'utils';

// mui
import { Box, Collapse, Typography, makeStyles, useTheme } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

CommentsView.propTypes = {
  title: PropTypes.string,
  comments: PropTypes.array,
  truncate: PropTypes.number,
  expanded: PropTypes.array,
  divider: PropTypes.bool,
  field: PropTypes.object,
  user: PropTypes.object,
  handleClickExpand: PropTypes.func,
  handlePostComment: PropTypes.func,
};

export function CommentsView({ id, title, comments, truncate, expanded, divider, field, user, handleClickExpand, handlePostComment }) {
  const dispatch = useDispatch();
  const classes = makeStyles(styles, { name: 'Comments' })({ divider });
  const theme = useTheme();
  const currentUser = useSelector(selectUser);
  const defaultValues = utils.form.getInitialValues([field]);
  const validationSchema = utils.form.getValidationSchema([field]);

  const { control, reset, handleSubmit, formState } = useForm({
    mode: 'onChange',
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  const handleDeleteComment = (commentId) => {
    dispatch(deleteComment(id, commentId));
  };

  return (
    <div className={classes.root}>
      {title && (
        <Typography variant="h5" className={classes.title}>
          {title}
        </Typography>
      )}

      <Collapse in={!!comments.length} timeout={'auto'}>
        {comments.map((item) => {
          const firstName = utils.user.firstname(item.user);
          const fullName = utils.user.fullname(item.user);
          const title = firstName || fullName || utils.string.t('app.na');
          const subtitle = item.date ? utils.string.t('format.dateFromNow', { value: { date: item.date } }) : null;
          const initials = utils.user.initials(item.user);
          const icon = !initials ? PersonIcon : null;
          const canDeleteComment = currentUser?.id === item.user.id;

          const toggle = (
            <Button
              size="xsmall"
              variant="text"
              text={<Translate label="app.seeMore" />}
              onClick={handleClickExpand(item.id)}
              nestedClasses={{ btn: classes.toggle, label: classes.label }}
              data-testid={`comment-expand-${item.id}`}
            />
          );

          // handle string truncation
          // we remove 20 characters more than the truncate limit, otherwise we could have cases
          // where 1 characters is truncated, but the "... see more" takes more space than the actual string
          const isTruncated = item.message && truncate && item.message.length > truncate;
          const isCollapsed = !expanded.includes(item.id);
          const messageTruncated = (
            <>
              {item.message.slice(0, truncate - 20).trim()}
              ...
              {toggle}
            </>
          );

          const message = isTruncated && isCollapsed ? messageTruncated : item.message;

          return (
            <Box key={item.id} display="flex" className={classes.info}>
              <Box flex="1">
                <Info
                  key={item.id}
                  title={title}
                  subtitle={subtitle}
                  description={message}
                  avatarText={initials}
                  avatarIcon={icon}
                  avatarBg={!!icon ? theme.palette.grey[300] : null}
                  avatarBorder={!!icon}
                  data-testid={`comment-${item.id}`}
                />
              </Box>
              <Box className={classes.info}>
                {canDeleteComment ? (
                  <Button
                    size="small"
                    variant="text"
                    color="primary"
                    icon={HighlightOffIcon}
                    onClick={() => handleDeleteComment(item.id)}
                    data-testid={`comment-delete-${item.id}`}
                  />
                ) : null}
              </Box>
            </Box>
          );
        })}
      </Collapse>

      <Box mt={3} mb={0.5}>
        <FormContainer onSubmit={handleSubmit(handlePostComment(reset))} className={classes.form} data-testid="form-comment">
          <Avatar text={utils.user.initials(user)} size={32} avatarClasses={classes.avatar} />
          <FormText
            {...field}
            control={control}
            muiComponentProps={{
              ...field.muiComponentProps,
              disabled: formState.isSubmitting,
            }}
          />
          <Button
            type="submit"
            text={<Translate label="app.send" />}
            color="primary"
            variant="contained"
            disabled={formState.isSubmitting || !formState.isValid}
            nestedClasses={{ btn: classes.submit }}
            data-testid="send-button"
          />
        </FormContainer>
      </Box>
    </div>
  );
}
