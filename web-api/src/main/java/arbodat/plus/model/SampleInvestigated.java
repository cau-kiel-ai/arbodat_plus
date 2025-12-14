package arbodat.plus.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Set;

@Data
@Entity
@Table(name = "sample_investigated")
public class SampleInvestigated {

    @Id
    private String id; // uri

    @Column(name = "label")
    private String label;

    @JsonIgnore
    @OneToMany(mappedBy = "seedsAndFruits")
    private Set<Sample> SampleSeedsAndFruitsList;

    @JsonIgnore
    @OneToMany(mappedBy = "charcoalInvestigated")
    private Set<Sample> SampleCharcoalInvestigatedList;

    @JsonIgnore
    @OneToMany(mappedBy = "woodSubfossile")
    private Set<Sample> SampleWoodSubfossileList;
}
