package promptly.promptly.utils;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

public class PasswordUtils {

    // Generate a random salt
    public static String generateSalt() {
        SecureRandom sr = new SecureRandom();
        byte[] salt = new byte[16];
        sr.nextBytes(salt);
        return Base64.getEncoder().encodeToString(salt);
    }

    // Hash a password
    public static String hashPassword(String password) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");

            // Add salt to the digest
            // md.update(Base64.getDecoder().decode(generateSalt()));

            byte[] hashedPassword = md.digest(password.getBytes());

            // Encode the hashed password in Base64
            return Base64.getEncoder().encodeToString(hashedPassword);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error while hashing password", e);
        }
    }

    // Verify a password by comparing the hash
    public static boolean verifyPassword(String providedPassword, String storedHash) {
        String hashedProvidedPassword = hashPassword(providedPassword);
        return hashedProvidedPassword.equals(storedHash);
    }
}