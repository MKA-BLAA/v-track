// Define the filename for storing votes
const fileName = 'poll1.txt'; // Change this for each poll

// Function to initialize the poll options
function initializePoll() {
  fetch(`scores/${fileName}`)
    .then(response => response.text())
    .then(data => {
      const options = parseOptions(data);
      displayOptions(options);
    })
    .catch(error => console.error('Error fetching options:', error));
}

// Function to parse options from text file
function parseOptions(text) {
  const options = {};
  text.split('\n').forEach(line => {
    if (line.trim() !== '') {
      const [option, count] = line.split(',');
      options[option.trim()] = parseInt(count.trim(), 10);
    }
  });
  return options;
}

// Function to display options as radio buttons
function displayOptions(options) {
  const pollContainer = document.getElementById('pollContainer');
  Object.keys(options).forEach(option => {
    const optionDiv = document.createElement('div');
    optionDiv.className = 'option';
    
    const input = document.createElement('input');
    input.type = 'radio';
    input.id = option;
    input.name = 'poll1'; // Change poll1 to match your poll ID
    input.value = option;
    
    const label = document.createElement('label');
    label.setAttribute('for', option);
    label.textContent = option;
    
    optionDiv.appendChild(input);
    optionDiv.appendChild(label);
    pollContainer.appendChild(optionDiv);
  });
}

// Function to handle voting
function vote() {
  const selectedOption = document.querySelector('input[name=poll1]:checked').value;
  
  // Fetch current votes from the .txt file
  fetch(`scores/${fileName}`)
    .then(response => response.text())
    .then(data => {
      const votes = parseOptions(data);

      // Update vote count for the selected option
      votes[selectedOption] = (votes[selectedOption] || 0) + 1;

      // Prepare data for writing back to the .txt file
      let newData = '';
      Object.keys(votes).forEach(option => {
        newData += `${option},${votes[option]}\n`;
      });

      // Write updated data back to the .txt file
      fetch(`scores/${fileName}`, {
        method: 'PUT', // Use PUT method to update the file
        body: newData,
        headers: {
          'Content-Type': 'text/plain'
        }
      })
      .then(() => {
        // Update UI with new vote counts
        updateUI(votes);
      })
      .catch(error => console.error('Error updating votes:', error));
    })
    .catch(error => console.error('Error fetching votes:', error));
}

// Function to update UI with vote counts
function updateUI(votes) {
  const resultsElement = document.getElementById('pollResults');
  resultsElement.innerHTML = ''; // Clear existing results

  Object.keys(votes).forEach(option => {
    const li = document.createElement('li');
    li.textContent = `${option}: ${votes[option]} votes`;
    resultsElement.appendChild(li);
  });
}

// Initialize the poll options when the page loads
document.addEventListener('DOMContentLoaded', initializePoll);
