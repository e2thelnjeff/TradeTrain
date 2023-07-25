import { useState } from 'react';
import './App.css';
import Papa from 'papaparse';

function App() {
  const [data, setData] = useState([]);
  const [recordNo, setRecordNo] = useState(0);

  const handleFileUpload = (e) =>{
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        //var newObj = Object.entries(results.data).slice(0,3)
        setData(results.data);
        
        

    }})
  };

  return (
    <>
      
      <div className="App">
        <p>
        <input type = "file" accept = ".csv" onChange = {handleFileUpload} />
        </p>
        <br/>
        <br/>
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
            {console.log(typeof data)}
            {console.log(data.length)}
            <tr>
              <td>{data.length ? (data[recordNo].date) : null}</td>
              <td>{data.length ? (data[recordNo].open) : null}</td>
              <td>{data.length ? (data[recordNo].high) : null}</td>
              <td>{data.length ? (data[recordNo].low) : null}</td>
              <td bgcolor='yellow'>{data.length ? (data[recordNo].close) : null}</td>
              <td>{data.length ? (data[recordNo].volume) : null}</td>
            </tr>
            

            <tr>
            
            </tr>

          </tbody>


        </table>
        <p><button onClick = {() => setRecordNo((recordNo) => recordNo + 1)} >Get Next Price</button></p>
        
        
      </div>

    </>
  );
}

export default App
