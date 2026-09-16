package arbodat.plus.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import jakarta.persistence.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

@Data
@Entity
@Table(name = "users")
public class User implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "orcid")
    private String orcid;

    @Column(name = "first_name")
    private String firstName;

    @Column (name = "middle_name")
    private String middleName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "mail_address")
    private String mailAddress;

    @ManyToMany
    @JoinTable(name = "user_institution_relation",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "institution_id")
    )
    private Set<Institution> institutionList;

    @JsonIgnore
    @ManyToMany(mappedBy = "botanicalDeterminationBy")
    private Set<Sample> botanicalDeterminedSamples;

    @JsonIgnore
    @ManyToMany(mappedBy = "siteDirectors")
    private Set<Site> directedSites;

    @JsonIgnore
    @ManyToMany(mappedBy = "archaeologists")
    private Set<Site> excavatedSites;

    @JsonIgnore
    @ManyToMany(mappedBy = "botanists")
    private Set<Site> botanicalStudiedSites;

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        User user = (User) obj;
        return Objects.equals(id, user.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
