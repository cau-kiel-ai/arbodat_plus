package arbodat.plus.repository;

import arbodat.plus.model.DatingMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DatingMethodRepository extends JpaRepository<DatingMethod, String> {

    Optional<DatingMethod> findByLabel(String label);
}
