package net.coding.ide.model.exception;

public class GitInvalidRefException extends RuntimeException {
    public GitInvalidRefException(String message) {
        super(message);
    }
}
