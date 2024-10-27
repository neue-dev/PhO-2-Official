// Append the trademark
const trademark = document.createElement('a');

trademark.href = "https://www.linkedin.com/in/m-david-6192222b2/";
trademark.target = "_blank";
trademark.innerHTML = `<div class="trademark">website by: <span class="blue-text text-accent-2"><b>Mo David</b></span></div>`;

document.body.appendChild(trademark);