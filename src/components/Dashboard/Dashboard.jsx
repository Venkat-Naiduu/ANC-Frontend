import './Dashboard.css'
import Navigation from '../Navigation';
import Cards from './Cards'
import Tablee from './Tablee'
 
 
 
const Dashboard = ({ results = [] }) => {
    return(
      < div className="mainsection">
          <Navigation />
          <div className="globalsummary" >
            <div className="summarysection">
                 <h1 className="header-head">Dashbaord</h1>
                 <p className="header-para">Monitor and manage customer recovery activities</p>
            </div>
          </div>
          <Cards results={results} />
          <Tablee />
      </div>
    )
} 
export default Dashboard
