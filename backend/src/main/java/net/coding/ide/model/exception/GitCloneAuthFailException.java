package net.coding.ide.model.exception;

public class GitCloneAuthFailException extends RuntimeException {

    public GitCloneAuthFailException(String message, Throwable cause) {
        super(message, cause);
    }
}
