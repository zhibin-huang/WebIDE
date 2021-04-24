package net.coding.ide.dto;

import lombok.Data;
import lombok.NonNull;


@Data(staticConstructor = "of")
public class DirDTO {

    @NonNull
    private String spaceKey;

    @NonNull
    private String path;
}
