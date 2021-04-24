package net.coding.ide.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "T_PROJECT")
public class ProjectEntity extends BaseEntity {

    @Column(name = "F_NAME")
    private String name;

    @Column(name = "F_FULL_NAME")
    private String fullName;

    @Column(name = "F_ICON_URL")
    private String iconUrl;

    @Column(name = "F_URL")
    private String url;

    @Column(name = "F_OWNER_NAME")
    private String ownerName;
}
