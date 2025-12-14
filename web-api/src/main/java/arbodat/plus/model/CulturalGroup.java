//package arbodat.plus.model;
//
//import com.fasterxml.jackson.annotation.JsonIgnore;
//import jakarta.persistence.*;
//import lombok.Data;
//import java.io.Serializable;
//import java.util.Set;
//
//@Data
//@Entity
//@Table(name = "cultural_group")
//public class CulturalGroup implements Serializable {
//
//    @Id
//    private String id; // uri
//
//    @Column(name = "label")
//    private String label;
//
//    @JsonIgnore
//    @OneToMany(mappedBy = "culturalGroup")
//    private Set<Sample> sampleList;
//
//    @JsonIgnore
//    @ManyToMany(mappedBy = "culturalGroupList")
//    private Set<Feature> featureList;
//}
