package arbodat.plus.repository;

import arbodat.plus.model.StateOfPreservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StateOfPreservationRepository extends JpaRepository<StateOfPreservation, String> {

    Optional<StateOfPreservation> findByLabel(String label);
}
