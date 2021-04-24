package net.coding.ide.model;


public enum ResetType {
    /**
     * Just change the ref, the index and workdir are not changed.
     */
    SOFT,

    /**
     * Change the ref and the index, the workdir is not changed.
     */
    MIXED,

    /**
     * Change the ref, the index and the workdir
     */
    HARD
}
