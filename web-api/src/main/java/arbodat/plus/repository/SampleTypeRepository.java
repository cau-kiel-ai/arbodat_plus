package arbodat.plus.repository;

import arbodat.plus.model.SampleType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SampleTypeRepository extends JpaRepository<SampleType, String> {

    Optional<SampleType> findByLabel(String label);
}
