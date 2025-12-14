package arbodat.plus.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Set;

@Data
@Entity
@Table(name = "rest_type")
public class RestType {

    @Id
    private String id; // uri

    @Column(name = "label")
    private String label;

    @Column(name = "structural_concept")
    private String structuralConcept;

    @JsonIgnore
    @OneToMany(mappedBy = "restType")
    private Set<Result> resultList;
}
