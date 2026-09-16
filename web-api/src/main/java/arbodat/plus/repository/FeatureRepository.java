package arbodat.plus.repository;

import arbodat.plus.model.Feature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Repository
public interface FeatureRepository extends JpaRepository<Feature, UUID>{

    List<Feature> findAllByLabel(String label);

    List<Feature> findBySiteIdIn(Collection<UUID> siteIds);
}
