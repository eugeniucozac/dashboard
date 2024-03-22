import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

// app
import styles from './PDFComments.styles';
import * as utils from 'utils';
import { Translate } from 'components';

// mui
import { TableRow, TableCell, makeStyles, Table, TableBody } from '@material-ui/core';

PDFCommentsView.propTypes = {
  comments: PropTypes.array,
  subjectivities: PropTypes.string,
  title: PropTypes.string,
};

export function PDFCommentsView({ comments, subjectivities, title }) {
  const classes = makeStyles(styles, { name: 'PDFComments' })();

  return (
    <div className={classes.root}>
      <Translate label={title} variant="h3" />
      <Table>
        <TableBody>
          {subjectivities ? (
            <TableRow className={classes.row}>
              <TableCell colSpan={4}>
                <p className={classes.title}>{utils.string.t('placement.sheet.subjectivities')}</p>
                <p data-testid={`pdf-subjectivities`}>{subjectivities}</p>
              </TableCell>
            </TableRow>
          ) : null}
          {comments.length > 0 ? (
            <TableRow className={classes.row}>
              <TableCell colSpan={4}>
                <p className={classes.title}>{utils.string.t('placement.sheet.comments')}</p>
                {comments.map((item, index) => {
                  const author = utils.user.fullname(item.user) || null;
                  const date = item.date ? utils.string.t('format.date', { value: { date: item.date } }) : null;
                  if (!item.message) return null;
                  return (
                    <Fragment key={`pdf-comment-${index}`}>
                      <div data-testid={`pdf-comment-${index}`} className={classes.message}>
                        {item.message}
                        {author && date && (
                          <>
                            {' '}
                            <span className={classes.author}>
                              - {author}, {date}
                            </span>
                          </>
                        )}
                      </div>
                    </Fragment>
                  );
                })}
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </div>
  );
}
