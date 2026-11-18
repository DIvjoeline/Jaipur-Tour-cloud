
document.addEventListener("DOMContentLoaded", () => {

    // ---------- ELEMENTS ----------

    const categorySelect = document.getElementById("priceCategory");
    const searchInput = document.getElementById("priceSearch");
    const checkButton = document.getElementById("checkPriceBtn");

    const resultSection = document.getElementById("priceResultSection");
    const resultContainer = document.getElementById("priceResult");
    const resultStatus = document.getElementById("resultStatus");

    const suggestionButtons = document.querySelectorAll(".suggestion-btn");
    const currentYear = document.getElementById("currentYear");

    // ---------- FOOTER YEAR ----------

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    // ---------- REFERENCE PRICE DATA ----------

    // These are sample demonstration records.
    // Replace them with verified records from your project workbook
    // before presenting them as real market prices.

    const priceData = [
        {
            name: "Auto Rickshaw",
            category: "transport",
            unit: "per ride",
            minPrice: null,
            maxPrice: null,
            note: "Fare depends on distance, route, waiting time and whether the meter is used.",
            source: "Verified fare data required"
        },
        {
            name: "Blue Pottery",
            category: "shopping",
            unit: "per item",
            minPrice: null,
            maxPrice: null,
            note: "Prices vary by size, design, craftsmanship and seller.",
            source: "Verified product-price data required"
        },
        {
            name: "Jaipur Textiles",
            category: "shopping",
            unit: "per item",
            minPrice: null,
            maxPrice: null,
            note: "Prices vary by fabric, printing technique, quality and size.",
            source: "Verified product-price data required"
        },
        {
            name: "Tourist Guide",
            category: "guide",
            unit: "per session",
            minPrice: null,
            maxPrice: null,
            note: "Charges depend on duration, language, group size and guide credentials.",
            source: "Verified guide-rate data required"
        }
    ];


    // ---------- HELPER FUNCTIONS ----------

    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, character => {
            const entities = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            };

            return entities[character];
        });
    }


    function formatPrice(value) {
        if (value === null || value === undefined || value === "") {
            return "Not available";
        }

        return "₹" + Number(value).toLocaleString("en-IN");
    }


    function showMessage(message, type = "info") {
        resultStatus.className = "result-status";

        if (type === "success") {
            resultStatus.style.background = "#dcfce7";
            resultStatus.style.color = "#166534";
            resultStatus.innerHTML =
                `<i class="fa-solid fa-circle-check"></i> ${escapeHTML(message)}`;
        } else if (type === "error") {
            resultStatus.style.background = "#fee2e2";
            resultStatus.style.color = "#991b1b";
            resultStatus.innerHTML =
                `<i class="fa-solid fa-circle-exclamation"></i> ${escapeHTML(message)}`;
        } else {
            resultStatus.style.background = "#fff7e6";
            resultStatus.style.color = "#a16207";
            resultStatus.innerHTML =
                `<i class="fa-solid fa-circle-info"></i> ${escapeHTML(message)}`;
        }
    }


    // ---------- RENDER RESULT ----------

    function renderResult(item) {

        const hasPrice =
            Number.isFinite(item.minPrice) &&
            Number.isFinite(item.maxPrice);

        resultContainer.innerHTML = `
            <div class="price-detail-result">

                <div class="price-detail-top">
                    <div>
                        <span class="section-eyebrow">SEARCHED ITEM</span>
                        <h3>${escapeHTML(item.name)}</h3>
                        <p>${escapeHTML(item.unit)}</p>
                    </div>

                    <span class="price-category-label">
                        ${escapeHTML(item.category)}
                    </span>
                </div>

                <div class="price-range-box">
                    <span class="price-range-label">
                        Reference price range
                    </span>

                    ${
                        hasPrice
                        ? `
                            <div class="price-range-values">
                                <strong>${formatPrice(item.minPrice)}</strong>
                                <span>to</span>
                                <strong>${formatPrice(item.maxPrice)}</strong>
                            </div>
                          `
                        : `
                            <div class="price-unavailable">
                                <i class="fa-solid fa-circle-info"></i>
                                Price data is not available yet.
                            </div>
                          `
                    }
                </div>

                <div class="price-detail-note">
                    <i class="fa-solid fa-lightbulb"></i>

                    <div>
                        <strong>Things to consider</strong>
                        <p>${escapeHTML(item.note)}</p>
                    </div>
                </div>

                <div class="price-source">
                    <i class="fa-solid fa-database"></i>
                    <span>Data status: ${escapeHTML(item.source)}</span>
                </div>

                <p class="price-disclaimer">
                    Reference information is not a guaranteed fixed price.
                    Always confirm the final price with the seller or service provider.
                </p>

            </div>
        `;

        showMessage(
            hasPrice ? "Reference found" : "Information found",
            hasPrice ? "success" : "info"
        );

        resultSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }


    // ---------- SEARCH FUNCTION ----------

    function checkPrice() {

        const category = categorySelect.value;
        const searchTerm = searchInput.value.trim().toLowerCase();

        if (!category) {
            showMessage("Please select a category.", "error");
            categorySelect.focus();
            return;
        }

        if (!searchTerm) {
            showMessage("Please enter a product or service.", "error");
            searchInput.focus();
            return;
        }

        const matchedItem = priceData.find(item => {

            const matchesCategory = item.category === category;

            const matchesName = item.name
                .toLowerCase()
                .includes(searchTerm);

            return matchesCategory && matchesName;
        });

        if (!matchedItem) {

            resultContainer.innerHTML = `
                <div class="price-empty-state">
                    <div class="empty-price-icon">
                        <i class="fa-solid fa-face-frown"></i>
                    </div>

                    <h3>No matching record found</h3>

                    <p>
                        We couldn't find this item in our current reference
                        dataset. Try another search or report missing information.
                    </p>
                </div>
            `;

            showMessage("No matching record", "error");

            resultSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            return;
        }

        renderResult(matchedItem);
    }


    // ---------- SEARCH BUTTON ----------

    checkButton.addEventListener("click", checkPrice);


    // ---------- ENTER KEY SEARCH ----------

    searchInput.addEventListener("keydown", event => {

        if (event.key === "Enter") {
            checkPrice();
        }

    });


    // ---------- POPULAR SEARCH BUTTONS ----------

    suggestionButtons.forEach(button => {

        button.addEventListener("click", () => {

            categorySelect.value = button.dataset.category;
            searchInput.value = button.dataset.search;

            checkPrice();

        });

    });


    // ---------- MOBILE NAVIGATION ----------

    const menuToggle = document.getElementById("menuToggle");
    const navbar = document.getElementById("navbar");

    if (menuToggle && navbar) {

        menuToggle.addEventListener("click", () => {

            const isOpen = navbar.classList.toggle("open");

            menuToggle.setAttribute("aria-expanded", isOpen);

            menuToggle.innerHTML = isOpen
                ? '<i class="fa-solid fa-xmark"></i>'
                : '<i class="fa-solid fa-bars"></i>';

        });

        navbar.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                navbar.classList.remove("open");

                menuToggle.setAttribute("aria-expanded", "false");

                menuToggle.innerHTML =
                    '<i class="fa-solid fa-bars"></i>';

            });

        });

    }


    // ---------- HEADER SCROLL EFFECT ----------

    const header = document.getElementById("header");

    window.addEventListener("scroll", () => {

        if (header) {
            header.classList.toggle("scrolled", window.scrollY > 50);
        }

    });


});
