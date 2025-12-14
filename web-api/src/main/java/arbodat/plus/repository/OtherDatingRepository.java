package arbodat.plus.repository;

import arbodat.plus.model.OtherDating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface OtherDatingRepository extends JpaRepository<OtherDating, UUID> {
}
