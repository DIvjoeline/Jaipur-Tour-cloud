
/* =========================================
   JAIPUR TOUR CLOUD - HOMEPAGE JAVASCRIPT
========================================= */


/* ---------- 1. SELECT HTML ELEMENTS ---------- */

const header = document.getElementById("header");
const menuToggle = document.getElementById("menuToggle");
const navbar = document.getElementById("navbar");

const heroSearch = document.getElementById("heroSearch");
const searchButton = document.getElementById("searchButton");
const searchSuggestions = document.getElementById("searchSuggestions");

const attractionCards = document.querySelectorAll(".attraction-card");
const filterButtons = document.querySelectorAll(".filter-btn");

const plannerForm = document.getElementById("plannerForm");
const itineraryResult = document.getElementById("itineraryResult");
const itineraryOutput = document.getElementById("itineraryOutput");
const closeItinerary = document.getElementById("closeItinerary");

const reportForm = document.getElementById("reportForm");
const reportMessage = document.getElementById("reportMessage");


/* ---------- 2. NAVIGATION ON SCROLL ---------- */

function updateHeader() {

    if (window.scrollY > 60) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }

}

window.addEventListener("scroll", updateHeader, { passive: true });

updateHeader();


/* ---------- 3. MOBILE NAVIGATION ---------- */

function closeMobileMenu() {

    navbar.classList.remove("open");
    document.body.classList.remove("menu-open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");

    menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';

}


menuToggle.addEventListener("click", () => {

    const isOpen = navbar.classList.toggle("open");

    document.body.classList.toggle("menu-open", isOpen);

    menuToggle.setAttribute("aria-expanded", String(isOpen));

    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );

    menuToggle.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';

});


/* Close menu when a navigation link is clicked */

navbar.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", closeMobileMenu);

});


/* Close menu when clicking outside it */

document.addEventListener("click", event => {

    if (
        navbar.classList.contains("open") &&
        !navbar.contains(event.target) &&
        !menuToggle.contains(event.target)
    ) {
        closeMobileMenu();
    }

});


/* ---------- 4. ACTIVE NAVIGATION LINK ---------- */

const navLinks = document.querySelectorAll(".nav-link");

const observedSections = document.querySelectorAll(
    "main section[id]"
);

const navObserver = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            const sectionId = entry.target.id;

            navLinks.forEach(link => {

                link.classList.toggle(
                    "active",
                    link.getAttribute("href") === `#${sectionId}`
                );

            });

        }

    });

}, {
    rootMargin: "-35% 0px -55% 0px"
});


observedSections.forEach(section => {
    navObserver.observe(section);
});


/* ---------- 5. SEARCH DATA ---------- */

const attractions = [
    {
        name: "Hawa Mahal",
        keywords: "palace winds pink city"
    },
    {
        name: "Amber Fort",
        keywords: "amer fort history heritage"
    },
    {
        name: "Jal Mahal",
        keywords: "water palace lake nature"
    },
    {
        name: "City Palace",
        keywords: "royal palace museum heritage"
    }
];


function searchAttractions(query) {

    const normalizedQuery = query.trim().toLowerCase();

    return attractions.filter(attraction => {

        return (
            attraction.name.toLowerCase().includes(normalizedQuery) ||
            attraction.keywords.includes(normalizedQuery)
        );

    });

}


/* ---------- 6. SEARCH SUGGESTIONS ---------- */

function displaySuggestions(results) {

    searchSuggestions.innerHTML = "";

    if (results.length === 0) {

        searchSuggestions.innerHTML = `
            <div class="suggestion-item">
                <i class="fa-solid fa-circle-info"></i>
                No matching attractions found
            </div>
        `;

        searchSuggestions.classList.add("show");
        return;

    }


    results.forEach(attraction => {

        const suggestion = document.createElement("button");

        suggestion.type = "button";
        suggestion.className = "suggestion-item";

        suggestion.style.width = "100%";
        suggestion.style.border = "none";
        suggestion.style.background = "white";
        suggestion.style.textAlign = "left";

        suggestion.innerHTML = `
            <i class="fa-solid fa-location-dot"></i>
            <span>${attraction.name}</span>
        `;

        suggestion.addEventListener("click", () => {

            heroSearch.value = attraction.name;

            searchSuggestions.classList.remove("show");

            performSearch(attraction.name);

        });

        searchSuggestions.appendChild(suggestion);

    });

    searchSuggestions.classList.add("show");

}


heroSearch.addEventListener("input", () => {

    const query = heroSearch.value.trim();

    if (query.length === 0) {

        searchSuggestions.classList.remove("show");
        return;

    }

    const results = searchAttractions(query);

    displaySuggestions(results);

});


/* ---------- 7. PERFORM SEARCH ---------- */

function performSearch(query) {

    const results = searchAttractions(query);

    searchSuggestions.classList.remove("show");

    if (results.length === 0) {

        alert("No matching attraction found. Try another search.");
        return;

    }

    document.getElementById("explore").scrollIntoView({
        behavior: "smooth"
    });

    filterButtons.forEach(button => {
        button.classList.remove("active");
    });

    document.querySelector('[data-filter="all"]')
        .classList.add("active");

    attractionCards.forEach(card => {

        const cardName = card.dataset.name.toLowerCase();

        const matched = results.some(attraction => {

            return attraction.name.toLowerCase() === cardName;

        });

        card.classList.toggle("hidden", !matched);

    });

}


searchButton.addEventListener("click", () => {

    const query = heroSearch.value.trim();

    if (!query) {

        heroSearch.focus();
        return;

    }

    performSearch(query);

});


heroSearch.addEventListener("keydown", event => {

    if (event.key === "Enter") {

        event.preventDefault();

        performSearch(heroSearch.value);

    }

    if (event.key === "Escape") {

        searchSuggestions.classList.remove("show");

    }

});


/* Close suggestions when clicking elsewhere */

document.addEventListener("click", event => {

    if (
        !heroSearch.contains(event.target) &&
        !searchSuggestions.contains(event.target)
    ) {

        searchSuggestions.classList.remove("show");

    }

});


/* ---------- 8. ATTRACTION CATEGORY FILTER ---------- */

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        const selectedCategory = button.dataset.filter;

        filterButtons.forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        attractionCards.forEach(card => {

            const cardCategory = card.dataset.category;

            const shouldShow =
                selectedCategory === "all" ||
                selectedCategory === cardCategory;

            card.classList.toggle("hidden", !shouldShow);

        });

    });

});


/* ---------- 9. FAVORITES ---------- */

function getFavorites() {

    try {

        const saved = JSON.parse(
            localStorage.getItem("jaipurFavorites") || "[]"
        );

        return Array.isArray(saved) ? saved : [];

    } catch (error) {

        console.warn("Could not read saved favorites:", error);
        return [];

    }

}


function saveFavorites(favorites) {

    try {

        localStorage.setItem(
            "jaipurFavorites",
            JSON.stringify(favorites)
        );

    } catch (error) {

        console.warn("Could not save favorites:", error);

    }

}


function updateFavoriteButtons() {

    const favorites = getFavorites();

    document.querySelectorAll(".favorite-btn").forEach(button => {

        const id = button.dataset.favorite;

        const isFavorite = favorites.includes(id);

        button.classList.toggle("favorited", isFavorite);

        const icon = button.querySelector("i");

        icon.className = isFavorite
            ? "fa-solid fa-heart"
            : "fa-regular fa-heart";

        button.setAttribute(
            "aria-pressed",
            String(isFavorite)
        );

    });

}


document.querySelectorAll(".favorite-btn").forEach(button => {

    button.addEventListener("click", () => {

        const attractionId = button.dataset.favorite;

        let favorites = getFavorites();

        if (favorites.includes(attractionId)) {

            favorites = favorites.filter(id => id !== attractionId);

        } else {

            favorites.push(attractionId);

        }

        saveFavorites(favorites);

        updateFavoriteButtons();

    });

});


updateFavoriteButtons();


/* ---------- 10. ITINERARY PREVIEW ---------- */

const itinerarySuggestions = {

    history: [
        "Amber Fort",
        "City Palace",
        "Hawa Mahal",
        "Jantar Mantar"
    ],

    food: [
        "Explore traditional Jaipur food",
        "Visit local food markets",
        "Discover local restaurants"
    ],

    shopping: [
        "Johari Bazaar",
        "Bapu Bazaar",
        "Explore traditional handicrafts"
    ],

    culture: [
        "City Palace",
        "Hawa Mahal",
        "Explore traditional markets"
    ],

    nature: [
        "Jal Mahal",
        "Explore scenic locations",
        "Visit outdoor attractions"
    ]

};


plannerForm.addEventListener("submit", event => {

    event.preventDefault();

    const duration = document.getElementById("tripDuration").value;

    const budget = document.getElementById("tripBudget").value;

    const selectedInterests = Array.from(
        document.querySelectorAll(
            'input[name="interest"]:checked'
        )
    ).map(input => input.value);


    if (!duration || !budget) {

        alert("Please select your trip duration and budget.");
        return;

    }

    if (selectedInterests.length === 0) {

        alert("Please select at least one interest.");
        return;

    }


    let suggestedPlaces = [];

    selectedInterests.forEach(interest => {

        const places = itinerarySuggestions[interest] || [];

        suggestedPlaces.push(...places);

    });


    suggestedPlaces = [...new Set(suggestedPlaces)];


    const numberOfDays = Number(duration);

    const placesPerDay = Math.ceil(
        suggestedPlaces.length / numberOfDays
    );


    const budgetLabels = {
        budget: "Budget Friendly",
        moderate: "Moderate",
        premium: "Premium"
    };


    let output = `
        <p><strong>Duration:</strong> ${numberOfDays} day(s)</p>

        <p><strong>Budget:</strong> ${budgetLabels[budget]}</p>

        <p><strong>Interests:</strong> ${selectedInterests.join(", ")}</p>

        <h4 style="margin-top:20px;">Suggested places and experiences</h4>
    `;


    for (let day = 0; day < numberOfDays; day++) {

        const start = day * placesPerDay;

        const dailyPlaces = suggestedPlaces.slice(
            start,
            start + placesPerDay
        );

        if (dailyPlaces.length === 0) {
            break;
        }

        output += `
            <div style="margin-top:15px;">
                <strong>Day ${day + 1}</strong>
                <ul style="padding-left:22px; margin-top:7px;">
                    ${dailyPlaces.map(place => `<li>${place}</li>`).join("")}
                </ul>
            </div>
        `;

    }


    output += `
        <p style="margin-top:20px; font-size:12px; color:#777;">
            This is a sample preview, not a route-optimized itinerary.
            A personalized itinerary service will be connected later.
        </p>
    `;


    itineraryOutput.innerHTML = output;

    itineraryResult.hidden = false;

    itineraryResult.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

});


/* Close itinerary preview */

closeItinerary.addEventListener("click", () => {

    itineraryResult.hidden = true;

});


/* ---------- 11. REPORT FORM ---------- */

reportForm.addEventListener("submit", event => {

    event.preventDefault();

    const category = document.getElementById("reportCategory").value;

    const location = document.getElementById("reportLocation").value.trim();

    const description = document.getElementById("reportDescription").value.trim();


    if (!category || !location || !description) {

        reportMessage.textContent = "Please complete all fields.";
        return;

    }


    reportMessage.textContent =
        "Demo submission successful! This report has not been sent to authorities.";

    reportMessage.style.color = "#16834A";


    reportForm.reset();

});


/* ---------- 12. SCROLL REVEAL ANIMATIONS ---------- */

const revealElements = document.querySelectorAll(".reveal");

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;


if ("IntersectionObserver" in window && !prefersReducedMotion) {

    const revealObserver = new IntersectionObserver((entries, observer) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                observer.unobserve(entry.target);

            }

        });

    }, {
        threshold: 0.12
    });


    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

} else {

    revealElements.forEach(element => {
        element.classList.add("visible");
    });

}


/* ---------- 13. FOOTER YEAR ---------- */

document.getElementById("currentYear").textContent =
    new Date().getFullYear();


/* ---------- 14. INITIAL PAGE SETUP ---------- */

console.log("Jaipur Tour Cloud homepage loaded successfully.");
