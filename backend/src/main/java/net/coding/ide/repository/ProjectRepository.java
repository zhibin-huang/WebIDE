package net.coding.ide.repository;

import net.coding.ide.entity.ProjectEntity;
import org.springframework.data.repository.CrudRepository;


public interface ProjectRepository extends CrudRepository<ProjectEntity, Long> {

    ProjectEntity findByUrl(String sshUrl);

}
