package arbodat.plus.repository;

import arbodat.plus.model.Sample;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SampleRepository extends JpaRepository <Sample, UUID>  {

    List<Sample> findAllByLabel(String label);
}
