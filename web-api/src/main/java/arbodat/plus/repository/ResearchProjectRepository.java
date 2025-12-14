package arbodat.plus.repository;

import arbodat.plus.model.ResearchProject;
//import arbodat.plus.model.ResearchProject_User_Relation;
import arbodat.plus.model.Site;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Repository
/* Repository = data access layer
* @Repository: This annotation indicates that the class is a repository
* (Responsible for accessing and manipulating data from a database).
* Another approach is to extend CrudRepository, which gives you methods for CRUD functionality.
* CRUD stands for Create, Read, Update, Delete. Version 3.0 introduces ListCrudRepository which
* is very similar to the CrudRepository but for those methods that return multiple entities
* it returns a List instead of an Iterable. */
public interface ResearchProjectRepository extends JpaRepository<ResearchProject, UUID>  {
/* domain class specific repository interface -> no direct instantiation
 * JpaRepository<must be typed to the Domain class, ID type>:
 * JPA = Java Persistence API
 * Data Persistence is a means for an application to persist and retrieve information from a non-volatile storage system.
 * JPA provides a mechanism for managing persistence and object-relational mapping and functions.
 *
 * JPA with Hibernate as underlying object-related mapping (ORM) framework allows ManyToMany relationship, aso.
 *
 * Here, we call the .save() and the .findAll() method for repositories in the controller
 */

//    @Query("SELECT u FROM ResearchProject_User_Relation u WHERE u.researchProject.id = :projectId")
//    Set<ResearchProject_User_Relation> findUsersByResearchProjectId(@Param("projectId") UUID projectId);

    @Query("SELECT s FROM Site s JOIN s.researchProjectList p WHERE p.id = :projectId")
    Set<Site> findSitesByResearchProjectId(@Param("projectId") UUID projectId);

    Optional<ResearchProject> findByProjectName(String projectName);

}