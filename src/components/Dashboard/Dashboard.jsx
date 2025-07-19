// import React, { useState } from "react";
// import EntityInputForm from "../EntityInput/EntityInputForm";
// import Tablee from "./Tablee";

// export default function Dashboard() {
//   const [entityResults, setEntityResults] = useState([]);

//   return (
//     <>
//       <EntityInputForm onResults={setEntityResults} />
//       <Tablee />
//     </>
//   );
// }




import './Dashboard.css'
import Navigation from '../Navigation';
import Cards from './Cards'
import Tablee from './Tablee'
 
 
 
const Dashboard = ({ results = [] }) => {
    return(
      < div className="mainsection1">
          <Navigation />
          <div className="globalsummary1" >
            <div className="summarysection1">
                 <h1 className="header-head1">Dashbaord</h1>
                 <p className="header-para1">Monitor and manage customer recovery activities</p>
            </div>
          </div>
          <Cards results={results} />
          <Tablee />
      </div>
    )
}
export default Dashboard