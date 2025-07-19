import './Cards.css'
import React, { useState, useEffect } from 'react';
import { Tile } from '@carbon/react'
import RedExportIcon from './approve.svg';
import Tooltip from './Tooltip.svg';
import Tooltip1 from './Tooltip1.svg';
import Tooltip2 from './Tooltip2.svg'; // fallback if you want to use the new icon, replace with correct path if needed


const base_url = "https://anc-kaara.lemoncoast-3e44e81a.eastus2.azurecontainerapps.io/clear_entities"

const Cards=()=>{
    const [uniqueEntitiesCount, setUniqueEntitiesCount] = useState(0);
    const [activeMonitoringCount, setActiveMonitoringCount] = useState(0);
    const [riskAlertsData, setRiskAlertsData] = useState(null);
    const [loadingEntities, setLoadingEntities] = useState(true);
    const [loadingActiveMonitoring, setLoadingActiveMonitoring] = useState(true);
    const [loadingRiskAlerts, setLoadingRiskAlerts] = useState(true);

    // Fetch Total Entities (unique entity names from localStorage)
    useEffect(() => {
        setLoadingEntities(true);
        try {
            const rawData = localStorage.getItem("entityResults");
            let parsedData = rawData ? JSON.parse(rawData) : [];
            
            if (!Array.isArray(parsedData)) {
                parsedData = [];
            }
            
            // Get unique entity names
            const uniqueEntities = [...new Set(parsedData.map(item => item.input_entity).filter(Boolean))];
            setUniqueEntitiesCount(uniqueEntities.length);
        } catch (error) {
            console.error("Error parsing localStorage data:", error);
            setUniqueEntitiesCount(0);
        } finally {
            setLoadingEntities(false);
        }
    }, []);

    // Fetch Active Monitoring (from ScheduleCards - Total Entities count)
    useEffect(() => {
        setLoadingActiveMonitoring(true);
        fetch('http://127.0.0.1:8000/api/active-schedules')
            .then(res => res.json())
            .then(data => {
                const schedules = Array.isArray(data) ? data : [];
                setActiveMonitoringCount(schedules.length);
                setLoadingActiveMonitoring(false);
            })
            .catch(() => {
                setActiveMonitoringCount(0);
                setLoadingActiveMonitoring(false);
            });
    }, []);

    // Fetch Risk Alerts and Articles Processed (same API)
    useEffect(() => {
        setLoadingRiskAlerts(true);
        fetch('http://127.0.0.1:8000/api/risk-alerts')
            .then(res => res.json())
            .then(data => {
                setRiskAlertsData(data);
                setLoadingRiskAlerts(false);
            })
            .catch(() => {
                setRiskAlertsData(null);
                setLoadingRiskAlerts(false);
            });
    }, []);

    return(
        <div className="cards1">
            <div className="tile-item1">
                <div className="inner11">
                    <h1 className="summary-head1">Total Entities</h1>
                    <img src={Tooltip} className="approve1" alt="export"/>
                </div>
                <p className="count ellipsis1">{loadingEntities ? '...' : uniqueEntitiesCount.toLocaleString()}</p>
            </div>
            <div className="tile-item1">
                <div className="inner11">
                    <h1 className="summary-head1">Active Monitoring</h1>
                    <img src={Tooltip1}  className="approve1"  alt="approve"/>
                </div>
                <p className="count ellipsis1">{loadingActiveMonitoring ? '...' : activeMonitoringCount.toLocaleString()}</p>
            </div>
            <div className="tile-item1">
                <div className="inner11">
                    <h1 className="summary-head1">Articles Processed</h1>
                    <img src={RedExportIcon}  className="approve1"  alt="approve"/>
                </div>
                <p className="count ellipsis1">{loadingRiskAlerts ? '...' : riskAlertsData ? riskAlertsData.articlesProcessed?.toLocaleString() : '--'}</p>
            </div>
            <div className="tile-item1">
                <div className="inner11">
                    <h1 className="summary-head1">Risk Alerts</h1>
                    <img src={Tooltip2}  className="approve1"  alt="approve"/>
                </div>
                <p className="count ellipsis1">{loadingRiskAlerts ? '...' : riskAlertsData ? riskAlertsData.riskAlerts?.toLocaleString() : '--'}</p>
            </div>
        </div>
    )
}

export default Cards