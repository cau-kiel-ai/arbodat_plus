package arbodat.plus.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.io.Serializable;
import java.util.Set;

@Data
@Entity
@Table(name = "feature_type")
public class FeatureType implements Serializable {

    @Id
    private String id; // uri

    @Column(name = "label")
    private String label;

    @JsonIgnore
    @OneToMany(mappedBy = "featureType")
    private Set<Feature> featureList;
}
