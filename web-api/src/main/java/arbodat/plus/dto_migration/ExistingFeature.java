package arbodat.plus.dto_migration;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class ExistingFeature {
    private String label;
    private UUID id;
    private String siteLabel;

    // For Testing
    @Override
    public String toString() {
        return "{label=" + label +
                ", id=" + id +
                ", siteLabel=" + siteLabel +
                "}";
    }
}
