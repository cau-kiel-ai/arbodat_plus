package arbodat.plus.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.util.UUID;

@Data
@Entity
@Table(name = "fraction_analyzed")
public class FractionAnalyzed implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "fraction_analyzed")
    private String fractionAnalyzed;

    @Column(name = "org_or_min")
    private String orgOrMin;

    @Column(name = "sieve_size")
    private Double sieveSize;

    @Column(name = "standard_multiplier")
    private Double standardMultiplier;

    @ManyToOne
    @JsonIgnoreProperties("fractionAnalyzedList")
    @JoinColumn(name = "sample_id")
    private Sample sample;
}
