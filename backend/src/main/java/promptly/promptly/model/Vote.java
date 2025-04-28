package promptly.promptly.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Data
@Table(name = "votes", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "prompt_id"}))
public class Vote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prompt_id", nullable = false)
    private Prompt prompt;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Transient
    public String getUserName() {
        return user != null ? user.getUsername() : null;
    }
}
