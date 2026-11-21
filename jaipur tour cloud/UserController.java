
package com.jaipurtourcloud.backend.controller;

import com.google.firebase.auth.FirebaseToken;
import com.jaipurtourcloud.backend.service.FirebaseTokenService;
import com.jaipurtourcloud.backend.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final FirebaseTokenService firebaseTokenService;
    private final UserService userService;

    public UserController(
            FirebaseTokenService firebaseTokenService,
            UserService userService
    ) {
        this.firebaseTokenService = firebaseTokenService;
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerUser(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody RegisterRequest request
    ) {

        Map<String, Object> response = new HashMap<>();

        try {

            // Validate Authorization header
            if (authorizationHeader == null
                    || !authorizationHeader.startsWith("Bearer ")) {

                response.put("status", "FAILED");
                response.put("message", "Invalid authorization header.");

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(response);
            }

            // Extract Firebase ID token
            String idToken = authorizationHeader.substring(7);

            // Verify token with Firebase
            FirebaseToken token =
                    firebaseTokenService.verifyToken(idToken);

            // Validate user details
            if (request.getFullName() == null
                    || request.getFullName().isBlank()
                    || request.getPhone() == null
                    || request.getPhone().isBlank()) {

                response.put("status", "FAILED");
                response.put("message", "Name and phone are required.");

                return ResponseEntity
                        .badRequest()
                        .body(response);
            }

            // Create Firestore profile
            Map<String, Object> user =
                    userService.createUserProfile(
                            token,
                            request.getFullName().trim(),
                            request.getPhone().trim()
                    );

            response.put("status", "SUCCESS");
            response.put("message", "User profile created successfully.");
            response.put("user", user);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(response);
} catch (com.google.firebase.auth.FirebaseAuthException e) {

    System.err.println("Firebase token verification failed:");
    e.printStackTrace();

    response.put("status", "FAILED");
    response.put("message", "Invalid or expired Firebase token.");

    return ResponseEntity
            .status(HttpStatus.UNAUTHORIZED)
            .body(response);

        } catch (Exception e) {

            response.put("status", "FAILED");
            response.put("message", "Unable to create user profile.");

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }

    public static class RegisterRequest {

        private String fullName;
        private String phone;

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }
    }
}
