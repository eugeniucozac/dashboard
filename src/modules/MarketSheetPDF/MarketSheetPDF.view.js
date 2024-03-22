import React from 'react';
import PropTypes from 'prop-types';

// app
import * as utils from 'utils';
import styles from './MarketSheetPDF.styles';
import { MarketSheetTable } from 'modules';
import { Mudmap, Translate, ChartKey, PDFPage, PDFDocument, PDFSummary, PDFComments } from 'components';

// mui
import { makeStyles } from '@material-ui/core';

MarketSheetPDFView.propTypes = {
  placementInfo: PropTypes.object.isRequired,
  pages: PropTypes.array.isRequired,
  yearObj: PropTypes.object.isRequired,
  mudmapConfig: PropTypes.object.isRequired,
  formValues: PropTypes.object.isRequired,
};

export function MarketSheetPDFView({ placementInfo, pages, yearObj, mudmapConfig, formValues }) {
  const classes = makeStyles(styles, { name: 'MarketSheetPDF' })();
  const pageCount = pages.length + 1;
  const year = utils.date.today('YYYY');
  const title = `${utils.string.t('placement.sheet.submissionUpdate')} ${year}`;

  return (
    <div>
      <PDFDocument subtitle={title} title={placementInfo.insureds}>
        <PDFPage pageCount={pageCount} pageNo={1}>
          <PDFSummary placementInfo={placementInfo} introduction={formValues.introduction} />
        </PDFPage>
        {pages.map((page, index) => (
          <PDFPage key={index} pageCount={pageCount} pageNo={index + 2}>
            <Translate className={classes.businessName} label={page.title} variant="h2" />
            {page.mudmap && (
              <div className={classes.mudmapContainer}>
                <div className={classes.mudmapRotate}>
                  <Mudmap items={page.mudmap} capacities={mudmapConfig.capacities} type="written" />
                  <ChartKey
                    noBorder={true}
                    size="xsmall"
                    avatarSize={12}
                    items={mudmapConfig.capacities.map((c) => {
                      return {
                        id: c.id,
                        color: c.color,
                        label: c.name,
                      };
                    })}
                    title={utils.string.t('mudmap.capacityType_plural')}
                    testid="capacity-types"
                    nestedClasses={{
                      root: classes.chartKey,
                    }}
                  />
                </div>
              </div>
            )}
            {page.policies && (
              <MarketSheetTable
                printView={true}
                year={yearObj.id}
                option="all"
                rowLimit={20}
                policies={page.policies}
                capacities={mudmapConfig.capacities}
              />
            )}
            {utils.generic.isValidArray(page.notes) && page.notes.map((note, index) => <PDFComments key={index} {...note} />)}
          </PDFPage>
        ))}
      </PDFDocument>
    </div>
  );
}
