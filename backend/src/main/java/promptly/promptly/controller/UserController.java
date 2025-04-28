package promptly.promptly.controller;

import promptly.promptly.model.User;
import promptly.promptly.repository.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

import java.util.HashMap;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(HttpServletRequest request) {
        HashMap<String, Object> response = new HashMap<>();
        final Integer userId = Integer.parseInt(request.getAttribute("userId").toString());

        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isEmpty()) {
            response.put("error", "User not found!");
            return ResponseEntity.badRequest().body(response);
        }

        User user = userOptional.get();
        user.setPasswordHash(null);

        response.put("message", "User profile retrieved successfully.");
        response.put("user", user);

        return ResponseEntity.ok(response);
    }

    @Data
    static class UserProfile {
        private String username;
        private String email;
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateUserProfile(HttpServletRequest request, @RequestBody UserProfile updatedUser) {
        HashMap<String, Object> response = new HashMap<>();

        final Integer userId = Integer.parseInt(request.getAttribute("userId").toString());

        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isEmpty()) {
            response.put("error", "User not found!");
            return ResponseEntity.badRequest().body(response);
        }

        User user = userOptional.get();

        User userWithUsername = userRepository.findByUsername(updatedUser.getUsername()).orElse(null);
        User userWithEmail = userRepository.findByEmail(updatedUser.getEmail()).orElse(null);

        if (userWithUsername != null && !userWithUsername.getId().equals(user.getId())) {
            response.put("error", "Username is already taken!");
            return ResponseEntity.badRequest().body(response);
        }
        
        if (userWithEmail != null && !userWithEmail.getId().equals(user.getId())) {
            response.put("error", "Email is already in use!");
            return ResponseEntity.badRequest().body(response);
        }
        
        user.setUsername(updatedUser.getUsername());
        user.setEmail(updatedUser.getEmail());

        userRepository.save(user);

        response.put("message", "User profile updated successfully.");
        response.put("user", user);

        return ResponseEntity.ok(response);
    }
}
