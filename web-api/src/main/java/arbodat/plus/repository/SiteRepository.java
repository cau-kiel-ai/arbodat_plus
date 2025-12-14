package arbodat.plus.repository;

import arbodat.plus.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Repository
public interface SiteRepository extends JpaRepository<Site, UUID> {

    @Query("SELECT l FROM Literature l JOIN l.siteList s WHERE s.id = :siteId")
    Set<Literature> findLiteratureBySiteId(@Param("siteId") UUID siteId);

    List<Site> findAllByLabel(String label);

    @Query("""
       SELECT DISTINCT s FROM Site s
       JOIN s.researchProjectList rpList
       WHERE s.label = :siteLabel
         AND rpList.id IN :researchProjectIds
       """)
    Optional<Site> findAlreadyExisting(
            @Param("siteLabel") String siteLabel,
            @Param("researchProjectIds") Set<UUID> researchProjectIds);
}
