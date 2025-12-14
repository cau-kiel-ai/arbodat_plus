package arbodat.plus.repository;

import arbodat.plus.model.AbsoluteDating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AbsoluteDatingRepository extends JpaRepository <AbsoluteDating, UUID>{

    List<AbsoluteDating> findAllBySubSample(String subSample);
}
