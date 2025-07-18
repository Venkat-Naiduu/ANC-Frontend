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
  Button
} from '@carbon/react';

import { Filter } from '@carbon/icons-react';
import { Download, View, TrashCan, Link } from '@carbon/icons-react';
import { Tab, TabPanels, TabPanel, Tabs, TabList } from '@carbon/react';

const headers = [
  { key: 'type', header: 'Type' },
  { key: 'entity', header: 'Entity Name' },
  { key: 'date', header: 'Date' },
  { key: 'source', header: 'Source' },
  { key: 'relevance', header: 'Relevance' },
  { key: 'sentiment', header: 'Sentiment' },
  { key: 'summary', header: 'Brief Summary' },
  { key: 'actions', header: 'Actions' },
];

const Tablee = () => {
  const [rows, setRows] = useState([]);
  const [loadingRows, setLoadingRows] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewRow, setViewRow] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, row: null });

  // Add delete handler
  const handleDelete = (row) => {
    // Remove the row from the data
    setRows(prevRows => prevRows.filter(r => r.id !== row.id));
    setDeleteConfirm({ open: false, row: null });
  };

  // Add export functionality
  const exportToCSV = () => {
    const headers = [
      { key: 'type', header: 'Type' },
      { key: 'entity', header: 'Entity Name' },
      { key: 'date', header: 'Date' },
      { key: 'source', header: 'Source' },
      { key: 'relevance', header: 'Relevance' },
      { key: 'sentiment', header: 'Sentiment' },
      { key: 'summary', header: 'Brief Summary' },
    ];
    
    const csvRows = [headers.map(h => h.header).join(",")];
    rows.forEach((row, idx) => {
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

  useEffect(() => {
    setLoadingRows(true);
    // fetch('http://localhost:8000/dashboard-data')
    //   .then(res => res.json())
    //   .then(data => {
    //     setRows(Array.isArray(data) ? data : (data.data || []));
    //     setLoadingRows(false);
    //   })
    //   .catch(() => setLoadingRows(false));

    const data = localStorage.getItem("entityResults",[]);
    console.log("data...",data)
    
  }, []);

  const totalItems = rows.length;
  const pagedRows = rows.slice((page - 1) * pageSize, page * pageSize);

  const columnWidths = {
    type: { width: '120px', minWidth: '120px', maxWidth: '120px' },
    entity: { width: '160px', minWidth: '160px', maxWidth: '160px' },
    date: { width: '120px', minWidth: '120px', maxWidth: '120px' },
    source: { minWidth: '160px' },
    relevance: { minWidth: '140px' },
    sentiment: { width: '140px', minWidth: '140px', maxWidth: '140px' },
    summary: { minWidth: '360px' },
    actions: { width: '160px', minWidth: '160px', maxWidth: '160px', textAlign: 'center' },
  };

  const statusOptions = [
    { value: '', text: 'All' },
    { value: 'Positive', text: 'Positive' },
    { value: 'Negative', text: 'Negative' },
  ];

  return (
    <div className="tablesection">
      <Tabs onTabCloseRequest={() => { }}>
        <TabList scrollDebounceWait={200}>
          <Tab>Entity Records</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <TableToolbar size="sm" className="custom-toolbar">
              <TableToolbarContent className="custom-toolbar-content">
                <TableToolbarSearch placeholder="Search" />
                <TableToolbarMenu
                  iconDescription="Filter options"
                  renderIcon={Filter}
                >
                  <MenuItem>Approved</MenuItem>
                  <MenuItem>Pending</MenuItem>
                  <MenuItem>Rejected</MenuItem>
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
                      {headers.map((header) => (
                        <TableHeader
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
                      rows.map((row) => (
                        <TableRow {...getRowProps({ row })}>
                          {row.cells.map((cell) => {
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
                                    <a href={link} target="_blank" rel="noopener noreferrer" style={{ ...boxStyle, textDecoration: 'none' }}>
                                      <Link size={20} style={{ color: '#2563eb' }} />
                                    </a>
                                    <div style={boxStyle} onClick={() => {
                                      console.log('View icon clicked');
                                      console.log('Row data:', row.original);
                                      setViewRow(row.original);
                                    }}>
                                      <View size={20} />
                                    </div>
                                    <div style={boxStyle} onClick={() => setDeleteConfirm({ open: true, row: row.original })}>
                                      <TrashCan size={20} />
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
                              let bg = '#eee';
                              let color = '#333';
                              let label = cell.value;
                              if (cell.value === 'Positive') {
                                bg = '#A7F0BA';
                                color = '#0E6027';
                              } else if (cell.value === 'Negative') {
                                bg = '#FFD7D9';
                                color = '#A2191F';
                              } else if (cell.value === 'Neutral') {
                                bg = '#E0E0E0';
                                color = '#393939';
                              }
                              return (
                                <TableCell key={cell.id} style={{ ...columnWidths['sentiment'], textAlign: 'left', verticalAlign: 'middle' }}>
                                  <span style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minWidth: 61,
                                    height: 24,
                                    borderRadius: 24,
                                    padding: '3px 12px',
                                    background: bg,
                                    color: color,
                                    fontWeight: 400,
                                    fontSize: 13,
                                    textAlign: 'center',
                                    lineHeight: '18px',
                                  }}>{label}</span>
                                </TableCell>
                              );
                            }

                            // Handle ellipsis for 'source' and 'summary'
                            if (['source', 'summary'].includes(headerKey)) {
                              return (
                                <TableCell key={cell.id} style={{ ...(columnWidths[headerKey] || {}), textAlign: 'left', verticalAlign: 'middle' }}>
                                  <div style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                  }}>
                                    <span title={cell.value}>{cell.value}</span>
                                  </div>
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
                      ))
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
        </TabPanels>
      </Tabs>
      
      {/* View Modal for all fields */}
      {viewRow && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh', 
          background: 'rgba(0,0,0,0.25)', 
          zIndex: 10000, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          {console.log('Modal is rendering with viewRow:', viewRow)}
          <div style={{ 
            background: '#fff', 
            borderRadius: 0, 
            padding: '12px 36px', 
            minWidth: 480, 
            maxWidth: 900, 
            width: '100%', 
            boxShadow: '0 4px 24px rgba(0,0,0,0.12)' 
          }}>
            <h3 style={{ marginTop: 0 }}>Details</h3>
            <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 7 }}>
              {exportHeaders.filter(h => h.key !== 'srNo').map((h, idx) => (
                <div key={h.key} style={{ display: 'flex', alignItems: 'flex-start', gap: 24 }}>
                  <div style={{ 
                    width: 200, 
                    minWidth: 140, 
                    fontWeight: 600, 
                    textAlign: 'left', 
                    paddingRight: 0, 
                    lineHeight: '1.5' 
                  }}>
                    {h.header}:
                  </div>
                  <div style={{ 
                    flex: 1, 
                    wordBreak: 'break-word', 
                    lineHeight: '1.5', 
                    textAlign: 'left' 
                  }}>
                    {viewRow[h.key] || '--'}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'right' }}>
              <button 
                onClick={() => setViewRow(null)} 
                style={{ 
                  background: '#2563eb', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: 4, 
                  padding: '6px 18px', 
                  fontSize: 15, 
                  cursor: 'pointer' 
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {deleteConfirm.open && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.25)', zIndex: 20000, display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: '#fff', borderRadius: 8, padding: '32px 40px',
            minWidth: 320, maxWidth: 400, boxShadow: '0 4px 24px rgba(0,0,0,0.12)'
          }}>
            <h4 style={{ marginTop: 0 }}>Are you sure you want to delete this record?</h4>
            <div style={{ marginBottom: 18, color: '#888' }}>
              {deleteConfirm.row?.entity || deleteConfirm.row?.company || deleteConfirm.row?.promoter || 'This record'}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
              <button
                onClick={() => setDeleteConfirm({ open: false, row: null })}
                style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 4, padding: '6px 18px', fontSize: 15, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.row)}
                style={{ background: '#da1e28', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 18px', fontSize: 15, cursor: 'pointer' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tablee;
