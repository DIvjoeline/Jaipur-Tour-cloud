
/* =========================================
   JAIPUR TOUR CLOUD - LOCAL BUSINESSES
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // ELEMENTS
    // =====================================

    const searchInput = document.getElementById("businessSearch");
    const clearButton = document.getElementById("clearBusinessSearch");
    const categoryButtons = document.querySelectorAll(".business-filter");
    const sortSelect = document.getElementById("businessSort");
    const resultCount = document.getElementById("businessResultCount");
    const businessGrid = document.getElementById("businessGrid");
    const noResults = document.getElementById("businessNoResults");
    const resetButton = document.getElementById("resetBusinessFilters");

    const cards = Array.from(
        document.querySelectorAll(".business-card")
    );

    let activeCategory = "all";


    // =====================================
    // FILTER AND SEARCH
    // =====================================

    function updateBusinesses() {

        const searchTerm = searchInput.value.trim().toLowerCase();
        const sortValue = sortSelect.value;

        let visibleCards = [];

        cards.forEach(card => {

            const name = (card.dataset.name || "").toLowerCase();
            const category = (card.dataset.category || "").toLowerCase();
            const keywords = (card.dataset.keywords || "").toLowerCase();
            const cardText = card.textContent.toLowerCase();

            const matchesSearch =
                name.includes(searchTerm) ||
                category.includes(searchTerm) ||
                keywords.includes(searchTerm) ||
                cardText.includes(searchTerm);

            const matchesCategory =
                activeCategory === "all" ||
                category === activeCategory;

            const shouldShow = matchesSearch && matchesCategory;

            card.hidden = !shouldShow;

            if (shouldShow) {
                visibleCards.push(card);
            }

        });


        // =================================
        // SORTING
        // =================================

        if (sortValue === "name") {

            visibleCards.sort((a, b) => {
                return (a.dataset.name || "").localeCompare(
                    b.dataset.name || ""
                );
            });

        } else {

            // Restore original order
            visibleCards.sort((a, b) => {
                return cards.indexOf(a) - cards.indexOf(b);
            });

        }

        // Append in the selected order
        visibleCards.forEach(card => {
            businessGrid.appendChild(card);
        });


        // =================================
        // RESULT COUNT
        // =================================

        if (resultCount) {

            const count = visibleCards.length;

            resultCount.textContent =
                `${count} ${count === 1 ? "category" : "categories"} found`;

        }


        // =================================
        // EMPTY STATE
        // =================================

        if (noResults) {
            noResults.hidden = visibleCards.length !== 0;
        }


        // =================================
        // CLEAR BUTTON
        // =================================

        if (clearButton) {

            clearButton.style.display =
                searchTerm ? "block" : "none";

        }

    }


    // =====================================
    // SEARCH INPUT
    // =====================================

    if (searchInput) {

        searchInput.addEventListener("input", updateBusinesses);

    }


    // =====================================
    // CLEAR SEARCH
    // =====================================

    if (clearButton) {

        clearButton.addEventListener("click", () => {

            searchInput.value = "";

            updateBusinesses();

            searchInput.focus();

        });

    }


    // =====================================
    // CATEGORY FILTERS
    // =====================================

    function selectCategory(category) {

        activeCategory = category;

        categoryButtons.forEach(button => {

            const isActive =
                button.dataset.category === category;

            button.classList.toggle("active", isActive);

        });

        updateBusinesses();

    }


    categoryButtons.forEach(button => {

        button.addEventListener("click", () => {

            selectCategory(button.dataset.category || "all");

        });

    });


    // =====================================
    // EXPLORE CATEGORY BUTTONS
    // =====================================

    const exploreButtons = document.querySelectorAll(
        ".business-explore-button"
    );

    exploreButtons.forEach(button => {

        button.addEventListener("click", () => {

            const category = button.dataset.filter;

            if (!category) return;

            selectCategory(category);

            // Scroll back to the category results
            document.querySelector(".business-results-heading")
                .scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

        });

    });


    // =====================================
    // SORTING
    // =====================================

    if (sortSelect) {

        sortSelect.addEventListener("change", updateBusinesses);

    }


    // =====================================
    // RESET FILTERS
    // =====================================

    function resetFilters() {

        searchInput.value = "";

        if (sortSelect) {
            sortSelect.value = "default";
        }

        selectCategory("all");

    }


    if (resetButton) {

        resetButton.addEventListener("click", resetFilters);

    }


    // =====================================
    // MOBILE NAVIGATION
    // =====================================

    const menuToggle = document.getElementById("menuToggle");
    const navbar = document.getElementById("navbar");

    if (menuToggle && navbar) {

        menuToggle.addEventListener("click", () => {

            const isOpen = navbar.classList.toggle("active");

            menuToggle.classList.toggle("active", isOpen);

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close navigation menu" : "Open navigation menu"
            );

        });


        navbar.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                navbar.classList.remove("active");
                menuToggle.classList.remove("active");

                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Open navigation menu");

            });

        });

    }


    // =====================================
    // HEADER SCROLL EFFECT
    // =====================================

    const header = document.getElementById("header");

    function updateHeader() {

        if (header) {

            header.classList.toggle(
                "scrolled",
                window.scrollY > 50
            );

        }

    }

    window.addEventListener("scroll", updateHeader);

    updateHeader();


    // =====================================
    // FOOTER YEAR
    // =====================================

    const yearElement = document.getElementById("currentYear");

    if (yearElement) {

        yearElement.textContent = new Date().getFullYear();

    }


    // =====================================
    // INITIAL PAGE LOAD
    // =====================================

    updateBusinesses();

});
