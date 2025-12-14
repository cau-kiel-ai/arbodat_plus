package arbodat.plus.dto_migration;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class CoordinateMigration {
    private String type;
    private UUID id;
    private String label;
    private Double latitude;
    private Double longitude;
    private Double zcoordinate;
    private Double altitude;
    private String coordinateSystem;
    private String remarks;
    private String siteLabel;
    private String featureLabel;
}
