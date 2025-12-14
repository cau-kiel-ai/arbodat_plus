//package arbodat.plus.model;
//
//import com.fasterxml.jackson.annotation.JsonIgnore;
//import jakarta.persistence.*;
//import lombok.Data;
//import java.io.Serializable;
//import java.util.Set;
//import java.util.UUID;
//
//@Data
//@Entity
//@Table(name = "archaeological_dating")
//public class ArchaeologicalDating implements Serializable {
//
//    @Id
//    private String id; // uri
//
//    @Column(name = "label")
//    private String label;
//
//    @JsonIgnore
//    @OneToMany(mappedBy = "archaeologicalDating")
//    private Set<Sample> sampleList;
//
//    @JsonIgnore
//    @ManyToMany(mappedBy = "archaeologicalDatingList")
//    private Set<Feature> featureList;
//}
