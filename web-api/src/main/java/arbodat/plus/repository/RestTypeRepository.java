package arbodat.plus.repository;

import arbodat.plus.model.RestType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RestTypeRepository extends JpaRepository<RestType, String> {

    Optional<RestType> findByLabel(String label);
}
