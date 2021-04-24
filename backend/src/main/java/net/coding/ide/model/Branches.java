package net.coding.ide.model;

import lombok.Data;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

import java.util.List;


@Data
@RequiredArgsConstructor(staticName = "of")
public class Branches {

    @NonNull
    private String current;

    @NonNull
    private List<String> local;

    @NonNull
    private List<String> remote;
}
