let allWords = {};

// Load all word data from JSON files
async function loadAllWords() {
  try {
    // Fetch the index file
    const indexResponse = await fetch('data/index.json');
    if (!indexResponse.ok) {
      throw new Error(`Failed to load index.json`);
    }
    const wordFiles = await indexResponse.json();
    
    // Load each word file
    for (const [folder, words] of Object.entries(wordFiles)) {
      for (const word of words) {
        const filePath = `data/${folder}/${word}.json`;
        
        try {
          const response = await fetch(filePath);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const wordData = await response.json();
          const key = Object.keys(wordData)[0];
          allWords[key] = wordData[key];
        } catch (error) {
          console.error(`Error loading ${filePath}:`, error);
        }
      }
    }
    
    console.log('All words loaded:', Object.keys(allWords).length, 'words');
  } catch (error) {
    console.error('Error loading word index:', error);
  }
}

// Search for a word and display its details
function searchWord() {
  const searchInput = document.getElementById('searchInput');
  const query = searchInput.value.trim().toLowerCase();
  const resultDiv = document.getElementById('result');
  
  if (!query) {
    resultDiv.innerHTML = '<p>Please enter a word to search.</p>';
    return;
  }
  
  const wordData = allWords[query];
  
  if (!wordData) {
    resultDiv.innerHTML = `<p>No definition found for "${query}".</p>`;
    return;
  }
  
  // Display word details
  let html = `
    <div class="word-card">
      <h2>${wordData.word}</h2>
      <p class="phonetic">${wordData.phonetic || ''}</p>
      <p class="part-of-speech"><strong>Part of Speech:</strong> ${wordData.part_of_speech.join(', ')}</p>
  `;
  
  // Display meanings
  if (wordData.meanings) {
    html += '<div class="meanings">';
    for (const [pos, definitions] of Object.entries(wordData.meanings)) {
      html += `<h3>${pos}</h3><ul>`;
      definitions.forEach(def => {
        html += `<li><strong>Definition:</strong> ${def.definition}`;
        if (def.example) {
          html += `<br><em>Example:</em> ${def.example}`;
        }
        html += '</li>';
      });
      html += '</ul>';
    }
    html += '</div>';
  }
  
  // Display synonyms if available
  if (wordData.synonyms && wordData.synonyms.length > 0) {
    html += `<p><strong>Synonyms:</strong> ${wordData.synonyms.join(', ')}</p>`;
  }
  
  html += '</div>';
  resultDiv.innerHTML = html;
}

// Allow search with Enter key
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('searchInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      searchWord();
    }
  });
  
  // Load all words on page load
  loadAllWords();
});
