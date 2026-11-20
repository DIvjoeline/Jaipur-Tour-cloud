
/* =========================================
   JAIPUR TOUR CLOUD - EXPLORE PAGE
========================================= */


/* ---------- 1. SELECT HTML ELEMENTS ---------- */

const attractionSearch = document.getElementById("attractionSearch");
const clearSearch = document.getElementById("clearSearch");
const sortAttractions = document.getElementById("sortAttractions");

const filterButtons = document.querySelectorAll(".filter-btn");
const attractionsGrid = document.getElementById("attractionsGrid");
const attractionCards = Array.from(
    document.querySelectorAll(".explore-card")
);

const resultCount = document.getElementById("resultCount");
const noResults = document.getElementById("noResults");

const currentYear = document.getElementById("currentYear");


/* ---------- 2. INITIAL SETTINGS ---------- */

let selectedCategory = "all";
let searchText = "";

// Update footer year automatically
if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


/* ---------- 3. FAVORITES STORAGE ---------- */

const FAVORITES_KEY = "jaipurTourCloudFavorites";

function getFavorites() {
    try {
        const saved = JSON.parse(
            localStorage.getItem(FAVORITES_KEY) || "[]"
        );

        return Array.isArray(saved) ? saved : [];

    } catch (error) {
        console.error("Could not read favorites:", error);
        return [];
    }
}

let favoriteAttractions = getFavorites();


function saveFavorites() {
    try {
        localStorage.setItem(
            FAVORITES_KEY,
            JSON.stringify(favoriteAttractions)
        );
    } catch (error) {
        console.error("Could not save favorites:", error);
    }
}


/* ---------- 4. IDENTIFY ATTRACTIONS ---------- */

function getAttractionName(card) {

    return (
        card.dataset.name ||
        card.querySelector("h3")?.textContent.trim() ||
        ""
    ).toLowerCase();

}


/* ---------- 5. UPDATE FAVORITE BUTTONS ---------- */

function updateFavoriteButtons() {

    document.querySelectorAll(".explore-favorite").forEach(button => {

        const card = button.closest(".explore-card");

        if (!card) return;

        const attractionName = getAttractionName(card);

        const isFavorite = favoriteAttractions.includes(attractionName);

        button.classList.toggle("favorited", isFavorite);

        button.setAttribute(
            "aria-pressed",
            String(isFavorite)
        );

        button.setAttribute(
            "aria-label",
            isFavorite
                ? "Remove from favorites"
                : "Add to favorites"
        );

        const icon = button.querySelector("i");

        if (icon) {
            icon.classList.toggle("fa-solid", isFavorite);
            icon.classList.toggle("fa-regular", !isFavorite);
        }

    });

}


/* ---------- 6. FAVORITE BUTTON CLICK ---------- */

document.querySelectorAll(".explore-favorite").forEach(button => {

    button.addEventListener("click", function(event) {

        event.preventDefault();
        event.stopPropagation();

        const card = this.closest(".explore-card");

        if (!card) return;

        const attractionName = getAttractionName(card);

        if (!attractionName) return;

        if (favoriteAttractions.includes(attractionName)) {

            favoriteAttractions = favoriteAttractions.filter(
                name => name !== attractionName
            );

        } else {

            favoriteAttractions.push(attractionName);

        }

        saveFavorites();
        updateFavoriteButtons();

    });

});

updateFavoriteButtons();


/* ---------- 7. SEARCH FUNCTIONALITY ---------- */

if (attractionSearch) {

    attractionSearch.addEventListener("input", function() {

        searchText = this.value.trim().toLowerCase();

        updateClearButton();
        filterAttractions();

    });

}


/* ---------- 8. CLEAR SEARCH BUTTON ---------- */

function updateClearButton() {

    if (!clearSearch) return;

    clearSearch.classList.toggle(
        "visible",
        attractionSearch.value.length > 0
    );

}

if (clearSearch) {

    clearSearch.addEventListener("click", function() {

        attractionSearch.value = "";
        searchText = "";

        updateClearButton();
        filterAttractions();

        attractionSearch.focus();

    });

}


/* ---------- 9. CATEGORY FILTERS ---------- */

filterButtons.forEach(button => {

    button.addEventListener("click", function() {

        filterButtons.forEach(filter => {
            filter.classList.remove("active");
        });

        this.classList.add("active");

        selectedCategory = this.dataset.filter || "all";

        filterAttractions();

    });

});


/* ---------- 10. FILTER ATTRACTIONS ---------- */

function filterAttractions() {

    let visibleCount = 0;

    attractionCards.forEach(card => {

        const category = (
            card.dataset.category || ""
        ).toLowerCase();

        const name = (
            card.dataset.name ||
            card.querySelector("h3")?.textContent ||
            ""
        ).toLowerCase();

        const description = (
            card.querySelector(".explore-card-content > p")
                ?.textContent || ""
        ).toLowerCase();

        const matchesCategory =
            selectedCategory === "all" ||
            category === selectedCategory;

        const matchesSearch =
            name.includes(searchText) ||
            description.includes(searchText);

        const isVisible = matchesCategory && matchesSearch;

        card.classList.toggle("hidden", !isVisible);

        if (isVisible) {
            visibleCount++;
        }

    });


    // Update result count
    if (resultCount) {
        resultCount.textContent = visibleCount;
    }


    // Show or hide no-results message
    if (noResults) {
        noResults.style.display =
            visibleCount === 0 ? "block" : "none";
    }

}


/* ---------- 11. SORT ATTRACTIONS ---------- */

if (sortAttractions && attractionsGrid) {

    sortAttractions.addEventListener("change", function() {

        const sortType = this.value;

        const sortedCards = [...attractionCards];

        if (
            sortType === "az" ||
            sortType === "name-asc"
        ) {

            sortedCards.sort((a, b) => {
                return getAttractionName(a).localeCompare(
                    getAttractionName(b)
                );
            });

        } else if (
            sortType === "za" ||
            sortType === "name-desc"
        ) {

            sortedCards.sort((a, b) => {
                return getAttractionName(b).localeCompare(
                    getAttractionName(a)
                );
            });

        }

        // Put cards back in the grid
        sortedCards.forEach(card => {
            attractionsGrid.appendChild(card);
        });

        filterAttractions();

    });

}


/* ---------- 12. MOBILE NAVIGATION ---------- */

const menuToggle = document.getElementById("menuToggle");
const navbar = document.getElementById("navbar");

function closeMobileMenu() {

    if (!menuToggle || !navbar) return;

    navbar.classList.remove("open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");

    const icon = menuToggle.querySelector("i");

    if (icon) {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
    }

}


if (menuToggle && navbar) {

    menuToggle.addEventListener("click", function() {

        const isOpen = navbar.classList.toggle("open");

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );

        const icon = menuToggle.querySelector("i");

        if (icon) {
            icon.classList.toggle("fa-bars", !isOpen);
            icon.classList.toggle("fa-xmark", isOpen);
        }

    });


    // Close menu after clicking a navigation link
    navbar.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", closeMobileMenu);

    });


    // Close menu using Escape key
    document.addEventListener("keydown", function(event) {

        if (event.key === "Escape") {
            closeMobileMenu();
        }

    });

}


/* ---------- 13. HEADER SCROLL EFFECT ---------- */

const header = document.getElementById("header");

if (header) {

    function updateHeader() {

        header.classList.toggle(
            "scrolled",
            window.scrollY > 40
        );

    }

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });

    updateHeader();

}


/* ---------- 14. INITIALIZE PAGE ---------- */

updateClearButton();
filterAttractions();

console.log("Jaipur Tour Cloud Explore page loaded successfully!");
