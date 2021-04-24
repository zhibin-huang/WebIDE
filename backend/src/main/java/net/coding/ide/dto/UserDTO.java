package net.coding.ide.dto;

import lombok.Data;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor(staticName = "of")
public class UserDTO {

    @NonNull
    private String username;

    @NonNull
    private String avatar;
}
