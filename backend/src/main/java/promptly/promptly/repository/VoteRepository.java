package promptly.promptly.repository;

import promptly.promptly.model.Prompt;
import promptly.promptly.model.User;
import promptly.promptly.model.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.List;

public interface VoteRepository extends JpaRepository<Vote, Integer> {

    // Check if the user has voted on a particular prompt
    boolean existsByUserAndPrompt(User user, Prompt prompt);

    // Find the vote by user and prompt (for deletion)
    Optional<Vote> findByUserAndPrompt(User user, Prompt prompt);

    @Query("SELECT v.prompt FROM Vote v WHERE v.user = :user")
    List<Prompt> findPromptsVotedByUser(User user);
}