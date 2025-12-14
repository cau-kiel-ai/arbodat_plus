package arbodat.plus.dto_migration;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class ExistingAbsoluteDating {
    private String subSample;
    private UUID id;
    private String sampleLabel;
    private String featureLabel;
    private String siteLabel;
}
