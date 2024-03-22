import React from 'react';
import { useForm } from 'react-hook-form';

//app
import * as utils from 'utils';
import { Button, FormContainer, FormFields, FormGrid, FormActions, FormFileDrop } from 'components';
import { EnterClaimCardInformation, ClaimsUnderwritingGroups, ClaimsMovementType } from 'modules';
import styles from './EditClaimInformation.styles';

//mui
import { makeStyles } from '@material-ui/core';

export function EditClaimInformationView({ actions }) {
  const classes = makeStyles(styles, { name: 'EditClaimInformation' })();
  const { control } = useForm({});

  const cancel = actions && actions.find((action) => action.name === 'cancel');
  const save = actions && actions.find((action) => action.name === 'save');

  return (
    <div className={classes.root}>
      <FormContainer type="dialog">
        <FormFields type="dialog">
          <FormGrid container>
            <FormGrid item xs={12}>
              <EnterClaimCardInformation />
            </FormGrid>
            <FormGrid item xs={12} md={7}>
              <ClaimsUnderwritingGroups />
            </FormGrid>
            <FormGrid item xs={12} md={5}>
              <ClaimsMovementType />
            </FormGrid>
            <FormGrid item xs={12}>
              <FormGrid container>
                <FormGrid item xs={6}>
                  <FormFileDrop
                    name="file"
                    control={control}
                    attachedFiles=""
                    showUploadPreview={false}
                    componentProps={{
                      multiple: true,
                    }}
                    dragLabel="Drag &amp; Drop GXB"
                    onChange={() => {}}
                  />
                </FormGrid>
                <FormGrid item xs={6}>
                  <FormFileDrop
                    name="file"
                    control={control}
                    attachedFiles=""
                    showUploadPreview={false}
                    componentProps={{
                      multiple: true,
                    }}
                    dragLabel={utils.string.t('dms.upload.fileUploadTitle')}
                    onChange={() => {}}
                  />
                </FormGrid>
              </FormGrid>
            </FormGrid>
          </FormGrid>
        </FormFields>
      </FormContainer>
      <FormActions type="dialog">
        {cancel && <Button text={utils.string.t('app.cancel')} variant="contained" color="primary" onClick={() => {}} />}
        {save && <Button text={utils.string.t('app.save')} type="submit" color="primary" />}
      </FormActions>
    </div>
  );
}
