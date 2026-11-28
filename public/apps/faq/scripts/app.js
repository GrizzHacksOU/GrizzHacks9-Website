// F.A.Q. app - old school message board
// 3 pages, picked by the url hash:
//   #/            -> board index (list of categories)
//   #/c/<id>      -> list of threads in a category
//   #/t/<id>      -> a single thread (question + admin answer + replies)

const content = document.getElementById('content');
const breadcrumbs = document.getElementById('breadcrumbs');

// no database so we save stuff in localStorage so it stays after u refresh
// (votes, reported posts, visitor number)

function loadData(name, fallback) {
  // try/catch bc some browsers block localStorage (private mode, iframes etc)
  try {
    const saved = localStorage.getItem(name);
    if (saved !== null) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.log('couldnt load ' + name, err);
  }
  return fallback;
}

function saveData(name, data) {
  try {
    localStorage.setItem(name, JSON.stringify(data));
  } catch (err) {
    // if it doesnt save its fine, stuff still works until refresh
    console.log('couldnt save ' + name, err);
  }
}

// votes the user clicked. key looks like "threadId:postId" and value is 1 (up), -1 (down) or 0
let myVotes = loadData('faq-votes', {});

// posts the user reported. key is the same "threadId:postId" thing, value is true
let myReports = loadData('faq-reports', {});

// used for replies from banned users (the real username is hidden)
const BANNED_USER = { name: 'Banned User', role: 'banned', rank: '', joined: '', posts: 0, location: '', sig: '' };

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

// banned replies don't have an author, so this gives back the fake banned user instead
function getReplyUser(reply) {
  if (reply.banned) return BANNED_USER;
  return getUser(reply.author);
}

// question + admin answer + all the replies
function countPosts(thread) {
  return 2 + thread.replies.length;
}

// 4821 -> "4,821"
function formatNum(n) {
  return n.toLocaleString('en-US');
}

// '2004-03-09 14:22' -> 'Tue Mar 09, 2004 2:22 pm'
function formatDate(str) {
  const parts = str.split(' ');
  const d = parts[0].split('-');
  const t = parts[1].split(':');
  const date = new Date(Number(d[0]), Number(d[1]) - 1, Number(d[2]), Number(t[0]), Number(t[1]));

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  let hour = date.getHours();
  const ampm = hour >= 12 ? 'pm' : 'am';
  hour = hour % 12;
  if (hour === 0) hour = 12;

  const day = String(date.getDate()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');

  return days[date.getDay()] + ' ' + months[date.getMonth()] + ' ' + day + ', ' +
    date.getFullYear() + ' ' + hour + ':' + min + ' ' + ampm;
}

// the newest post in a thread, used for the "Last Post" columns
// (dates are 'YYYY-MM-DD HH:MM' so comparing them as strings works)
function getLastPost(thread) {
  let last = { author: thread.author, date: thread.date };
  if (thread.answerDate > last.date) {
    last = { author: 'GrizzAdmin', date: thread.answerDate };
  }
  thread.replies.forEach(function (r) {
    if (r.date > last.date) {
      last = { author: getReplyUser(r).name, date: r.date };
    }
  });
  return last;
}

// makes the username red + bold if it's the admin
function nameHtml(name) {
  if (getUser(name).role === 'admin') {
    return '<span class="admin-name">' + name + '</span>';
  }
  return name;
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

    let posts = 0;
    let last = null;
    let lastThread = null;
    threads.forEach(function (t) {
      posts += countPosts(t);
      const lp = getLastPost(t);
      if (last === null || lp.date > last.date) {
        last = lp;
        lastThread = t;
      }
    });

    let lastPost = '<span class="muted">No posts</span>';
    if (last) {
      lastPost = formatDate(last.date) + '<br>' +
        '<a href="#/t/' + lastThread.id + '">Re: ' + lastThread.title + '</a><br>' +
        '<span class="muted">by</span> ' + nameHtml(last.author);
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

  let totalPosts = 0;
  THREADS.forEach(function (t) { totalPosts += countPosts(t); });

  return '<div class="stats-box">' +
    '<div class="stats-title">Who is Online</div>' +
    '<div class="stats-body small">' +
    'Our users have posted a total of <b>' + totalPosts + '</b> posts in <b>' + THREADS.length + '</b> topics.<br>' +
    'We have <b>' + formatNum(registeredUsers()) + '</b> registered users.<br>' +
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

    const last = getLastPost(t);

    rows += '<tr class="' + rowClass + '">' +
      '<td class="col-icon"><div class="topic-icon' + (t.locked ? ' locked' : '') + '"></div></td>' +
      '<td>' + tags + '<a class="topic-link" href="#/t/' + t.id + '">' + t.title + '</a></td>' +
      '<td class="col-author">' + t.author + '</td>' +
      // replies = everything except the question
      '<td class="col-num">' + (countPosts(t) - 1) + '</td>' +
      '<td class="col-num">' + formatNum(t.views) + '</td>' +
      '<td class="col-last small">' + formatDate(last.date) + '<br>' +
      '<span class="muted">by</span> ' + nameHtml(last.author) + '</td>' +
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

// finds the text + author of a post so replies can quote it
function getQuoted(thread, postId) {
  if (postId === 'question') {
    return { author: thread.author, text: thread.question };
  }
  if (postId === 'answer') {
    return { author: 'GrizzAdmin', text: thread.answer };
  }
  const reply = thread.replies.find(function (r) { return r.id === postId; });
  if (reply) {
    return { author: getReplyUser(reply).name, text: reply.text };
  }
  return null;
}

// the up/down arrows next to each post
function voteBox(key, baseVotes) {
  const mine = myVotes[key] || 0;
  return '<div class="vote-box" data-key="' + key + '" data-base="' + baseVotes + '">' +
    '<button class="vote-btn vote-up' + (mine === 1 ? ' active' : '') + '" title="Upvote">&#9650;</button>' +
    '<div class="vote-count">' + (baseVotes + mine) + '</div>' +
    '<button class="vote-btn vote-down' + (mine === -1 ? ' active' : '') + '" title="Downvote">&#9660;</button>' +
    '</div>';
}

// the text in the report box. changes after u click it
function reportText(key, reports) {
  const reported = myReports[key] === true;
  let total = reports;
  if (reported) total = total + 1;

  let html = '';
  if (reported) {
    html = '<span class="reported">Reported. Thanks, a moderator will review this post.</span>';
  } else {
    html = '<a href="#" class="report-link">Report post</a>';
  }

  if (total > 0) {
    html += ' <span class="muted">(reported ' + total + (total === 1 ? ' time' : ' times') + ')</span>';
  }
  return html;
}

// post = { user, subject, body, date, votes, voteKey, isAnswer, edited, quote, reports, modNote }
function renderPost(post) {
  const user = post.user;

  const isBanned = user.role === 'banned';

  let badge = '<div class="rank">' + user.rank + '</div>';
  if (user.role === 'admin') {
    badge = '<div class="badge-admin">Admin</div>';
  }

  let officialLabel = '';
  if (post.isAnswer) {
    officialLabel = '<span class="official">&#10004; Official answer</span>';
  }

  let quoteHtml = '';
  if (post.quote) {
    quoteHtml = '<div class="quote">' +
      '<div class="quote-head small">' + post.quote.author + ' wrote:</div>' +
      post.quote.text +
      '</div>';
  }

  let editedLine = '';
  if (post.edited) {
    editedLine = '<div class="edited muted small">Last edited by ' + user.name + ', edited 2 times in total.</div>';
  }

  let location = '';
  if (user.location) {
    location = '<br>Location: ' + user.location;
  }

  // left column with the user info. banned users get no name, no stats, just the badge
  let authorHtml = '';
  if (isBanned) {
    authorHtml = '<div class="badge-banned">Banned User</div>' +
      '<div class="avatar banned">?</div>';
  } else {
    authorHtml = '<div class="username' + (user.role === 'admin' ? ' admin-name' : '') + '">' + user.name + '</div>' +
      badge +
      // placeholder avatar until design gives us real ones
      '<div class="avatar">' + user.name.charAt(0).toUpperCase() + '</div>' +
      '<div class="user-stats small">' +
      'Joined: ' + user.joined + '<br>' +
      'Posts: ' + formatNum(user.posts) +
      location +
      '</div>';
  }

  let modNote = '';
  if (post.modNote) {
    modNote = '<div class="mod-note"><b>Moderator note:</b> ' + post.modNote + '</div>';
  }

  // no report button on admin posts (who would they report it to lol)
  let reportHtml = '';
  if (user.role !== 'admin') {
    reportHtml = '<div class="report-box" data-key="' + post.voteKey + '" data-reports="' + (post.reports || 0) + '">' +
      reportText(post.voteKey, post.reports || 0) +
      '</div>';
  }

  let bannedNote = '';
  if (isBanned) {
    bannedNote = '<div class="banned-note">This user has been banned for violating the community guidelines.</div>';
  }

  return '<table class="post' + (post.isAnswer ? ' answer' : '') + '">' +
    '<tr>' +
    '<td class="post-votes">' + voteBox(post.voteKey, post.votes) + '</td>' +
    '<td class="post-author">' + authorHtml + '</td>' +
    '<td class="post-body">' +
    '<div class="post-subject small">' +
    officialLabel +
    '<b>' + post.subject + '</b> &middot; Posted: ' + formatDate(post.date) +
    '</div>' +
    quoteHtml +
    '<div class="post-text">' + post.body + '</div>' +
    bannedNote +
    modNote +
    editedLine +
    (user.sig ? '<div class="signature small">' + user.sig + '</div>' : '') +
    reportHtml +
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

  // question
  html += renderPost({
    user: getUser(t.author),
    subject: t.title,
    body: t.question,
    date: t.date,
    votes: t.votes,
    voteKey: t.id + ':question'
  });

  // admin answer, always pinned right under the question
  html += renderPost({
    user: USERS.GrizzAdmin,
    subject: 'Re: ' + t.title,
    body: t.answer,
    date: t.answerDate,
    votes: t.answerVotes,
    voteKey: t.id + ':answer',
    isAnswer: true,
    edited: t.edited
  });

  // the rest of the replies, most votes first (if tied, older one first)
  // includes the users own vote so if they upvoted something it moves up after refresh
  const replies = t.replies.slice();
  replies.sort(function (a, b) {
    const aVotes = a.votes + (myVotes[t.id + ':' + a.id] || 0);
    const bVotes = b.votes + (myVotes[t.id + ':' + b.id] || 0);
    if (bVotes !== aVotes) return bVotes - aVotes;
    return a.date < b.date ? -1 : 1;
  });

  if (replies.length > 0) {
    html += '<div class="replies-head">' + replies.length + ' more ' +
      (replies.length === 1 ? 'reply' : 'replies') + ' &middot; sorted by votes</div>';
  }

  replies.forEach(function (r) {
    html += renderPost({
      user: getReplyUser(r),
      subject: 'Re: ' + t.title,
      body: r.text,
      date: r.date,
      votes: r.votes,
      voteKey: t.id + ':' + r.id,
      quote: r.quote ? getQuoted(t, r.quote) : null,
      reports: r.reports,
      modNote: r.modNote
    });
  });

  if (t.locked) {
    html += '<div class="locked-bar">This thread has been locked by <span class="admin-name">GrizzAdmin</span>. You cannot reply.</div>';
  }

  html += '<p><a href="#/c/' + cat.id + '">&laquo; Back to ' + cat.name + '</a></p>';

  content.innerHTML = html;
}

// ---------- voting ----------
// one click listener for the whole page instead of one per button

content.addEventListener('click', function (e) {
  // report link
  const reportLink = e.target.closest('.report-link');
  if (reportLink) {
    e.preventDefault(); // its an <a href="#"> so stop it from messing up the url
    const reportBox = reportLink.closest('.report-box');
    const reportKey = reportBox.dataset.key;
    myReports[reportKey] = true;
    saveData('faq-reports', myReports);
    reportBox.innerHTML = reportText(reportKey, Number(reportBox.dataset.reports));
    return;
  }

  const btn = e.target.closest('.vote-btn');
  if (!btn) return;

  const box = btn.closest('.vote-box');
  const key = box.dataset.key;
  const base = Number(box.dataset.base);
  const clicked = btn.classList.contains('vote-up') ? 1 : -1;

  // clicking the same arrow again takes the vote back
  if (myVotes[key] === clicked) {
    myVotes[key] = 0;
  } else {
    myVotes[key] = clicked;
  }
  saveData('faq-votes', myVotes);

  // just update this one box, don't re-sort (posts jumping around is annoying)
  box.querySelector('.vote-count').textContent = base + myVotes[key];
  box.querySelector('.vote-up').classList.toggle('active', myVotes[key] === 1);
  box.querySelector('.vote-down').classList.toggle('active', myVotes[key] === -1);
});

// ---------- register link ----------
// theres no forum registration, it just shows a message pointing to the real register app

document.getElementById('register-link').addEventListener('click', function (e) {
  e.preventDefault();
  const msg = document.getElementById('register-msg');
  msg.hidden = !msg.hidden; // click again to hide it
});

// ---------- hit counter ----------
// fake visitor counter in the footer. no server so we kinda make it up:
// first visit = number based on how long the site has been up (about 1 visitor every 3 min)
// after that = saved number + 1 each visit. never goes lower than the time number,
// so if u open it on another device later u still get a bigger number

const COUNTER_START = new Date(2026, 10, 1); // nov 1 2026, months start at 0 in js
const COUNTER_BASE = 1000;

// the time based number (same for everyone at the same time, doesnt go up when u refresh)
// gets set by updateHitCounter, the stats box uses it for the user count
let timeVisitorCount = 0;

// pretend about 1 out of every 5 visitors made an account
// (never less than the users we actually have in data.js)
function registeredUsers() {
  return Math.max(Math.floor(timeVisitorCount / 5), Object.keys(USERS).length);
}

function updateHitCounter() {
  const minutes = Math.floor((Date.now() - COUNTER_START.getTime()) / 60000);
  const timeCount = COUNTER_BASE + Math.floor(minutes / 3);
  timeVisitorCount = timeCount;

  const saved = loadData('faq-visitor', null);
  let count = 0;
  if (saved === null) {
    // first visit. add a random 0-9 so 2 people in the same minute dont get the same number
    count = timeCount + Math.floor(Math.random() * 10);
  } else {
    count = Math.max(saved + 1, timeCount);
  }
  saveData('faq-visitor', count);

  // 7 digits with zeros in front, each digit gets its own box like an old odometer
  const digits = String(count).padStart(7, '0').split('');
  let html = 'You are visitor # ';
  digits.forEach(function (d) {
    html += '<span class="digit">' + d + '</span>';
  });
  document.getElementById('hit-counter').innerHTML = html;
}

updateHitCounter();

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
