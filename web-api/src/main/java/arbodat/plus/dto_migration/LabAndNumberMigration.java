package arbodat.plus.dto_migration;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class LabAndNumberMigration {
    private UUID absoluteDatingId;
    private String sampleLabel;
    private String subSample;
    private String datingMethod;
    private String labAndNumber;
    private String labLabel; // To be set in frontend (if C14Dating, central labCode from Uni of Arizona (dante) table)
    private Integer number;  // To be set in frontend (-1 corresponds to 'not set')
    private String siteLabel;
    private String featureLabel;
}