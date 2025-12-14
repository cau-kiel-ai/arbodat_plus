package arbodat.plus.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.util.Set;

@Data
@Entity
@Table(name = "site_type")
public class SiteType implements Serializable {

    @Id
    private String id; // uri

    @Column(name = "label")
    private String label;

    @Column(name = "structural_concept")
    private String structuralConcept;

    @JsonIgnore
    @ManyToMany(mappedBy = "siteTypeList")
    private Set<Site> siteList;
}
