package arbodat.plus.repository;

import arbodat.plus.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Set;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    @Query("SELECT i FROM Institution i JOIN i.userList u WHERE u.id = :userId")
    Set<Institution> findInstitutionsByUserId(@Param("userId") UUID userId);

    @Query("SELECT s FROM Sample s JOIN s.botanicalDeterminationBy u WHERE u.id = :userId")
    Set<Sample> findSamplesByUserId(@Param("userId") UUID userId);
}
