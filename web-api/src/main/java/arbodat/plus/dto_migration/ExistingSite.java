package arbodat.plus.dto_migration;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class ExistingSite {
    private String label;
    private UUID id;
    private List<String> researchProjectNames;
    private List<String> addedResearchProjectNames;

    // For Testing
    @Override
    public String toString() {
        return "{label=" + label +
                ", id=" + id +
                ", researchProjectNames=" + researchProjectNames +
                ", addedResearchProjectNames=" + addedResearchProjectNames +
                "}";
    }
}


