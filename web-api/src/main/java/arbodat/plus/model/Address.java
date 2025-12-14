package arbodat.plus.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

@Data
@Entity
@Table(name = "address")
public class Address implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "country")
    private String country;

    @Column(name = "county")
    private String county;

    @Column(name = "district")
    private String district;

    @Column(name = "parish")
    private String parish;

    @Column(name = "town")
    private String town;

    @Column(name = "street_or_place")
    private String street_or_place;

    @JsonIgnore
    @OneToOne(mappedBy = "address")
    private Site site;
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Address address = (Address) obj;
        return Objects.equals(id, address.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
