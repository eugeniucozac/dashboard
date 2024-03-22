import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

// app
import styles from './DmsUploadMetaData.styles';
import { Accordion, FormGrid, Info } from 'components';
import * as utils from 'utils';
import * as constants from 'consts';
import config from 'config';

// mui
import { Box, Typography, makeStyles } from '@material-ui/core';

DmsUploadMetaDataView.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  dmsContext: PropTypes.string.isRequired,
  preUploadMetaData: PropTypes.object,
  postUploadMetaData: PropTypes.array,
  filesSubmitted: PropTypes.bool,
};

export function DmsUploadMetaDataView({ isLoading, dmsContext, preUploadMetaData, postUploadMetaData, filesSubmitted }) {
  const classes = makeStyles(styles, { name: 'DmsUploadMetaData' })();

  const { commonInfo, lossInfo, claimInfo, policyInfo } = preUploadMetaData;
  const isClaimContext = dmsContext === constants.DMS_CONTEXT_CLAIM;

  return (
    <Box className={classes.root}>
      <Accordion isDataLoading={isLoading} title={<Typography> {utils.string.t('dms.upload.modalItems.viewData')}</Typography>}>
        {!isLoading && (
          <Box width="100%">
            <Box className={classes.boxView}>
              <Typography className={classes.subTitle}>{utils.string.t('dms.upload.commonInfoSection.commonInfo')}</Typography>
              <FormGrid container spacing={3}>
                {commonInfo?.map(({ name, value, id }) => (
                  <FormGrid key={id} item xs={12} sm={4} md={3}>
                    <Info title={name} description={value} nestedClasses={{ root: classes.info }} />
                  </FormGrid>
                ))}

                {filesSubmitted &&
                  utils.generic.isValidArray(postUploadMetaData, true) &&
                  postUploadMetaData.map((eachFileMetaData, ind) => {
                    const { createdDate, documentVersion, createdByName, fileLastModifiedDate, documentUploaded } = eachFileMetaData;
                    return (
                      <Fragment key={ind}>
                        {documentUploaded && (
                          <>
                            {createdDate && (
                              <FormGrid item xs={12} sm={4} md={3}>
                                <Info
                                  title={utils.string.t('dms.upload.commonUploadInfoSection.documentCreatedOn')}
                                  description={`${utils.string.t('format.date', {
                                    value: { date: createdDate, format: config.ui.format.date.text },
                                  })}`}
                                  nestedClasses={{ root: classes.info }}
                                />
                              </FormGrid>
                            )}

                            {documentVersion && (
                              <FormGrid item xs={12} sm={4} md={3}>
                                <Info
                                  title={utils.string.t('dms.upload.commonUploadInfoSection.documentVersion')}
                                  description={documentVersion}
                                  nestedClasses={{ root: classes.info }}
                                />
                              </FormGrid>
                            )}

                            {createdByName && (
                              <FormGrid item xs={12} sm={4} md={3}>
                                <Info
                                  title={utils.string.t('dms.upload.commonUploadInfoSection.documentUploadedBy')}
                                  description={createdByName}
                                  nestedClasses={{ root: classes.info }}
                                />
                              </FormGrid>
                            )}
                            {fileLastModifiedDate && (
                              <FormGrid item xs={12} sm={4} md={3}>
                                <Info
                                  title={utils.string.t('dms.upload.commonUploadInfoSection.documentModifiedOn')}
                                  description={`${utils.string.t('format.date', {
                                    value: { date: fileLastModifiedDate, format: config.ui.format.date.text },
                                  })}`}
                                  nestedClasses={{ root: classes.info }}
                                />
                              </FormGrid>
                            )}
                          </>
                        )}
                      </Fragment>
                    );
                  })}
              </FormGrid>
            </Box>

            {isClaimContext && (
              <Box className={classes.boxView} mt={2}>
                <Typography className={classes.subTitle}>{utils.string.t('dms.upload.claimInfoSection.claimDetails')}</Typography>
                <FormGrid container spacing={3}>
                  {claimInfo?.map(({ name, value, id }) => (
                    <FormGrid key={id} item xs={12} sm={4} md={3}>
                      <Info title={name} description={value} nestedClasses={{ root: classes.info }} />
                    </FormGrid>
                  ))}
                </FormGrid>
              </Box>
            )}

            {(isClaimContext || dmsContext === constants.DMS_CONTEXT_LOSS) && (
              <Box className={classes.boxView} mt={2}>
                <Typography className={classes.subTitle}>{utils.string.t('dms.upload.lossInfoSection.lossDetails')}</Typography>
                <FormGrid container spacing={3}>
                  {lossInfo?.map(({ name, value, id }) => (
                    <FormGrid key={id} item xs={12} sm={4} md={3}>
                      <Info title={name} description={value} nestedClasses={{ root: classes.info }} />
                    </FormGrid>
                  ))}
                </FormGrid>
              </Box>
            )}

            {(dmsContext === constants.DMS_CONTEXT_PROCESSING_INSTRUCTION ||
              dmsContext === constants.DMS_CONTEXT_POLICY ||
              dmsContext === constants.DMS_CONTEXT_CASE) && (
              <Box className={classes.boxView} mt={2}>
                <Typography className={classes.subTitle}>{utils.string.t('dms.upload.policyInfoSection.policyDetails')}</Typography>
                <FormGrid container spacing={3}>
                  {policyInfo?.map(({ name, value, id }) => (
                    <FormGrid key={id} item xs={12} sm={4} md={3}>
                      <Info title={name} description={value} nestedClasses={{ root: classes.info }} />
                    </FormGrid>
                  ))}
                </FormGrid>
              </Box>
            )}
          </Box>
        )}
      </Accordion>
    </Box>
  );
}
