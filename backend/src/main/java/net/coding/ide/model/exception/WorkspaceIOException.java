package net.coding.ide.model.exception;


public class WorkspaceIOException extends RuntimeException {

    public WorkspaceIOException(String message) {
        super(message);
    }

    public WorkspaceIOException(String message, Throwable cause) {
        super(message, cause);
    }

    public WorkspaceIOException(Throwable cause) {
        super(cause);
    }
}
