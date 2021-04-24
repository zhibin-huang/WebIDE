package net.coding.ide.model.exception;


public class WorkspaceMissingException extends WorkspaceException {

    public WorkspaceMissingException(String msg) {
        super(msg);
    }

    public WorkspaceMissingException(String msg, Throwable cause) {
        super(msg, cause);
    }
}
