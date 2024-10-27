// Filter functionality
const filterText = document.querySelector('#filter-text');
const filterFunc = (tables) => {

  // If the filter object exists, add the event listener
  if(filterText) {
    filterText.addEventListener('input', e => {

      // Go through each table of data
      for(let i = 0; i < tables.length; i++) { 
        let entries = tables[i].children;

        // Browse the entries
        for(let j = 0; j < entries.length; j++) {
          let entry = entries[j];

          if (!entry.children[0].textContent.toLowerCase().includes(filterText.value.toLowerCase()) && 
              !entry.children[1].textContent.toLowerCase().includes(filterText.value.toLowerCase())){
            entry.style.display = 'none';
          } else {
            entry.style.display = '';
          }
        }
      }
    });
  }
}