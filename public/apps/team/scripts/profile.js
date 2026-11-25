
// Read the person's ID from the URL.
const params = new URLSearchParams(window.location.search);

const personId = params.get("id");

// Find the person across all teams.
const people = teams.flatMap(team => team.members);

const person = people.find(
    member => member.id === personId
);

// Get the HTML elements.
const profileName = document.getElementById("profileName");
const profileRole = document.getElementById("profileRole");
const profileMajor = document.getElementById("profileMajor");
const profileQuote = document.getElementById("profileQuote");
const profileFunFact = document.getElementById("profileFunFact");
const profilePicture = document.getElementById("profilePicture");
const picturePlaceholder = document.getElementById("picturePlaceholder");
const profileLinks = document.getElementById("profileLinks");

if (person) {

    // Basic information.
    profileName.textContent = person.name;

    profileRole.textContent = person.role;

    profileMajor.textContent =
        `${person.major}, Class of ${person.graduationYear}`;

    // Away message and fun fact.
    profileQuote.textContent = person.quote;

    profileFunFact.textContent = person.funFact;

    // Profile picture.
    profilePicture.onerror = function () {
        profilePicture.onerror = null;
        profilePicture.src = "images/no.webp";
    };

    profilePicture.src = person.image || "images/no.webp";
    profilePicture.alt = `Profile picture of ${person.name}`;
    profilePicture.hidden = false;
    picturePlaceholder.hidden = true;

    // Create the person's links.
    person.links.forEach(linkData => {

        const li = document.createElement("li");
        const link = document.createElement("a");

        const url = new URL(linkData.url, window.location.href);

        // Only allow normal web links.
        if (url.protocol !== "https:" && url.protocol !== "http:") {
            return;
        }

        link.textContent = linkData.label;
        link.href = url.href;

        link.target = "_blank";
        link.rel = "noopener noreferrer";

        li.appendChild(link);
        profileLinks.appendChild(li);
    });

    if (person.links.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No links yet";
        profileLinks.appendChild(li);
    }

} else {

    // Handle missing or invalid profile IDs.
    profileName.textContent = "Profile Not Found";
    profileRole.textContent = "This person does not exist.";
    profileMajor.textContent = "";
    profileQuote.textContent = "";
    profileFunFact.textContent = "";

}
