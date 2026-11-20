// ============================================================
//  GrizzHacks 9 - Event Schedule data
//  !! PLACEHOLDER DATA !!  Replace dates/events with the real
//  schedule once it's final. This is the only file that should
//  need to change.
//
//  Times are ISO 8601 with the Michigan UTC offset
//  (-04:00 = EDT, -05:00 = EST). Everything is displayed in the
//  event's time zone no matter where the visitor is.
// ============================================================

window.SCHEDULE = {
    eventName: "GrizzHacks 9",
    timeZone: "America/Detroit",

    // Used by the countdown.
    hackingStarts: "2027-03-20T12:00:00-04:00",
    hackingEnds: "2027-03-21T12:00:00-04:00",

    // One entry per day of the event (YYYY-MM-DD, event time zone).
    // `startHour` / `endHour` set the visible range of the Day view.
    days: [
        { date: "2027-03-20", label: "Saturday", startHour: 8, endHour: 24 },
        { date: "2027-03-21", label: "Sunday", startHour: 0, endHour: 18 },
    ],

    // Colors for the Day view blocks and the legend.
    categories: {
        ceremony: { label: "Ceremony", color: "#3a6ea5" },
        workshop: { label: "Workshop", color: "#2e8b57" },
        food: { label: "Food", color: "#d2691e" },
        deadline: { label: "Deadlines", color: "#b22222" },
        activity: { label: "Activity", color: "#7b4fa0" },
    },

    events: [
        // ---- Saturday ----
        {
            id: "checkin", title: "Check-in & Registration", category: "ceremony",
            start: "2027-03-20T09:00:00-04:00", end: "2027-03-20T10:30:00-04:00",
            location: "Oakland Center - Main Lobby", host: "GrizzHacks Team",
            description: "Pick up your badge and swag. Bring a photo ID.",
        },
        {
            id: "breakfast", title: "Breakfast", category: "food",
            start: "2027-03-20T09:30:00-04:00", end: "2027-03-20T10:30:00-04:00",
            location: "Banquet Room A", host: "GrizzHacks Team",
            description: "Coffee, bagels and fruit.",
        },
        {
            id: "opening", title: "Opening Ceremony", category: "ceremony",
            start: "2027-03-20T11:00:00-04:00", end: "2027-03-20T12:00:00-04:00",
            location: "Gold Rooms", host: "GrizzHacks E-Board",
            description: "Welcome, sponsor intros, tracks and rules.",
        },
        {
            id: "hacking-begins", title: "Hacking Begins", category: "deadline",
            start: "2027-03-20T12:00:00-04:00", end: "2027-03-20T12:15:00-04:00",
            location: "Everywhere", host: "",
            description: "Start your engines. Projects must be started after this time.",
        },
        {
            id: "team-forming", title: "Team Formation Mixer", category: "activity",
            start: "2027-03-20T12:15:00-04:00", end: "2027-03-20T13:00:00-04:00",
            location: "Gold Room C", host: "GrizzHacks Team",
            description: "Don't have a team yet? Come meet people.",
        },
        {
            id: "lunch", title: "Lunch", category: "food",
            start: "2027-03-20T13:00:00-04:00", end: "2027-03-20T14:00:00-04:00",
            location: "Banquet Room A", host: "",
            description: "Lunch is served.",
        },
        {
            id: "ws-git", title: "Workshop: Git & GitHub Basics", category: "workshop",
            start: "2027-03-20T14:00:00-04:00", end: "2027-03-20T15:00:00-04:00",
            location: "Room 128", host: "Placeholder Speaker",
            description: "Branches, commits, pull requests and how not to lose your work.",
        },
        {
            id: "ws-api", title: "Workshop: Building with APIs", category: "workshop",
            start: "2027-03-20T14:30:00-04:00", end: "2027-03-20T15:30:00-04:00",
            location: "Room 130", host: "Placeholder Sponsor",
            description: "Call your first REST API and ship a demo in an hour.",
        },
        {
            id: "ws-ai", title: "Workshop: Intro to AI/ML", category: "workshop",
            start: "2027-03-20T16:00:00-04:00", end: "2027-03-20T17:00:00-04:00",
            location: "Room 128", host: "Placeholder Speaker",
            description: "Train and use a model without a PhD.",
        },
        {
            id: "dinner", title: "Dinner", category: "food",
            start: "2027-03-20T18:30:00-04:00", end: "2027-03-20T19:30:00-04:00",
            location: "Banquet Room A", host: "",
            description: "Dinner is served.",
        },
        {
            id: "game", title: "Retro Game Night", category: "activity",
            start: "2027-03-20T21:00:00-04:00", end: "2027-03-20T22:30:00-04:00",
            location: "Gold Room C", host: "GrizzHacks Team",
            description: "Take a break. Prizes for the high scores.",
        },
        // ---- Sunday ----
        {
            id: "midnight-snack", title: "Midnight Snack", category: "food",
            start: "2027-03-21T00:00:00-04:00", end: "2027-03-21T00:45:00-04:00",
            location: "Banquet Room A", host: "",
            description: "Fuel for the night owls.",
        },
        {
            id: "sun-breakfast", title: "Breakfast", category: "food",
            start: "2027-03-21T08:00:00-04:00", end: "2027-03-21T09:00:00-04:00",
            location: "Banquet Room A", host: "",
            description: "Coffee. Lots of coffee.",
        },
        {
            id: "submission", title: "Project Submission Deadline", category: "deadline",
            start: "2027-03-21T12:00:00-04:00", end: "2027-03-21T12:15:00-04:00",
            location: "Devpost", host: "",
            description: "Submit your project on Devpost before this time. Hacking ends.",
        },
        {
            id: "sun-lunch", title: "Lunch", category: "food",
            start: "2027-03-21T12:15:00-04:00", end: "2027-03-21T13:00:00-04:00",
            location: "Banquet Room A", host: "",
            description: "Lunch is served.",
        },
        {
            id: "judging", title: "Judging & Demo Expo", category: "ceremony",
            start: "2027-03-21T13:00:00-04:00", end: "2027-03-21T15:00:00-04:00",
            location: "Gold Rooms", host: "Judges",
            description: "Show your project to the judges at your table.",
        },
        {
            id: "closing", title: "Closing Ceremony & Awards", category: "ceremony",
            start: "2027-03-21T15:30:00-04:00", end: "2027-03-21T16:30:00-04:00",
            location: "Gold Rooms", host: "GrizzHacks E-Board",
            description: "Winners announced. Thanks for hacking with us!",
        },
    ],
};
