package net.coding.ide.dto;

import lombok.Data;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;


@Data
@RequiredArgsConstructor(staticName = "of")
public class BranchDTO {

    @NonNull
    private String name;

}
