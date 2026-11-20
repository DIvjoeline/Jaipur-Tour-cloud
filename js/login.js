
document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");
    const loginMessage = document.getElementById("loginMessage");

    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");

    // Mobile navigation
    const menuToggle = document.getElementById("menuToggle");
    const navbar = document.getElementById("navbar");

    if (menuToggle && navbar) {
        menuToggle.addEventListener("click", () => {
            const isOpen = navbar.classList.toggle("active");

            menuToggle.setAttribute("aria-expanded", isOpen);
            menuToggle.innerHTML = isOpen
                ? '<i class="fa-solid fa-xmark"></i>'
                : '<i class="fa-solid fa-bars"></i>';
        });
    }

    // Header scroll effect
    const header = document.getElementById("header");

    window.addEventListener("scroll", () => {
        if (header) {
            header.classList.toggle("scrolled", window.scrollY > 50);
        }
    });

    // Show / hide password
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener("click", () => {
            const isPassword = passwordInput.type === "password";

            passwordInput.type = isPassword ? "text" : "password";

            togglePassword.innerHTML = isPassword
                ? '<i class="fa-regular fa-eye-slash"></i>'
                : '<i class="fa-regular fa-eye"></i>';

            togglePassword.setAttribute(
                "aria-label",
                isPassword ? "Hide password" : "Show password"
            );
        });
    }

    // Clear individual field errors
    emailInput.addEventListener("input", () => {
        emailError.textContent = "";
        emailInput.closest(".input-wrapper").classList.remove("has-error");
    });

    passwordInput.addEventListener("input", () => {
        passwordError.textContent = "";
        passwordInput.closest(".input-wrapper").classList.remove("has-error");
    });

    // Form validation
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        emailError.textContent = "";
        passwordError.textContent = "";

        loginMessage.className = "login-message";
        loginMessage.textContent = "";

        emailInput.closest(".input-wrapper").classList.remove("has-error");
        passwordInput.closest(".input-wrapper").classList.remove("has-error");

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        let isValid = true;

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            emailError.textContent = "Please enter your email address.";
            emailInput.closest(".input-wrapper").classList.add("has-error");
            isValid = false;
        } else if (!emailPattern.test(email)) {
            emailError.textContent = "Please enter a valid email address.";
            emailInput.closest(".input-wrapper").classList.add("has-error");
            isValid = false;
        }

        if (!password) {
            passwordError.textContent = "Please enter your password.";
            passwordInput.closest(".input-wrapper").classList.add("has-error");
            isValid = false;
        }

        if (!isValid) {
            loginMessage.textContent = "Please correct the highlighted fields.";
            loginMessage.classList.add("show", "error");
            return;
        }

        // Frontend only: authentication will be connected to Spring Boot later.
        loginMessage.textContent =
            "Your details passed the basic form checks. Sign-in authentication is not connected yet.";

        loginMessage.classList.add("show", "info");
    });

    // Forgot password placeholder
    const forgotPassword = document.getElementById("forgotPassword");

    if (forgotPassword) {
        forgotPassword.addEventListener("click", (event) => {
            event.preventDefault();

            loginMessage.textContent =
                "Password recovery will be available after we connect the authentication backend.";

            loginMessage.classList.add("show", "info");
        });
    }

});
