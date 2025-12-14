package arbodat.plus.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.util.Set;

@Data
@Entity
@Table(name = "preservation_condition")
public class PreservationCondition implements Serializable {

    @Id
    private String id; // uri

    @Column(name = "preservation_condition_label")
    private String label;

    @JsonIgnore
    @OneToMany(mappedBy = "preservationCondition")
    private Set<Feature> featureList;
}
