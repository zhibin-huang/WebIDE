package net.coding.ide.model;

import lombok.Data;


@Data
public class GitLog {

    private String shortName;

    private String name;

    private String shortMessage;

    private int commitTime;

    private PersonIdent commiterIdent;

    private PersonIdent authorIdent;

    private String[] parents;
}
