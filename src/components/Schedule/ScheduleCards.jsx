import './ScheduleCardss.css'
import React, { useState, useEffect } from 'react';
import { Tile } from '@carbon/react'
import RedExportIcon from './approve.svg'; // fallback if you want to use the new icon, replace with correct path if needed

const ScheduleCards=()=>{
    const [activeSchedulesCount, setActiveSchedulesCount] = useState(0);
    const [nextRunData, setNextRunData] = useState(null);
    const [loadingActiveSchedules, setLoadingActiveSchedules] = useState(true);
    const [loadingNextRun, setLoadingNextRun] = useState(true);

    // Fetch Active Schedules count
    useEffect(() => {
        setLoadingActiveSchedules(true);
        fetch('http://127.0.0.1:8000/api/active-schedules')
            .then(res => res.json())
            .then(data => {
                const schedules = Array.isArray(data) ? data : [];
                setActiveSchedulesCount(schedules.length);
                setLoadingActiveSchedules(false);
            })
            .catch(() => {
                setActiveSchedulesCount(0);
                setLoadingActiveSchedules(false);
            });
    }, []);

    // Fetch Next Run data
    useEffect(() => {
        setLoadingNextRun(true);
        fetch('http://127.0.0.1:8000/api/next-run')
            .then(res => res.json())
            .then(data => {
                setNextRunData(data);
                setLoadingNextRun(false);
            })
            .catch(() => {
                setNextRunData(null);
                setLoadingNextRun(false);
            });
    }, []);

    return(
        <div className="cards">
            <div className="tile-item">
                <div className="inner1">
                    <h1 className="summary-head">Active Schedules</h1>
                    <img src={RedExportIcon} className="approve" alt="export"/>
                </div>
                <p className="count ellipsis">{loadingActiveSchedules ? '...' : activeSchedulesCount.toLocaleString()}</p>
            </div>
            <div className="tile-item">
                <div className="inner1">
                    <h1 className="summary-head">Total Entities</h1>
                    <img src="/approve.png"  className="approve"  alt="approve"/>
                </div>
                <p className="count ellipsis">{loadingActiveSchedules ? '...' : activeSchedulesCount.toLocaleString()}</p>
            </div>
            <div className="tile-item">
                <div className="inner1">
                    <h1 className="summary-head">Next Run</h1>
                    <img src="/approve.png"  className="approve"  alt="approve"/>
                </div>
                <p className="count ellipsis">{loadingNextRun ? '...' : nextRunData ? nextRunData.nextRun : '--'}</p>
            </div>
           
        </div>
    )
}

export default ScheduleCards