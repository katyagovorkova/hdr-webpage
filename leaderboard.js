// leaderboard.js

async function getJson(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

async function aggregateScores(urls) {
  const ownerScores = {};

  for (const url of urls) {
    const jsonData = await getJson(url);
    if (jsonData && Array.isArray(jsonData.submissions)) {
      jsonData.submissions.forEach(submission => {
        const owner = submission.owner;
        const score = parseFloat(submission.scores[0]?.score) || 0;

        if (ownerScores[owner]) {
          ownerScores[owner] += score;
        } else {
          ownerScores[owner] = score;
        }
      });
    }
  }

  displayTable(ownerScores);
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
    td.innerText = value.toPrecision(3);
    dataRow.appendChild(td);
  });
  tbody.appendChild(dataRow);

  // Append thead and tbody to table
  table.appendChild(thead);
  table.appendChild(tbody);

  // Append table to container
  container.appendChild(table);
}


async function main() {
  // URLs of the JSON files
  // const url_a3d3 = "https://www.codabench.org/api/leaderboards/2744/";
  const urls = [
    './scores/a3d3.json',
    './scores/iharp.json',
    './scores/imageomics.json'
  ];

  // Get aggregated scores
  const scores = await aggregateScores(urls);

  // Output the results
  console.log('Aggregated Scores by Owner:', scores);
}

// Call the main function
main();