package arbodat.plus.repository;

import arbodat.plus.model.ClassificationConfer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClassificationConferRepository  extends JpaRepository<ClassificationConfer, String> {

    Optional<ClassificationConfer> findByLabel(String label);
}
