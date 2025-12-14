package arbodat.plus.repository;

import arbodat.plus.model.PreservationCondition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PreservationConditionRepository extends JpaRepository<PreservationCondition, String> {

    Optional<PreservationCondition> findByLabel(String label);
}