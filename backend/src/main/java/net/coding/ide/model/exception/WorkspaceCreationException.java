package net.coding.ide.model.exception;


public class WorkspaceCreationException extends WorkspaceException {
    public WorkspaceCreationException(String msg) {
        super(msg);
    }

    public WorkspaceCreationException(String msg, Throwable cause) {
        super(msg, cause);
    }
}
