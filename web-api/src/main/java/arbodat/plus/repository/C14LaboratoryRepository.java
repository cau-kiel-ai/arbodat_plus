package arbodat.plus.repository;

import arbodat.plus.model.C14Laboratory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface C14LaboratoryRepository extends JpaRepository <C14Laboratory, String> {
}
