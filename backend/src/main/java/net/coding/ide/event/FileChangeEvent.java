package net.coding.ide.event;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import net.coding.ide.model.FileInfo;

@Data
@NoArgsConstructor
@EqualsAndHashCode
public class FileChangeEvent {

    protected String spaceKey;

    protected FileInfo fileInfo;

    public FileChangeEvent(String spaceKey, FileInfo fileInfo) {
        this.spaceKey = spaceKey;
        this.fileInfo = fileInfo;
    }
}
