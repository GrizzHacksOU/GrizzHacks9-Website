// All the content for the FAQ forum lives here.
// To add a question just add another object to THREADS.
// NOTE: titles, questions and answers are lorem ipsum for now, swap them with the real info later!

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
    rank: 'Member',
    joined: 'Jun 2003',
    posts: 212,
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
    joined: 'Feb 2004',
    posts: 3,
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
const THREADS = [
  // ---------- General ----------
  {
    id: 'what-is-grizzhacks',
    category: 'general',
    sticky: true,
    locked: true,
    title: 'Lorem ipsum dolor sit amet?',
    author: 'n00b_hax0r',
    views: 4821,
    question: 'lorem ipsum dolor sit amet??',
    quick: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
      'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' +
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    edited: true
  },
  {
    id: 'do-i-need-to-code',
    category: 'general',
    sticky: false,
    locked: true,
    title: 'Consectetur adipiscing elit sed do?',
    author: 'sk8rgrl2003',
    views: 1290,
    question: 'consectetur adipiscing elit, sed do eiusmod tempor... ut labore?',
    quick: 'Sed do eiusmod tempor incididunt ut labore.',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
      'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    edited: false
  },
  {
    id: 'how-much-does-it-cost',
    category: 'general',
    sticky: false,
    locked: true,
    title: 'Eiusmod tempor incididunt?',
    author: 'lan_party_dave',
    views: 976,
    question: 'eiusmod tempor? incididunt ut labore?',
    quick: 'Ut enim ad minim veniam.',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    edited: false
  },

  // ---------- Registration ----------
  {
    id: 'how-do-i-register',
    category: 'registration',
    sticky: true,
    locked: true,
    title: 'Ut labore et dolore magna aliqua?',
    author: 'Neo_1999',
    views: 3507,
    question: 'ut labore et dolore magna aliqua. quis nostrud?',
    quick: 'Quis nostrud exercitation ullamco laboris.',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
      'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    edited: true
  },
  {
    id: 'who-can-attend',
    category: 'registration',
    sticky: false,
    locked: true,
    title: 'Quis nostrud exercitation ullamco?',
    author: 'n00b_hax0r',
    views: 1544,
    question: 'quis nostrud exercitation??',
    quick: 'Duis aute irure dolor in reprehenderit.',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
      'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' +
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    edited: false
  },
  {
    id: 'teams',
    category: 'registration',
    sticky: false,
    locked: true,
    title: 'Laboris nisi ut aliquip ex ea commodo consequat?',
    author: 'sk8rgrl2003',
    views: 1102,
    question: 'laboris nisi ut aliquip lol. ex ea commodo consequat?',
    quick: 'Excepteur sint occaecat cupidatat non proident.',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
      'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    edited: false
  },

  // ---------- Travel & Parking ----------
  {
    id: 'where-is-it',
    category: 'travel',
    sticky: true,
    locked: true,
    title: 'Duis aute irure dolor?',
    author: 'lan_party_dave',
    views: 2033,
    question: 'duis aute irure dolor?? in reprehenderit',
    quick: 'Lorem ipsum dolor sit amet, consectetur.',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
      'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    edited: true
  },
  {
    id: 'parking',
    category: 'travel',
    sticky: false,
    locked: true,
    title: 'Velit esse cillum dolore?',
    author: 'xX_c0d3r_Xx',
    views: 845,
    question: 'velit esse cillum dolore eu fugiat nulla pariatur or something',
    quick: 'Sed do eiusmod tempor incididunt.',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    edited: false
  },
  {
    id: 'travel-reimbursement',
    category: 'travel',
    sticky: false,
    locked: true,
    title: 'Fugiat nulla pariatur?',
    author: 'Neo_1999',
    views: 610,
    question: 'fugiat nulla pariatur, excepteur sint occaecat?',
    quick: 'Ut enim ad minim veniam, quis nostrud.',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
      'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    edited: false
  },

  // ---------- During the Event ----------
  {
    id: 'what-to-bring',
    category: 'during',
    sticky: true,
    locked: true,
    title: 'Excepteur sint occaecat cupidatat?',
    author: 'sk8rgrl2003',
    views: 2710,
    question: 'excepteur sint occaecat cupidatat non proident',
    quick: 'Duis aute irure dolor in reprehenderit in voluptate.',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.<ul>' +
      '<li>Lorem ipsum dolor</li>' +
      '<li>Sit amet consectetur</li>' +
      '<li>Adipiscing elit</li>' +
      '<li>Sed do eiusmod tempor</li>' +
      '<li>Incididunt ut labore</li></ul>' +
      'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    edited: true
  },
  {
    id: 'food',
    category: 'during',
    sticky: false,
    locked: true,
    title: 'Sunt in culpa?',
    author: 'lan_party_dave',
    views: 1888,
    question: 'sunt??',
    quick: 'Excepteur sint occaecat cupidatat.',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    edited: false
  },
  {
    id: 'sleeping',
    category: 'during',
    sticky: false,
    locked: true,
    title: 'Qui officia deserunt mollit anim?',
    author: 'n00b_hax0r',
    views: 734,
    question: 'qui officia deserunt mollit anim id est laborum?',
    quick: 'Lorem ipsum dolor sit amet.',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
      'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' +
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ' +
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ' +
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ' +
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ' +
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    edited: false
  },

  // ---------- Prizes & Judging ----------
  {
    id: 'how-judging-works',
    category: 'prizes',
    sticky: true,
    locked: true,
    title: 'Mollit anim id est laborum?',
    author: 'xX_c0d3r_Xx',
    views: 1650,
    question: 'mollit anim id est laborum. lorem ipsum dolor sit amet consectetur?',
    quick: 'Sed do eiusmod tempor incididunt ut labore et dolore.',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
      'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' +
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    edited: true
  },
  {
    id: 'what-are-the-prizes',
    category: 'prizes',
    sticky: false,
    locked: true,
    title: 'Nemo enim ipsam voluptatem?',
    author: 'Neo_1999',
    views: 2299,
    question: 'nemo enim ipsam?',
    quick: 'Ut enim ad minim veniam.',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    edited: false
  },
  {
    id: 'old-projects',
    category: 'prizes',
    sticky: false,
    locked: true,
    title: 'Neque porro quisquam est qui dolorem ipsum?',
    author: 'lan_party_dave',
    views: 512,
    question: 'neque porro quisquam est, qui dolorem ipsum quia dolor sit amet?',
    quick: 'Quis nostrud exercitation ullamco.',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
      'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    edited: false
  }
];
