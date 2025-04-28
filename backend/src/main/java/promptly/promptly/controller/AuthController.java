package promptly.promptly.controller;

import lombok.Data;
import promptly.promptly.model.User;
import promptly.promptly.repository.UserRepository;
import promptly.promptly.utils.JwtAuth;
import promptly.promptly.utils.PasswordUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final JwtAuth jwtAuth;

    // Inner class for Login request
    @Data
    static class RegisterRequest {
        private String username;
        private String email;
        private String password;
    }
    
    @Data
    static class LoginRequest {
        private String email;
        private String password;
    }

    // REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest newUser) {
        if (userRepository.findByEmail(newUser.getEmail()).isPresent()) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Email is already in use!");
            return ResponseEntity.badRequest().body(errorResponse);
        }

        if (userRepository.findByUsername(newUser.getUsername()).isPresent()) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Username is already taken!");
            return ResponseEntity.badRequest().body(errorResponse);
        }

        User user = new User();
        user.setEmail(newUser.getEmail());
        user.setUsername(newUser.getUsername());

        String hashedPassword = PasswordUtils.hashPassword(newUser.getPassword());
    
        user.setPasswordHash(hashedPassword);

        // Save the user
        User savedUser = userRepository.save(user);

        // Return success response
        Map<String, Object> successResponse = new HashMap<>();
        successResponse.put("message", "User registered successfully!");
        successResponse.put("user", savedUser);
        return ResponseEntity.ok(successResponse);
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());

        if (userOptional.isEmpty()) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Invalid credentials!");
            return ResponseEntity.status(401).body(errorResponse);
        }

        User user = userOptional.get();

        // Verify the password using the stored salt and hash
        boolean isPasswordValid = PasswordUtils.verifyPassword(
            loginRequest.getPassword(),
            user.getPasswordHash()
        );

        if (!isPasswordValid) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Invalid credentials!");
            return ResponseEntity.status(401).body(errorResponse);
        }

        // Generate JWT token
        String token = jwtAuth.generateToken(user.getId());

        // Return success response with JWT token
        Map<String, Object> successResponse = new HashMap<>();
        successResponse.put("message", "Login successful!");
        successResponse.put("email", user.getEmail());
        successResponse.put("username", user.getUsername());
        successResponse.put("token", token); // Include the token in the response
        return ResponseEntity.ok(successResponse);
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyTokenAndExtractUserId(@RequestHeader("Authorization") String bearerToken) {
        Map<String, Object> response = new HashMap<>();

        // Step 1: Extract the token from the "Bearer" prefix
        String token = extractTokenFromBearer(bearerToken);
        if (token == null) {
            response.put("verified", false);
            response.put("error", "Token is missing!");
            return ResponseEntity.status(401).body(response);
        }

        // Step 2: Validate the token
        if (!jwtAuth.isValidToken(token)) {
            response.put("verified", false);
            response.put("error", "Token is invalid!");
            return ResponseEntity.status(401).body(response);
        }

        // Step 3: Extract the user_id from the token
        Integer userId = Integer.parseInt(jwtAuth.extractUserIdFromToken(token));
        if (userId == null) {
            response.put("verified", false);
            response.put("error", "Token is invalid!");
            return ResponseEntity.status(400).body(response);
        }

        // Step 4: Fetch the user from the database
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            response.put("verified", false);
            response.put("error", "User not found!");
            return ResponseEntity.status(404).body(response);
        }

        // Step 5: Return success response with user_id
        response.put("verified", true);
        response.put("message", "Token verified successfully.");
        return ResponseEntity.ok(response);
    }

    // Helper method to extract the token from the "Bearer" prefix
    private String extractTokenFromBearer(String bearerToken) {
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // Remove "Bearer " prefix
        }
        return null;
    }
}