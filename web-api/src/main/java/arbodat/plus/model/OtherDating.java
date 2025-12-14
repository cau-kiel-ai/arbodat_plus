package arbodat.plus.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.util.UUID;

@Data
@Entity
@Table(name = "other_dating",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"laboratory_label", "number"})})
public class OtherDating implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "age_divers")
    private String ageDivers;

    // laboratory_label + number -------------
    @ManyToOne
    @JoinColumn(name = "laboratory")
    private Laboratory laboratory;

    @Column(name = "number")
    private Integer number;
    // ---------------------------------------

    @OneToOne(mappedBy = "otherDating")
    @JsonIgnore
    private AbsoluteDating absoluteDating;
}
