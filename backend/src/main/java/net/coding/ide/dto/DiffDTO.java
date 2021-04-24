package net.coding.ide.dto;

import lombok.Data;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;


@Data
@RequiredArgsConstructor(staticName = "of")
public class DiffDTO {

    @NonNull
    private String diff;

}
