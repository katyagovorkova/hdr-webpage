// script.js
async function getData() {
  const url = "https://www.codabench.org/api/competitions/2626/results.json";
  // try {
  //   const response = await fetch(url);
  //   if (!response.ok) {
  //     throw new Error(`Response status: ${response.status}`);
  //   }

  //   const json = await response.json();
  //   console.log(json);

    json = {"User":"a3d3","Score A3D3":"0.8","Score imageomics":"0.6","Score iHARP":"0.7"};
    json["Total score"] = calculateTotalScore(json);
    displayTable(json);

//     // Check if the response contains an error message
//     if (json.detail) {
//       displayError(json.detail);
//     } else {
//       // Assuming json contains valid data, display it as a table
//       displayTable(json);
//     }
//   } catch (error) {
//     console.error(error.message);
//     displayError('Failed to load data.');
//   }
}

function calculateTotalScore(data) {
  const scoreA3D3 = parseFloat(data["Score A3D3"]) || 0;
  const scoreImageomics = parseFloat(data["Score imageomics"]) || 0;
  const scoreiHARP = parseFloat(data["Score iHARP"]) || 0;

  return (scoreA3D3 + scoreImageomics + scoreiHARP).toFixed(1);
}

function displayError(message) {
  const container = document.getElementById('leaderboard-content');
  container.innerText = message;
}

function displayTable(data) {
  const container = document.getElementById('leaderboard-content');
  container.innerHTML = ''; // Clear any existing content

  // Create table and headers
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  // Assuming data is an object with key-value pairs
  const headerRow = document.createElement('tr');
  Object.keys(data).forEach(key => {
    const th = document.createElement('th');
    th.innerText = key;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  // Create the body row with data
  const dataRow = document.createElement('tr');
  Object.values(data).forEach(value => {
    const td = document.createElement('td');
    td.innerText = value;
    dataRow.appendChild(td);
  });
  tbody.appendChild(dataRow);

  // Append thead and tbody to table
  table.appendChild(thead);
  table.appendChild(tbody);

  // Append table to container
  container.appendChild(table);
}

// Call the function
getData();