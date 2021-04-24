package net.coding.ide.model;


import lombok.Data;
import lombok.EqualsAndHashCode;
import org.joda.time.DateTime;



@Data
@EqualsAndHashCode(of = {"path", "isDir"})
public class FileInfo {

    private String path;  // 包含 name

    private String name;

    private boolean isDir;

    private Integer directoriesCount;

    private Integer filesCount;

    private long size;

    private DateTime lastModified;

    private DateTime lastAccessed;

    private String contentType;

    private GitStatus gitStatus;

    private boolean isSymbolicLink;

    private boolean readable = true;

    private boolean writable = true;

    private String target;

}
