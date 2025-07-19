import React, { useState, useRef } from "react";
import "./EntityInputForm.css";
import Navigation from "../Navigation";
import { InlineLoading } from '@carbon/react';
import { CaretDown } from '@carbon/icons-react';


let results_arr = [];
// Add the API call function
async function clearEntitiesAPI(entities) {
  
  const response = await fetch(
    'https://anc-kaara.lemoncoast-3e44e81a.eastus2.azurecontainerapps.io/clear_entities',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ entities }),
    }
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

export default function EntityInputForm() {
  // State for Manual Entry
  const [manualType, setManualType] = useState("");
  const [manualEntity, setManualEntity] = useState("");
  const [manualYears, setManualYears] = useState("");
  const [manualCompanyName, setManualCompanyName] = useState("");
  const [manualEntities, setManualEntities] = useState([]);

  // State for Bulk Upload
  const [bulkFiles, setBulkFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const canAdd = manualType && manualEntity.trim();

  const handleAdd = () => {
    if (canAdd) {
      setManualEntities([
        ...manualEntities,
        { name: manualEntity.trim(), type: manualType, years: manualYears }
      ]);
      setManualEntity("");
      setManualYears("");
    }
  };

  const handleRemove = idx => {
    setManualEntities(manualEntities.filter((_, i) => i !== idx));
  };

  // Bulk upload handlers
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.name.endsWith('.csv') || file.name.endsWith('.xlsx')
    );
    setBulkFiles(files);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).filter(file =>
      file.name.endsWith('.csv') || file.name.endsWith('.xlsx')
    );
    setBulkFiles(files);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Add handler for Start Processing
  const handleStartProcessing = async () => {
    setLoading(true);
    console.log("handle processing method called...");
    const entities = manualEntities.map(e => ({
      name: e.name,
      entity_type: e.type,
      years: e.years, // add this line
      additional_info: manualType
    }));
    try {
      const result = await clearEntitiesAPI(entities);
    // Pass response up
      // Store result in localStorage
      try {
        localStorage.setItem('entityResults', JSON.stringify(result.results));
      } catch (e) {
        console.error('Failed to save entity results to localStorage:', e);
      }
      console.log('API result:', result);
      results_arr.push(result);
      console.log("results...",results_arr);
    
      // You can pass result to another component or show a notification here
    } catch (error) {
      console.error('API error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navigation/>
    {/* {loading && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(255,255,255,0.7)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <InlineLoading
            description="Loading"
            iconDescription="Loading data..."
          />
        </div>
      )} */}
    <div className="entity-input-form-container" style={{marginTop:10}}>
      {/* Top Card with heading and subtitle */}
      <div className="entity-input-form-card">
        <div className="entity-input-heading-block">
          <h1 className="entity-input-main-heading" style={{ marginBottom: 12 }}>Entity Input</h1>
          <p className="entity-input-subtitle">
            Fill out the form below to submit a new Insurance claim on behalf of the patient
          </p>
        </div>
      </div>
      {/* Main content cards layout */}
      <div style={{ display: "flex", justifyContent: "center", gap: 0, marginTop: 32 }}>
        {/* Manual Entry Card */}
        <div className="entity-input-form-content-card" style={{ boxShadow: '0px 7px 10px 0px #BCAAA033' }}>
          <span
            style={{
              display: 'inline-block',
              width: 140,
              height: 28,
              fontFamily: 'Fixed, Heading, Heading 03, sans-serif',
              fontWeight: 400,
              fontStyle: 'normal',
              fontSize: 20,
              lineHeight: '28px',
              letterSpacing: 0,
              color: 'var(--Text-text-primary, #161616)',
              background: 'transparent',
              opacity: 1,
              marginBottom: 16
            }}
          >
            Manual Entry
          </span>

          {/* Type and Years row */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: 400, marginBottom: 8 }}>Type</label>
              <select
                className="manual-entry-type-select"
                value={manualType}
                onChange={e => setManualType(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="">Choose Type</option>
                <option value="Company">Company</option>
                <option value="Promoter">Promoter</option>
                <option value="Director">Director</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: 400, marginBottom: 8 }}>
                Years <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Years"
                className="manual-entry-years-input"
                value={manualYears}
                onChange={e => setManualYears(e.target.value.replace(/[^0-9]/g, ''))}
                maxLength={3}
                autoComplete="off"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Company name */}
          <label style={{ display: 'block', fontWeight: 400, fontSize: '0.875rem', color: '#525252', margin: '8px 0 8px 0' }}>
            Company name <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="text"
            placeholder="Enter Company Name"
            className="manual-entry-entity-name-input"
            style={{ height: '40px', width: '100%', marginBottom: 8,color: 'black' }}
            value={manualCompanyName}
            onChange={e => setManualCompanyName(e.target.value)}
          />

          {/* Entity Name and Add+ row */}
          <label style={{ display: 'block', fontWeight: 400, marginBottom: 8 }}>Entity Name</label>
          <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
            <input
              type="text"
              placeholder="Enter Entity Name"
              className="manual-entry-entity-name-input"
              value={manualEntity}
              onChange={e => setManualEntity(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
              style={{ height: '40px', flex: 2 }}
            />
            <button
              style={{
                width: 100,
                background: canAdd ? '#0f62fe' : '#ccc',
                color: canAdd ? '#fff' : '#888',
                fontSize: 18,
                border: 'none',
                height: 40,
                cursor: canAdd ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontWeight: 400,
                transition: 'background 0.2s'
              }}
              disabled={!canAdd}
              onClick={handleAdd}
            >
              Add <span style={{ fontSize: 22, fontWeight: 400, marginLeft: 4 }}>+</span>
            </button>
          </div>

          {/* Added Entities and empty input box */}
          <label style={{ display: 'block', fontWeight: 400, marginBottom: 8 }}>Added Entities ({manualEntities.length})</label>
          <div className="manual-entry-added-entities-box">
            {manualEntities.map((entity, idx) => (
              <span key={idx} className="manual-entry-entity-chip">
                {entity.name}
                <button
                  onClick={() => handleRemove(idx)}
                  aria-label={`Remove ${entity.name}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
        {/* Bulk Upload Card */}
        <div className="entity-input-form-content-card">
          {/* Bulk Upload Section */}
          <span
            style={{
              display: 'inline-block',
              width: 110,
              height: 28,
              fontFamily: 'Fixed, Heading, Heading 03, sans-serif',
              fontWeight: 400,
              fontStyle: 'normal',
              fontSize: 20,
              lineHeight: '28px',
              letterSpacing: 0,
              color: 'var(--Text-text-primary, #161616)',
              background: 'transparent',
              opacity: 1,
              marginBottom: 8
            }}
          >
            Bulk Upload
          </span>
          <div style={{ marginBottom: 16 }}>
            <p className="cds--file--label" style={{ fontWeight: 'bold', marginBottom: 4 }}>
              Upload should contain Company Name, Entity Name, Years. these coloums.
            </p>
            <p className="cds--label-description" style={{ color: '#666', fontSize: 14, marginBottom: 16 }}>
              Max file size is 5 MB. Supported file types are .csv and .xlsx.
            </p>
            {/* FileUploaderDropContainer functional */}
            <div
              style={{
                border: '2px dashed #888',
                padding: '16px 32px',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'flex-start',
                minHeight: 80,
                cursor: 'pointer',
                background: '#fafafa',
                borderRadius: 0,
                marginBottom: 16,
                color: '#0f62fe', // blue color for the text
                fontWeight: 500
              }}
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
            >
              Drag and drop files here or click to upload
              <input
                type="file"
                accept=".csv, .xlsx"
                multiple
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
            {/* Show selected files */}
            {bulkFiles.length > 0 && (
              <div style={{ marginTop: 8, color: '#222', fontSize: 15, display: 'flex', alignItems: 'center', gap: 12 }}>
                {bulkFiles.map((file, idx) => (
                  <span
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: '#e0e0e0',
                      borderRadius: 20,
                      padding: '6px 16px',
                      fontSize: 16,
                      marginRight: 8,
                    }}
                  >
                    {file.name}
                    <button
                      onClick={e => {
                        e.stopPropagation(); // Prevent parent click
                        setBulkFiles(bulkFiles.filter((_, i) => i !== idx));
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#888',
                        marginLeft: 8,
                        fontSize: 18,
                        cursor: 'pointer',
                        lineHeight: 1,
                      }}
                      aria-label={`Remove ${file.name}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="cds--file-container cds--file-container--drop" />
          </div>
        </div>
      </div>
      {/* Instructions Card */}
      <div style={{
        background: '#F7F3F2',
        width: '100%',
        marginTop: 32,
        padding: 32,
        borderRadius: 0,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 180,
        position: 'relative'
      }}>
        <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>Instructions</div>
        <ol style={{ color: '#444', fontSize: 15, marginLeft: 18, marginBottom: 0, paddingLeft: 0 }}>
          <li style={{ marginBottom: 6 }}>1. Processing will search for news articles and perform risk analysis.</li>
          <li style={{ marginBottom: 6 }}>2. Estimated time: 2-5 minutes per entity</li>
          <li>3. You will be notified when processing is complete.</li>
        </ol>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 0, marginTop: 32 }}>
          <button
            style={{
              background: '#393939',
              color: '#fff',
              border: 'none',
              padding: '12px 32px',
              fontSize: 15,
              fontWeight: 400,
              borderRadius: 0,
              marginRight: 2,
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            Cancel
          </button>
          <button
            style={{
              background: '#D7262C',
              color: '#fff',
              border: 'none',
              padding: '12px 32px',
              fontSize: 15,
              fontWeight: 400,
              borderRadius: 0,
              marginLeft: 2,
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onClick={handleStartProcessing}
            disabled={loading}
          >
            Start Processing
          </button>
          {loading && (
            <InlineLoading
              description="Loading"
              iconDescription="Loading data..."
              style={{ marginLeft: 16 }}
            />
          )}
        </div>
      </div>
    </div>
    </>
  );
}