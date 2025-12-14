package arbodat.plus.repository;

import arbodat.plus.model.CoordinateSystem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CoordinateSystemRepository extends JpaRepository<CoordinateSystem, String> {
}
