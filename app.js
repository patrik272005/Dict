let dictionary = {};

fetch("dictionary.json")
  .then(res => res.json())
  .then(data => dictionary = data);

/* -------------------------
   Utility: Format Labels
-------------------------- */
function formatLabel(key) {
  return key
    .replace(/_/g, " ")                 // remove underscores
    .replace(/\b\w/g, c => c.toUpperCase()); // capitalize words
}

function searchWord() {
  const word = document.getElementById("searchInput").value.toLowerCase();
  const resultDiv = document.getElementById("result");

  if (!dictionary[word]) {
    resultDiv.innerHTML = `<p>❌ Word not found</p>`;
    return;
  }

  const entry = dictionary[word];

  resultDiv.innerHTML = `
    <h2>${entry.word}</h2>
    <p><em>${entry.phonetic}</em></p>

    <div class="section">
      <h3>Meanings</h3>
      ${Object.entries(entry.meanings).map(([pos, meanings]) =>
        `<b>${formatLabel(pos)}</b>
         <ul>
           ${meanings.map(m =>
             `<li>
                ${m.definition}
                <br><small>Example: ${m.example}</small>
              </li>`
           ).join("")}
         </ul>`
      ).join("")}
    </div>

    <div class="section">
      <h3>Tense Forms</h3>
      <ul>
        ${Object.entries(entry.tense_forms).map(
          ([k, v]) => `
            <li>
              <strong>${formatLabel(k)}</strong>: ${v}
            </li>`
        ).join("")}
      </ul>
    </div>

    <div class="section">
      <h3>Synonyms</h3>
      <div class="list">
        ${entry.synonyms.map(s => `<span>${s}</span>`).join("")}
      </div>
    </div>

    <div class="section">
      <h3>Antonyms</h3>
      <div class="list">
        ${entry.antonyms.map(a => `<span>${a}</span>`).join("")}
      </div>
    </div>

    <div class="section">
      <h3>Usage Examples</h3>
      <ul>
        ${entry.usage_examples.map(e => `<li>${e}</li>`).join("")}
      </ul>
    </div>
  `;
}
