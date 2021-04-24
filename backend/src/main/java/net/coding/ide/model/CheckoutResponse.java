package net.coding.ide.model;

import lombok.Data;

import java.util.List;

@Data
public class CheckoutResponse {

    public enum Status {
        CONFLICTS,
        ERROR,
        NONDELETED,
        NOT_TRIED,
        OK
    }

    private Status status;
    private List<String> conflictList;
    private List<String> modifiedList;
    private List<String> removedList;
    private List<String> undeletedList;
}
