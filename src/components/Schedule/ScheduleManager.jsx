import './ScheduleManager.css'
import Navigation from '../Navigation';
import ScheduleCards from './ScheduleCards'
import ScheduleTablee from './ScheduleTable';

const Schedule = () => {
    return (
      <div className="mainsection">
          <Navigation />
          <div className="globalsummary" >
            <div className="summarysection">
                 <h1 className="header-head">Schedule Manager</h1>
                 <p className="header-para">Monitor and manage customer recovery activities</p>
            </div>
          </div>
          <ScheduleCards />
          <ScheduleTablee/>
      </div>
    )
}

export default Schedule