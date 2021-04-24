package net.coding.ide.model;

import lombok.Data;

@Data
public class DiffEntry {
    private ChangeType changeType;
    private String oldPath;
    private String newPath;

    public enum ChangeType {
        ADD,
        COPY,
        DELETE,
        MODIFY,
        RENAME
    }
}