import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';

//app
import { FormContainer, FormFields, FormText, Button, FormGrid, Translate } from 'components';
import styles from './PremiumProcessingCaseNotes.styles';
import * as utils from 'utils';
import { premiumProcessingNoteSave } from 'stores';
import { NOTES_API_SUCCESS_STATUS, NOTES_STAGECODE } from 'consts';

// mui
import { makeStyles, Box, Grid, Divider, Typography } from '@material-ui/core';

PremiumProcessingCaseNotesView.propTypes = {
  taskId: PropTypes.string.isRequired,
  caseNotesHistory: PropTypes.array,
  enableSaveNotes: PropTypes.bool,
  fields: PropTypes.array,
  bpmStageName: PropTypes.arrayOf(
    PropTypes.shape({
      bpmStageCode: PropTypes.string.isRequired,
      bpmStageName: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default function PremiumProcessingCaseNotesView({ taskId, caseNotesHistory, enableSaveNotes, fields, bpmStageName }) {
  const classes = makeStyles(styles, { name: 'PremiumProcessingCaseNotes' })();
  const defaultValues = utils.form.getInitialValues(fields);
  const { control, errors, watch, reset } = useForm({ defaultValues });
  const dispatch = useDispatch();
  const notesFieldValue = watch('notesField');
  enableSaveNotes = notesFieldValue ? true : false;
  const notesLength = 150;
  const [expanded, setExpanded] = useState([]);
  const caseNotesHistoryDesc = orderBy(caseNotesHistory, ['commentedDate'], ['desc']);

  useEffect(() => {}, [enableSaveNotes, notesFieldValue]);
  const saveNotes = (noteComments) => {
    dispatch(premiumProcessingNoteSave({ comments: noteComments, taskId: taskId })).then((response) => {
      if (response?.status === NOTES_API_SUCCESS_STATUS) {
        reset('', 'notesField');
      }
    });
  };

  const handleClickExpandCollapse = (id, labelText) => () => {
    if (labelText === 'app.seeMore') {
      setExpanded([...expanded, id]);
    } else {
      setExpanded([...expanded?.filter((item) => item !== id)]);
    }
  };

  const toggle_button = (notesData, labelText) => (
    <Button
      size="xsmall"
      variant="text"
      text={<Translate label={labelText} />}
      onClick={handleClickExpandCollapse(notesData?.notesId, labelText)}
      nestedClasses={{ btn: classes.toggle, label: classes.label }}
    />
  );

  const notesMessageTruncated = (noteMsg) => {
    const isCollapsed = !expanded.includes(noteMsg.notesId);
    const isTruncated = noteMsg?.notes?.length > notesLength;
    if (isTruncated && isCollapsed) {
      return (
        <>
          {noteMsg?.notes.slice(0, notesLength - 20).trim()}
          ...
          {toggle_button(noteMsg, 'app.seeMore')}
        </>
      );
    } else {
      return (
        <>
          {noteMsg?.notes}
          {isTruncated && <>{toggle_button(noteMsg, 'app.seeLess')}</>}
        </>
      );
    }
  };

  const getStageName = (stageCodes) => {
    if (stageCodes !== NOTES_STAGECODE) {
      return bpmStageName?.find((bpmName) => bpmName?.bpmStageCode?.toString() === stageCodes?.toString())?.bpmStageName;
    }
  };

  return (
    <FormContainer>
      <FormFields>
        <FormText {...utils.form.getFieldProps(fields, 'notesField')} control={control} error={errors.notes} />
        <Grid item className={classes.noteSaveButton}>
          <Button
            color="primary"
            size="small"
            text={utils.string.t('premiumProcessing.caseSummary.saveNote')}
            onClick={() => {
              saveNotes(notesFieldValue);
            }}
            disabled={!enableSaveNotes}
          />
        </Grid>
      </FormFields>
      <FormGrid>
        {caseNotesHistoryDesc.length > 0 && (
          <Box data-testid="notes" marginTop={2}>
            {caseNotesHistoryDesc.map((note, idx) => {
              const bpmStageNames = getStageName(note.stageCode);
              return (
                <Box key={note.notesId}>
                  <Box py={2}>
                    <FormGrid container alignItems="center" justify="flex-start" spacing={1}>
                      <FormGrid item>
                        {note.stageCode === NOTES_STAGECODE && (
                          <Typography className={classes.noteStatus}>
                            {utils.string.t('premiumProcessing.stage')}:{' '}
                            {utils.string.t('premiumProcessing.caseDetailsSection.processingInstruction')}
                          </Typography>
                        )}
                        {note.stageCode !== NOTES_STAGECODE && (
                          <Typography className={classes.noteStatus}>
                            {utils.string.t('premiumProcessing.stage')}: {bpmStageNames}
                          </Typography>
                        )}
                      </FormGrid>
                    </FormGrid>
                    <Box pb={2}>
                      <Typography className={classes.textDescription}>{notesMessageTruncated(note)}</Typography>
                    </Box>
                    <Box className={classes.noteUpdatedBy}>
                      {utils.string.t('premiumProcessing.commentedBy')} {note.commentedBy} ({note.roleName}) -{note.commentedDate}
                    </Box>
                  </Box>
                  {idx !== caseNotesHistory.length - 1 && <Divider />}
                </Box>
              );
            })}
          </Box>
        )}
      </FormGrid>
    </FormContainer>
  );
}
