package arbodat.plus.dto_migration;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class FractionAnalyzedMigration {
    private String siteLabel;
    private UUID   sampleId;
    private String sampleLabel;
    private String fractionAnalyzed;
    private Boolean modifiedFraction;
    private String fraction;
    private String orgOrMin;
    private Double sieveSize;
    private String featureLabel;
}
