package net.coding.ide.model;

import lombok.Builder;
import lombok.Data;


@Builder
@Data
public class GitBlame {

    private PersonIdent author;

    private String shortName;

}
