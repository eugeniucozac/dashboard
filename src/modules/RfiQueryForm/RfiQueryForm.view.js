import React, { useState } from 'react';
import PropTypes from 'prop-types';

//app
import * as utils from 'utils';
import { FormAutocompleteMui, FormContainer, FormFields, FormGrid, FormLabel, FormText, Button, Link, Loader, Info } from 'components';
import styles from './RfiQueryForm.styles';
import { useFormActions } from 'hooks';

//mui
import { makeStyles, Typography, Box } from '@material-ui/core';
import DescriptionIcon from '@material-ui/icons/Description';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

RfiQueryFormView.propTypes = {
  fields: PropTypes.array.isRequired,
  actions: PropTypes.array.isRequired,
  formProps: PropTypes.shape({
    control: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    formState: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
  }),
  resetKey: PropTypes.number,
  documentNameList: PropTypes.array,
  isUploading: PropTypes.bool,
  isLinking: PropTypes.bool,
  handlers: PropTypes.shape({
    handleAttachDocuments: PropTypes.func,
    confirmDocumentDelete: PropTypes.func,
  }),
};

export function RfiQueryFormView({ actions, fields, formProps, resetKey, documentNameList, isUploading, isLinking, handlers }) {
  const classes = makeStyles(styles, { name: 'RfiQueryForm' })();

  const { control, errors, formState, handleSubmit, reset } = formProps;
  const { secondary, submit } = useFormActions(actions, reset);

  const [expanded, setExpanded] = useState(false);
  const DOCUMENTS_COLLAPSE_COUNT = 5;

  const handleClickExpandCollapse = (isExpand) => {
    if(isExpand) {
      setExpanded(true);
    } else {
      setExpanded(false);
    }
  };

  const checkExpandCollapseDocuments = (documentList) => {
    let isCollapsed = !expanded;
    const isTruncated = documentList?.length > DOCUMENTS_COLLAPSE_COUNT;
    if (isTruncated && isCollapsed) {
      const truncatedList = [...documentList?.slice(0, DOCUMENTS_COLLAPSE_COUNT)];
      const pendingDocList = documentList?.length - truncatedList?.length;
      return (
        <>
          <Box className={classes.attachedDocumentContainer}>
            {truncatedList?.map((document, index) => (
              <Box display="flex" pr={2} key={index}>
                {(isUploading || isLinking) && (
                  <Box alignSelf="center" mr={1}>
                    <Loader inline mr={2} />
                  </Box>
                )}
                <Info size="md" avatarIcon={DescriptionIcon} description={document} verticalAlign={true} avatarBorder={false} />
                <Button
                  icon={HighlightOffIcon}
                  variant="text"
                  danger={false}
                  size="small"
                  onClick={() => handlers.confirmDocumentDelete(index)}
                />
              </Box>
            ))}
          </Box>
          <Box className={classes.expandBtn}>
            <Link
              text={`${utils.string.t('app.seeMore')} (${pendingDocList})`}
              color="secondary"
              onClick={() => handleClickExpandCollapse(true)}
            />
          </Box>
        </>
      );
    } else {
      return (
        <>
          <Box className={classes.attachedDocumentContainer}>
            {documentList?.map((document, index) => (
              <Box display="flex" mb={1} pr={3} key={index}>
                {(isUploading || isLinking) && (
                  <Box alignSelf="center" mr={1}>
                    <Loader inline mr={2} />
                  </Box>
                )}
                <Info size="md" avatarIcon={DescriptionIcon} description={document} verticalAlign={true} avatarBorder={false} />
                <Button
                  icon={HighlightOffIcon}
                  variant="text"
                  danger={false}
                  size="small"
                  onClick={() => handlers.confirmDocumentDelete(index)}
                />
              </Box>
            ))}
          </Box>
          {isTruncated && (
            <Box className={classes.collapseBtn}>
              <Link
                text={utils.string.t('app.seeLess')}
                color="secondary"
                onClick={() => handleClickExpandCollapse(false)}
              />
            </Box>
          )}
        </>
      );
    }
  };

  return (
    <div className={classes.root}>
      <FormContainer type="dialog" onSubmit={handleSubmit}>
        <FormFields type="dialog">
          <FormGrid container alignItems="center" nestedClasses={{ root: classes.fullWidth }}>
            <FormGrid item xs={2}>
              <Typography variant="h5" className={classes.sectionheader}>
                {utils.string.t('claims.processing.taskFunction.rfiTypeYourReply')}
              </Typography>
            </FormGrid>
            <FormGrid container item xs={10} alignItems="center">
              <FormGrid item xs={8}>
                <FormLabel label={`${utils.string.t('claims.columns.createRFIColumns.sendTo')} *`} align="right" />
              </FormGrid>
              <FormGrid item xs={4} key={resetKey}>
                <FormAutocompleteMui
                  {...utils.form.getFieldProps(fields, 'sendTo', control)}
                  error={errors.sendTo}
                  nestedClasses={{ root: classes.catCodeSelect }}
                />
              </FormGrid>
            </FormGrid>
          </FormGrid>
          <FormGrid item xs={12} sm={12}>
            <FormGrid container nestedClasses={{ root: classes.descriptionBox }}>
              <FormGrid item xs={12}>
                <FormText {...utils.form.getFieldProps(fields, 'description', control, errors)} />
              </FormGrid>
            </FormGrid>
          </FormGrid>
        </FormFields>

        {!utils.generic.isInvalidOrEmptyArray(documentNameList) && (
          <Box display="flex" alignItems="center" pl={4}>
            <Typography variant="body1">Documents</Typography>
          </Box>
        )}

        {!utils.generic.isInvalidOrEmptyArray(documentNameList) && (
          <Box display="flex" width="100%" pl={2}>
            {checkExpandCollapseDocuments(documentNameList)}
          </Box>
        )}

        <Box display="flex" pl={4}>
          <Link text={utils.string.t('claims.rfiDashboard.attachDocuments')} color="secondary" onClick={handlers.handleAttachDocuments} />
        </Box>
        <Box mt={1} display="flex" alignItems="flex-start" className={classes.replyBtnContainer}>
          <Box flexShrink={0}>
            <Button
              text={submit.label}
              type="submit"
              disabled={formState.isSubmitting}
              onClick={handleSubmit(submit.handler)}
              color="primary"
            />
            <Button
              ml={1}
              text={secondary.label}
              variant="outlined"
              size="medium"
              disabled={secondary.disabled || formState.isSubmitting}
              onClick={secondary.handler}
              nestedClasses={{ btn: classes.closeBtn }}
            />
          </Box>
        </Box>
      </FormContainer>
    </div>
  );
}
