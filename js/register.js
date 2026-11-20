
import { auth } from "./firebase-config.js";

import {
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


document.addEventListener("DOMContentLoaded", () => {

    // Form elements
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


    // =========================================
    // SHOW / HIDE PASSWORD
    // =========================================

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


    // =========================================
    // CLEAR ERRORS
    // =========================================

    function clearError(errorId) {

        const element = document.getElementById(errorId);

        if (element) {
            element.textContent = "";
        }

    }


    // =========================================
    // DISPLAY ERRORS
    // =========================================

    function showError(errorId, message) {

        const element = document.getElementById(errorId);

        if (element) {
            element.textContent = message;
        }

    }


    // =========================================
    // DISPLAY GENERAL MESSAGE
    // =========================================

    function showMessage(message, type) {

        registerMessage.textContent = message;

        registerMessage.className = "register-message";

        registerMessage.classList.add(type);

    }


    // =========================================
    // PASSWORD STRENGTH CHECKER
    // =========================================

    function checkPasswordStrength(value) {

        let score = 0;

        if (value.length >= 8) score++;
        if (/[A-Z]/.test(value)) score++;
        if (/[a-z]/.test(value)) score++;
        if (/[0-9]/.test(value)) score++;
        if (/[^A-Za-z0-9]/.test(value)) score++;


        const levels = [

            {
                width: "0%",
                color: "#DC2626",
                text: "Use at least 8 characters"
            },

            {
                width: "20%",
                color: "#DC2626",
                text: "Very weak"
            },

            {
                width: "40%",
                color: "#F97316",
                text: "Weak"
            },

            {
                width: "60%",
                color: "#EAB308",
                text: "Fair"
            },

            {
                width: "80%",
                color: "#16A34A",
                text: "Good"
            },

            {
                width: "100%",
                color: "#15803D",
                text: "Strong password"
            }

        ];


        const level = value.length === 0
            ? levels[0]
            : levels[score];


        strengthBar.style.width = level.width;
        strengthBar.style.backgroundColor = level.color;

        strengthText.textContent = level.text;

    }


    // Password input event
    password.addEventListener("input", () => {

        checkPasswordStrength(password.value);

        clearError("passwordError");

        if (confirmPassword.value) {
            clearError("confirmPasswordError");
        }

    });


    // =========================================
    // REMOVE ERRORS WHILE EDITING
    // =========================================

    fullName.addEventListener("input", () => {
        clearError("nameError");
    });

    email.addEventListener("input", () => {
        clearError("emailError");
    });

    phone.addEventListener("input", () => {
        clearError("phoneError");
    });

    confirmPassword.addEventListener("input", () => {
        clearError("confirmPasswordError");
    });

    terms.addEventListener("change", () => {
        clearError("termsError");
    });


    // =========================================
    // PHONE NUMBER INPUT
    // Allow only digits
    // =========================================

    phone.addEventListener("input", () => {

        phone.value = phone.value
            .replace(/\D/g, "")
            .slice(0, 10);

    });


    // =========================================
    // FORM SUBMISSION
    // =========================================

    registerForm.addEventListener("submit", async (event) => {

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


        // Get form values
        const nameValue = fullName.value.trim();
        const emailValue = email.value.trim();
        const phoneValue = phone.value.trim();

        const passwordValue = password.value;
        const confirmValue = confirmPassword.value;


        // =====================================
        // NAME VALIDATION
        // =====================================

        if (nameValue.length < 2) {

            showError(
                "nameError",
                "Please enter your full name."
            );

            isValid = false;

        }


        // =====================================
        // EMAIL VALIDATION
        // =====================================

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(emailValue)) {

            showError(
                "emailError",
                "Please enter a valid email address."
            );

            isValid = false;

        }


        // =====================================
        // PHONE VALIDATION
        // =====================================

        if (!/^[6-9]\d{9}$/.test(phoneValue)) {

            showError(
                "phoneError",
                "Enter a valid 10-digit Indian mobile number."
            );

            isValid = false;

        }


        // =====================================
        // PASSWORD VALIDATION
        // =====================================

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


        // =====================================
        // CONFIRM PASSWORD VALIDATION
        // =====================================

        if (confirmValue === "") {

            showError(
                "confirmPasswordError",
                "Please confirm your password."
            );

            isValid = false;

        } else if (passwordValue !== confirmValue) {

            showError(
                "confirmPasswordError",
                "Passwords do not match."
            );

            isValid = false;

        }


        // =====================================
        // TERMS VALIDATION
        // =====================================

        if (!terms.checked) {

            showError(
                "termsError",
                "Please accept the Terms & Conditions."
            );

            isValid = false;

        }


        // =====================================
        // STOP IF VALIDATION FAILS
        // =====================================

        if (!isValid) {

            showMessage(
                "Please correct the highlighted fields.",
                "error"
            );

            return;

        }


        // =====================================
        // PREVENT MULTIPLE SUBMISSIONS
        // =====================================

        const submitButton = registerForm.querySelector('[type="submit"]');

        if (submitButton) {
            submitButton.disabled = true;
        }


        let accountCreated = false;
        let redirecting = false;


        try {


            // =================================
            // STEP 1: CREATE FIREBASE ACCOUNT
            // =================================

            const userCredential = await createUserWithEmailAndPassword(
                auth,
                emailValue,
                passwordValue
            );

            const user = userCredential.user;

            accountCreated = true;


            // =================================
            // STEP 2: SAVE FULL NAME
            // TO FIREBASE AUTH PROFILE
            // =================================

            await updateProfile(user, {
                displayName: nameValue
            });


            // =================================
            // STEP 3: GET FIREBASE ID TOKEN
            // =================================

            const idToken = await user.getIdToken(true);


            // =================================
            // STEP 4: SEND PROFILE TO JAVA BACKEND
            // =================================

            const response = await fetch(
                "http://localhost:8080/api/users/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${idToken}`
                    },

                    body: JSON.stringify({
                        fullName: nameValue,
                        phone: phoneValue
                    })
                }
            );


            // =================================
            // READ BACKEND RESPONSE
            // =================================

            const responseText = await response.text();

            let result = {};

            try {

                result = responseText
                    ? JSON.parse(responseText)
                    : {};

            } catch {

                result = {};

            }


            // =================================
            // STEP 5: CHECK BACKEND RESPONSE
            // =================================

            console.log("Backend HTTP status:", response.status);
            console.log("Backend response:", result);


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    `Profile creation failed (HTTP ${response.status}).`
                );

            }


            // =================================
            // STEP 6: REGISTRATION SUCCESS
            // =================================

            showMessage(
                "Registration successful! Redirecting to homepage...",
                "success"
            );


            console.log("Registered UID:", user.uid);
            console.log("Backend response:", result);


            // Clear the form
            registerForm.reset();

            checkPasswordStrength("");


            // =================================
            // STEP 7: REDIRECT TO HOMEPAGE
            // AFTER 2 SECONDS
            // =================================

            redirecting = true;

            setTimeout(() => {

                window.location.href = "index.html";

            }, 2000);


        } catch (error) {


            // =================================
            // REGISTRATION ERROR
            // =================================

            console.error("Registration error:", error);


            // Firebase duplicate email
            if (error.code === "auth/email-already-in-use") {

                showError(
                    "emailError",
                    "This email is already registered. Please log in."
                );

                showMessage(
                    "An account already exists with this email. Please log in instead.",
                    "error"
                );

            }


            // Invalid email
            else if (error.code === "auth/invalid-email") {

                showError(
                    "emailError",
                    "Please enter a valid email address."
                );

                showMessage(
                    "Please enter a valid email address.",
                    "error"
                );

            }


            // Weak password
            else if (error.code === "auth/weak-password") {

                showError(
                    "passwordError",
                    "Your password is too weak."
                );

                showMessage(
                    "Please choose a stronger password.",
                    "error"
                );

            }


            // Network error
            else if (error.code === "auth/network-request-failed") {

                showMessage(
                    "Network error. Please check your internet connection.",
                    "error"
                );

            }


            // Firebase account created,
            // but backend profile failed
            else if (accountCreated) {

                showMessage(
                    "Your Firebase account was created successfully, but your user profile could not be saved. Please try logging in or contact support.",
                    "error"
                );

                console.error(
                    "Firebase account created, but backend profile failed:",
                    error.message
                );

            }


            // Other errors
            else {

                showMessage(
                    error.message || "Registration failed. Please try again.",
                    "error"
                );

            }


        } finally {


            // =================================
            // RE-ENABLE BUTTON
            // ONLY IF NOT REDIRECTING
            // =================================

            if (submitButton && !redirecting) {

                submitButton.disabled = false;

            }

        }

    });


    // =========================================
    // TERMS & CONDITIONS PLACEHOLDER
    // =========================================

    const termsLink = document.getElementById("termsLink");

    if (termsLink) {

        termsLink.addEventListener("click", (event) => {

            event.preventDefault();

            alert("Terms & Conditions page will be added later.");

        });

    }


    // =========================================
    // PRIVACY POLICY PLACEHOLDER
    // =========================================

    const privacyLink = document.getElementById("privacyLink");

    if (privacyLink) {

        privacyLink.addEventListener("click", (event) => {

            event.preventDefault();

            alert("Privacy Policy page will be added later.");

        });

    }

});
