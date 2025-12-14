package arbodat.plus.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.util.Set;

@Data
@Entity
@Table(name = "c14_laboratory")
public class C14Laboratory implements Serializable {

    @Id
    private String id; // uri

    @Column(name = "label")
    private String label;

    @JsonIgnore
    @OneToMany(mappedBy = "c14Laboratory")
    private Set<C14Dating> c14DatingList;
}
