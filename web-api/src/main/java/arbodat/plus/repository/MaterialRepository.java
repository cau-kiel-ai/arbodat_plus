package arbodat.plus.repository;

import arbodat.plus.model.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MaterialRepository extends JpaRepository<Material, String> {

    Optional<Material> findByLabel(String label);
}
