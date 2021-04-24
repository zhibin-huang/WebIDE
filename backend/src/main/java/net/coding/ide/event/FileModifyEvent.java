package net.coding.ide.event;

import lombok.Data;
import lombok.EqualsAndHashCode;
import net.coding.ide.model.FileInfo;


@Data
@EqualsAndHashCode(callSuper = true)
public class FileModifyEvent extends FileChangeEvent {

    public FileModifyEvent(String spaceKey, FileInfo fileInfo) {
        super(spaceKey, fileInfo);
    }
}
