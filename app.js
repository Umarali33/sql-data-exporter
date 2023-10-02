const fs = require('fs');
const sql = require('mssql');
const json2csv = require('json2csv').Parser;

const config = {
  user: 'sa',
  password: 'Abcd1234',
  server: 'DESKTOP-SVL4JM5', 
  database: 'Test',
  options: {
    encrypt: false, 
  },
};

(async () => {
  try {
    const pool = await sql.connect(config);

    const query1Result = await pool.request().query('SELECT top 5 * FROM Attendance');

    const query2Result = await pool.request().execute('GetAttendance');
    await sql.close();

    

    saveToCSV(query1Result.recordset, 'data1.csv');
    saveToJSON(query1Result.recordset, 'data1.json');

    saveToCSV(query2Result.recordset, 'data2.csv');
    saveToJSON(query2Result.recordset, 'data2.json');
    
    console.log('Data exported successfully.');

  } catch (err) {
    console.error('Error:', err);
  }
})();

function saveToCSV(data, filename) {
    try {
      if (!data) return;
      const fields = Object.keys(data[0]);
      const jsonParser = new json2csv({ fields, header: true });
      const csv = jsonParser.parse(data);
      fs.writeFileSync(filename, csv);
    } catch (err) {
      console.error('Error saving to CSV:', err);
    }
  }
  
  function saveToJSON(data, filename) {
    try {
      if (!data) return;
      fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    } catch (err) {
      console.error('Error saving to JSON:', err);
    }
  }