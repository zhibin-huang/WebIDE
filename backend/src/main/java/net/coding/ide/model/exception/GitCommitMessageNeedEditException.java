package net.coding.ide.model.exception;


public class GitCommitMessageNeedEditException extends RuntimeException {
    public GitCommitMessageNeedEditException(String message) {
        super(message);
    }
}
