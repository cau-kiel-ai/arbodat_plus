package arbodat.plus.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.util.Set;
import java.util.UUID;

@Data
@Entity
@Table(name = "laboratory")
public class Laboratory implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "label")
    private String label;

    @JsonIgnore
    @OneToMany(mappedBy = "laboratory")
    private Set<DendrochronologicalDating> dendrochronologicalDatingList;

    @JsonIgnore
    @OneToMany(mappedBy = "laboratory")
    private Set<OtherDating> otherDatingList;
}
