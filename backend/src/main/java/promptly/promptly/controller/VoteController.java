package promptly.promptly.controller;

import promptly.promptly.model.Prompt;
import promptly.promptly.model.User;
import promptly.promptly.model.Vote;
import promptly.promptly.repository.PromptRepository;
import promptly.promptly.repository.UserRepository;
import promptly.promptly.repository.VoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

import java.util.HashMap;
import java.util.Optional;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/votes")
@RequiredArgsConstructor
public class VoteController {

    private final UserRepository userRepository;
    private final PromptRepository promptRepository;
    private final VoteRepository voteRepository;

    @PostMapping("/toggle/{promptId}")
    public ResponseEntity<?> toggleVote(HttpServletRequest request ,@PathVariable Integer promptId) {
        HashMap<String, Object> response = new HashMap<>();
        final Integer userId = Integer.parseInt(request.getAttribute("userId").toString());

        Optional<User> userOptional = userRepository.findById(userId);
        Optional<Prompt> promptOptional = promptRepository.findById(promptId);

        if (userOptional.isEmpty()) {
            response.put("error", "User not found!");
            return ResponseEntity.badRequest().body(response);
        }
    
        if (promptOptional.isEmpty()) {
            response.put("error", "Prompt not found!");
            return ResponseEntity.badRequest().body(response);
        }

        User user = userOptional.get();
        Prompt prompt = promptOptional.get();

        Optional<Vote> existingVote = voteRepository.findByUserAndPrompt(user, prompt);

        if (existingVote.isEmpty()) {
            prompt.setUpvotes(prompt.getUpvotes() + 1);
            promptRepository.save(prompt);

            Vote newVote = new Vote();
            newVote.setUser(user);
            newVote.setPrompt(prompt);
            voteRepository.save(newVote);

            response.put("message", "Vote added successfully!");
            return ResponseEntity.ok(response);
        }
        
        prompt.setUpvotes(prompt.getUpvotes() - 1);
        promptRepository.save(prompt);
        voteRepository.delete(existingVote.get());

        response.put("message", "Vote deleted successfully!");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/hasvoted/{promptId}")
    public ResponseEntity<HashMap<String, Object>> checkIfUserHasVoted(HttpServletRequest request, @PathVariable Integer promptId) {
        HashMap<String, Object> response = new HashMap<>();

        final Integer userId = Integer.parseInt(request.getAttribute("userId").toString());

        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isEmpty()) {
            response.put("error", "User not found!");
            return ResponseEntity.badRequest().body(response);
        }

        User user = userOptional.get();

        // Fetch the prompt by ID
        Optional<Prompt> promptOptional = promptRepository.findById(promptId);

        if (promptOptional.isEmpty()) {
            response.put("error", "Prompt not found!");
            return ResponseEntity.badRequest().body(response);
        }

        Prompt prompt = promptOptional.get();

        // Check if the user has voted on this prompt
        boolean hasVoted = voteRepository.existsByUserAndPrompt(user, prompt);

        // Build the response based on whether the user has voted
        response.put("message", hasVoted ? "User has voted on this prompt." : "User has not voted on this prompt.");
        response.put("hasVoted", hasVoted);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/prompts")
    public ResponseEntity<?> getPromptsVotedByUser(HttpServletRequest request) {
        final Integer userId = Integer.parseInt(request.getAttribute("userId").toString());
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: User not found!");
        }

        User user = userOptional.get();
        List<Prompt> prompts = voteRepository.findPromptsVotedByUser(user);
        
        return ResponseEntity.ok(prompts);
    }
}
