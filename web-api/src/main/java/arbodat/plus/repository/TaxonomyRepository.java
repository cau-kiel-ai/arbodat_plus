package arbodat.plus.repository;

import arbodat.plus.model.Taxonomy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TaxonomyRepository extends JpaRepository<Taxonomy, String> {

    Optional<Taxonomy> findByLabel(String label);
}
