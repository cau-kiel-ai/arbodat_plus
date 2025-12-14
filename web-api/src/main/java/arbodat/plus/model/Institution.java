package arbodat.plus.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

@Data
@Entity
@Table(name = "institution")
public class Institution implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "institution_label")
    private String label;

    @Column(name = "ror_id")
    private String rorId;

    @JsonIgnore
    @ManyToMany(mappedBy = "institutionList")
    private Set<User> userList;

    @JsonIgnore
    @ManyToMany(mappedBy = "institutionList")
    private Set<Site> sites;

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Institution institution = (Institution) obj;
        return Objects.equals(id, institution.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
