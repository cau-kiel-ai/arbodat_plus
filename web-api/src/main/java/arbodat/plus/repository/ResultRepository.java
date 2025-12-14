package arbodat.plus.repository;

import arbodat.plus.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ResultRepository extends JpaRepository <Result, UUID> {

    @Query("SELECT r FROM Result r " +
           "WHERE r.sample = :sample " +
             "AND r.taxCode = :taxCode " +
             "AND r.orgOrMin = :orgOrMin " +
             "AND r.sieveSize = :sieveSize " +
             "AND r.classificationConfer = :cf " +
             "AND r.restType = :restType " +
             "AND r.stateOfPreservation = :stateOfPreservation")
    Optional<Result> findAlreadyExisting(@Param("sample")    Sample sample,
                                         @Param("taxCode") TaxCode taxCode,
                                         @Param("orgOrMin")  String orgOrMin,
                                         @Param("sieveSize") Double sieveSize,
                                         @Param("cf")        ClassificationConfer cf,
                                         @Param("restType")   RestType restType,
                                         @Param("stateOfPreservation")StateOfPreservation stateOfPreservation);
}
