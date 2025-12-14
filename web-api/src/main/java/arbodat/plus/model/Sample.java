package arbodat.plus.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.io.Serializable;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

@Data
@Entity
@Table(name = "sample")
public class Sample implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "sample_label")
    private String label;

    @Column(name = "botanical_determination_year")
    private String botanicalDeterminationYear;

    @ManyToMany
    @JoinTable(name = "botanical_determination_by",
               joinColumns = @JoinColumn(name = "sample_id"),
               inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> botanicalDeterminationBy;

    @Column(name = "sample_storage")
    private Boolean sampleStorage;

    @Column(name = "micro_remain_sample")
    private Boolean microRemain;

    @Column(name = "volume_determination")
    private String volumeDetermination; // dryOrWet

    @Column(name = "remarks_sample", columnDefinition = "TEXT")
    private String remarksSample;

    // liter
    @Column(name = "sample_volume")
    private Double sampleVolume;

    // Sample Location -------------
    @Column(name = "stratum")
    private String stratum;

    @Column(name = "layer")
    private String layer;

    @Column(name = "sector")
    private String sector;

    @Column(name = "planum")
    private String planum;

    @Column(name = "depth_from")
    private Double depthFrom;

    @Column(name = "depth_to")
    private Double depthTo;
    // -----------------------------

    // central on Dante
    @ManyToOne
    @JoinColumn(name = "seeds_and_fruits")
    private SampleInvestigated seedsAndFruits;

    // charcoal ---------------------------------
    // central on Dante
    @ManyToOne
    @JoinColumn(name = "charcoal_investigated")
    private SampleInvestigated charcoalInvestigated;

    // central on Dante
    @ManyToOne
    @JoinColumn(name = "wood_subfossile")
    private SampleInvestigated woodSubfossile;

    @Column(name = "total_weight")
    private Double totalWeight;

    @Column(name = "weight_undetermined")
    private Double weightUndetermined;
    // ------------------------------------------

    @ManyToOne
    @JoinColumn(name = "feature_id")
    private Feature feature;

    @JsonIgnore
    @OneToMany(mappedBy = "sample")
    private Set<AbsoluteDating> absoluteDatingList;

    // central on Dante
    @ManyToOne
    @JoinColumn(name = "chronozone")
    private Chronozone chronozone;

//    // central on Dante
//    @ManyToOne
//    @JoinColumn(name = "archaeological_dating")
//    private ArchaeologicalDating archaeologicalDating;
    private String archaeologicalDating;

//    // central on Dante
//    @ManyToOne
//    @JoinColumn(name = "cultural_group")
//    private CulturalGroup culturalGroup;
    private String culturalGroup;

    // central on Dante
    @ManyToOne
    @JoinColumn(name = "sample_type")
    private SampleType sampleType;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval=true)
    @JoinColumn(name = "coordinate")
    private Coordinate coordinate;

    @OneToMany(mappedBy = "sample", cascade = CascadeType.ALL, orphanRemoval=true)
    private Set<FractionAnalyzed> fractionAnalyzedList;

    @JsonIgnore
    @OneToMany(mappedBy = "sample")
    private Set<Result> resultList;

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Sample sample = (Sample) obj;
        return Objects.equals(id, sample.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
