
document.addEventListener("DOMContentLoaded", () => {

    const registerForm = document.getElementById("registerForm");

    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const terms = document.getElementById("terms");

    const strengthBar = document.getElementById("strengthBar");
    const strengthText = document.getElementById("strengthText");
    const registerMessage = document.getElementById("registerMessage");

    // Show / hide password
    document.querySelectorAll(".password-toggle").forEach(button => {
        button.addEventListener("click", () => {
            const targetId = button.dataset.target;
            const input = document.getElementById(targetId);
            const icon = button.querySelector("i");

            if (input.type === "password") {
                input.type = "text";
                icon.classList.remove("fa-eye");
                icon.classList.add("fa-eye-slash");
                button.setAttribute("aria-label", "Hide password");
            } else {
                input.type = "password";
                icon.classList.remove("fa-eye-slash");
                icon.classList.add("fa-eye");
                button.setAttribute("aria-label", "Show password");
            }
        });
    });

    // Clear an individual error
    function clearError(errorId) {
        document.getElementById(errorId).textContent = "";
    }

    // Display an individual error
    function showError(errorId, message) {
        document.getElementById(errorId).textContent = message;
    }

    // Password strength checker
    function checkPasswordStrength(value) {
        let score = 0;

        if (value.length >= 8) score++;
        if (/[A-Z]/.test(value)) score++;
        if (/[a-z]/.test(value)) score++;
        if (/[0-9]/.test(value)) score++;
        if (/[^A-Za-z0-9]/.test(value)) score++;

        const levels = [
            { width: "0%", color: "#DC2626", text: "Use at least 8 characters" },
            { width: "20%", color: "#DC2626", text: "Very weak" },
            { width: "40%", color: "#F97316", text: "Weak" },
            { width: "60%", color: "#EAB308", text: "Fair" },
            { width: "80%", color: "#16A34A", text: "Good" },
            { width: "100%", color: "#15803D", text: "Strong password" }
        ];

        const level = value.length === 0 ? levels[0] : levels[score];

        strengthBar.style.width = level.width;
        strengthBar.style.backgroundColor = level.color;
        strengthText.textContent = level.text;
    }

    password.addEventListener("input", () => {
        checkPasswordStrength(password.value);
        clearError("passwordError");

        if (confirmPassword.value) {
            clearError("confirmPasswordError");
        }
    });

    // Remove errors while editing
    fullName.addEventListener("input", () => clearError("nameError"));
    email.addEventListener("input", () => clearError("emailError"));
    phone.addEventListener("input", () => clearError("phoneError"));
    confirmPassword.addEventListener("input", () => clearError("confirmPasswordError"));

    terms.addEventListener("change", () => clearError("termsError"));

    // Allow only digits in phone field
    phone.addEventListener("input", () => {
        phone.value = phone.value.replace(/\D/g, "").slice(0, 10);
    });

    // Form submission
    registerForm.addEventListener("submit", (event) => {
        event.preventDefault();

        // Clear previous errors
        [
            "nameError",
            "emailError",
            "phoneError",
            "passwordError",
            "confirmPasswordError",
            "termsError"
        ].forEach(clearError);

        registerMessage.textContent = "";
        registerMessage.className = "register-message";

        let isValid = true;

        const nameValue = fullName.value.trim();
        const emailValue = email.value.trim();
        const phoneValue = phone.value.trim();
        const passwordValue = password.value;
        const confirmValue = confirmPassword.value;

        // Name validation
        if (nameValue.length < 2) {
            showError("nameError", "Please enter your full name.");
            isValid = false;
        }

        // Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(emailValue)) {
            showError("emailError", "Please enter a valid email address.");
            isValid = false;
        }

        // Phone validation
        if (!/^[6-9]\d{9}$/.test(phoneValue)) {
            showError("phoneError", "Enter a valid 10-digit Indian mobile number.");
            isValid = false;
        }

        // Password validation
        const strongEnough =
            passwordValue.length >= 8 &&
            /[A-Z]/.test(passwordValue) &&
            /[a-z]/.test(passwordValue) &&
            /[0-9]/.test(passwordValue);

        if (!strongEnough) {
            showError(
                "passwordError",
                "Use 8+ characters with uppercase, lowercase and a number."
            );
            isValid = false;
        }

        // Confirm password validation
        if (confirmValue === "") {
            showError("confirmPasswordError", "Please confirm your password.");
            isValid = false;
        } else if (passwordValue !== confirmValue) {
            showError("confirmPasswordError", "Passwords do not match.");
            isValid = false;
        }

        // Terms validation
        if (!terms.checked) {
            showError("termsError", "Please accept the Terms & Conditions.");
            isValid = false;
        }

        if (!isValid) {
            registerMessage.textContent = "Please correct the highlighted fields.";
            registerMessage.classList.add("error");
            return;
        }

        // Frontend-only success message
        registerMessage.textContent =
            "Your details passed validation. Account creation will be available after backend integration.";

        registerMessage.classList.add("success");
    });

    // Placeholder links until these pages are created
    document.getElementById("termsLink").addEventListener("click", event => {
        event.preventDefault();
        alert("Terms & Conditions page will be added later.");
    });

    document.getElementById("privacyLink").addEventListener("click", event => {
        event.preventDefault();
        alert("Privacy Policy page will be added later.");
    });

});
