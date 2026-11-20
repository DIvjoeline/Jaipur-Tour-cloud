
document.addEventListener("DOMContentLoaded", () => {

    // ELEMENTS
    const searchInput = document.getElementById("essentialSearch");
    const clearButton = document.getElementById("clearEssentialSearch");
    const locationButton = document.getElementById("locationButton");
    const categoryButtons = document.querySelectorAll(".essential-category");
    const sortSelect = document.getElementById("essentialSort");
    const resultCount = document.getElementById("essentialResultCount");
    const noResults = document.getElementById("essentialNoResults");
    const cards = Array.from(document.querySelectorAll(".essential-card"));

    let activeCategory = "all";

    // FILTER AND SORT
    function updateEssentials() {

        const searchTerm = searchInput.value.trim().toLowerCase();
        const sortValue = sortSelect.value;

        let visibleCards = [];

        cards.forEach(card => {

            const name = (card.dataset.name || "").toLowerCase();
            const category = (card.dataset.category || "").toLowerCase();
            const cardText = card.textContent.toLowerCase();

            const matchesSearch =
                name.includes(searchTerm) ||
                category.includes(searchTerm) ||
                cardText.includes(searchTerm);

            const matchesCategory =
                activeCategory === "all" ||
                category === activeCategory;

            const shouldShow = matchesSearch && matchesCategory;

            card.style.display = shouldShow ? "" : "none";

            if (shouldShow) {
                visibleCards.push(card);
            }
        });

        // SORT VISIBLE CARDS
        if (sortValue === "name") {
            visibleCards.sort((a, b) => {
                return (a.dataset.name || "").localeCompare(
                    b.dataset.name || ""
                );
            });

            const grid = document.querySelector(".essentials-grid");

            visibleCards.forEach(card => {
                grid.appendChild(card);
            });
        }

        // UPDATE COUNT
        if (resultCount) {
            resultCount.textContent =
                `${visibleCards.length} essential ${visibleCards.length === 1 ? "result" : "results"} found`;
        }

        // EMPTY STATE
        if (noResults) {
            noResults.style.display =
                visibleCards.length === 0 ? "block" : "none";
        }

        // CLEAR BUTTON
        if (clearButton) {
            clearButton.style.display =
                searchTerm ? "block" : "none";
        }
    }

    // SEARCH
    if (searchInput) {
        searchInput.addEventListener("input", updateEssentials);
    }

    // CLEAR SEARCH
    if (clearButton) {
        clearButton.addEventListener("click", () => {
            searchInput.value = "";
            updateEssentials();
            searchInput.focus();
        });
    }

    // CATEGORY FILTERS
    categoryButtons.forEach(button => {

        button.addEventListener("click", () => {

            categoryButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            activeCategory = button.dataset.category || "all";

            updateEssentials();
        });
    });

    // SORTING
    if (sortSelect) {
        sortSelect.addEventListener("change", updateEssentials);
    }

    // LOCATION BUTTON
    if (locationButton) {

        locationButton.addEventListener("click", () => {

            if (!navigator.geolocation) {
                alert("Location services are not supported by your browser.");
                return;
            }

            locationButton.disabled = true;
            locationButton.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> Getting location...';

            navigator.geolocation.getCurrentPosition(

                position => {

                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;

                    locationButton.disabled = false;
                    locationButton.innerHTML =
                        '<i class="fa-solid fa-location-crosshairs"></i> Location received';

                    console.log("Latitude:", latitude);
                    console.log("Longitude:", longitude);

                    alert(
                        "Your location was received successfully. Nearby listings will be connected in a future update."
                    );
                },

                error => {

                    locationButton.disabled = false;
                    locationButton.innerHTML =
                        '<i class="fa-solid fa-location-crosshairs"></i> Use My Location';

                    if (error.code === error.PERMISSION_DENIED) {
                        alert("Location permission was denied. Please allow location access in your browser.");
                    } else {
                        alert("Unable to retrieve your location. Please try again.");
                    }
                },

                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        });
    }

    // MOBILE NAVIGATION
    const menuToggle = document.getElementById("menuToggle");
    const navbar = document.getElementById("navbar");

    if (menuToggle && navbar) {

        menuToggle.addEventListener("click", () => {
            navbar.classList.toggle("active");
            menuToggle.classList.toggle("active");
        });

        navbar.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navbar.classList.remove("active");
                menuToggle.classList.remove("active");
            });
        });
    }

    // HEADER SCROLL EFFECT
    const header = document.getElementById("header");

    window.addEventListener("scroll", () => {
        if (header) {
            header.classList.toggle("scrolled", window.scrollY > 50);
        }
    });

    // FOOTER YEAR
    const yearElement = document.getElementById("currentYear");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // INITIAL LOAD
    updateEssentials();

});
