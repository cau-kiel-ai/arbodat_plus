package arbodat.plus.repository;

import arbodat.plus.model.C14Dating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface C14DatingRepository extends JpaRepository<C14Dating, UUID> {
}
