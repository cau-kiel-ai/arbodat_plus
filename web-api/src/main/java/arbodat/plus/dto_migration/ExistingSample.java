package arbodat.plus.dto_migration;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class ExistingSample {
    private String label;
    private UUID id;
    private String featureLabel;
    private String siteLabel;
}
