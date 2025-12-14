package arbodat.plus.dto_migration;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class LiteratureMigration {
    private UUID siteId;
    private String siteLabel;
    private String author;
    private String publicationYear;

    @Override
    public String toString() {
        return "LiteratureMigration{" +
                "siteId=" + siteId +
                ", siteLabel='" + siteLabel + '\'' +
                ", author='" + author + '\'' +
                ", publicationYear='" + publicationYear + '\'' +
                '}';
    }
}
