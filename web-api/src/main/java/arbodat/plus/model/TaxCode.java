package arbodat.plus.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.util.Set;

@Data
@Entity
@Table(name = "taxCode")
public class TaxCode implements Serializable {

    @Id
    private String id; // uri

    @Column(name = "label")
    private String label;

    @Column(name = "taxonomy")
    private String taxonomy;

    @JsonIgnore
    @OneToMany(mappedBy = "taxCode")
    private Set<Result> resultList;
}
