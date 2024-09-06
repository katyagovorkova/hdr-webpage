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

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const jsonData = await getJson(url);
    if (jsonData && Array.isArray(jsonData.submissions)) {
      jsonData.submissions.forEach(submission => {
        const owner = submission.owner;
        const score = parseFloat(submission.scores[0]?.score) || 0;

        // Initialize owner object if not already
        if (!ownerScores[owner]) {
          ownerScores[owner] = { scores: new Array(urls.length).fill(0), total: 0 };
        }

        // Store the score in the appropriate column and update total
        ownerScores[owner].scores[i] = score;
        ownerScores[owner].total += score;
      });
    }
  }

  displayTable(ownerScores, urls);
}

function displayTable(data, urls) {
  const container = document.getElementById('leaderboard-content');
  container.innerHTML = ''; // Clear any existing content

  // Create table and headers
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  // Create header row
  const headerRow = document.createElement('tr');
  const thTeam = document.createElement('th');
  thTeam.innerText = 'Team';
  headerRow.appendChild(thTeam);

  // Add headers for each JSON file (removing ".json" from the filename)
  urls.forEach(url => {
    const th = document.createElement('th');
    const fileName = url.split('/').pop().replace('.json', ''); // Extract filename and remove ".json"
    th.innerText = fileName;
    headerRow.appendChild(th);
  });

  const thTotal = document.createElement('th');
  thTotal.innerText = 'Aggregated Score';
  headerRow.appendChild(thTotal);

  thead.appendChild(headerRow);

  // Create rows for each team
  Object.keys(data).forEach(owner => {
    const ownerRow = document.createElement('tr');

    // Team name
    const tdTeam = document.createElement('td');
    tdTeam.innerText = owner;
    ownerRow.appendChild(tdTeam);

    // Scores from each JSON file
    data[owner].scores.forEach(score => {
      const tdScore = document.createElement('td');
      tdScore.innerText = score.toPrecision(3);
      ownerRow.appendChild(tdScore);
    });

    // Aggregated total score
    const tdTotal = document.createElement('td');
    tdTotal.innerText = data[owner].total.toPrecision(3);
    ownerRow.appendChild(tdTotal);

    tbody.appendChild(ownerRow);
  });

  // Append thead and tbody to the table
  table.appendChild(thead);
  table.appendChild(tbody);

  // Append table to container
  container.appendChild(table);
}

async function main() {
  // URLs of the JSON files
  const urls = [
    './scores/a3d3.json',
    './scores/iharp.json',
    './scores/imageomics.json'
  ];

  // Get aggregated scores
  await aggregateScores(urls);
}

// Call the main function
main();