package net.coding.ide.model.exception;


public class WorkspaceException extends RuntimeException {

    public WorkspaceException() {

    }

    public WorkspaceException(String msg) {
        super(msg);
    }

    public WorkspaceException(String msg, Throwable cause) {
        super(msg, cause);
    }
}
