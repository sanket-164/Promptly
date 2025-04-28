package promptly.promptly.repository;

import promptly.promptly.model.Prompt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PromptRepository extends JpaRepository<Prompt, Integer> {
    List<Prompt> findByUser_Id(Integer userId);
    List<Prompt> findByCategory(String category);
    Page<Prompt> findByCategoryIn(List<String> categories, Pageable pageable);
}
