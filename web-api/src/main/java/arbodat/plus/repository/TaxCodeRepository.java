package arbodat.plus.repository;

import arbodat.plus.model.TaxCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TaxCodeRepository extends JpaRepository<TaxCode, String> {

    Optional<TaxCode> findByLabel(String label);
}
