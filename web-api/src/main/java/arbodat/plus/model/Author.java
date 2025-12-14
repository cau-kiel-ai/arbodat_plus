package arbodat.plus.model;

import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

@Data
@Entity
@Table(name = "author")
public class Author implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "middle_name")
    private String middleName;

    @Column(name = "last_name")
    private String lastName;

    @ManyToMany(mappedBy = "authorList")
    private Set<Literature> literatureList;

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Author author = (Author) obj;
        return Objects.equals(id, author.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}