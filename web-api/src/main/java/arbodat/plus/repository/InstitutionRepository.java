package arbodat.plus.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import arbodat.plus.model.Institution;

import java.util.UUID;

@Repository
public interface InstitutionRepository extends JpaRepository<Institution, UUID>  {
}
