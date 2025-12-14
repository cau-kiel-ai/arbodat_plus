package arbodat.plus.repository;

import arbodat.plus.model.SampleInvestigated;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SampleInvestigatedRepository extends JpaRepository<SampleInvestigated, String> {

    Optional<SampleInvestigated> findByLabel(String label);
}
