import React from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';

// app
import { FormPopoverMenuRHF, FormFileDrop, Info } from 'components';
import * as utils from 'utils';
import styles from './DocumentAutoUpload.styles';

// mui
import DescriptionIcon from '@material-ui/icons/Description';
import { makeStyles, Divider } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

DocumentAutoUploadView.propTypes = {
  folders: PropTypes.array.isRequired,
  folderValue: PropTypes.string.isRequired,
  link: PropTypes.string,
  divider: PropTypes.bool,
  onUpdateFolderValue: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export function DocumentAutoUploadView({ link, folders, folderValue, onSubmit, onUpdateFolderValue, divider }) {
  const classes = makeStyles(styles, { name: 'DocumentAutoUpload' })();
  const { control, setValue, getValues } = useForm({ defaultValues: { folder: folderValue } });

  return (
    <form className={classes.form}>
      {divider && <Divider className={classes.divider} />}
      <Info
        link={link}
        title={utils.string.t('placement.document.title')}
        avatarIcon={DescriptionIcon}
        content={
          <FormPopoverMenuRHF
            control={control}
            name="folder"
            offset
            placeholder={utils.string.t('app.select')}
            text={utils.form.getLabelById(folders, folderValue)}
            size="small"
            icon={ArrowDropDownIcon}
            iconPosition="right"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            nestedClasses={{ btn: classes.popoverButton }}
            items={folders.map(({ id, label }) => ({
              id,
              label,
              callback: () => {
                onUpdateFolderValue(id);
                setValue('folder', id);
              },
            }))}
          />
        }
      />
      <FormFileDrop
        control={control}
        showUploadPreview={false}
        dragLabel={utils.string.t('form.dragDrop.dragFileEmailHere')}
        onChange={(file) => {
          setValue('file', file);
          onSubmit(getValues());
        }}
        name="file"
      />
    </form>
  );
}
