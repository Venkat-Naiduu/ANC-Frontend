import React, { useState, useEffect } from 'react';
import './ScheduleTable.css';
import { Tab, TabPanels, TabPanel, Tabs, TabList, Button, TextInput, Select, SelectItem, FormItem, FileUploaderDropContainer, OverflowMenu, OverflowMenuItem, ToastNotification } from '@carbon/react';
import { OverflowMenuVertical, Time, Calendar, Timer, Task, CheckmarkOutline } from '@carbon/icons-react';
import { useNavigate } from 'react-router-dom';
 
const ScheduleTablee = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  // New state for form fields and popup
  const [companyName, setCompanyName] = useState('');
  const [frequency, setFrequency] = useState('');
  const [entityName, setEntityName] = useState('');
  const [time, setTime] = useState('');
  const [ampm, setAmpm] = useState('AM');
  const [timezone, setTimezone] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  const [notification, setNotification] = useState({ type: '', message: '', show: false });
  const [activeSchedules, setActiveSchedules] = useState([]);
  
  // Pagination state for Active Schedules
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 3;

  const navigate = useNavigate();

  useEffect(() => {
    if (selectedTab === 1) {
      fetch('http://127.0.0.1:8000/api/active-schedules')
        .then(res => res.json())
        .then(data => setActiveSchedules(Array.isArray(data) ? data : []))
        .catch(() => setActiveSchedules([]));
    }
  }, [selectedTab]);

  // Pagination logic for Active Schedules
  const totalPages = Math.ceil(activeSchedules.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const currentSchedules = activeSchedules.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
 
  const getIconForLabel = (label) => {
    const iconStyle = { width: 16, height: 16, transform: 'rotate(0deg)', opacity: 1 };
    switch (label) {
      case "Start Time":
        return <Time style={iconStyle} />;
      case "Frequency":
        return <Calendar style={iconStyle} />;
      case "Last Run":
        return <Timer style={iconStyle} />;
      case "Entities":
        return <Task style={iconStyle} />;
      case "Status":
        return <CheckmarkOutline style={iconStyle} />;
      default:
        return null;
    }
  };
  return (
    <div className="tablesection">
      <Tabs onTabCloseRequest={() => { }} selectedIndex={selectedTab} onChange={({ selectedIndex }) => setSelectedTab(selectedIndex)}>
        <TabList scrollDebounceWait={200} >
          <Tab>Create New Schedule</Tab>
          <Tab>Active Schedules</Tab>
        </TabList>
      </Tabs>
      {selectedTab === 0 && (
        <>
          <div className="schedule-content-block">
            <div className="schedule-content-title">Create New Schedule</div>
            <div className="schedule-inner-block">
              <div className="schedule-top-row">
                <div className="schedule-row schedule-row-fields">
                  <div className="schedule-field">
                    <TextInput
                      className="input-test-class"
                      id="company-name-input"
                      labelText={<span>Company Name <span style={{ color: 'red' }}>*</span></span>}
                      placeholder="Enter Company Name"
                      size="md"
                      type="text"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      style={{ width: 421.33 }}
                      required
                    />
                  </div>
                  <div className="schedule-field">
                    <Select
                      id="frequency-select"
                      labelText={<span>Frequency <span style={{ color: 'red' }}>*</span></span>}
                      size="md"
                      style={{ width: 421.33 }}
                      className="input-test-class"
                      value={frequency}
                      onChange={e => setFrequency(e.target.value)}
                      required
                    >
                      <SelectItem value="" text="Select Frequency" />
                      <SelectItem value="daily" text="Daily" />
                      <SelectItem value="weekly" text="Weekly" />
                      <SelectItem value="monthly" text="Monthly" />
                      <SelectItem value="yearly" text="Yearly" />
                    </Select>
                  </div>
                  <div className="schedule-field">
                    <TextInput
                      className="input-test-class"
                      id="entity-name-input"
                      labelText="Entity Name"
                      placeholder="Enter Entity Name"
                      size="md"
                      type="text"
                      value={entityName}
                      onChange={e => setEntityName(e.target.value)}
                      style={{ width: 421.33 }}
                    />
                  </div>
                </div>
                <div className="schedule-row-time">
                  <div className="schedule-time-label">Choose a time</div>
                  <div className="schedule-time-inputs">
                    <div>
                    <TextInput
                      id="time-input"
                      labelText={<span>Time <span style={{ color: 'red' }}>*</span></span>}
                      placeholder="hh:mm"
                      size="md"
                      type="text"
                      value={time}
                      onChange={e => {
                        let val = e.target.value.replace(/[^0-9:]/g, '');
                        // Auto-insert ':' after 2 digits
                        if (val.length === 2 && !val.includes(':')) val = val + ':';
                        // Restrict to hh:mm format
                        if (val.length > 5) val = val.slice(0, 5);
                        // Validate hours and minutes
                        const [hh, mm] = val.split(':');
                        let newVal = val;
                        if (hh && Number(hh) > 12) newVal = '12' + (mm !== undefined ? ':' + mm : '');
                        if (mm && Number(mm) > 59) newVal = (hh || '00') + ':59';
                        setTime(newVal);
                      }}
                      style={{marginRight: 0, borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                      className="input-test-class schedule-time-input-carbon hrs-input"
                      required
                    />
                    </div>
                    <div>
                    <Select
                      id="am-pm-select"
                      labelText=" "
                      size="md"
                      style={{marginRight: 0, borderRadius: 0 }}
                      className="input-test-class schedule-time-input-carbon am-pm"
                      value={ampm}
                      onChange={e => setAmpm(e.target.value)}
                    >
                      <SelectItem value="AM" text="AM" />
                      <SelectItem value="PM" text="PM" />
                    </Select>
                    </div>
                    <div>
                    <Select
                      id="timezone-select"
                      labelText=" "
                      size="md"
                      style={{width:160, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                      className="input-test-class schedule-time-input-carbon time-zone"
                      value={timezone}
                      onChange={e => setTimezone(e.target.value)}
                    >
                      <SelectItem value="" text="Timezone" />
                      <SelectItem value="IST" text="IST" />
                      <SelectItem value="UTC" text="UTC" />
                      {/* Add more timezones as needed */}
                    </Select>
                    </div>
                   
                  </div>
                </div>
                <div className="schedule-divider" />
              </div>
              <div className="schedule-bulk-upload">
                <div className="bulk-upload-title"></div>
                <div className="bulk-upload-desc">
                 
                </div>
                <FormItem>
                  <p className="cds--file--label">
                   Bulk Upload
                  </p>
                  <p className="cds--label-description">
                    Supported file types are .csv and .xlsx.
                  </p>
                  <FileUploaderDropContainer
                    accept={['.csv', '.xlsx']}
                    labelText="Drag and drop files here or click to upload"
                    multiple
                    name=""
                    onAddFiles={() => {}}
                    onChange={() => {}}
                    tabIndex={0}
                  />
                  <div className="cds--file-container cds--file-container--drop" />
                </FormItem>
              </div>
            </div>
          </div>
          {formError && <div style={{ color: 'red', margin: '12px 0 0 24px', fontWeight: 500 }}>{formError}</div>}
          <div className="schedule-actions-row">
            <Button kind="secondary" className="schedule-cancel-btn" onClick={() => {
              setCompanyName(''); setFrequency(''); setEntityName(''); setTime(''); setAmpm('AM'); setTimezone(''); setFormError('');
            }}>Cancel</Button>
            <Button kind="danger" className="schedule-create-btn" onClick={async () => {
              setFormError('');
              if (!companyName.trim() || !frequency || !time.trim()) {
                setNotification({ type: 'error', message: 'Please fill all required fields.', show: true });
                return;
              }
              // Prepare data
              const data = {
                companyName,
                frequency,
                entityName,
                time: `${time} ${ampm}`,
                timezone
              };
              try {
                const res = await fetch('/api/new-schedule', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(data)
                });
                if (res.ok) {
                  setNotification({ type: 'success', message: 'Successfully created schedule', show: true });
                  setCompanyName(''); setFrequency(''); setEntityName(''); setTime(''); setAmpm('AM'); setTimezone('');
                } else {
                  setNotification({ type: 'error', message: 'Failed to create schedule.', show: true });
                }
              } catch {
                setNotification({ type: 'error', message: 'Failed to create schedule.', show: true });
              }
            }}>Create Schedule</Button>
          </div>
          {showSuccess && (
            <div style={{ position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)', background: '#A7F0BA', color: '#0E6027', padding: '16px 32px', borderRadius: 8, fontWeight: 600, fontSize: 18, zIndex: 9999 }}>
              Successfully created schedule
            </div>
          )}
          {notification.show && (
            <ToastNotification
              kind={notification.type}
              title={notification.type === 'success' ? 'Success' : 'Error'}
              subtitle={notification.message}
              onCloseButtonClick={() => setNotification({ ...notification, show: false })}
              lowContrast
              style={{ position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)', zIndex: 9999 }}
            />
          )}
        </>
      )}
      {selectedTab === 1 && (
        <div className="active-schedules-block">
          <div className="active-schedules-content">
            {currentSchedules.map((schedule, idx) => (
              <div className="active-schedule-card" key={idx}>
                <div className="active-schedule-card-header">
                  <div className="active-schedule-card-header-content">
                    <span className="active-schedule-title">{schedule.companyName}</span>
                    <OverflowMenu
                      renderIcon={OverflowMenuVertical}
                      size="sm"
                      direction="bottom"
                      flipped={false}
                      iconDescription="Show more options"
                      aria-label="Show more options"
                      className="active-schedule-overflow-menu"
                      light
                      menuOptionsClass="active-schedule-overflow-options"
                      style={{ width: 32, height: 32, opacity: 1 }}
                    >
                      <OverflowMenuItem itemText="View" onClick={() => navigate('/active-records')} />
                      <OverflowMenuItem itemText="Pause" />
                      <OverflowMenuItem itemText="Delete" />
                    </OverflowMenu>
                  </div>
                </div>
                <div className="active-schedule-card-body">
                  <div className="active-schedule-body-list">
                    <div className="active-schedule-body-list-item">
                      <div className="active-schedule-list-icon">{<Time style={{ width: 16, height: 16 }} />}</div>
                      <div className="active-schedule-list-label">Start Time</div>
                      <div className="active-schedule-list-time">{schedule.starttime}</div>
                    </div>
                    <div className="active-schedule-body-list-item">
                      <div className="active-schedule-list-icon">{<Calendar style={{ width: 16, height: 16 }} />}</div>
                      <div className="active-schedule-list-label">Frequency</div>
                      <div className="active-schedule-list-time">{schedule.frequency}</div>
                    </div>
                    <div className="active-schedule-body-list-item">
                      <div className="active-schedule-list-icon">{<Timer style={{ width: 16, height: 16 }} />}</div>
                      <div className="active-schedule-list-label">Last Run</div>
                      <div className="active-schedule-list-time">{schedule.lastRun}</div>
                    </div>
                    <div className="active-schedule-body-list-item">
                      <div className="active-schedule-list-icon">{<Task style={{ width: 16, height: 16 }} />}</div>
                      <div className="active-schedule-list-label">Entity Name</div>
                      <div className="active-schedule-list-time">{schedule.entityName}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination Navigation */}
          {totalPages > 1 && (
            <div className="active-schedules-pagination">
              <button 
                className="pagination-arrow"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  opacity: currentPage === 1 ? 0.5 : 1,
                  padding: '8px',
                  fontSize: '16px'
                }}
              >
                ←
              </button>
              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              <button 
                className="pagination-arrow"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  opacity: currentPage === totalPages ? 0.5 : 1,
                  padding: '8px',
                  fontSize: '16px'
                }}
              >
                →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
 
export default ScheduleTablee;