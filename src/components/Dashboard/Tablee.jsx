import React, { useState, useEffect } from 'react';
import '@carbon/styles/css/styles.css';
import './Table.css';
import {
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Pagination,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  TableToolbarMenu,
  MenuItem,
  Button,
  Tile,
  Tag
} from '@carbon/react';

import { Filter } from '@carbon/icons-react';
import { Download, View, Link, ThumbsUp, ThumbsDown, Archive } from '@carbon/icons-react';
import { Tab, TabPanels, TabPanel, Tabs, TabList } from '@carbon/react';

const headers = [
  { key: 'type', header: 'Type' },
  { key: 'entity', header: 'Entity Name' },
  { key: 'date', header: 'Date' },
  { key: 'source', header: 'Source' },
  // { key: 'relevance', header: 'Relevance' },
  { key: 'sentiment', header: 'Sentiment' },
  { key: 'summary', header: 'Brief Summary' },
  { key: 'link', header: 'Link' },
  { key: 'actions', header: 'Actions' },
];

const Tablee = () => {
  const [rows, setRows] = useState([]);
  const [loadingRows, setLoadingRows] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewRow, setViewRow] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('');
  const [cardWidth, setCardWidth] = useState(1200);
  const [thumbs, setThumbs] = useState(() => {
    const savedThumbs = localStorage.getItem('tablee_thumbs');
    return savedThumbs ? JSON.parse(savedThumbs) : {};
  });
  const [exportDialog, setExportDialog] = useState(false);
  const [exportType, setExportType] = useState('all');
  const [dateSortAsc, setDateSortAsc] = useState(true);
  const [sentimentMenuOpen, setSentimentMenuOpen] = useState(false);
  const [sentimentFilterValue, setSentimentFilterValue] = useState('');
  const [archiveConfirm, setArchiveConfirm] = useState({ open: false, row: null });
  const [archivedRows, setArchivedRows] = useState([]);
  // Remove: const [selectedTab, setSelectedTab] = useState(0);
  // Add state for restore confirmation modal
  const [restoreConfirm, setRestoreConfirm] = useState({ open: false, row: null });

  // Add export functionality
  const exportToCSV = () => {
    setExportDialog(true);
  };
  const doExport = (type) => {
    setExportDialog(false);
    let filteredRows = rows;
    if (type === 'up') filteredRows = rows.filter(r => thumbs[r.summary] === 'up');
    if (type === 'down') filteredRows = rows.filter(r => thumbs[r.summary] === 'down');
    const headers = [
      { key: 'type', header: 'Type' },
      { key: 'entity', header: 'Entity Name' },
      { key: 'date', header: 'Date' },
      { key: 'source', header: 'Source' },
      { key: 'sentiment', header: 'Sentiment' },
      { key: 'summary', header: 'Brief Summary' },
    ];
    const csvRows = [headers.map(h => h.header).join(",")];
    filteredRows.forEach((row, idx) => {
      csvRows.push(headers.map(h => {
        return row[h.key] !== undefined ? row[h.key] : '';
      }).map(val => '"' + String(val).replace(/"/g, '""') + '"').join(","));
    });
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "table_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Add exportHeaders for view modal
  const exportHeaders = [
    { key: 'srNo', header: 'Sr No.' },
    { key: 'date', header: 'Date' },
    { key: 'link', header: 'Link' },
    { key: 'source', header: 'Source / Publication' },
    { key: 'entity', header: 'Entity / Promoter / Director' },
    { key: 'otherEntities', header: 'Other Entity/Promoters/Directors' },
    { key: 'category', header: 'Category' },
    { key: 'keyword', header: 'Keyword' },
    { key: 'headline', header: 'Headline' },
    { key: 'openRestricted', header: 'Open/ Restricted' },
    { key: 'relevance', header: 'Relevance' },
    { key: 'sentiment', header: 'Sentiment' },
    { key: 'summary', header: 'Brief Summary' },
  ];

  // Add this function to load and filter rows from localStorage
  const loadRowsFromLocalStorage = () => {
    try {
      const rawData = localStorage.getItem("entityResults");
      let parsedData = rawData ? JSON.parse(rawData) : [];
      if (!Array.isArray(parsedData)) parsedData = [];

      // Load archive_records and build a set of unique keys
      let archiveRecords = localStorage.getItem('archive_records');
      archiveRecords = archiveRecords ? JSON.parse(archiveRecords) : [];
      const archivedKeys = new Set(
        archiveRecords.map(item =>
          `${item.input_entity || item.entity || ""}__${item.publication_source || item.source || ""}__${item.summary || ""}`
        )
      );

      // Map and filter out archived
      const mappedRows = parsedData
        .map((item, index) => ({
          id: index.toString(),
          type: item.risk_category || "N/A",
          entity: item.input_entity || "N/A",
          date: item.date || "N/A",
          source: item.publication_source || "N/A",
          sentiment: item.sentiment || "N/A",
          summary: item.summary || "N/A",
          link: item.source_link || "",
          source_link: item.source_link || "",
          uniqueKey: `${item.input_entity || item.entity || ""}__${item.publication_source || item.source || ""}__${item.summary || ""}`
        }))
        .filter(row => !archivedKeys.has(`${row.entity}__${row.source}__${row.summary}`));

      setRows(mappedRows);
    } catch (error) {
      setRows([]);
    }
  };

  // Function to load archived rows from localStorage
  const loadArchivedRowsFromLocalStorage = () => {
    try {
      let archiveRecords = localStorage.getItem('archive_records');
      archiveRecords = archiveRecords ? JSON.parse(archiveRecords) : [];
      const mappedRows = archiveRecords.map((item, index) => ({
        id: index.toString(),
        type: item.risk_category || "N/A",
        entity: item.input_entity || item.entity || "N/A",
        date: item.date || "N/A",
        source: item.publication_source || item.source || "N/A",
        sentiment: item.sentiment || "N/A",
        summary: item.summary || "N/A",
        link: item.source_link || "",
        source_link: item.source_link || "",
        uniqueKey: `${item.input_entity || item.entity || ""}__${item.publication_source || item.source || ""}__${item.summary || ""}`
      }));
      setArchivedRows(mappedRows);
    } catch (error) {
      setArchivedRows([]);
    }
  };

  // useEffect(() => {
  //   setLoadingRows(true);
  //   // fetch('http://localhost:8000/dashboard-data')
  //   //   .then(res => res.json())
  //   //   .then(data => {
  //   //     setRows(Array.isArray(data) ? data : (data.data || []));
  //   //     setLoadingRows(false);
  //   //   })
  //   //   .catch(() => setLoadingRows(false));

  //   const data = localStorage.getItem("entityResults",[]);
  //   console.log("data...",data)
    
  // }, []);
  useEffect(() => {
    setLoadingRows(true);
    try {
      const rawData = localStorage.getItem("entityResults");
      let parsedData = rawData ? JSON.parse(rawData) : [];
      if (!Array.isArray(parsedData)) parsedData = [];

      // Load archive_records and build a set of unique keys
      let archiveRecords = localStorage.getItem('archive_records');
      archiveRecords = archiveRecords ? JSON.parse(archiveRecords) : [];
      const archivedKeys = new Set(
        archiveRecords.map(item =>
          `${item.input_entity || item.entity}__${item.publication_source || item.source}__${item.summary}`
        )
      );

      // Map and filter out archived
      const mappedRows = parsedData
        .map((item, index) => ({
          id: index.toString(),
          type: item.risk_category || "N/A",
          entity: item.input_entity || "N/A",
          date: item.date || "N/A",
          source: item.publication_source || "N/A",
          sentiment: item.sentiment || "N/A",
          summary: item.summary || "N/A",
          link: item.source_link || "",
          source_link: item.source_link || "",
          uniqueKey: `${item.input_entity}__${item.publication_source}__${item.summary}`
        }))
        .filter(row => !archivedKeys.has(`${row.entity}__${row.source}__${row.summary}`));
  
      setRows(mappedRows);
      console.log('Mapped rows:', mappedRows);
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
      setRows([]);
    } finally {
      setLoadingRows(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tablee_thumbs', JSON.stringify(thumbs));
  }, [thumbs]);

  // Filter rows based on search query and sentiment filter
  let filteredRows = rows.filter(row => {
    const matchesSearch = Object.values(row).some(
      value =>
        typeof value === 'string' &&
        value.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesSentiment = !sentimentFilterValue || (row.sentiment && row.sentiment.toLowerCase() === sentimentFilterValue);
    return matchesSearch && matchesSentiment;
  });
  // Sort by date if needed
  filteredRows = filteredRows.sort((a, b) => {
    const dateA = new Date(a.date.split(',')[0]);
    const dateB = new Date(b.date.split(',')[0]);
    return dateSortAsc ? dateA - dateB : dateB - dateA;
  });

  const totalItems = filteredRows.length;
  const pagedRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);

  const columnWidths = {
    type: { width: '120px', minWidth: '120px', maxWidth: '120px' }, // 1st column
    entity: { width: '160px', minWidth: '160px', maxWidth: '160px' }, // 2nd column
    date: { width: '120px', minWidth: '120px', maxWidth: '120px' }, // 3rd column
    source: { width: '160px', minWidth: '160px', maxWidth: '160px' }, // 4th column
    sentiment: { width: '140px', minWidth: '140px', maxWidth: '140px' }, // 5th column
    summary: { width: '500px', minWidth: '500px', maxWidth: '500px' }, // 6th column (Example/Brief Summary)
    actions: { width: '160px', minWidth: '160px', maxWidth: '160px', textAlign: 'center' }, // Actions column
  };

  const statusOptions = [
    { value: '', text: 'All' },
    { value: 'Positive', text: 'Positive' },
    { value: 'Negative', text: 'Negative' },
  ];

  // Archive handler
  const handleArchive = (row) => {
    console.log('[DEBUG] Row to archive:', row);
    // Build a robust unique key for the row
    const rowKey = [
      row.entity || row.input_entity || "",
      row.source || row.publication_source || "",
      row.summary || ""
    ].join("__");
    console.log('[DEBUG] Archive rowKey:', rowKey);

    // Get entityResults from localStorage
    let entityResults = localStorage.getItem('entityResults');
    entityResults = entityResults ? JSON.parse(entityResults) : [];
    console.log('[DEBUG] entityResults before:', entityResults);

    // Find the record to archive and filter out from entityResults
    let archivedRecord = null;
    const updatedEntityResults = entityResults.filter(item => {
      const itemKey = [
        item.entity || item.input_entity || "",
        item.source || item.publication_source || "",
        item.summary || ""
      ].join("__");
      if (itemKey === rowKey) {
        archivedRecord = item;
        return false; // remove this item
      }
      return true;
    });
    console.log('[DEBUG] entityResults after:', updatedEntityResults);

    // Save updated entityResults
    localStorage.setItem('entityResults', JSON.stringify(updatedEntityResults));

    // Add to archive_records if found
    if (archivedRecord) {
      let archiveRecords = localStorage.getItem('archive_records');
      archiveRecords = archiveRecords ? JSON.parse(archiveRecords) : [];
      archiveRecords.push(archivedRecord);
      localStorage.setItem('archive_records', JSON.stringify(archiveRecords));
      console.log('[DEBUG] archivedRecord:', archivedRecord);
      console.log('[DEBUG] archiveRecords after:', archiveRecords);
    } else {
      console.log('[DEBUG] No matching record found to archive.');
    }

    // Remove from UI
    loadRowsFromLocalStorage();
    setArchiveConfirm({ open: false, row: null });
  };

  // Restore handler for archived records
  const handleRestore = (row) => {
    // Build unique key
    const rowKey = [
      row.entity || row.input_entity || "",
      row.source || row.publication_source || "",
      row.summary || ""
    ].join("__");

    // Remove from archive_records
    let archiveRecords = localStorage.getItem('archive_records');
    archiveRecords = archiveRecords ? JSON.parse(archiveRecords) : [];
    let restoredRecord = null;
    const updatedArchiveRecords = archiveRecords.filter(item => {
      const itemKey = [
        item.entity || item.input_entity || "",
        item.source || item.publication_source || "",
        item.summary || ""
      ].join("__");
      if (itemKey === rowKey) {
        restoredRecord = item;
        return false;
      }
      return true;
    });
    localStorage.setItem('archive_records', JSON.stringify(updatedArchiveRecords));

    // Add to entityResults if found
    if (restoredRecord) {
      let entityResults = localStorage.getItem('entityResults');
      entityResults = entityResults ? JSON.parse(entityResults) : [];
      entityResults.push(restoredRecord);
      localStorage.setItem('entityResults', JSON.stringify(entityResults));
    }

    // Reload both tables
    loadRowsFromLocalStorage();
    loadArchivedRowsFromLocalStorage();
  };

  // Add export dialog state for archived records
  const [exportArchiveDialog, setExportArchiveDialog] = useState(false);
  // Fix: split exportArchivedToCSV and doExportArchived
  const exportArchivedToCSV = () => {
    setExportArchiveDialog(true);
  };
  const doExportArchived = () => {
    setExportArchiveDialog(false);
    // Apply search and sentiment filter to archivedRows
    let filtered = archivedRows.filter(row => {
      const matchesSearch = Object.values(row).some(
        value => typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const matchesSentiment = !sentimentFilterValue || (row.sentiment && row.sentiment.toLowerCase() === sentimentFilterValue);
      return matchesSearch && matchesSentiment;
    });
    // Sort by date if needed
    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.date.split(',')[0]);
      const dateB = new Date(b.date.split(',')[0]);
      return dateSortAsc ? dateA - dateB : dateB - dateA;
    });
    const headers = [
      { key: 'type', header: 'Type' },
      { key: 'entity', header: 'Entity Name' },
      { key: 'date', header: 'Date' },
      { key: 'source', header: 'Source' },
      { key: 'sentiment', header: 'Sentiment' },
      { key: 'summary', header: 'Brief Summary' },
    ];
    const csvRows = [headers.map(h => h.header).join(",")];
    filtered.forEach((row, idx) => {
      csvRows.push(headers.map(h => {
        return row[h.key] !== undefined ? row[h.key] : '';
      }).map(val => '"' + String(val).replace(/"/g, '""') + '"').join(","));
    });
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "archived_records_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="tablesection">
      <Tabs onChange={({ selectedIndex }) => {
        if (selectedIndex === 1) loadArchivedRowsFromLocalStorage();
      }} onTabCloseRequest={() => { }}>
        <TabList scrollDebounceWait={200}>
          <Tab>Entity Records</Tab>
          <Tab>Archieve Records</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <TableToolbar size="sm" className="custom-toolbar">
              <TableToolbarContent className="custom-toolbar-content">
                <TableToolbarSearch
                  placeholder="Search"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <TableToolbarMenu renderIcon={Filter} iconDescription="Filter options">
                  <MenuItem label="Date" onClick={() => setDateSortAsc(v => !v)} />
                  <MenuItem label="Sentiment" onClick={() => setSentimentMenuOpen(v => !v)} style={{ padding: 0 }}>
                    <MenuItem label="All" onClick={() => setSentimentFilterValue('')} style={{ margin: 0, padding: '2px 16px' }} />
                    <MenuItem label="Positive" onClick={() => setSentimentFilterValue(sentimentFilterValue === 'positive' ? '' : 'positive')} style={{ margin: 0, padding: '2px 16px' }} />
                    <MenuItem label="Negative" onClick={() => setSentimentFilterValue(sentimentFilterValue === 'negative' ? '' : 'negative')} style={{ margin: 0, padding: '2px 16px' }} />
                    <MenuItem label="Neutral" onClick={() => setSentimentFilterValue(sentimentFilterValue === 'neutral' ? '' : 'neutral')} style={{ margin: 0, padding: '2px 16px' }} />
                  </MenuItem>
                </TableToolbarMenu>
                <Button className="but"
                  kind="ghost"
                  size="sm"
                  onClick={exportToCSV}
                  renderIcon={() => <Download style={{ transform: 'scaleX(-1)', marginLeft: '8px', fill: '#ffffff' }} />}
                >
                  Export
                </Button>
              </TableToolbarContent>
            </TableToolbar>
            <DataTable rows={pagedRows} headers={headers}>
              {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
                <Table {...getTableProps()}>
                  <TableHead>
                    <TableRow>
                      {headers.filter(header => header.key !== 'link').map((header) => (
                        <TableHeader
                          key={header.key}
                          {...getHeaderProps({ header })}
                          style={columnWidths[header.key] || {}}
                        >
                          {header.header}
                        </TableHeader>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loadingRows ? (
                      <TableRow>
                        <TableCell colSpan={headers.length} style={{ textAlign: 'center', padding: 24, color: '#888' }}>Loading...</TableCell>
                      </TableRow>
                    ) : rows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={headers.length} style={{ textAlign: 'center', padding: 24, color: '#888' }}>No results found.</TableCell>
                      </TableRow>
                    ) : (
                      rows.map((row) => {
                        const rowProps = getRowProps({ row });
                        const { key, ...otherProps } = rowProps;
                        return (
                          <TableRow key={key} {...otherProps}>
                            {row.cells
                              .filter(cell => cell.info.header !== 'link')
                              .map((cell) => {
                            const headerKey = cell.info.header;
                            if (headerKey === 'actions') {
                              const boxStyle = {
                                width: 32,
                                height: 32,
                                background: '#fff',
                                border: '1px solid var(--Button-button-secondary-active, #6F6F6F)',
                                borderRadius: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: 0,
                                padding: 0,
                              };
                              const linkCell = row.cells.find(c => c.info.header === 'link');
                                  const link = linkCell ? linkCell.value : '';
                                  console.log('Action link:', link, row);
                              return (
                                <TableCell key={cell.id} className="action-cell" style={{ ...columnWidths['actions'], textAlign: 'center', verticalAlign: 'middle' }}>
                                  <div style={{ display: 'flex', width: 128, height: 32, gap: 16, alignItems: 'center', justifyContent: 'center', opacity: 1 }}>
                                        <a
                                          href={link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="action-link-icon"
                                          style={{ ...boxStyle, textDecoration: 'none', color: '#525252' }}
                                        >
                                          <Link size={20} />
                                    </a>
                                    <div style={boxStyle} onClick={() => {
                                      const rowData = {};
                                      row.cells.forEach(cell => {
                                        rowData[cell.info.header] = cell.value;
                                      });
                                      setViewRow(rowData);
                                    }}>
                                      <View size={20} />
                                    </div>
                                    <div style={boxStyle} onClick={() => {
                                      // Extract values from row.cells
                                      const rowData = {};
                                      row.cells.forEach(cell => {
                                        rowData[cell.info.header] = cell.value;
                                      });
                                      setArchiveConfirm({ open: true, row: rowData });
                                    }}>
                                      <Archive size={20} />
                                    </div>
                                  </div>
                                </TableCell>
                              );
                            }

                            if (headerKey === 'relevance') {
                              let label = cell.value;
                              let color = '';
                              if (cell.value >= 0 && cell.value <= 3) {
                                label = 'Low';
                                color = '#1192E8';
                              } else if (cell.value >= 4 && cell.value <= 7) {
                                label = 'Medium';
                                color = '#FF832B';
                              } else if (cell.value >= 8 && cell.value <= 10) {
                                label = 'High';
                                color = '#DA1E28';
                              }
                              return (
                                <TableCell key={cell.id} style={{ ...columnWidths['relevance'], color: color, fontWeight: 700, fontSize: 13, textAlign: 'left', verticalAlign: 'middle' }}>
                                  {label}
                                </TableCell>
                              );
                            }

                            if (headerKey === 'sentiment') {
                                    let label = cell.value ? cell.value.charAt(0).toUpperCase() + cell.value.slice(1).toLowerCase() : '';
                                    let type = 'gray';
                                    let customStyle = {};
                                    if (cell.value && cell.value.toLowerCase() === 'positive') {
                                      type = 'green';
                                      customStyle = { backgroundColor: '#A7F0BA', color: '#0E6027' };
                                    } else if (cell.value && cell.value.toLowerCase() === 'negative') {
                                      type = 'red';
                                      customStyle = { backgroundColor: '#FFD7D9', color: '#A2191F' };
                                    } else if (cell.value && cell.value.toLowerCase() === 'neutral') {
                                      type = 'gray';
                                      customStyle = { backgroundColor: '#e0e0e0', color: '#161616' };
                              }
                              return (
                                <TableCell key={cell.id} style={{ ...columnWidths['sentiment'], textAlign: 'left', verticalAlign: 'middle' }}>
                                        <Tag type={type} size="md" style={customStyle}>{label}</Tag>
                                      </TableCell>
                                    );
                                  }

                                  if (headerKey === 'summary') {
                                    const value = cell.value || '';
                                    // Reconstruct unique key from cell values
                                    const entityCell = row.cells.find(c => c.info.header === 'entity');
                                    const dateCell = row.cells.find(c => c.info.header === 'date');
                                    const uniqueKey = `${entityCell ? entityCell.value : ''}__${dateCell ? dateCell.value : ''}__${value}`;
                                    const isThumbUp = thumbs[uniqueKey] === 'up';
                                    const isThumbDown = thumbs[uniqueKey] === 'down';
                                    return (
                                      <TableCell key={cell.id} style={{ ...columnWidths['summary'], textAlign: 'left', verticalAlign: 'middle', paddingRight: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                                          <div style={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            maxHeight: '4.5em',
                                            lineHeight: '1.5em',
                                            minWidth: 0,
                                            flex: 1,
                                            wordBreak: 'break-word',
                                            fontSize: 14,
                                            color: '#222',
                                            background: 'none',
                                          }} title={value}>
                                            {value}
                                          </div>
                                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 24, padding: '10px', outline: 'none' }}>
                                            <ThumbsUp
                                              size={18}
                                              style={{ cursor: 'pointer', color: isThumbUp ? '#0E6027' : '#888', background: isThumbUp ? '#A7F0BA' : 'transparent', borderRadius: 4, padding: 2 }}
                                              onClick={() => {
                                                setThumbs(t => {
                                                  const newState = { ...t, [uniqueKey]: t[uniqueKey] === 'up' ? 'none' : 'up' };
                                                  localStorage.setItem('tablee_thumbs', JSON.stringify(newState));
                                                  return newState;
                                                });
                                              }}
                                              title="Thumbs Up"
                                            />
                                            <ThumbsDown
                                              size={18}
                                              style={{ cursor: 'pointer', color: isThumbDown ? '#A2191F' : '#888', background: isThumbDown ? '#FFD7D9' : 'transparent', borderRadius: 4, padding: 2 }}
                                              onClick={() => {
                                                setThumbs(t => {
                                                  const newState = { ...t, [uniqueKey]: t[uniqueKey] === 'down' ? 'none' : 'down' };
                                                  localStorage.setItem('tablee_thumbs', JSON.stringify(newState));
                                                  return newState;
                                                });
                                              }}
                                              title="Thumbs Down"
                                            />
                                          </div>
                                        </div>
                                    </TableCell>
                                  );
                                }

                                if (headerKey === 'date') {
                                  // Only show the part before the first comma
                                  const dateValue = (cell.value || '').split(',')[0];
                                  return (
                                    <TableCell key={cell.id} style={{ ...(columnWidths[headerKey] || {}), textAlign: 'left', verticalAlign: 'middle' }}>
                                      {dateValue}
                                </TableCell>
                              );
                            }

                            // Handle ellipsis for 'source' and 'summary'
                            if (["source", "summary", "type","source"].includes(headerKey)) {
                              return (
                                <TableCell key={cell.id} style={{ ...(columnWidths[headerKey] || {}), textAlign: 'left', verticalAlign: 'middle', maxWidth: headerKey === 'summary' ? 120 : undefined }}>
                                  <div style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    maxWidth: headerKey === 'summary' ? 120 : undefined
                                  }}>
                                    <span title={cell.value}>{cell.value}</span>
                                  </div>
                                </TableCell>
                              );
                            }

                                if (headerKey === 'type') {
                                  return (
                                    <TableCell key={cell.id} style={{ ...(columnWidths[headerKey] || {}), textAlign: 'left', verticalAlign: 'middle', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: columnWidths[headerKey]?.width || '120px' }}>
                                      <span style={{ display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }} title={cell.value}>
                                        {cell.value}
                                      </span>
                                </TableCell>
                              );
                            }

                            // Default cell
                            return (
                              <TableCell key={cell.id} style={{ ...(columnWidths[headerKey] || {}), textAlign: 'left', verticalAlign: 'middle' }}>
                                {cell.value}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              )}
            </DataTable>
            <div>
              <Pagination
                backwardText="Previous page"
                forwardText="Next page"
                itemsPerPageText="Items per page:"
                page={page}
                pageNumberText="Page Number"
                pageSize={pageSize}
                pageSizes={[10, 20, 30, 40, 50]}
                size="md"
                totalItems={totalItems}
                onChange={({ page, pageSize }) => {
                  if (page !== undefined) setPage(page);
                  if (pageSize !== undefined) {
                    setPageSize(pageSize);
                    setPage(1);
                  }
                }}
              />
            </div>
          </TabPanel>
          <TabPanel>
            {/* Archive Records Table - remove Export button from toolbar */}
            <TableToolbar size="sm" className="custom-toolbar">
              <TableToolbarContent className="custom-toolbar-content">
                <TableToolbarSearch
                  placeholder="Search"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <TableToolbarMenu renderIcon={Filter} iconDescription="Filter options">
                  <MenuItem label="Date" onClick={() => setDateSortAsc(v => !v)} />
                  <MenuItem label="Sentiment" onClick={() => setSentimentMenuOpen(v => !v)} style={{ padding: 0 }}>
                    <MenuItem label="All" onClick={() => setSentimentFilterValue('')} style={{ margin: 0, padding: '2px 16px' }} />
                    <MenuItem label="Positive" onClick={() => setSentimentFilterValue(sentimentFilterValue === 'positive' ? '' : 'positive')} style={{ margin: 0, padding: '2px 16px' }} />
                    <MenuItem label="Negative" onClick={() => setSentimentFilterValue(sentimentFilterValue === 'negative' ? '' : 'negative')} style={{ margin: 0, padding: '2px 16px' }} />
                    <MenuItem label="Neutral" onClick={() => setSentimentFilterValue(sentimentFilterValue === 'neutral' ? '' : 'neutral')} style={{ margin: 0, padding: '2px 16px' }} />
                  </MenuItem>
                </TableToolbarMenu>
                <Button className="but"
                  kind="ghost"
                  size="sm"
                  onClick={exportArchivedToCSV}
                  renderIcon={() => <Download style={{ transform: 'scaleX(-1)', marginLeft: '8px', fill: '#ffffff' }} />}
                >
                  Export
                </Button>
              </TableToolbarContent>
            </TableToolbar>
            <DataTable rows={(() => {
              // Apply search and sentiment filter to archivedRows
              let filtered = archivedRows.filter(row => {
                const matchesSearch = Object.values(row).some(
                  value => typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase())
                );
                const matchesSentiment = !sentimentFilterValue || (row.sentiment && row.sentiment.toLowerCase() === sentimentFilterValue);
                return matchesSearch && matchesSentiment;
              });
              // Sort by date if needed
              filtered = filtered.sort((a, b) => {
                const dateA = new Date(a.date.split(',')[0]);
                const dateB = new Date(b.date.split(',')[0]);
                return dateSortAsc ? dateA - dateB : dateB - dateA;
              });
              return filtered.slice((page - 1) * pageSize, page * pageSize);
            })()} headers={headers}>
              {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
                <Table {...getTableProps()}>
                  <TableHead>
                    <TableRow>
                      {headers.filter(header => header.key !== 'link').map((header) => (
                        <TableHeader
                          key={header.key}
                          {...getHeaderProps({ header })}
                          style={columnWidths[header.key] || {}}
                        >
                          {header.header}
                        </TableHeader>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={headers.length} style={{ textAlign: 'center', padding: 24, color: '#888' }}>No archived records.</TableCell>
                      </TableRow>
                    ) : (
                      rows.map((row) => {
                        const rowProps = getRowProps({ row });
                        const { key, ...otherProps } = rowProps;
                        return (
                          <TableRow key={key} {...otherProps}>
                            {row.cells
                              .filter(cell => cell.info.header !== 'link')
                              .map((cell) => {
                                const headerKey = cell.info.header;
                                if (headerKey === 'actions') {
                                  const boxStyle = {
                                    width: 32,
                                    height: 32,
                                    background: '#fff',
                                    border: '1px solid var(--Button-button-secondary-active, #6F6F6F)',
                                    borderRadius: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: 0,
                                    padding: 0,
                                  };
                                  const linkCell = row.cells.find(c => c.info.header === 'link');
                                  const link = linkCell ? linkCell.value : '';
                                  return (
                                    <TableCell key={cell.id} className="action-cell" style={{ ...columnWidths['actions'], textAlign: 'center', verticalAlign: 'middle' }}>
                                      <div style={{ display: 'flex', width: 128, height: 32, gap: 16, alignItems: 'center', justifyContent: 'center', opacity: 1 }}>
                                        <a
                                          href={link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="action-link-icon"
                                          style={{ ...boxStyle, textDecoration: 'none', color: '#525252' }}
                                        >
                                          <Link size={20} />
                                        </a>
                                        <div style={boxStyle} onClick={() => {
                                          const rowData = {};
                                          row.cells.forEach(cell => {
                                            rowData[cell.info.header] = cell.value;
                                          });
                                          setViewRow(rowData);
                                        }}>
                                          <View size={20} />
                                        </div>
                                        <div style={boxStyle} onClick={() => {
                                          const rowData = {};
                                          row.cells.forEach(cell => {
                                            rowData[cell.info.header] = cell.value;
                                          });
                                          setRestoreConfirm({ open: true, row: rowData });
                                        }}>
                                          <Archive size={20} />
                                        </div>
                                      </div>
                                    </TableCell>
                                  );
                                }
                                // Reuse all other cell rendering logic from Entity Records table
                                if (headerKey === 'relevance') {
                                  let label = cell.value;
                                  let color = '';
                                  if (cell.value >= 0 && cell.value <= 3) {
                                    label = 'Low';
                                    color = '#1192E8';
                                  } else if (cell.value >= 4 && cell.value <= 7) {
                                    label = 'Medium';
                                    color = '#FF832B';
                                  } else if (cell.value >= 8 && cell.value <= 10) {
                                    label = 'High';
                                    color = '#DA1E28';
                                  }
                                  return (
                                    <TableCell key={cell.id} style={{ ...columnWidths['relevance'], color: color, fontWeight: 700, fontSize: 13, textAlign: 'left', verticalAlign: 'middle' }}>
                                      {label}
                                    </TableCell>
                                  );
                                }
                                if (headerKey === 'sentiment') {
                                  let label = cell.value ? cell.value.charAt(0).toUpperCase() + cell.value.slice(1).toLowerCase() : '';
                                  let type = 'gray';
                                  let customStyle = {};
                                  if (cell.value && cell.value.toLowerCase() === 'positive') {
                                    type = 'green';
                                    customStyle = { backgroundColor: '#A7F0BA', color: '#0E6027' };
                                  } else if (cell.value && cell.value.toLowerCase() === 'negative') {
                                    type = 'red';
                                    customStyle = { backgroundColor: '#FFD7D9', color: '#A2191F' };
                                  } else if (cell.value && cell.value.toLowerCase() === 'neutral') {
                                    type = 'gray';
                                    customStyle = { backgroundColor: '#e0e0e0', color: '#161616' };
                                  }
                                  return (
                                    <TableCell key={cell.id} style={{ ...columnWidths['sentiment'], textAlign: 'left', verticalAlign: 'middle' }}>
                                      <Tag type={type} size="md" style={customStyle}>{label}</Tag>
                                    </TableCell>
                                  );
                                }
                                if (headerKey === 'summary') {
                                  const value = cell.value || '';
                                  const entityCell = row.cells.find(c => c.info.header === 'entity');
                                  const dateCell = row.cells.find(c => c.info.header === 'date');
                                  const uniqueKey = `${entityCell ? entityCell.value : ''}__${dateCell ? dateCell.value : ''}__${value}`;
                                  const isThumbUp = thumbs[uniqueKey] === 'up';
                                  const isThumbDown = thumbs[uniqueKey] === 'down';
                                  return (
                                    <TableCell key={cell.id} style={{ ...columnWidths['summary'], textAlign: 'left', verticalAlign: 'middle', paddingRight: 0 }}>
                                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                                        <div style={{
                                          display: '-webkit-box',
                                          WebkitLineClamp: 3,
                                          WebkitBoxOrient: 'vertical',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          maxHeight: '4.5em',
                                          lineHeight: '1.5em',
                                          minWidth: 0,
                                          flex: 1,
                                          wordBreak: 'break-word',
                                          fontSize: 14,
                                          color: '#222',
                                          background: 'none',
                                        }} title={value}>
                                          {value}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 24, padding: '10px', outline: 'none' }}>
                                          <ThumbsUp
                                            size={18}
                                            style={{ cursor: 'pointer', color: isThumbUp ? '#0E6027' : '#888', background: isThumbUp ? '#A7F0BA' : 'transparent', borderRadius: 4, padding: 2 }}
                                            onClick={() => {
                                              setThumbs(t => {
                                                const newState = { ...t, [uniqueKey]: t[uniqueKey] === 'up' ? 'none' : 'up' };
                                                localStorage.setItem('tablee_thumbs', JSON.stringify(newState));
                                                return newState;
                                              });
                                            }}
                                            title="Thumbs Up"
                                          />
                                          <ThumbsDown
                                            size={18}
                                            style={{ cursor: 'pointer', color: isThumbDown ? '#A2191F' : '#888', background: isThumbDown ? '#FFD7D9' : 'transparent', borderRadius: 4, padding: 2 }}
                                            onClick={() => {
                                              setThumbs(t => {
                                                const newState = { ...t, [uniqueKey]: t[uniqueKey] === 'down' ? 'none' : 'down' };
                                                localStorage.setItem('tablee_thumbs', JSON.stringify(newState));
                                                return newState;
                                              });
                                            }}
                                            title="Thumbs Down"
                                          />
                                        </div>
                                      </div>
                                    </TableCell>
                                  );
                                }
                                if (headerKey === 'date') {
                                  const dateValue = (cell.value || '').split(',')[0];
                                  return (
                                    <TableCell key={cell.id} style={{ ...(columnWidths[headerKey] || {}), textAlign: 'left', verticalAlign: 'middle' }}>
                                      {dateValue}
                                    </TableCell>
                                  );
                                }
                                if (["source", "summary", "type","source"].includes(headerKey)) {
                                  return (
                                    <TableCell key={cell.id} style={{ ...(columnWidths[headerKey] || {}), textAlign: 'left', verticalAlign: 'middle', maxWidth: headerKey === 'summary' ? 120 : undefined }}>
                                      <div style={{
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        maxWidth: headerKey === 'summary' ? 120 : undefined
                                      }}>
                                        <span title={cell.value}>{cell.value}</span>
                                      </div>
                                    </TableCell>
                                  );
                                }
                                if (headerKey === 'type') {
                                  return (
                                    <TableCell key={cell.id} style={{ ...(columnWidths[headerKey] || {}), textAlign: 'left', verticalAlign: 'middle', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: columnWidths[headerKey]?.width || '120px' }}>
                                      <span style={{ display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }} title={cell.value}>
                                        {cell.value}
                                      </span>
                                    </TableCell>
                                  );
                                }
                                return (
                                  <TableCell key={cell.id} style={{ ...(columnWidths[headerKey] || {}), textAlign: 'left', verticalAlign: 'middle' }}>
                                    {cell.value}
                                  </TableCell>
                                );
                              })}
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              )}
            </DataTable>
            <div>
              <Pagination
                backwardText="Previous page"
                forwardText="Next page"
                itemsPerPageText="Items per page:"
                page={page}
                pageNumberText="Page Number"
                pageSize={pageSize}
                pageSizes={[10, 20, 30, 40, 50]}
                size="md"
                totalItems={archivedRows.length}
                onChange={({ page, pageSize }) => {
                  if (page !== undefined) setPage(page);
                  if (pageSize !== undefined) {
                    setPageSize(pageSize);
                    setPage(1);
                  }
                }}
              />
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
      
      {/* View Modal for all fields */}
      {viewRow && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.10)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: '"IBM Plex Sans", "Helvetica Neue", Arial, sans-serif'
        }}>
          <Tile style={{
            background: '#fff',
            // borderRadius: 8,
            padding: '20px 16px',
            minWidth: 480,
            maxWidth: 1000,
          

            width: '90vw',
            maxHeight: '80vh',
            boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            border: 'none',
            fontFamily: 'inherit',
            overflow: 'hidden',
          }}>
            <h3 style={{ marginTop: 0, marginBottom: 12, fontSize: 18, fontWeight: 600, letterSpacing: 0, color: '#161616', fontFamily: 'inherit' }}>Record Details</h3>
            <div style={{ marginBottom: 8, display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto', maxHeight: '55vh', minHeight: 0 }}>
              {Object.entries(viewRow).filter(([key]) => key !== 'actions').map(([key, value]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{
                    width: 100,
                    minWidth: 80,

                    fontWeight: 500,
                    textAlign: 'left',
                    paddingRight: 0,
                    lineHeight: '1.5',
                    fontSize: 13,
                    color: '#393939',
                    fontFamily: 'inherit'
                  }}>{key}:</div>
                  <div style={{
                    flex: 1,
                    wordBreak: 'break-word',
                    lineHeight: '1.5',
                    textAlign: 'left',
                    whiteSpace: key === 'summary' ? 'pre-wrap' : 'pre-line',
                    fontSize: 13,
                    color: '#161616',
                    fontFamily: 'inherit',
                    maxHeight: key === 'summary' ? '120px' : undefined,
                    overflowY: key === 'summary' ? 'auto' : undefined,
                  }}>{value || '--'}</div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'right' }}>
              <button
                onClick={() => setViewRow(null)}
                style={{
                  background: '#DA1E28',
                  color: '#fff',
                  border: 'none',
                  // borderRadius: 4,
                  padding: '6px 18px',
                  fontSize: 14,
                  fontWeight: 500,
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  boxShadow: 'none',
                  letterSpacing: 0.2
                }}
              >
                Close
              </button>
            </div>
          </Tile>
        </div>
      )}
      
      {/* Export Dialog */}
      {exportDialog && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.15)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', padding: 32, borderRadius: 8, minWidth: 320, boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}>
            <h4 style={{ marginTop: 0 }}>Export Brief Summary</h4>
            <div style={{ margin: '18px 0' }}>
              <button style={{ marginRight: 12, padding: '8px 18px', background: '#0f62fe', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }} onClick={() => doExport('all')}>All</button>
              <button style={{ marginRight: 12, padding: '8px 18px', background: '#A7F0BA', color: '#0E6027', border: 'none', borderRadius: 4, cursor: 'pointer' }} onClick={() => doExport('up')}><ThumbsUp size={16} style={{ marginRight: 4, verticalAlign: 'middle' }} />Thumbs Up</button>
              <button style={{ padding: '8px 18px', background: '#FFD7D9', color: '#A2191F', border: 'none', borderRadius: 4, cursor: 'pointer' }} onClick={() => doExport('down')}><ThumbsDown size={16} style={{ marginRight: 4, verticalAlign: 'middle' }} />Thumbs Down</button>
            </div>
            <button style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 4, padding: '6px 18px', fontSize: 15, cursor: 'pointer' }} onClick={() => setExportDialog(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Archive Confirmation Modal */}
      {archiveConfirm.open && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.25)', zIndex: 20000, display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: '#fff', borderRadius: 8, padding: '32px 40px',
            minWidth: 320, maxWidth: 400, boxShadow: '0 4px 24px rgba(0,0,0,0.12)'
          }}>
            <h4 style={{ marginTop: 0 }}>Are you sure you want to archive this record?</h4>
            <div style={{ marginBottom: 18, color: '#888' }}>
              {archiveConfirm.row?.entity || archiveConfirm.row?.company || archiveConfirm.row?.promoter || 'This record'}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
              <button
                onClick={() => setArchiveConfirm({ open: false, row: null })}
                style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 4, padding: '6px 18px', fontSize: 15, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleArchive(archiveConfirm.row)}
                style={{ background: '#1192E8', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 18px', fontSize: 15, cursor: 'pointer' }}
              >
                Archive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Dialog for Archived Records */}
      {exportArchiveDialog && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.15)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', padding: 32, borderRadius: 8, minWidth: 320, boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}>
            <h4 style={{ marginTop: 0 }}>Export Archived Records</h4>
            <div style={{ margin: '18px 0' }}>
              <span style={{ fontSize: 16 }}>Do you want to export the archived records?</span>
            </div>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
              <button style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 4, padding: '6px 18px', fontSize: 15, cursor: 'pointer' }} onClick={() => setExportArchiveDialog(false)}>Cancel</button>
              <button style={{ marginRight: 0, padding: '8px 18px', background: '#0f62fe', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }} onClick={doExportArchived}>Export</button>
            </div>
          </div>
        </div>
      )}

      {/* Restore Confirmation Modal */}
      {restoreConfirm.open && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.25)', zIndex: 20000, display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: '#fff', borderRadius: 8, padding: '32px 40px',
            minWidth: 320, maxWidth: 400, boxShadow: '0 4px 24px rgba(0,0,0,0.12)'
          }}>
            <h4 style={{ marginTop: 0 }}>Do you want to un-archive this record?</h4>
            <div style={{ marginBottom: 18, color: '#888' }}>
              {restoreConfirm.row?.entity || restoreConfirm.row?.company || restoreConfirm.row?.promoter || 'This record'}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
              <button
                onClick={() => setRestoreConfirm({ open: false, row: null })}
                style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 4, padding: '6px 18px', fontSize: 15, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleRestore(restoreConfirm.row);
                  setRestoreConfirm({ open: false, row: null });
                }}
                style={{ background: '#1192E8', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 18px', fontSize: 15, cursor: 'pointer' }}
              >
                Un-archive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tablee;
