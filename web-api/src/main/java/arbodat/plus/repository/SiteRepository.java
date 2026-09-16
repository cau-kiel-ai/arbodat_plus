package arbodat.plus.repository;

import arbodat.plus.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.*;

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

    @Query("SELECT DISTINCT s FROM Site s JOIN s.researchProjectList rp WHERE rp.id in :rpIds")
    List<Site> findByResearchProjectIdIn(@Param("rpIds") Collection<UUID> rpIds);

    // Site<->RP pairs directly from the join table – avoids lazy loading of the collections (N+1)
    @Query("SELECT s.id, rp.id FROM Site s JOIN s.researchProjectList rp WHERE s.id in :siteIds")
    List<Object[]> findRpIdPairsBySiteIdIn(@Param("siteIds") Collection<UUID> siteIds);
}
