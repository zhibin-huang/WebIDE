package net.coding.ide.model;

public enum RebaseOperation {
    /**
     * Continues after a conflict resolution
     */
    CONTINUE,
    /**
     * Skips the "current" commit
     */
    SKIP,
    /**
     * Aborts and resets the current rebase
     */
    ABORT,
    /**
     * Starts processing steps
     * @since 3.2
     */
    PROCESS_STEPS
}
