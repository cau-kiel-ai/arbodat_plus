package arbodat.plus.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import jakarta.persistence.*;

import java.io.Serializable;
import java.util.Set;
import java.util.UUID;

@Data
@Entity
@Table(name = "literature")
public class Literature implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "doi")
    private String doi;

    @Column(name = "publication_year")
    private Integer publicationYear;

    @Column(name = "title")
    private String title;

    @Column(name = "short_citation")
    private String shortCitation;

    @Column (name = "long_citation")
    private String longCitation;

    @Column(name = "abstract")
    private String litAbstract;

    @ManyToMany(cascade = CascadeType.MERGE)
    @JoinTable(name = "literature_author_relation",
            joinColumns = @JoinColumn(name = "literature_id"),
            inverseJoinColumns = @JoinColumn(name = "author_id")
    )
    @JsonIgnoreProperties("literatureList")
    private Set<Author> authorList;


    @ManyToMany
    @JoinTable(name = "literature_site_relation",
            joinColumns = @JoinColumn(name = "literature_id"),
            inverseJoinColumns = @JoinColumn(name = "site_id")
    )
    @JsonIgnoreProperties("literatureList")
    private Set<Site> siteList;

    @ManyToMany
    @JoinTable(name = "literature_absolute_dating_relation",
            joinColumns = @JoinColumn(name = "literature_id"),
            inverseJoinColumns = @JoinColumn(name = "absolute_dating_id")
    )
    @JsonIgnoreProperties("literatureList")
    private Set<AbsoluteDating> absoluteDatingList;
}
