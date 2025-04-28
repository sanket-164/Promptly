package promptly.promptly.controller;

import promptly.promptly.model.Prompt;
import promptly.promptly.model.User;
import promptly.promptly.repository.PromptRepository;
import promptly.promptly.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/prompts")
@RequiredArgsConstructor
public class PromptController {

    private final PromptRepository promptRepository;
    private final UserRepository userRepository;

    @lombok.Data
    static class CreatePromptRequest {
        private Integer userId;
        private String title;
        private String content;
        private String category;
    }

     @GetMapping("/filter")
    public ResponseEntity<?> getPromptsByCategory(HttpServletRequest request,
            @RequestParam(required = false) List<String> categories,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        // Create a Pageable object for pagination
        Pageable pageable = PageRequest.of(page, size);

        Page<Prompt> prompts;

        if (categories != null && !categories.isEmpty()) {
            // Filter by multiple categories
            prompts = promptRepository.findByCategoryIn(categories, pageable);
        } else {
            // If no categories are specified, return all prompts with pagination
            prompts = promptRepository.findAll(pageable);
        }

        return ResponseEntity.ok(prompts);
    }


    @GetMapping("/myprompts")
    public ResponseEntity<?> getMyPrompts(HttpServletRequest request) {
        final Integer userId = Integer.parseInt(request.getAttribute("userId").toString());
        
        List<Prompt> prompts = promptRepository.findByUser_Id(userId);
        return ResponseEntity.ok(prompts);
    }


    @GetMapping("/username/{username}")
    public ResponseEntity<?> getPromptsByUsername(@PathVariable String username) {
        HashMap<String, Object> response = new HashMap<>();

        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isEmpty()) {
            response.put("error", "User not found!");
            return ResponseEntity.badRequest().body(response);
        }

        List<Prompt> prompts = promptRepository.findByUser_Id(userOptional.get().getId());
        return ResponseEntity.ok(prompts);
    }


    @GetMapping("/category/{category}")
    public ResponseEntity<?> getPromptsByCategory(@PathVariable String category) {        
        List<Prompt> prompts = promptRepository.findByCategory(category);
        return ResponseEntity.ok(prompts);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createPrompt(HttpServletRequest request, @RequestBody CreatePromptRequest requestBody) {
        final Integer userId = Integer.parseInt(request.getAttribute("userId").toString());
        
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: User not found!");
        }

        Prompt prompt = new Prompt();
        prompt.setUser(userOptional.get());
        prompt.setTitle(requestBody.getTitle());
        prompt.setContent(requestBody.getContent());
        prompt.setCategory(requestBody.getCategory());

        Prompt savedPrompt = promptRepository.save(prompt);

        return ResponseEntity.ok(savedPrompt);
    }

    // DELETE PROMPT
    @DeleteMapping("/delete/{promptId}")
    public ResponseEntity<?> deletePrompt(HttpServletRequest request, @PathVariable Integer promptId) {
        HashMap<String, Object> response = new HashMap<>();
        final Integer userId = Integer.parseInt(request.getAttribute("userId").toString());

        Optional<Prompt> promptOptional = promptRepository.findById(promptId);

        if (promptOptional.isEmpty()) {
            response.put("error", "Prompt not found!");
            return ResponseEntity.badRequest().body(response);
        }

        Prompt prompt = promptOptional.get();

        if (!prompt.getUser().getId().equals(userId)) {
            response.put("error", "You can only delete your own prompts!");
            return ResponseEntity.status(403).body(response);
        }

        promptRepository.delete(prompt);

        response.put("message", "Prompt deleted successfully.");
        return ResponseEntity.ok(response);
    }
}
