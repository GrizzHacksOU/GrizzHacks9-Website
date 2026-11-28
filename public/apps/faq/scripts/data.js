// All the content for the FAQ forum lives here.
// To add a question just add another object to THREADS.
// NOTE: questions and answers are lorem ipsum for now (titles are real), swap them with the real info later!
//
// IMPORTANT!! dont change thread ids or reply ids (r1, r2...) once the site is live.
// votes get saved in the browser using those ids, so if u rename them peoples votes
// will either disappear or end up on the wrong post. adding new ones is fine

const USERS = {
  GrizzAdmin: {
    name: 'GrizzAdmin',
    role: 'admin',
    joined: 'Jan 2001',
    posts: 9001,
    location: 'Rochester, MI',
    sig: 'GrizzHacks Staff | Please read the stickies before posting!!'
  },
  xX_c0d3r_Xx: {
    name: 'xX_c0d3r_Xx',
    role: 'member',
    rank: 'Senior Member',
    joined: 'Mar 2002',
    posts: 1337,
    location: 'my basement',
    sig: 'There are 10 types of people: those who understand binary and those who don\'t'
  },
  sk8rgrl2003: {
    name: 'sk8rgrl2003',
    role: 'member',
    rank: 'Newbie',
    joined: 'Jun 2003',
    posts: 14,
    location: 'Detroit',
    sig: 'AIM: sk8rgrl2003 ~ leave a msg!! ~'
  },
  lan_party_dave: {
    name: 'lan_party_dave',
    role: 'member',
    rank: 'Member',
    joined: 'Nov 2001',
    posts: 486,
    location: 'Troy, MI',
    sig: 'Pentium 4 @ 2.4GHz | 512MB RAM | GeForce4 Ti 4200'
  },
  n00b_hax0r: {
    name: 'n00b_hax0r',
    role: 'member',
    rank: 'Newbie',
    joined: 'Sep 2003',
    posts: 9,
    location: '',
    sig: 'first post!!1!'
  },
  Neo_1999: {
    name: 'Neo_1999',
    role: 'member',
    rank: 'Member',
    joined: 'Apr 2002',
    posts: 101,
    location: 'the Matrix',
    sig: '"There is no spoon."'
  }
};

const CATEGORIES = [
  { id: 'general', name: 'General', desc: 'The basics. What is GrizzHacks anyway?' },
  { id: 'registration', name: 'Registration', desc: 'Signing up, eligibility, teams.' },
  { id: 'travel', name: 'Travel & Parking', desc: 'Getting to campus and where to park.' },
  { id: 'during', name: 'During the Event', desc: 'Food, sleeping, what to bring.' },
  { id: 'prizes', name: 'Prizes & Judging', desc: 'How projects get judged and what you can win.' }
];

// author = whoever asked the question, the answer is always from GrizzAdmin
// dates are 'YYYY-MM-DD HH:MM' (24h), app.js turns them into the old forum format
// replies get sorted by votes (highest first), the admin answer always stays on top
// quote: put the id of the post being quoted ('question', 'answer' or a reply id like 'r1')
// banned: true instead of author hides the username and shows the "Banned User" badge
// reports: how many times a reply was already reported (optional, default 0)
// modNote: little note from the admin under a reply (optional)
const THREADS = [
  // ---------- General ----------
  {
    id: 'what-is-grizzhacks',
    category: 'general',
    sticky: true,
    locked: true,
    title: 'What is GrizzHacks?',
    author: 'n00b_hax0r',
    views: 4821,
    date: '2003-09-14 21:07',
    votes: 12,
    question: 'lorem ipsum dolor sit amet??',
    quick: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
      'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' +
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    answerDate: '2003-09-15 09:30',
    answerVotes: 48,
    edited: true,
    replies: [
      { id: 'r1', author: 'lan_party_dave', date: '2003-09-14 21:40', votes: 15, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod?' },
      { id: 'r2', author: 'xX_c0d3r_Xx', date: '2003-09-14 22:15', votes: 9, text: 'Ut enim ad minim veniam lol', quote: 'r1' },
      { id: 'r3', author: 'sk8rgrl2003', date: '2003-09-15 11:02', votes: 4, text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.' },
      { id: 'r4', author: 'n00b_hax0r', date: '2003-09-15 12:48', votes: 2, text: 'oh. lorem ipsum thx!!', quote: 'answer' },
      // necro post lol. modNote shows up under the post as a note from the admin
      { id: 'r5', author: 'lan_party_dave', date: '2026-11-21 03:14', votes: 27, text: 'bump. anyone still here?? GTA VI finally came out btw',
        modNote: 'Please don\'t bump 23 year old threads. -GrizzAdmin' }
    ]
  },
  {
    id: 'do-i-need-to-code',
    category: 'general',
    sticky: false,
    locked: true,
    title: 'Can I join if I have never coded before?',
    author: 'sk8rgrl2003',
    views: 1290,
    date: '2003-10-02 16:22',
    votes: 5,
    question: 'ok so i have literally never written a line of code. is GrizzHacks even for me?? ' +
      'i don\'t want to be the person slowing my team down :(',
    quick: 'Yes! No coding experience needed. First-timers are welcome.',
    answer: 'Absolutely, yes! You don\'t need any coding experience to join GrizzHacks. ' +
      'A hackathon is one of the best places to learn: you pick things up from your teammates, ' +
      'and there\'s a lot more to a project than code, like coming up with the idea, design, research, ' +
      'and presenting your demo at the end.<br><br>' +
      'Everyone here started somewhere. Just bring your laptop and your curiosity, ' +
      'and don\'t be afraid to ask questions. We can\'t wait to see what you build!',
    answerDate: '2003-10-02 18:05',
    answerVotes: 21,
    edited: false,
    replies: [
      // banned: true -> no username shown, gets the "Banned User" badge instead
      { id: 'r1', banned: true, reports: 37, date: '2003-10-02 16:51', votes: -14, text: 'lol you\'ve never coded and you want to go to a HACKathon?? ' +
        'go watch a hello world tutorial first. you\'re gonna be dead weight for whatever team gets stuck with you' },
      { id: 'r2', author: 'Neo_1999', date: '2003-10-02 17:30', votes: 11, text: 'Excepteur sint occaecat cupidatat non proident.', quote: 'r1' }
    ]
  },
  {
    id: 'how-much-does-it-cost',
    category: 'general',
    sticky: false,
    locked: true,
    title: 'How much does it cost to attend?',
    author: 'lan_party_dave',
    views: 976,
    date: '2003-11-20 01:13',
    votes: 3,
    question: 'eiusmod tempor? incididunt ut labore?',
    quick: 'Ut enim ad minim veniam.',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    answerDate: '2003-11-20 10:45',
    answerVotes: 17,
    edited: false,
    replies: []
  },

  // duplicates (people who didnt read before posting lol)
  // duplicateOf = id of the real thread. the admin reply gets made automatically so no answer needed
  {
    id: 'cant-code',
    category: 'general',
    duplicateOf: 'do-i-need-to-code',
    sticky: false,
    locked: true,
    title: 'can i come if i cant code??',
    author: 'n00b_hax0r',
    views: 64,
    date: '2004-02-11 23:52',
    votes: -2,
    question: 'i dont know any code at all. can i still come?? sry if this was asked already',
    answerDate: '2004-02-12 08:15',
    answerVotes: 9,
    edited: false,
    replies: []
  },
  {
    id: 'wat-is-this',
    category: 'general',
    duplicateOf: 'what-is-grizzhacks',
    sticky: false,
    locked: true,
    title: 'wat is this',
    author: 'Neo_1999',
    views: 41,
    date: '2004-03-03 14:07',
    votes: 0,
    question: 'saw a poster in the hallway. wat is this, some kind of matrix thing?',
    answerDate: '2004-03-03 15:30',
    answerVotes: 6,
    edited: false,
    replies: []
  },

  // ---------- Registration ----------
  {
    id: 'how-do-i-register',
    category: 'registration',
    sticky: true,
    locked: true,
    title: 'How do I register?',
    author: 'Neo_1999',
    views: 3507,
    date: '2004-01-08 19:55',
    votes: 8,
    question: 'ut labore et dolore magna aliqua. quis nostrud?',
    quick: 'Quis nostrud exercitation ullamco laboris.',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
      'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    answerDate: '2004-01-08 20:10',
    answerVotes: 35,
    edited: true,
    replies: [
      { id: 'r1', author: 'n00b_hax0r', date: '2004-01-08 20:44', votes: 6, text: 'lorem ipsum dolor sit amet ^^^', quote: 'answer' },
      { id: 'r2', author: 'sk8rgrl2003', date: '2004-01-09 08:17', votes: 3, text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem.' },
      { id: 'r3', author: 'lan_party_dave', date: '2004-01-09 13:02', votes: 1, text: '+1' }
    ]
  },
  {
    id: 'who-can-attend',
    category: 'registration',
    sticky: false,
    locked: true,
    title: 'Who can attend?',
    author: 'n00b_hax0r',
    views: 1544,
    date: '2004-01-12 23:41',
    votes: 4,
    question: 'quis nostrud exercitation??',
    quick: 'Duis aute irure dolor in reprehenderit.',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
      'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' +
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    answerDate: '2004-01-13 11:20',
    answerVotes: 14,
    edited: false,
    replies: [
      { id: 'r1', author: 'lan_party_dave', date: '2004-01-13 00:05', votes: 7, text: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.' },
      { id: 'r2', author: 'xX_c0d3r_Xx', date: '2004-01-13 00:31', votes: -5, text: 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet???', quote: 'r1' },
      { id: 'r3', author: 'sk8rgrl2003', date: '2004-01-13 09:12', votes: 8, text: 'Quis autem vel eum iure reprehenderit.', quote: 'r2' },
      { id: 'r4', author: 'Neo_1999', date: '2004-01-13 14:58', votes: 2, text: 'Lorem ipsum dolor sit amet.' }
    ]
  },
  {
    id: 'teams',
    category: 'registration',
    sticky: false,
    locked: true,
    title: 'Do I need a team before signing up?',
    author: 'sk8rgrl2003',
    views: 1102,
    date: '2004-02-03 15:30',
    votes: 6,
    question: 'laboris nisi ut aliquip lol. ex ea commodo consequat?',
    quick: 'Excepteur sint occaecat cupidatat non proident.',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
      'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    answerDate: '2004-02-03 17:42',
    answerVotes: 19,
    edited: false,
    replies: [
      { id: 'r1', author: 'Neo_1999', date: '2004-02-03 16:05', votes: 10, text: 'Ut enim ad minima veniam, quis nostrum exercitationem. Lorem ipsum dolor!!' }
    ]
  },

  // ---------- Travel & Parking ----------
  {
    id: 'where-is-it',
    category: 'travel',
    sticky: true,
    locked: true,
    title: 'Where is GrizzHacks held?',
    author: 'lan_party_dave',
    views: 2033,
    date: '2004-02-19 10:08',
    votes: 7,
    question: 'duis aute irure dolor?? in reprehenderit',
    quick: 'Lorem ipsum dolor sit amet, consectetur.',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
      'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    answerDate: '2004-02-19 10:55',
    answerVotes: 29,
    edited: true,
    replies: [
      { id: 'r1', author: 'xX_c0d3r_Xx', date: '2004-02-19 10:20', votes: 3, text: 'Lorem ipsum dolor sit amet, consectetur.' },
      { id: 'r2', author: 'lan_party_dave', date: '2004-02-19 11:30', votes: 5, text: 'At vero eos et accusamus et iusto odio dignissimos ducimus.', quote: 'question' }
    ]
  },
  {
    id: 'parking',
    category: 'travel',
    sticky: false,
    locked: true,
    title: 'Is there parking on campus?',
    author: 'xX_c0d3r_Xx',
    views: 845,
    date: '2004-02-25 08:44',
    votes: 2,
    question: 'velit esse cillum dolore eu fugiat nulla pariatur or something',
    quick: 'Sed do eiusmod tempor incididunt.',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    answerDate: '2004-02-25 12:16',
    answerVotes: 13,
    edited: false,
    replies: [
      { id: 'r1', author: 'sk8rgrl2003', date: '2004-02-25 09:01', votes: 4, text: 'Temporibus autem quibusdam et aut officiis debitis.' },
      { id: 'r2', author: 'n00b_hax0r', date: '2004-02-25 09:47', votes: -2, text: 'lorem ipsum?? dolor sit amet' },
      { id: 'r3', author: 'Neo_1999', date: '2004-02-25 13:20', votes: 6, text: 'Itaque earum rerum hic tenetur a sapiente delectus.', quote: 'r2' }
    ]
  },
  {
    id: 'travel-reimbursement',
    category: 'travel',
    sticky: false,
    locked: true,
    title: 'Do you reimburse travel costs?',
    author: 'Neo_1999',
    views: 610,
    date: '2004-03-01 20:19',
    votes: 1,
    question: 'fugiat nulla pariatur, excepteur sint occaecat?',
    quick: 'Ut enim ad minim veniam, quis nostrud.',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
      'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    answerDate: '2004-03-02 09:05',
    answerVotes: 9,
    edited: false,
    replies: []
  },
  {
    id: 'where-do-i-park',
    category: 'travel',
    duplicateOf: 'parking',
    sticky: false,
    locked: true,
    title: 'where do i park my car??',
    author: 'n00b_hax0r',
    views: 88,
    date: '2004-03-08 07:58',
    votes: -1,
    question: 'title says it all. pls help',
    answerDate: '2004-03-08 09:20',
    answerVotes: 5,
    edited: false,
    replies: []
  },

  // ---------- During the Event ----------
  {
    id: 'what-to-bring',
    category: 'during',
    sticky: true,
    locked: true,
    title: 'What should I bring?',
    author: 'sk8rgrl2003',
    views: 2710,
    date: '2004-03-05 17:36',
    votes: 9,
    question: 'excepteur sint occaecat cupidatat non proident',
    quick: 'Duis aute irure dolor in reprehenderit in voluptate.',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.<ul>' +
      '<li>Lorem ipsum dolor</li>' +
      '<li>Sit amet consectetur</li>' +
      '<li>Adipiscing elit</li>' +
      '<li>Sed do eiusmod tempor</li>' +
      '<li>Incididunt ut labore</li></ul>' +
      'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    answerDate: '2004-03-05 18:02',
    answerVotes: 41,
    edited: true,
    replies: [
      { id: 'r1', author: 'lan_party_dave', date: '2004-03-05 18:30', votes: 22, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.', quote: 'answer' },
      { id: 'r2', author: 'xX_c0d3r_Xx', date: '2004-03-05 19:11', votes: 5, text: 'Duis aute irure dolor.', quote: 'r1' },
      { id: 'r3', author: 'Neo_1999', date: '2004-03-06 02:47', votes: 3, text: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa.' },
      { id: 'r4', author: 'sk8rgrl2003', date: '2004-03-06 10:15', votes: 1, text: 'lorem ipsum thx' }
    ]
  },
  {
    id: 'food',
    category: 'during',
    sticky: false,
    locked: true,
    title: 'Will food be provided?',
    author: 'lan_party_dave',
    views: 1888,
    date: '2004-03-10 12:00',
    votes: 14,
    question: 'sunt??',
    quick: 'Excepteur sint occaecat cupidatat.',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    answerDate: '2004-03-10 12:30',
    answerVotes: 37,
    edited: false,
    replies: [
      { id: 'r1', author: 'n00b_hax0r', date: '2004-03-10 12:04', votes: 18, text: 'lorem ipsum!!!' },
      { id: 'r2', author: 'xX_c0d3r_Xx', date: '2004-03-10 13:15', votes: 12, text: 'Nam libero tempore, cum soluta nobis est eligendi optio.', quote: 'r1' }
    ]
  },
  {
    id: 'sleeping',
    category: 'during',
    sticky: false,
    locked: true,
    title: 'Can I sleep at the venue?',
    author: 'n00b_hax0r',
    views: 734,
    date: '2004-03-14 03:22',
    votes: 3,
    question: 'qui officia deserunt mollit anim id est laborum?',
    quick: 'Lorem ipsum dolor sit amet.',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
      'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' +
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ' +
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ' +
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ' +
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ' +
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    answerDate: '2004-03-14 11:40',
    answerVotes: 16,
    edited: false,
    replies: [
      { id: 'r1', author: 'lan_party_dave', date: '2004-03-14 03:50', votes: 4, text: 'Lorem ipsum dolor sit amet.' }
    ]
  },

  // ---------- Prizes & Judging ----------
  {
    id: 'how-judging-works',
    category: 'prizes',
    sticky: true,
    locked: true,
    title: 'How does judging work?',
    author: 'xX_c0d3r_Xx',
    views: 1650,
    date: '2004-03-20 14:10',
    votes: 10,
    question: 'mollit anim id est laborum. lorem ipsum dolor sit amet consectetur?',
    quick: 'Sed do eiusmod tempor incididunt ut labore et dolore.',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
      'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' +
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    answerDate: '2004-03-20 16:33',
    answerVotes: 33,
    edited: true,
    replies: [
      { id: 'r1', author: 'sk8rgrl2003', date: '2004-03-20 14:45', votes: 13, text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.', quote: 'question' },
      { id: 'r2', author: 'Neo_1999', date: '2004-03-20 15:20', votes: 7, text: 'Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.' },
      { id: 'r3', author: 'xX_c0d3r_Xx', date: '2004-03-20 17:05', votes: -4, text: 'lorem ipsum dolor. sit amet.', quote: 'answer' }
    ]
  },
  {
    id: 'what-are-the-prizes',
    category: 'prizes',
    sticky: false,
    locked: true,
    title: 'What are the prizes?',
    author: 'Neo_1999',
    views: 2299,
    date: '2004-03-22 22:58',
    votes: 11,
    question: 'nemo enim ipsam?',
    quick: 'Ut enim ad minim veniam.',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    answerDate: '2004-03-23 09:15',
    answerVotes: 24,
    edited: false,
    replies: [
      { id: 'r1', author: 'lan_party_dave', date: '2004-03-22 23:10', votes: 16, text: 'Lorem ipsum dolor sit amet consectetur?!' },
      { id: 'r2', author: 'n00b_hax0r', date: '2004-03-22 23:24', votes: 9, text: 'lorem ipsum +1', quote: 'r1' }
    ]
  },
  {
    id: 'old-projects',
    category: 'prizes',
    sticky: false,
    locked: true,
    title: 'Can I work on a project I started before the event?',
    author: 'lan_party_dave',
    views: 512,
    date: '2004-03-27 18:40',
    votes: -2,
    question: 'neque porro quisquam est, qui dolorem ipsum quia dolor sit amet?',
    quick: 'Quis nostrud exercitation ullamco.',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
      'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    answerDate: '2004-03-27 19:12',
    answerVotes: 20,
    edited: false,
    replies: [
      { id: 'r1', author: 'Neo_1999', date: '2004-03-27 19:40', votes: 8, text: 'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse.', quote: 'answer' }
    ]
  }
];
