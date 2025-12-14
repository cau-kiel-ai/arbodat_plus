package arbodat.plus.repository;

import arbodat.plus.model.DendrochronologicalDating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface DendrochronologicalDatingRepository extends JpaRepository<DendrochronologicalDating, UUID> {
}
