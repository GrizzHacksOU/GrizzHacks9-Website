// F.A.Q. app - old school message board
// 3 pages, picked by the url hash:
//   #/            -> board index (list of categories)
//   #/c/<id>      -> list of threads in a category
//   #/t/<id>      -> a single thread (question + admin answer)

const content = document.getElementById('content');
const breadcrumbs = document.getElementById('breadcrumbs');

// ---------- helpers ----------

function getCategory(id) {
  return CATEGORIES.find(function (c) { return c.id === id; });
}

function getThread(id) {
  return THREADS.find(function (t) { return t.id === id; });
}

function getUser(name) {
  // fallback just in case someone typos a username in data.js
  return USERS[name] || { name: name, role: 'member', rank: 'Guest', joined: '???', posts: 0, location: '', sig: '' };
}

// threads in a category, stickies first
function getThreadsIn(catId) {
  const threads = THREADS.filter(function (t) { return t.category === catId; });
  const sticky = threads.filter(function (t) { return t.sticky; });
  const normal = threads.filter(function (t) { return !t.sticky; });
  return sticky.concat(normal);
}

// 4821 -> "4,821"
function formatNum(n) {
  return n.toLocaleString('en-US');
}

function setBreadcrumbs(links) {
  // links is a list of { text, href }. last one is the current page so no link
  let html = '';
  for (let i = 0; i < links.length; i++) {
    if (i > 0) html += ' &raquo; ';
    if (i === links.length - 1) {
      html += '<b>' + links[i].text + '</b>';
    } else {
      html += '<a href="' + links[i].href + '">' + links[i].text + '</a>';
    }
  }
  breadcrumbs.innerHTML = html;
}

// ---------- page: board index ----------

function showIndex() {
  setBreadcrumbs([{ text: 'Board Index', href: '#/' }]);

  let rows = '';
  CATEGORIES.forEach(function (cat, i) {
    const threads = getThreadsIn(cat.id);
    const last = threads[threads.length - 1];
    // every thread is 1 question + 1 answer so posts = threads * 2
    const posts = threads.length * 2;

    let lastPost = '<span class="muted">No posts</span>';
    if (last) {
      lastPost = '<a href="#/t/' + last.id + '">Re: ' + last.title + '</a><br>' +
        '<span class="muted">by</span> <span class="admin-name">GrizzAdmin</span>';
    }

    rows += '<tr class="' + (i % 2 === 1 ? 'alt' : '') + '">' +
      '<td class="col-icon"><div class="folder-icon"></div></td>' +
      '<td><a class="cat-link" href="#/c/' + cat.id + '">' + cat.name + '</a>' +
      '<div class="muted small">' + cat.desc + '</div></td>' +
      '<td class="col-num">' + threads.length + '</td>' +
      '<td class="col-num">' + posts + '</td>' +
      '<td class="col-last small">' + lastPost + '</td>' +
      '</tr>';
  });

  content.innerHTML =
    '<table class="forum-table">' +
    '<thead><tr>' +
    '<th></th><th>Forum</th><th>Topics</th><th>Posts</th><th>Last Post</th>' +
    '</tr></thead>' +
    '<tbody>' + rows + '</tbody>' +
    '</table>' +
    statsBox();
}

// the little "who's online" box at the bottom of the index
function statsBox() {
  const names = Object.keys(USERS);

  // fake "online" list: GrizzAdmin is always on + 2 to 4 random members
  const members = names.filter(function (n) { return USERS[n].role !== 'admin'; });
  // shuffle (random sort, not perfect but good enough for this)
  members.sort(function () { return Math.random() - 0.5; });
  const howMany = 2 + Math.floor(Math.random() * 3);
  const online = ['<span class="admin-name">GrizzAdmin</span>']
    .concat(members.slice(0, howMany))
    .join(', ');

  return '<div class="stats-box">' +
    '<div class="stats-title">Who is Online</div>' +
    '<div class="stats-body small">' +
    'Our users have posted a total of <b>' + THREADS.length * 2 + '</b> posts in <b>' + THREADS.length + '</b> topics.<br>' +
    'We have <b>' + names.length + '</b> registered users.<br>' +
    'Users online: ' + online +
    '</div></div>';
}

// ---------- page: category (thread list) ----------

function showCategory(catId) {
  const cat = getCategory(catId);
  const threads = getThreadsIn(catId);

  setBreadcrumbs([
    { text: 'Board Index', href: '#/' },
    { text: cat.name, href: '#/c/' + cat.id }
  ]);

  let rows = '';
  threads.forEach(function (t, i) {
    let tags = '';
    if (t.sticky) tags += '<span class="tag tag-sticky">Sticky</span> ';
    if (t.locked) tags += '<span class="tag tag-locked">Locked</span> ';

    let rowClass = i % 2 === 1 ? 'alt' : '';
    if (t.sticky) rowClass += ' sticky-row';

    rows += '<tr class="' + rowClass + '">' +
      '<td class="col-icon"><div class="topic-icon' + (t.locked ? ' locked' : '') + '"></div></td>' +
      '<td>' + tags + '<a class="topic-link" href="#/t/' + t.id + '">' + t.title + '</a></td>' +
      '<td class="col-author">' + t.author + '</td>' +
      '<td class="col-num">1</td>' +
      '<td class="col-num">' + formatNum(t.views) + '</td>' +
      '<td class="col-last small"><span class="muted">by</span> <span class="admin-name">GrizzAdmin</span></td>' +
      '</tr>';
  });

  content.innerHTML =
    '<h2 class="page-title">' + cat.name + '</h2>' +
    '<p class="muted small">' + cat.desc + '</p>' +
    '<table class="forum-table">' +
    '<thead><tr>' +
    '<th></th><th>Topic</th><th>Author</th><th>Replies</th><th>Views</th><th>Last Post</th>' +
    '</tr></thead>' +
    '<tbody>' + rows + '</tbody>' +
    '</table>';
}

// ---------- page: thread ----------

function renderPost(user, subject, body, isAnswer, edited) {
  let badge = '<div class="rank">' + user.rank + '</div>';
  if (user.role === 'admin') {
    badge = '<div class="badge-admin">Admin</div>';
  }

  let editedLine = '';
  if (edited) {
    editedLine = '<div class="edited muted small">Last edited by ' + user.name + ', edited 2 times in total.</div>';
  }

  let location = '';
  if (user.location) {
    location = '<br>Location: ' + user.location;
  }

  return '<table class="post' + (isAnswer ? ' answer' : '') + '">' +
    '<tr>' +
    '<td class="post-author">' +
    '<div class="username' + (user.role === 'admin' ? ' admin-name' : '') + '">' + user.name + '</div>' +
    badge +
    // placeholder avatar until design gives us real ones
    '<div class="avatar">' + user.name.charAt(0).toUpperCase() + '</div>' +
    '<div class="user-stats small">' +
    'Joined: ' + user.joined + '<br>' +
    'Posts: ' + formatNum(user.posts) +
    location +
    '</div>' +
    '</td>' +
    '<td class="post-body">' +
    '<div class="post-subject small">' + subject + '</div>' +
    '<div class="post-text">' + body + '</div>' +
    editedLine +
    (user.sig ? '<div class="signature small">' + user.sig + '</div>' : '') +
    '</td>' +
    '</tr>' +
    '</table>';
}

function showThread(threadId) {
  const t = getThread(threadId);
  const cat = getCategory(t.category);

  setBreadcrumbs([
    { text: 'Board Index', href: '#/' },
    { text: cat.name, href: '#/c/' + cat.id },
    { text: t.title, href: '#/t/' + t.id }
  ]);

  let html = '<h2 class="page-title">' + t.title + '</h2>';

  // short answer box at the top (the stackoverflow thing)
  if (t.quick) {
    html += '<div class="quick-answer">' +
      '<span class="quick-label">Quick answer:</span> ' + t.quick +
      '</div>';
  }

  html += renderPost(getUser(t.author), t.title, t.question, false, false);
  html += renderPost(USERS.GrizzAdmin, 'Re: ' + t.title, t.answer, true, t.edited);

  if (t.locked) {
    html += '<div class="locked-bar">This thread has been locked by <span class="admin-name">GrizzAdmin</span>. You cannot reply.</div>';
  }

  html += '<p><a href="#/c/' + cat.id + '">&laquo; Back to ' + cat.name + '</a></p>';

  content.innerHTML = html;
}

// ---------- router ----------

function router() {
  // "#/t/parking" -> ["t", "parking"]
  const parts = window.location.hash.replace('#', '').split('/').filter(function (p) {
    return p !== '';
  });

  if (parts[0] === 'c' && getCategory(parts[1])) {
    showCategory(parts[1]);
  } else if (parts[0] === 't' && getThread(parts[1])) {
    showThread(parts[1]);
  } else {
    // bad link or no hash, just go to the index
    showIndex();
  }

  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', router);
router();
