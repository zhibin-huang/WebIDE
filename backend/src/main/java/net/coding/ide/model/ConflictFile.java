package net.coding.ide.model;

import lombok.Data;


@Data
public class ConflictFile {

    private String base;

    private String local;

    private String remote;
}
