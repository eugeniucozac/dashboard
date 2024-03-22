import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import styles from './TreeView.styles';
import { Search, Status, Tooltip, Warning } from 'components';
import { DmsDocDetailsTooltip } from 'modules';
import * as utils from 'utils';

// mui
import { TreeView as TreeViewMui, TreeItem } from '@material-ui/lab';
import { Box, Typography, Divider, makeStyles } from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DescriptionIcon from '@material-ui/icons/Description';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

TreeView.propTypes = {
  title: PropTypes.string,
  rootRef: PropTypes.string,
  treeData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    labelInfo: PropTypes.string,
    children: PropTypes.array.isRequired,
  }),
  filteredData: PropTypes.arrayOf(PropTypes.object),
  defaultExpanded: PropTypes.arrayOf(PropTypes.string.isRequired),
  searchQuery: PropTypes.string,
  handlers: PropTypes.shape({
    submitSearch: PropTypes.func.isRequired,
    resetSearch: PropTypes.func.isRequired,
    rowClick: PropTypes.func.isRequired,
    onClickAccordion: PropTypes.func,
  }),
};

export default function TreeView({ title, rootRef, treeData, filteredData, defaultExpanded, searchQuery, handlers }) {
  const classes = makeStyles(styles, { name: 'TreeView' })();

  const renderContent = (node) => {
    return (
      <Box className={classes.treeItem}>
        <Box className={classes.column1}>
          <Typography component="div" className={classnames(classes.label, classes.file, { [classes.parent]: node.hasChildren })}>
            {node.labelInfo ? (
              <>
                {node.isUploadedOnGxb === 1 && (
                  <Status size="xxs" text={utils.string.t('app.gxb')} status="light" nestedClasses={{ root: classes.status }} />
                )}
                <span className={classes.name}>{node.label}</span>
              </>
            ) : (
              node.label
            )}
          </Typography>
        </Box>
        <Box className={classes.column2}>
          <Typography className={classnames([classes.label, classes.date])}>{node.labelInfo}</Typography>
        </Box>
      </Box>
    );
  };

  const renderItem = (node) => {
    // abort
    if (!utils.generic.isValidObject(node, 'label')) return;

    return (
      <>
        {node.labelInfo ? (
          <Tooltip title={<DmsDocDetailsTooltip data={node} />} className={classes.toolTipOuterWrapper} placement="bottom" arrow>
            {renderContent(node)}
          </Tooltip>
        ) : (
          renderContent(node)
        )}
      </>
    );
  };

  const renderTree = (node, parentId, idx) => {
    const hasChildren = !utils.generic.isInvalidOrEmptyArray(node?.children);

    return (
      <TreeItem
        key={node?.id || `${parentId}-${idx}`}
        nodeId={`${node?.id}`}
        label={renderItem({ ...node, hasChildren })}
        onClick={(e) => (!hasChildren ? handlers.rowClick(e, node) : null)}
        classes={{
          root: classes.treeItemRoot,
          label: classes.treeItemLabel,
        }}
      >
        {!hasChildren ? null : node?.children?.map((child, idx) => renderTree(child, node?.id, idx))}
      </TreeItem>
    );
  };

  return (
    <Box className={classes.root}>
      <Box display="flex" alignItems="center" mb={2.5}>
        <DescriptionIcon />
        <Typography variant="body1">{title}</Typography>
      </Box>
      <Box mb={3}>
        <Search
          text=""
          placeholder={utils.string.t('dms.view.searchDocuments')}
          submitButtonProps={{ size: 'small' }}
          minChars={3}
          nestedClasses={{
            btn: classes.searchBtn,
            inputPropsRoot: classes.searchRoot,
          }}
          handlers={{
            search: (args) => {
              handlers.submitSearch(args);
            },
            reset: () => {
              handlers.resetSearch();
            },
          }}
        />
      </Box>
      <Box>
        <Box display="flex">
          <Typography variant="body2" className={classnames([classes.column1, classes.header])}>
            {utils.string.t('dms.upload.file')}
          </Typography>
          <Typography variant="body2" className={classnames([classes.column2, classes.header])}>
            {utils.string.t('dms.upload.uploadedOn')}
          </Typography>
        </Box>

        <Divider className={classes.divider} />

        {searchQuery ? (
          !utils.generic.isInvalidOrEmptyArray(filteredData) ? (
            filteredData?.map((data) => {
              return renderItem(data);
            })
          ) : (
            <Box my={2}>
              <Warning text={utils.string.t('app.editableTableNoData')} type="info" align="center" size="small" icon />
            </Box>
          )
        ) : (
          <TreeViewMui
            aria-label="rich object"
            defaultExpanded={defaultExpanded}
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            onNodeSelect={handlers?.onClickAccordion}
          >
            {rootRef ? renderTree(treeData) : null}
          </TreeViewMui>
        )}
      </Box>
    </Box>
  );
}
