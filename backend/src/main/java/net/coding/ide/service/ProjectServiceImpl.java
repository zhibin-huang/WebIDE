package net.coding.ide.service;

import com.google.common.collect.Lists;
import net.coding.ide.entity.ProjectEntity;
import net.coding.ide.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
public class ProjectServiceImpl extends BaseService implements ProjectService {
    @Autowired
    private ProjectRepository prjRepo;

    @Override
    @Transactional
    public List<ProjectEntity> projects() {
        return Lists.newArrayList(prjRepo.findAll());
    }
}
