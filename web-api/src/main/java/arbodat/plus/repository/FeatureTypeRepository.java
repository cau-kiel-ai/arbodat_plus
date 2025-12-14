package arbodat.plus.repository;

import arbodat.plus.model.FeatureType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FeatureTypeRepository extends JpaRepository <FeatureType, String> {

    Optional<FeatureType> findByLabel(String label);
}
