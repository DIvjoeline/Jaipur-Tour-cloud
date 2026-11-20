
package com.jaipurtourcloud.backend.controller;

import com.google.cloud.firestore.Firestore;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/firebase")
public class FirebaseTestController {

    private final Firestore firestore;

    public FirebaseTestController(Firestore firestore) {
        this.firestore = firestore;
    }

    @GetMapping("/test")
    public Map<String, String> testFirebase() throws Exception {

        // Create test data
        Map<String, Object> data = new HashMap<>();
        data.put("message", "Firebase connected successfully");
        data.put("project", "Jaipur Tour Cloud");

        // Write data to Firestore
        firestore.collection("_system_tests")
                .document("connection_test")
                .set(data)
                .get();

        // Read the data back
        var document = firestore.collection("_system_tests")
                .document("connection_test")
                .get()
                .get();

        // Return result
        Map<String, String> response = new HashMap<>();

        if (document.exists()) {
            response.put("status", "SUCCESS");
            response.put("message", "Java connected to Firestore!");
        } else {
            response.put("status", "FAILED");
            response.put("message", "Document was not found.");
        }

        return response;
    }
}
