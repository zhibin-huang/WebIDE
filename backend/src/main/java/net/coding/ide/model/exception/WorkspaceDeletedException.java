package net.coding.ide.model.exception;

public class WorkspaceDeletedException extends WorkspaceMissingException {

    public WorkspaceDeletedException(String msg) {
        super(msg);
    }

    public WorkspaceDeletedException(String msg, Throwable cause) {
        super(msg, cause);
    }

}
