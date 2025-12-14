package arbodat.plus.dto_migration;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class UserMigration {
    private String type;        // site or sample
    private UUID   id;
    private String label;
    private String userLabel;
    private String userRole;    // Site:   archaeologicalExcavator, archaeologicalEditor, botanicalEditor
                                // Sample: botanicalDeterminationBy
    private String siteLabel;
    private String featureLabel;
}
