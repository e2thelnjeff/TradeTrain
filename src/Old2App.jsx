import { useState } from 'react';
import './App.css';
import Papa from 'papaparse';

function App() {
  
  //onPageLoad, load data from file using papaParse, disable refresh
  //onClick "Get next", update price by one, populate graph?
  //onFfwd >1 bars, update price to current, populate graphs with all prices in between

  const [data, setData] = useState([]);
  const getData = () =>{
    const file = './assets/APPL_data.csv';
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setData(results.data);
    }})
  };

  return (
    <>
      
      <div className="App">
        <button onClick = {() => getData()}>Start</button>
        <table className="table">
          <thead>
            <tr>
              <th>date</th>
              <th>open</th>
              <th>high</th>
              <th>low</th>
              <th>close</th>
              <th>volume</th>
            </tr>
          </thead>
          <tbody>
            {console.log('2oody')}
            {console.log(data.length)}
            
            {data.length ? (data[1].open) : null}
          </tbody>


        </table>

        
        
      </div>

    </>
  );
}

export default App
