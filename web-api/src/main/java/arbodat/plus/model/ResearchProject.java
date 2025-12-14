package arbodat.plus.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

@Data
/* generates all getter and setter, toString implementations, and others (https://projectlombok.org/features/Data) */
@Entity
/* Entities are Objects, that can be persisted in the database: 1 entity = 1 table in DB.
-> Every instance of an entity represents a row in the table.
Entity 'Material' with identifier: every '@Entity' class must declare or inherit at least one '@Id' or '@EmbeddedId' property */
@Table(name = "research_project")
/* annotation provides the db-table that maps this entity. */
public class ResearchProject implements Serializable {
    /* Serialization is the mechanism that converts an object's state to a byte stream,
    enabling it to be transmitted across a network or stored in a persistent storage medium */

    @Id
    /* annotation for primary key */
    @GeneratedValue(strategy = GenerationType.UUID)
    /* @GeneratedValue annotation is used to define generation strategy for the primary key.
    GenerationType.AUTO means Auto Increment field */
    private UUID id;

    @Column(name = "project_name")
    private String projectName;

    @Column(name = "funder")
    private String funder;

    @Column (name = "authorisation_number")
    private String authorisationNumber;

    @Column(name = "export_file_name")
    private String exportFileName;

    // central on Dante
    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "license")
    private License license;

    @ManyToMany(mappedBy = "researchProjectList")
    @JsonIgnoreProperties("researchProjectList")
    private Set<Site> siteList = new HashSet<>();

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        ResearchProject researchProject = (ResearchProject) obj;
        return Objects.equals(id, researchProject.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
