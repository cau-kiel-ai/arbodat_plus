package arbodat.plus.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.util.Set;

@Data
@Entity
@Table(name = "coordinate_system")
public class CoordinateSystem implements Serializable {

    @Id
    private String id; // uri

    @Column(name = "label")
    private String label;

    @JsonIgnore
    @OneToMany(mappedBy = "coordinateSystem")
    private Set<Coordinate> coordinateList;
}
