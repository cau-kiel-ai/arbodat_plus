package arbodat.plus.repository;

import arbodat.plus.model.Chronozone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChronozoneRepository extends JpaRepository<Chronozone, String> {

    Optional<Chronozone> findByLabel(String label);
}
