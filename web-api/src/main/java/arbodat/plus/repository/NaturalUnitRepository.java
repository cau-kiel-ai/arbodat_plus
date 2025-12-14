package arbodat.plus.repository;

import arbodat.plus.model.NaturalUnit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NaturalUnitRepository extends JpaRepository<NaturalUnit, String> {

    Optional<NaturalUnit> findByLabel(String label);
}
