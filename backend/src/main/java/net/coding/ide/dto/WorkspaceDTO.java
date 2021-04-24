package net.coding.ide.dto;

import lombok.Data;

@Data
public class WorkspaceDTO {
    private String spaceKey;

    private String ownerName;

    private String projectName;

    private String projectIconUrl;

    private String projectHtmlUrl;

    private String encoding;

    private String workingStatus;

    private String description;
}
