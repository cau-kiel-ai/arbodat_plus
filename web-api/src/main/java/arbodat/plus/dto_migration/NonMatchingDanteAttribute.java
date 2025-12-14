package arbodat.plus.dto_migration;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class NonMatchingDanteAttribute {
    private String type;
    private UUID id;
    private String label;
    private String attribute;
    private String nonMatchingLabel;
}
