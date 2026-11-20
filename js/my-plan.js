
/* =========================================
   JAIPUR TOUR CLOUD - ITINERARY SYSTEM
========================================= */


/* ---------- 1. SELECT HTML ELEMENTS ---------- */

const tripName = document.getElementById("tripName");
const tripStartDate = document.getElementById("tripStartDate");
const tripDuration = document.getElementById("tripDuration");
const travelType = document.getElementById("travelType");

const placeSearch = document.getElementById("placeSearch");
const availableAttractions = document.getElementById("availableAttractions");

const selectedPlacesContainer = document.getElementById("selectedPlaces");
const totalPlaces = document.getElementById("totalPlaces");

const generatePlanBtn = document.getElementById("generatePlan");
const clearPlanBtn = document.getElementById("clearPlan");
const savePlanBtn = document.getElementById("savePlan");

const itineraryDays = document.getElementById("itineraryDays");
const planMessage = document.getElementById("planMessage");
const planEmptySearch = document.getElementById("planEmptySearch");

const currentYear = document.getElementById("currentYear");


/* ---------- 2. STORAGE ---------- */

const STORAGE_KEY = "jaipurTourCloudMyPlan";

let selectedAttractions = [];
let generatedItinerary = [];

let saveMessageTimeout;


/* ---------- 3. HELPER FUNCTIONS ---------- */

function showMessage(message, isError = false) {

    if (!planMessage) return;

    planMessage.textContent = message;
    planMessage.classList.toggle("error", isError);

    clearTimeout(saveMessageTimeout);

    saveMessageTimeout = setTimeout(() => {
        planMessage.textContent = "";
        planMessage.classList.remove("error");
    }, 3500);

}


function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);

}


function getDateLabel(dateString) {

    if (!dateString) return "Date not selected";

    const date = new Date(dateString + "T12:00:00");

    if (Number.isNaN(date.getTime())) {
        return "Date not selected";
    }

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });

}


/* ---------- 4. INITIALIZE PAGE ---------- */

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


// Prevent choosing a past start date
if (tripStartDate) {

    const today = new Date();

    const localToday = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");

    tripStartDate.min = localToday;

}


/* ---------- 5. GET AVAILABLE PLACES ---------- */

function getPlaceDetails(card) {

    if (!card) return null;

    const name = card.dataset.name ||
        card.querySelector("h3")?.textContent.trim();

    const category = card.dataset.category || "attraction";

    const image = card.querySelector("img")?.getAttribute("src") || "";

    const description = card.querySelector("p")?.textContent.trim() || "";

    if (!name) return null;

    return {
        id: name.toLowerCase(),
        name,
        category,
        image,
        description
    };

}


/* ---------- 6. ADD PLACE TO PLAN ---------- */

if (availableAttractions) {

    availableAttractions.querySelectorAll(".add-place-btn")
        .forEach(button => {

            button.addEventListener("click", function() {

                const card = this.closest(".plan-place-card");
                const place = getPlaceDetails(card);

                if (!place) return;

                const alreadyAdded = selectedAttractions.some(
                    item => item.id === place.id
                );

                if (alreadyAdded) {
                    showMessage("This place is already in your plan.", true);
                    return;
                }

                selectedAttractions.push(place);

                generatedItinerary = [];

                renderSelectedPlaces();
                renderItinerary();

                showMessage(place.name + " added to your plan!");

            });

        });

}


/* ---------- 7. REMOVE PLACE ---------- */

if (selectedPlacesContainer) {

    selectedPlacesContainer.addEventListener("click", function(event) {

        const removeButton = event.target.closest(".remove-place-btn");

        if (!removeButton) return;

        const placeId = removeButton.dataset.id;

        selectedAttractions = selectedAttractions.filter(
            place => place.id !== placeId
        );

        generatedItinerary = [];

        renderSelectedPlaces();
        renderItinerary();

        showMessage("Place removed from your plan.");

    });

}


/* ---------- 8. RENDER SELECTED PLACES ---------- */

function renderSelectedPlaces() {

    if (!selectedPlacesContainer) return;

    if (totalPlaces) {
        totalPlaces.textContent = selectedAttractions.length;
    }

    if (selectedAttractions.length === 0) {

        selectedPlacesContainer.innerHTML = `
            <div class="plan-empty-state">

                <div class="empty-icon">
                    <i class="fa-regular fa-map"></i>
                </div>

                <h3>Your journey starts here</h3>

                <p>
                    You haven't selected any attractions yet.
                    Add places from above to start planning.
                </p>

            </div>
        `;

        return;

    }

    selectedPlacesContainer.innerHTML = selectedAttractions.map(place => `

        <div class="selected-place-card">

            <img
                src="${escapeHTML(place.image)}"
                alt="${escapeHTML(place.name)}">

            <div class="selected-place-info">

                <h4>${escapeHTML(place.name)}</h4>

                <span>
                    ${escapeHTML(place.category)}
                </span>

            </div>

            <button
                type="button"
                class="remove-place-btn"
                data-id="${escapeHTML(place.id)}"
                aria-label="Remove ${escapeHTML(place.name)}">

                <i class="fa-solid fa-xmark"></i>

            </button>

        </div>

    `).join("");

}


/* ---------- 9. SEARCH AVAILABLE PLACES ---------- */

if (placeSearch && availableAttractions) {

    placeSearch.addEventListener("input", function() {

        const searchValue = this.value.trim().toLowerCase();

        let visibleCount = 0;

        availableAttractions.querySelectorAll(".plan-place-card")
            .forEach(card => {

                const name = card.dataset.name || "";

                const description =
                    card.querySelector("p")?.textContent.toLowerCase() || "";

                const category = card.dataset.category || "";

                const matches =
                    name.includes(searchValue) ||
                    description.includes(searchValue) ||
                    category.includes(searchValue);

                card.classList.toggle("hidden", !matches);

                if (matches) visibleCount++;

            });

        if (planEmptySearch) {
            planEmptySearch.style.display =
                visibleCount === 0 ? "block" : "none";
        }

    });

}


/* ---------- 10. GENERATE ITINERARY ---------- */

if (generatePlanBtn) {

    generatePlanBtn.addEventListener("click", generateItinerary);

}


function generateItinerary() {

    if (selectedAttractions.length === 0) {

        showMessage(
            "Please add at least one attraction before generating your plan.",
            true
        );

        return;

    }

    const numberOfDays = Number(tripDuration?.value || 1);

    if (!Number.isInteger(numberOfDays) ||
        numberOfDays < 1 ||
        numberOfDays > 7) {

        showMessage("Please select a valid trip duration.", true);
        return;

    }

    const startDate = tripStartDate?.value || "";

    if (startDate) {

        const selectedDate = new Date(startDate + "T00:00:00");
        const today = new Date();

        today.setHours(0, 0, 0, 0);

        if (Number.isNaN(selectedDate.getTime()) || selectedDate < today) {

            showMessage("Please select today or a future starting date.", true);
            return;

        }

    }

    generatedItinerary = Array.from(
        { length: numberOfDays },
        () => []
    );

    // Distribute places across days as evenly as possible.
    selectedAttractions.forEach((place, index) => {

        const dayIndex = index % numberOfDays;

        generatedItinerary[dayIndex].push(place);

    });

    renderItinerary();

    showMessage("Your day-wise itinerary has been generated!");

}


/* ---------- 11. RENDER ITINERARY ---------- */

function renderItinerary() {

    if (!itineraryDays) return;

    if (generatedItinerary.length === 0) {

        itineraryDays.innerHTML = `
            <div class="itinerary-empty-state">

                <i class="fa-solid fa-route"></i>

                <h3>Your itinerary is waiting</h3>

                <p>
                    Select attractions and generate
                    your day-wise Jaipur travel plan.
                </p>

            </div>
        `;

        return;

    }

    const startDate = tripStartDate?.value || "";

    itineraryDays.innerHTML = generatedItinerary.map(
        (dayPlaces, index) => {

            let dateLabel = "";

            if (startDate) {

                const date = new Date(startDate + "T12:00:00");

                date.setDate(date.getDate() + index);

                dateLabel = date.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                });

            } else {

                dateLabel = "Date not selected";

            }

            const placesHTML = dayPlaces.map((place, placeIndex) => `

                <div class="itinerary-stop">

                    <img
                        class="stop-image"
                        src="${escapeHTML(place.image)}"
                        alt="${escapeHTML(place.name)}">

                    <div class="stop-info">

                        <h4>
                            ${placeIndex + 1}. ${escapeHTML(place.name)}
                        </h4>

                        <span>
                            ${escapeHTML(place.category)}
                        </span>

                    </div>

                </div>

            `).join("");

            return `

                <article class="itinerary-day">

                    <div class="itinerary-day-header">

                        <div class="day-number">
                            ${index + 1}
                        </div>

                        <div>

                            <h3>Day ${index + 1}</h3>

                            <p>${dateLabel}</p>

                        </div>

                    </div>

                    <div class="itinerary-day-places">

                        ${placesHTML || `
                            <p>No attractions assigned to this day.</p>
                        `}

                    </div>

                </article>

            `;

        }
    ).join("");

}


/* ---------- 12. SAVE PLAN ---------- */

if (savePlanBtn) {

    savePlanBtn.addEventListener("click", savePlan);

}


function savePlan() {

    const planData = {

        tripName: tripName?.value.trim() || "My Jaipur Adventure",

        startDate: tripStartDate?.value || "",

        duration: Number(tripDuration?.value || 1),

        travelStyle: travelType?.value || "balanced",

        attractions: selectedAttractions,

        itinerary: generatedItinerary,

        updatedAt: new Date().toISOString()

    };

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(planData)
        );

        showMessage("Your Jaipur travel plan has been saved!");

    } catch (error) {

        console.error("Unable to save plan:", error);

        showMessage(
            "Could not save your plan. Check your browser storage.",
            true
        );

    }

}


/* ---------- 13. LOAD SAVED PLAN ---------- */

function loadSavedPlan() {

    let savedPlan;

    try {

        savedPlan = JSON.parse(
            localStorage.getItem(STORAGE_KEY)
        );

    } catch (error) {

        console.error("Unable to read saved plan:", error);
        return;

    }

    if (!savedPlan || typeof savedPlan !== "object") return;

    if (tripName) {
        tripName.value = savedPlan.tripName || "";
    }

    if (tripStartDate) {
        tripStartDate.value = savedPlan.startDate || "";
    }

    if (tripDuration) {
        tripDuration.value = String(savedPlan.duration || 2);
    }

    if (travelType) {
        travelType.value = savedPlan.travelStyle || "balanced";
    }

    if (Array.isArray(savedPlan.attractions)) {

        selectedAttractions = savedPlan.attractions.filter(place =>
            place &&
            typeof place.id === "string" &&
            typeof place.name === "string"
        );

    }

    if (Array.isArray(savedPlan.itinerary)) {

        const validIds = new Set(
            selectedAttractions.map(place => place.id)
        );

        generatedItinerary = savedPlan.itinerary.map(day =>
            Array.isArray(day)
                ? day.filter(place =>
                    place && validIds.has(place.id)
                )
                : []
        );

    }

    renderSelectedPlaces();
    renderItinerary();

}


/* ---------- 14. CLEAR PLAN ---------- */

if (clearPlanBtn) {

    clearPlanBtn.addEventListener("click", function() {

        const confirmed = confirm(
            "Are you sure you want to clear your entire travel plan?"
        );

        if (!confirmed) return;

        selectedAttractions = [];
        generatedItinerary = [];

        if (tripName) tripName.value = "";

        if (tripStartDate) tripStartDate.value = "";

        if (tripDuration) tripDuration.value = "2";

        if (travelType) travelType.value = "balanced";

        try {

            localStorage.removeItem(STORAGE_KEY);

        } catch (error) {

            console.error("Unable to clear saved plan:", error);

        }

        renderSelectedPlaces();
        renderItinerary();

        showMessage("Your travel plan has been cleared.");

    });

}


/* ---------- 15. MOBILE NAVIGATION ---------- */

const menuToggle = document.getElementById("menuToggle");
const navbar = document.getElementById("navbar");
const header = document.getElementById("header");

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

    navbar.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {
            closeMobileMenu();
        }

    });

}


/* ---------- 16. HEADER SCROLL EFFECT ---------- */

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


/* ---------- 17. START THE APPLICATION ---------- */

loadSavedPlan();

console.log("Jaipur Tour Cloud - My Plan loaded successfully!");
