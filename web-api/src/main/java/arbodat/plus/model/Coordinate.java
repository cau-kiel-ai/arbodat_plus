package arbodat.plus.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Data
@Entity
@Table(name = "coordinate")
public class Coordinate implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // "TK", "Limes" from Import
    @Column(name = "remarks_coordinate")
    private String remarksCoordinate;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "longitude_wgs84")
    private Double longitudeWgs84;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "latitude_wgs84")
    private Double latitudeWgs84;

    @Column(name = "altitude")
    private Double altitude;

    // central on Dante
    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "coordinate_system")
    private CoordinateSystem coordinateSystem;

    @JsonIgnore
    @OneToOne(mappedBy = "coordinate")
    private Site site;

    @JsonIgnore
    @OneToOne(mappedBy = "coordinate")
    private Sample sample;


    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Coordinate coordinate = (Coordinate) obj;
        return Objects.equals(id, coordinate.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
