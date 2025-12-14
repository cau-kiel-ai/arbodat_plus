package arbodat.plus.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Set;

@Data
@Entity
@Table(name = "state_of_preservation")
public class StateOfPreservation {

    @Id
    private String id; // uri

    @Column(name = "label")
    private String label;

    @JsonIgnore
    @OneToMany(mappedBy = "stateOfPreservation")
    private Set<Result> resultList;
}
