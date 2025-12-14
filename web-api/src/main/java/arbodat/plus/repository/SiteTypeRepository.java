package arbodat.plus.repository;

import arbodat.plus.model.SiteType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SiteTypeRepository extends JpaRepository<SiteType, String> {

    Optional<SiteType> findByLabel(String label);
}