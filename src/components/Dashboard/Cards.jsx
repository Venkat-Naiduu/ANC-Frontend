import './Cards.css'
import React, { useState, useEffect } from 'react';
import { Tile } from '@carbon/react'
import RedExportIcon from './approve.png'; // fallback if you want to use the new icon, replace with correct path if needed


const base_url = "https://anc-kaara.lemoncoast-3e44e81a.eastus2.azurecontainerapps.io/clear_entities"

const Cards=()=>{
    const [summaryData, setSummaryData] = useState(null);
    const [loadingSummary, setLoadingSummary] = useState(true);

    useEffect(() => {
        setLoadingSummary(true);
        fetch('http://localhost:8000/dashboard-details')
            .then(res => res.json())
            .then(data => {
                setSummaryData(data);
                setLoadingSummary(false);
            })
            .catch(() => setLoadingSummary(false));
    }, []);
    return(
        <div className="cards">
            <div className="tile-item">
                <div className="inner1">
                    <h1 className="summary-head">Total Entities</h1>
                    <img src={RedExportIcon} className="approve" alt="export"/>
                </div>
                <p className="count ellipsis">{loadingSummary ? '...' : summaryData ? summaryData.total_entities?.toLocaleString() : '--'}</p>
            </div>
            <div className="tile-item">
                <div className="inner1">
                    <h1 className="summary-head">Active Monitoring</h1>
                    <img src="/approve.png"  className="approve"  alt="approve"/>
                </div>
                <p className="count ellipsis">{loadingSummary ? '...' : summaryData ? summaryData.active_monitoring?.toLocaleString() : '--'}</p>
            </div>
            <div className="tile-item">
                <div className="inner1">
                    <h1 className="summary-head">Articles Processed</h1>
                    <img src="/approve.png"  className="approve"  alt="approve"/>
                </div>
                <p className="count ellipsis">{loadingSummary ? '...' : summaryData ? summaryData.articles_processed?.toLocaleString() : '--'}</p>
            </div>
            <div className="tile-item">
                <div className="inner1">
                    <h1 className="summary-head">Risk Alerts</h1>
                    <img src="/approve.png"  className="approve"  alt="approve"/>
                </div>
                <p className="count ellipsis">{loadingSummary ? '...' : summaryData ? summaryData.risk_alerts?.toLocaleString() : '--'}</p>
            </div>
        </div>
    )
}

export default Cards