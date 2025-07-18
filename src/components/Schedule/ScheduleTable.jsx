import React, { useState } from 'react';
import './ScheduleTable.css';
import { Tab, TabPanels, TabPanel, Tabs, TabList, Button, TextInput, Select, SelectItem, FormItem, FileUploaderDropContainer, OverflowMenu, OverflowMenuItem } from '@carbon/react';
import { OverflowMenuVertical } from '@carbon/icons-react';

const ScheduleTablee = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const scheduleItems = [
    { label: "Start Time", time: "09:00 AM" },
    { label: "Frequency", time: "05:00 PM" },
    { label: "Last Run", time: "01:00 PM" },
    { label: "Entities", time: "03:00 PM" },
    { label: "Status", time: "04:30 PM" }
  ];
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
                      id="schedule-name-input"
                      labelText="Schedule Name"
                      placeholder="Enter Schedule Name"
                      size="md"
                      type="text"
                      style={{ width: 421.33 }}
                    />
                  </div>
                  <div className="schedule-field">
                    <Select
                      id="frequency-select"
                      labelText="Frequency"
                      size="md"
                      style={{ width: 421.33 }}
                      className="input-test-class"
                      defaultValue=""
                    >
                      <SelectItem value="" text="Select Frequency" />
                      <SelectItem value="daily" text="Daily" />
                      <SelectItem value="weekly" text="Weekly" />
                      <SelectItem value="monthly" text="Monthly" />
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
                      labelText=" "
                      placeholder="hh:mm"
                      size="md"
                      type="text"
                      style={{marginRight: 0, borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                      className="input-test-class schedule-time-input-carbon hrs-input"
                    />
                    </div>
                    <div>
                    <Select
                      id="am-pm-select"
                      labelText=" "
                      size="md"
                      style={{marginRight: 0, borderRadius: 0 }}
                      className="input-test-class schedule-time-input-carbon am-pm"
                      defaultValue="AM"
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
                      defaultValue=""
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
          <div className="schedule-actions-row">
            <Button kind="secondary" className="schedule-cancel-btn">Cancel</Button>
            <Button kind="danger" className="schedule-create-btn">Create Schedule</Button>
          </div>
        </>
      )}
      {selectedTab === 1 && (
        <div className="active-schedules-block">
          <div className="active-schedule-card">
            <div className="active-schedule-card-header">
              <div className="active-schedule-card-header-content">
                <span className="active-schedule-title">Daily Risk Scan</span>
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
                  <OverflowMenuItem itemText="View" />
                  <OverflowMenuItem itemText="Pause" />
                  <OverflowMenuItem itemText="Delete" />
                </OverflowMenu>
              </div>
            </div>
            <div className="active-schedule-card-body">
              <div className="active-schedule-body-list">
                {scheduleItems.map((item, idx) => (
                  <div className="active-schedule-body-list-item" key={idx}>
                    <div className="active-schedule-list-icon" />
                    <div className="active-schedule-list-label">{item.label}</div>
                    <div className="active-schedule-list-time">{item.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="active-schedule-card">
            <div className="active-schedule-card-header">
              <div className="active-schedule-card-header-content">
                <span className="active-schedule-title">Daily Risk Scan</span>
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
                  <OverflowMenuItem itemText="View" />
                  <OverflowMenuItem itemText="Pause" />
                  <OverflowMenuItem itemText="Delete" />
                </OverflowMenu>
              </div>
            </div>
            <div className="active-schedule-card-body">
              <div className="active-schedule-body-list">
                {scheduleItems.map((item, idx) => (
                  <div className="active-schedule-body-list-item" key={idx}>
                    <div className="active-schedule-list-icon" />
                    <div className="active-schedule-list-label">{item.label}</div>
                    <div className="active-schedule-list-time">{item.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="active-schedule-card">
            <div className="active-schedule-card-header">
              <div className="active-schedule-card-header-content">
                <span className="active-schedule-title">Daily Risk Scan</span>
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
                  <OverflowMenuItem itemText="View" />
                  <OverflowMenuItem itemText="Pause" />
                  <OverflowMenuItem itemText="Delete" />
                </OverflowMenu>
              </div>
            </div>
            <div className="active-schedule-card-body">
              <div className="active-schedule-body-list">
                {scheduleItems.map((item, idx) => (
                  <div className="active-schedule-body-list-item" key={idx}>
                    <div className="active-schedule-list-icon" />
                    <div className="active-schedule-list-label">{item.label}</div>
                    <div className="active-schedule-list-time">{item.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleTablee;
 