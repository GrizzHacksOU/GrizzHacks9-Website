
// Populate the team dropdowns.
teams.forEach(team => {

    const list = document.getElementById(
        `${team.id}-members`
    );

    if (!list) return;

    team.members.forEach(person => {

        const li = document.createElement("li");
        const link = document.createElement("a");

        link.textContent = person.name;

        link.href =
            `profile.html?id=${encodeURIComponent(person.id)}`;

        link.target = "_self";

        li.appendChild(link);
        list.appendChild(li);
    });
});


// Search functionality.
const searchBar = document.getElementById("searchBar");
const teamDropdowns = document.querySelectorAll("details");
const noResults = document.getElementById("noResults");

searchBar.addEventListener("input", function () {

    const query = searchBar.value.toLowerCase().trim();

    let totalMatches = 0;

    teamDropdowns.forEach(dropdown => {

        const members = dropdown.querySelectorAll("li");

        let teamMatches = 0;

        members.forEach(member => {

            const name = member.textContent.toLowerCase();
            const matches = name.includes(query);

            member.hidden = !matches;

            if (matches) {
                teamMatches++;
                totalMatches++;
            }
        });

        if (query === "") {
            dropdown.hidden = false;
            dropdown.open = false;
        } else {
            dropdown.hidden = teamMatches === 0;
            dropdown.open = teamMatches > 0;
        }
    });

    noResults.hidden = query === "" || totalMatches > 0;
});
