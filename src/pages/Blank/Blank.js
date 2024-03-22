/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import get from 'lodash/get';
import classnames from 'classnames';
import { AutoSizer, Column, Table as RvTable } from 'react-virtualized';

// app
import {
  DmsSearch,
  Layout,
  SectionHeader,
  TableHead,
  TableCell,
  Tooltip,
  Button,
  FilterBar,
  InfiniteScroll,
  TimelineComponent,
  LazyLoadingList
} from 'components';
import * as constants from 'consts';
import styles from './Blank.styles';
import { expandSidebar, viewDocumentsDownload, getProcessingInstructionsGridData } from 'stores';
import * as utils from 'utils';

// mui
import {
  makeStyles,
  Box,
  Typography,
  Dialog,
  Divider,
  AppBar,
  IconButton,
  Toolbar,
  Slide,
  DialogContent,
  DialogTitle,
  Grid,
  Table,
  TableBody,
  TableRow,
  Checkbox,
  TextField,
  TableContainer,
  Select,
  MenuItem,
  Paper,
  TableCell as MuiTableCell,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import BugReportIcon from '@material-ui/icons/BugReport';
import Stepper from '@material-ui/core/Stepper';
import LinearProgress from '@material-ui/core/LinearProgress';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import CloseIcon from '@material-ui/icons/Close';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import FastfoodIcon from '@material-ui/icons/Fastfood';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export function Blank() {
  const dispatch = useDispatch();

  const classes = makeStyles(styles, { name: 'Blank' })();

  const [url, setUrl] = useState('');
  const dms = {
    context: constants.DMS_CONTEXT_LOSS,
    source: 5,
  };
  const uiSidebarExpanded = useSelector((state) => get(state, 'ui.sidebar.expanded'));
  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      label={
        <Box style={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }}>
          <Typography variant="body2" style={{ flex: '0.8', fontWeight: 'inherit', flexGrow: 1 }}>
            <Tooltip
              title={
                <Box p={2}>
                  <Box>
                    {nodes.name} {`With Contact Info`}
                  </Box>
                  <Box mt={2}>{`Doc Type : Claim => Correspondence (Adjustments)`}</Box>
                  <Box mt={2}>{`Originally Created on :${nodes.date}`}</Box>
                </Box>
              }
              placement={'top'}
              arrow={true}
            >
              {nodes.name}
            </Tooltip>
          </Typography>
          <Typography style={{ flex: '0.4' }} variant="caption" color="inherit">
            <Tooltip title={`Heyyyyyy`} placement={'top'} arrow={true}>
              {nodes.date}
            </Tooltip>
          </Typography>
        </Box>
      }
    >
      {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
    </TreeItem>
  );
  const referenceId = 'AE00610';
  const [open, setOpen] = React.useState(false);
  const steps = ['General', 'Aircraft', 'Pilot', 'Coverages', 'Confirmation'];

  const [stepFields, setStepFields] = useState(steps);
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  const searchFields = [
    {
      name: 'query',
      type: 'text',
      placeholder: 'Search Documents',
      defaultValue: '',
      gridSize: { xs: 12 },
      muiComponentProps: {
        autoComplete: 'off',
        'data-testid': 'search-field',
      },
    },
  ];
  const searchActions = [
    {
      name: 'filter',
      label: utils.string.t('app.searchLabel'),
      handler: (values) => { },
    },
    {
      name: 'reset',
      label: utils.string.t('app.reset'),
      handler: {},
    },
  ];
  const data = {
    id: 'root',
    name: 'Loss Reference 47001',
    date: '',
    children: [
      {
        id: '1',
        name: 'Q-Core Primary',
        date: '13 Nov 2021',
      },
      {
        id: '2',
        name: '20170606 Initial Advice',
        date: '22 Nov 2021',
      },
      {
        id: '3',
        name: '20170606 Initial Advice',
        date: '22 Nov 2021',
      },
      {
        id: '4',
        name: '20170606 Initial Advice',
        date: '22 Nov 2021',
      },
      {
        id: '5',
        name: '20170606 Initial Advice',
        date: '22 Nov 2021',
      },
      {
        id: '6',
        name: '20170606 Initial Advice',
        date: '22 Nov 2021',
      },
      {
        id: '7',
        name: '20170606 Initial Advice',
        date: '22 Nov 2021',
      },
      {
        id: '8',
        name: '20170606 Initial Advice',
        date: '22 Nov 2021',
      },
      {
        id: '9',
        name: 'Claim 04063',
        date: '',
        children: [
          {
            id: '10',
            name: '20173453 Attorney',
            date: '12 Sep 2020',
          },
          {
            id: '11',
            name: '20173453 Attorney',
            date: '12 Sep 2020',
          },
          {
            id: '12',
            name: '20173453 Attorney',
            date: '12 Sep 2020',
          },
          {
            id: '13',
            name: '20173453 Attorney',
            date: '12 Sep 2020',
          },
          {
            id: '14',
            name: '20173453 Attorney',
            date: '12 Sep 2020',
          },
          {
            id: '15',
            name: '20173453 Attorney',
            date: '12 Sep 2020',
          },
        ],
      },
      {
        id: '16',
        name: 'Claim 5473',
        date: '',
        children: [
          {
            id: '17',
            name: '20173453 Attorney',
            date: '12 Sep 2020',
          },
          {
            id: '18',
            name: '20173453 Attorney',
            date: '12 Sep 2020',
          },
          {
            id: '19',
            name: '20173453 Attorney',
            date: '12 Sep 2020',
          },
          {
            id: '20',
            name: '20173453 Attorney',
            date: '12 Sep 2020',
          },
          {
            id: '21',
            name: '20173453 Attorney',
            date: '12 Sep 2020',
          },
          {
            id: '22',
            name: '20173453 Attorney',
            date: '12 Sep 2020',
          },
          {
            id: '23',
            name: '20173453 Attorney',
            date: '12 Sep 2020',
          },
          {
            id: '24',
            name: '20173453 Attorney',
            date: '12 Sep 2020',
          },
          {
            id: '25',
            name: '20173453 Attorney',
            date: '12 Sep 2020',
          },
          {
            id: '26',
            name: '20173453 Attorney',
            date: '12 Sep 2020',
          },
          {
            id: '27',
            name: '20173453 Attorney',
            date: '12 Sep 2020',
          },
          {
            id: '28',
            name: '20173453 Attorney',
            date: '12 Sep 2020',
          },
          {
            id: '29',
            name: '20173453 Attorney',
            date: '12 Sep 2020',
          },
          {
            id: '30',
            name: '20173453 Attorney',
            date: '12 Sep 2020',
          },
          {
            id: '31',
            name: '20173453 Attorney',
            date: '12 Sep 2020',
          },
          {
            id: '32',
            name: '20173453 Attorney',
            date: '12 Sep 2020',
          },
          {
            id: '33',
            name: '20173453 Attorney',
            date: '12 Sep 2020',
          },
          {
            id: '34',
            name: '20173453 Attorney',
            date: '12 Sep 2020',
          },
        ],
      },
    ],
  };

  useEffect(() => {
    dispatch(viewDocumentsDownload({ documentId: 1264026, documentName: 'test.docx' })).then((url) => setUrl(url));
    dispatch(expandSidebar());
    setStepFields(steps);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setProgress(activeStep ? (activeStep / stepFields.length) * 100 : 0);
  }, [activeStep]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleStep = (step) => () => {
    setActiveStep(step);
  };
  const cols = [
    { id: 'taskRef1', label: '' },
    { id: 'taskRef2', label: 'Contract/Policy Ref' },
    { id: 'taskRef3', label: 'Policy Status' },
    { id: 'taskRef4', label: 'Insured' },
    { id: 'taskRef5', label: 'Reinsured' },
    { id: 'taskRef6', label: 'Client' },
    { id: 'taskRef7', label: 'Inception Date' },
    { id: 'taskRef8', label: 'Expiry Date' },
    { id: 'taskRef9', label: 'Risk Details' },
    { id: 'taskRef10', label: 'Division' },
  ];

  let fileds = {
    arrayItemDef: [
      { id: 'id', type: 'label', value: '', width: 10, label: '', visable: false },
      { id: 'taskRef2', type: 'text', value: '', width: 120, label: 'Facility Reference	', disabled: true },
      { id: 'taskRef3', type: 'text', value: '', width: 120, ellipsis: true, label: 'Gross Premium (100%)' },
      { id: 'taskRef4', type: 'text', value: '', width: 80, label: 'Slip Order' },
      { id: 'taskRef5', type: 'text', value: '', width: 80, label: 'Total Brokerage' },
      { id: 'taskRef6', type: 'text', value: '', width: 120, label: 'Client Discount (%)' },
      { id: 'taskRef7', type: 'text', value: '', width: 120, label: 'Third Party Commission Sharing (%)' },
      { id: 'taskRef8', type: 'text', value: '', width: 120, label: 'Third party name' },
      { id: 'taskRef9', type: 'text', value: '', width: 120, label: 'PF Internal Commission Sharing (%)' },
      { id: 'taskRef10', type: 'text', value: '', width: 120, label: 'PF Internal Department' },
      { id: 'taskRef11', type: 'text', value: '', width: 120, label: 'Retained Brokerage' },
      { id: 'total', type: 'label', value: '', width: 80, label: 'Total' },
      { id: 'taskRef13', type: 'text', value: '', width: 80, label: 'Fees' },
      { id: 'taskRef14', type: 'text', value: '', width: 80, label: 'Other Deductions (eg. Taxes)' },
      { id: 'taskRef15', type: 'text', value: '', width: 120, label: 'Settlement Currency' },
      { id: 'taskRef16', type: 'text', value: '', width: 80, label: 'Payment Basis' },
      { id: 'taskRef17', type: 'text', value: '', width: 80, label: 'PPW/PPC' },
      { id: 'copyAction', type: 'copyIcon', value: '', width: 80, label: '' },
    ],
    fieldData: [],
  };
  const [dataTableData, setDataTableData] = useState(fileds?.fieldData);

  const [rowNumber, setRowNumber] = useState(10);
  const list = Array(30000)
    .fill()
    .map((val, idx) => {
      return {
        id: idx,
        time: idx,
        activity: (idx % 2 === 0 && 'EAT') || 'SLEEP',
        description: (idx % 2 === 0 && 'I am eating') || 'I am sleeping',
      };
    });

  const timelineData = {
    align: 'alternate',
    isVirtualized: true,
    contentItems: Array(10)
      .fill()
      .map((val, idx) => {
        return {
          isOppositeContent: true,
          isTimeLineDotVarient: 'outlined',
          isTimeLineConnector: true,
          isDotIcon: true,
          isElevation: 3,
          isTimeLineDotIcon: <FastfoodIcon />,
          oppositeContent: (
            <>
              <Typography variant="body2" color="textSecondary">
                {idx}
              </Typography>
            </>
          ),
          content: (
            <>
              <Typography variant="h6" component="h1">
                {(idx % 2 === 0 && 'EAT') || 'SLEEP'}
              </Typography>
              <Typography>{(idx % 2 === 0 && 'I am eating') || 'I am sleeping'}</Typography>
            </>
          ),
        };
      }),
  };

  useEffect(() => {
    let dataObject = [];
    for (let index = 0; index < rowNumber; index++) {
      dataObject.push({
        id: index + 1,
        isRowSelected: false,
        taskRef1: '',
        taskRef2: `Reference-${index + 1}`,
        taskRef3: '',
        taskRef4: '',
        taskRef5: '',
        taskRef6: '',
        taskRef7: '',
        taskRef8: '',
        taskRef9: '',
        taskRef10: '',
        taskRef11: '',
        taskRef12: '',
        taskRef13: '',
        taskRef14: '',
        taskRef15: '',
        taskRef16: '',
        taskRef17: '',
        taskRef18: '',
      });
    }

    setDataTableData(dataObject);
  }, [rowNumber]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e, row, column, name) => {
    e.preventDefault();
    setDataTableData((prevState) => prevState.map((dd) => (dd.id === row.id ? { ...dd, [name]: e?.target?.value } : dd)));
  };

  const handleCheckboxClik = (e, row) => {
    if (!row.isRowSelected) {
      e.preventDefault();
      setDataTableData((prevState) =>
        prevState.map((dd) => (dd.id === row.id ? { ...dd, isRowSelected: true } : { ...dd, isRowSelected: false }))
      );
    }
  };

  const handleRow = (e) => {
    e.preventDefault();
    setRowNumber(e?.target?.value);
  };
  const [selectedValue, setselectedValue] = useState('USD');
  const selectOptions = [
    { id: 'EUR', value: 'EUR', label: 'EUR' },
    { id: 'GBP', value: 'GBP', label: 'GBP' },
    { id: 'USD', value: 'USD', label: 'USD' },
    { id: 'AED', value: 'AED', label: 'AED' },
    { id: 'AUD', value: 'AUD', label: 'AUD' },
    { id: 'CAD', value: 'CAD', label: 'CAD' },
    { id: 'CHF', value: 'CHF', label: 'CHF' },
  ];

  const dummyTable1 = [
    { id: 'taskRef1', type: 'checkbox', value: '', width: 50, label: 'Select' },
    { id: 'taskRef2', type: 'text', value: '', width: 120, label: 'Facility Reference	', disabled: true },
    { id: 'taskRef3', type: 'text', value: '', width: 120, ellipsis: true, label: 'Gross Premium (100%)' },
    { id: 'taskRef4', type: 'text', value: '', width: 120, ellipsis: true, label: ' Slip Order' },
  ];

  const temporarilytableData = [
    {
      tableNo: 'Table 1',
      rows: [
        { rowNo: 'Row 1', cells: ['1', '2', '3', '10'] },
        { rowNo: 'Row 2', cells: ['4', '5', '6', '15'] },
        { rowNo: 'Row 3', cells: ['7', '8', '9', '20'] },
        { rowNo: 'Row 4', cells: ['10', '11', '12', '25'] },
      ],
    },
    {
      tableNo: 'Table 2',
      rows: [
        { rowNo: 'Row 5', cells: ['13', '14', '15', '30'] },
        { rowNo: 'Row 6', cells: ['16', '17', '18', '35'] },
        { rowNo: 'Row 7', cells: ['19', '20', '21', '40'] },
        { rowNo: 'Row 8', cells: ['22', '23', '24', '45'] },
      ],
    },
  ];

  const [tableData, setTableData] = useState(temporarilytableData);

  const dragItem = useRef();
  const dragItemNode = useRef();

  const handleDragStart = (e, item) => {
    dragItem.current = item;

    dragItemNode.current = e.target;

    dragItemNode.current.addEventListener('Draged Item', handleDragEnd);
  };

  const handleDrop = (e, targetItem) => {
    e.preventDefault();
    const currentItem = dragItem.current;
    if (e.target !== dragItemNode.current) {
      setTableData((oldTableData) => {
        let newTableData = JSON.parse(JSON.stringify(oldTableData));

        newTableData[targetItem.tableIndex].rows.splice(
          targetItem.rowIndex,
          0,
          newTableData[currentItem.tableIndex].rows.splice(currentItem.rowIndex, 1)[0]
        );
        dragItem.current = targetItem;

        return newTableData;
      });
    }
  };

  const handleDragEnd = (e) => {
    e.preventDefault();
    dragItem.current = null;
    dragItemNode.current.removeEventListener('Draged Item', handleDragEnd);

    dragItemNode.current = null;
  };

  /***************************************** VIRTUALIZED TABLE IMPLEMENTATION *************************************************/

  const headerRenderer = ({ label, columnIndex }) => {
    return (
      <MuiTableCell
        component="div"
        className={classnames(classes.tableCell, classes.flexContainer, classes.noClick)}
        variant="head"
        style={{ height: 70 }}
        align="right"
      >
        <span>{label}</span>
      </MuiTableCell>
    );
  };

  const cellRenderer = ({ rowData, dataKey }) => {
    const columnData = fileds?.arrayItemDef.filter((data) => data.id === dataKey);
    return rowData.isRowSelected ? (
      <TableCell key={columnData[0]?.id} width={rowData[columnData[0]?.width]}>
        {columnData[0]?.type === 'text' && (
          <TextField
            width={rowData[columnData[0]?.width]}
            name="fieldText"
            type="text"
            disabled={columnData[0]?.disabled}
            size="small"
            value={rowData[columnData[0]?.id]}
            variant="outlined"
            onChange={(e) => handleChange(e, rowData, columnData[0], columnData[0].id)}
          />
        )}
        {columnData[0]?.type === 'label' && rowData[columnData[0]?.id]}
        {columnData[0]?.type === 'copyIcon' && (
          <Button
            icon={FileCopyIcon}
            size="medium"
            variant="text"
            color="default"
            tooltip={{ title: utils.string.t('Copy data from above line') }}
          />
        )}
      </TableCell>
    ) : (
      <TableCell key={columnData[0]?.id} width={rowData[columnData[0]?.width]} onClick={(e) => handleCheckboxClik(e, rowData)}>
        {columnData[0]?.type !== 'checkbox' && columnData[0]?.type !== 'copyIcon' && (
          <Typography className={classes.tableCellLabel} style={{ width: `${rowData[columnData[0]?.width]}` }}>
            {rowData[columnData[0]?.id] || '-'}
          </Typography>
        )}
        {columnData[0]?.type === 'copyIcon' && (
          <Button
            icon={FileCopyIcon}
            size="medium"
            variant="text"
            color="default"
            tooltip={{ title: utils.string.t('Copy data from above line') }}
          />
        )}
      </TableCell>
    );
  };

  const getRowClassName = ({ index, onRowClick }) => {
    return classnames(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null,
    });
  };

  const virtualizedTable = (tableProps) => {
    return (
      <Paper style={{ height: 400, width: '100%' }}>
        <AutoSizer>
          {({ height, width }) => (
            <RvTable
              height={height}
              width={width}
              rowHeight={48}
              gridStyle={{
                direction: 'inherit',
              }}
              headerHeight={70}
              className={classnames(classes.table)}
              {...tableProps}
              rowClassName={getRowClassName}
            >
              {fileds?.arrayItemDef.map(({ id, ...other }, index) => {
                return (
                  <Column
                    key={id}
                    headerRenderer={(headerProps) =>
                      headerRenderer({
                        ...headerProps,
                        columnIndex: index,
                      })
                    }
                    className={classnames(classes.flexContainer)}
                    cellRenderer={cellRenderer}
                    dataKey={id}
                    {...other}
                  />
                );
              })}
            </RvTable>
          )}
        </AutoSizer>
      </Paper>
    );
  };





  const [pageNumber, setPageNumber] = useState(1)
  const [searchQueryValue, setSearchQueryValue] = useState('')
  // const { loading, hasMore, lazyListOptions, error } = getLazyList(searchQueryValue, pageNumber)
  const observer = useRef()
  const [values, setValues] = useState([]);





  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [lazyListOptions, setlazyListOptions] = useState([])
  useEffect(() => {
    const getLazyList = (query, pageNum) => {
      setLoading(true)
      dispatch(getProcessingInstructionsGridData({
        filters: {
          instructionIds: [{
            id: query,
            name: query,
          }]
        }, page: pageNum
      })).then((res) => {
        let data = utils.generic.isValidArray(res?.data) ?
          res?.data?.map(a => {
            return { id: a.instructionId, name: a.instructionId.toString() }
          })
          : []
        if (query) {
          setlazyListOptions(data)
        } else {
          setlazyListOptions(prev => {
            return [...prev, ...data]
          })
        }
        setHasMore(res?.pagination?.totalPages > res?.pagination?.page)
        setLoading(false)
      }).catch(e => {
        setError(true)
        setLoading(false)
      });
    }
    getLazyList(searchQueryValue, pageNumber)
  }, [pageNumber, searchQueryValue])
  // const { loading, hasMore, lazyListOptions, error} = useLazyList(searchQueryValue,pageNumber)


  const lastElementReference = useCallback(element => {
    if (loading) return
    if (observer.current) {
      observer.current.disconnect()
    }
    observer.current = new IntersectionObserver(entry => {
      if (entry[0].isIntersecting && hasMore) {
        setPageNumber(prevPage => prevPage + 1)
        console.log('Visiable')
      }
    })
    if (element) observer.current.observe(element)
  }, [loading, hasMore])// eslint-disable-line react-hooks/exhaustive-deps

  const itemsSelected = (field, value) => {
    if (value) {
      const isValueAlreadySelected = values.some((i) => i.id === value.id);
      setValues(isValueAlreadySelected ? values.filter((i) => i.id !== value.id) : [...values, value]);
    }
  };
  const onSearchQuery = (value) => {
    // setlazyListOptions([])
    setSearchQueryValue(value)
  }
  const clearSearchQuery = () => {
    setSearchQueryValue('')
  }
  /***************************************** VIRTUALIZED List IMPLEMENTATION *************************************************/
  const renderContainerHeightBasedOnLength = (length) => {
    let containerHeight;
    switch (length) {
      case 1:
        containerHeight = 215;
        break;
      case 2:
        containerHeight = 345;
        break;
      case 3:
        containerHeight = 475;
        break;
      default:
        containerHeight = 530;
        break;
    }
    return containerHeight;
  };

  const renderRow = (index) => {
    return (
      <TimelineItem className={classnames({ [classes.rightListItem]: index % 2 !== 0 })}>
        <TimelineOppositeContent>
          <Typography variant="body2" color="textSecondary">
            {list[index].time}
          </Typography>
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot>
            <FastfoodIcon />
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <Paper elevation={3} className={classes.paper}>
            <Typography variant="h6" component="h1">
              {list[index].activity}
            </Typography>
            <Typography>{list[index].description}</Typography>
          </Paper>
        </TimelineContent>
      </TimelineItem>
    );
  };

  return (
    <Layout>
      <Layout main>
        <SectionHeader title="Development Page" icon={BugReportIcon} testid="blank" children={undefined} />
        <Box my={5}>
          <Typography variant="h2">Lazy Loading list</Typography>

          <Box height={300} width={500}>
            <LazyLoadingList
              id="lazy-list"
              search
              options={lazyListOptions}
              isDataLoading={loading}
              isDataLoadingError={error}
              values={values}
              placeholder={'Select Items'}
              lastElementReference={lastElementReference}
              searchQueryValue={searchQueryValue}
              handlers={{
                toggleOption: itemsSelected,
                onSearchQuery: onSearchQuery,
                clearSearchQuery: clearSearchQuery
              }} />
          </Box>

        </Box>
        <Box my={5}>
          <Typography variant="h2">DMS Doc Viewer POC</Typography>

          <Box mt={5}>
            <object data={url} width="500" height="200" />
            <iframe src={url} title="come" />
          </Box>
        </Box>
        <Box>
          <Typography variant="h2"> Select Dropdown </Typography>
          <Select
            shrink
            variant="outlined"
            onChange={(e, data) => {
              const selectedValue = {
                name: data?.props.name,
                value: data?.props.value,
              };
              setselectedValue(selectedValue.name);
            }}
            value={selectedValue}
          >
            {selectOptions.map((option) => {
              return (
                <MenuItem name={option.value} value={option.id}>
                  {option.value}
                </MenuItem>
              );
            })}
          </Select>
          <TableContainer style={{ maxHeight: 440 }}>
            {tableData.map((table, tableIndex) => {
              return (
                <Table key={tableIndex} stickyHeader className={classes.dataTable} size="small">
                  <TableHead nestedClasses={{ tableHead: classes.tableHead }} columns={dummyTable1} />
                  <TableBody key={tableIndex} onDragOver={(e) => e.preventDefault()} className={classes.tableBody}>
                    {table.rows.map((row, rowIndex) => {
                      return (
                        <TableRow
                          key={rowIndex}
                          draggable
                          onDragStart={(e) => handleDragStart(e, { tableIndex, rowIndex })}
                          onDrop={(e) => handleDrop(e, { tableIndex, rowIndex })}
                        >
                          {row.cells.map((tableCell, cellIndex) => {
                            return <TableCell key={cellIndex}>{tableCell}</TableCell>;
                          })}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              );
            })}
          </TableContainer>
        </Box>

        {/* <Box>
          <Typography variant="h2"> Editable Table </Typography>
          <Box display="inline-block" width="100%">
            <TextField
              width={100}
              name="fieldText"
              label="No of Rows"
              type="text"
              onChange={(e) => handleRow(e)}
              size="small"
              value={rowNumber}
              variant="outlined"
            />

            <Overflow>
              <TableContainer style={{ maxHeight: 440 }}>
                <Table stickyHeader className={classes.dataTable} size="small">
                  <TableHead nestedClasses={{ tableHead: classes.tableHead }} columns={fileds?.arrayItemDef} />
                  <TableBody className={classes.tableBody}>
                    {dataTableData?.map((row, index) => {
                      return (
                        <Fragment key={row.id}>
                          <TableRow
                            title={!row.isRowSelected && 'Click here to edit'}
                            onClick={(e) => handleCheckboxClik(e, row)}
                            hover
                            className={classnames({ [classes.tableRow]: true, [classes.selectedRow]: row.isRowSelected })}
                          >
                            {fileds?.arrayItemDef.map((column, defIndex) => {
                              return row.isRowSelected ? (
                                <TableCell key={defIndex} width={row[column?.width]}>
                                  {column?.type === 'text' && (
                                    <TextField
                                      width={row[column?.width]}
                                      name="fieldText"
                                      type="text"
                                      disabled={column?.disabled}
                                      size="small"
                                      value={row[column?.id]}
                                      variant="outlined"
                                      onChange={(e) => handleChange(e, row, column, column.id)}
                                    />
                                  )}
                                  {column?.type === 'label' && row[column?.id]}
                                  {column?.type === 'copyIcon' && (
                                    <Button
                                      icon={FileCopyIcon}
                                      size="medium"
                                      variant="text"
                                      color="default"
                                      tooltip={{ title: utils.string.t('Copy data from above line') }}
                                    />
                                  )}
                                </TableCell>
                              ) : (
                                <TableCell key={defIndex} width={row[column?.width]}>
                                  {column?.type !== 'checkbox' && column?.type !== 'copyIcon' && (
                                    <Typography className={classes.tableCellLabel} style={{ width: `${row[column?.width]}` }}>
                                      {row[column?.id] || '-'}
                                    </Typography>
                                  )}
                                  {column?.type === 'copyIcon' && (
                                    <Button
                                      icon={FileCopyIcon}
                                      size="medium"
                                      variant="text"
                                      color="default"
                                      tooltip={{ title: utils.string.t('Copy data from above line') }}
                                    />
                                  )}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        </Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Overflow>
          </Box>
        </Box> */}

        <Box>
          <Typography variant="h2"> Full Screen Modal </Typography>
          <Button variant="contained" text={'Open full-screen dialog'} color={'primary'} size="small" onClick={handleClickOpen} />

          <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
            <DialogTitle className={classes.title}>
              <AppBar elevation={1}>
                <Toolbar className={classes.toolbar}>
                  <Button
                    icon={CloseIcon}
                    variant="text"
                    onClick={handleClose}
                    nestedClasses={{ btn: classes.close }}
                    data-testid="modal-close-button"
                  />

                  <Grid container>
                    <Grid item xs={8}>
                      <Typography variant="h2">Register New Loss</Typography>
                    </Grid>
                    {uiSidebarExpanded && (
                      <Grid item xs={4}>
                        <Box ml={2} display={'flex'} alignItems={'baseline'}>
                          <Button size="xsmall" variant="text" icon={InsertDriveFileIcon} />
                          <Typography variant="h2">Documents</Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Toolbar>
              </AppBar>
            </DialogTitle>
            <DialogContent className={classes.content}>
              <Layout showDesktopControls>
                <Layout main>
                  <Box mt={'-40px'}>
                    <Stepper alternativeLabel activeStep={activeStep}>
                      {steps.map((label, index) => (
                        <Step key={index} onClick={handleStep(index)}>
                          <StepLabel
                            StepIconProps={{
                              classes: { root: classes.iconContainer },
                            }}
                          >
                            {label}
                          </StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                    <LinearProgress variant="determinate" value={progress} className={classes.linearProgress} />

                    <Box>
                      {activeStep === 0 && (
                        <Box display={'flex'} flex={'1'}>
                          <Box className={classes.card}>
                            <Box p={2} className={classes.cardTitle}>
                              <Typography variant="h3" className={classes.cardTitleHeading}>
                                {'Search Policy'}
                              </Typography>
                              <IconButton size="small" aria-label="edit">
                                <EditIcon className={classes.editIcon} />
                              </IconButton>
                            </Box>
                            <Box className={classes.cardContainer}>{'Test'}</Box>
                          </Box>
                          <Box className={classes.card}>
                            <Box p={2} className={classes.cardTitle}>
                              <Typography variant="h3" className={classes.cardTitleHeading}>
                                {'Search Policy'}
                              </Typography>
                              <IconButton size="small" aria-label="edit">
                                <EditIcon className={classes.editIcon} />
                              </IconButton>
                            </Box>
                            <Box className={classes.cardContainer}>{'Test'}</Box>
                          </Box>
                        </Box>
                      )}
                    </Box>
                    <Box>
                      {activeStep === 1 && (
                        <>
                          <Table size="small" data-testid="tasks-processing-table">
                            <TableHead columns={cols} />
                            <TableBody data-testid="tasks-list-body">
                              <TableRow>
                                <TableCell>
                                  <Checkbox color="primary" checked={false} />
                                </TableCell>
                                <TableCell>{'Test Data'}</TableCell>
                                <TableCell>{'Test Data'}</TableCell>
                                <TableCell>{'Test Data'}</TableCell>
                                <TableCell>{'Test Data'}</TableCell>
                                <TableCell>{'Test Data'}</TableCell>
                                <TableCell>{'Test Data'}</TableCell>
                                <TableCell>{'Test Data'}</TableCell>
                                <TableCell>{'Test Data'}</TableCell>
                                <TableCell>{'Test Data'}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </>
                      )}
                    </Box>
                    <Box>{activeStep === 2 && <>Step - 3 </>}</Box>
                    <Box>{activeStep === 3 && <>Step - 4 </>}</Box>
                    <Box>{activeStep === 4 && <>Step - 5 </>}</Box>
                  </Box>
                </Layout>
                <Layout sidebar padding={false}>
                  <Box pt={2} pl={5} pr={3}>
                    <FilterBar id="userFilter" fields={searchFields} actions={searchActions} />

                    <Divider />
                    <Box display="flex">
                      <Box flex={'0.8'} pl={2}>
                        File Name
                      </Box>
                      <Box flex={'0.4'} pl={12}>
                        Date
                      </Box>
                    </Box>
                    <Divider />

                    <TreeView
                      aria-label="rich object"
                      defaultCollapseIcon={<ExpandMoreIcon />}
                      defaultExpanded={['1', '9', 'root']}
                      defaultExpandIcon={<ChevronRightIcon />}
                    >
                      {renderTree(data)}
                    </TreeView>
                  </Box>
                </Layout>
              </Layout>
            </DialogContent>
          </Dialog>
        </Box>
        <Box my={5}>
          <Typography variant="h2">DMS Search</Typography>

          <Box mt={5}>
            <DmsSearch {...dms} referenceId={referenceId} />
          </Box>
        </Box>
        <Box>
          <Typography variant="h2">Virtualization Editable Table </Typography>
          <Box display="inline-block" width="100%">
            <TextField
              width={100}
              name="fieldText"
              label="No of Rows"
              type="text"
              onChange={(e) => handleRow(e)}
              size="small"
              value={rowNumber}
              variant="outlined"
            />
          </Box>
        </Box>
        <Box my={5}>
          <Typography variant="h1">Implementing Table Virtualization</Typography>

          <Box mt={5}>
            {virtualizedTable({
              rowCount: dataTableData.length,
              rowGetter: ({ index }) => {
                return dataTableData[index];
              },
            })}
          </Box>
        </Box>
        <Box my={5}>
          <Typography variant="h1">Implementing List Virtualization</Typography>

          <Box mt={5} height={100}>
            {<TimelineComponent props={timelineData} />}
          </Box>
        </Box>
        <div data-testid="blank" />
      </Layout>
    </Layout>
  );
}

export default Blank;
