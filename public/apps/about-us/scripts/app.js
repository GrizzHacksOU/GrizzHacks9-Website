let tab = 'contents';
let selectedId = PAGES[0].id;
let query = '';

const tabButtons = document.querySelectorAll('.hm-tab');
const list = document.querySelector('.hm-list');
const search = document.querySelector('.hm-search');
const pageTitle = document.getElementById('page-title');
const pageBody = document.getElementById('page-body');

function getVisiblePages() {
  if (tab === 'index') {
    return [...PAGES].sort(function (a, b) { return a.title.localeCompare(b.title); });
  }
  if (tab === 'search') {
    const q = query.toLowerCase();
    return PAGES.filter(function (p) {
      return (p.title + ' ' + p.body.join(' ')).toLowerCase().includes(q);
    });
  }
  return PAGES;
}

function renderList() {
  list.innerHTML = '';
  getVisiblePages().forEach(function (p) {
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.className = p.id === selectedId ? 'hm-item active' : 'hm-item';
    button.textContent = p.title;
    button.addEventListener('click', function () {
      selectedId = p.id;
      render();
    });
    li.append(button);
    list.append(li);
  });
}

function renderPage() {
  const selected = PAGES.find(function (p) { return p.id === selectedId; }) || PAGES[0];
  pageTitle.textContent = selected.title;

  pageBody.innerHTML = '';
  selected.body.forEach(function (line) {
    const p = document.createElement('p');
    p.textContent = line;
    pageBody.append(p);
  });
}

function render() {
  tabButtons.forEach(function (b) {
    b.classList.toggle('active', b.dataset.tab === tab);
  });
  search.hidden = tab !== 'search';
  renderList();
  renderPage();
}

tabButtons.forEach(function (b) {
  b.addEventListener('click', function () {
    tab = b.dataset.tab;
    render();
    if (tab === 'search') search.focus();
  });
});

search.addEventListener('input', function () {
  query = search.value;
  renderList();
});

render();
