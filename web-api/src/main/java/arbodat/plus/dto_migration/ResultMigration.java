package arbodat.plus.dto_migration;

import arbodat.plus.model.Result;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ResultMigration {

    private Result result;
    private FractionAnalyzedMigration fractionAnalyzed;

    // ---- Empty string indicates that attribute is already set ----
    private String nonMatchingTaxCode               = "";
    private String nonMatchingStateOfPreservation   = "";
    private String nonMatchingRestType              = "";
    private String nonMatchingClassificationConfer  = "";
    // --------------------------------------------------------------
}
