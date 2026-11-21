package com.jaipurtourcloud.backend.service;

import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.FieldValue;
import com.google.firebase.auth.FirebaseToken;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class UserService {

    private final Firestore firestore;

    public UserService(Firestore firestore) {
        this.firestore = firestore;
    }

    public Map<String, Object> createUserProfile(
            FirebaseToken token,
            String fullName,
            String phone
    ) throws Exception {

        String uid = token.getUid();
        String email = token.getEmail();

        Map<String, Object> userData = new HashMap<>();

        userData.put("uid", uid);
        userData.put("fullName", fullName);
        userData.put("email", email);
        userData.put("phone", phone);
        userData.put("role", "USER");
        userData.put("status", "ACTIVE");
        userData.put("createdAt", FieldValue.serverTimestamp());

        DocumentReference userDocument =
                firestore.collection("users").document(uid);

        // Create only if the profile doesn't already exist.
        userDocument.create(userData).get();

        return userData;
    }
}