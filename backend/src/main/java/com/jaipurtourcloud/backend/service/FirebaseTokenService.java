
package com.jaipurtourcloud.backend.service;

import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.auth.FirebaseAuthException;

import org.springframework.stereotype.Service;

@Service
public class FirebaseTokenService {

    private final FirebaseAuth firebaseAuth;

    public FirebaseTokenService(FirebaseApp firebaseApp) {
        this.firebaseAuth = FirebaseAuth.getInstance(firebaseApp);
    }

    public FirebaseToken verifyToken(String idToken)
            throws FirebaseAuthException {

        return firebaseAuth.verifyIdToken(idToken);
    }
}
