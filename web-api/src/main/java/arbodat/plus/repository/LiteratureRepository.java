package arbodat.plus.repository;

import arbodat.plus.model.AbsoluteDating;
import arbodat.plus.model.Literature;
import arbodat.plus.model.Site;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Set;
import java.util.UUID;

@Repository
public interface LiteratureRepository extends JpaRepository<Literature, UUID> {

    @Query("SELECT s FROM Site s JOIN s.literatureList l WHERE l.id = :literatureId")
    Set<Site> findSitesByLiteratureId(@Param("literatureId") UUID literatureId);

    @Query("SELECT ad FROM AbsoluteDating ad JOIN ad.literatureList l WHERE l.id = :literatureId")
    Set<AbsoluteDating> findAbsoluteDatingsByLiteratureId(@Param("literatureId") UUID literatureId);

}
