package net.coding.ide.event;

import lombok.Getter;
import net.coding.ide.model.Workspace;

public class GitCheckoutEvent {

    @Getter
    protected Workspace workspace;

    @Getter
    protected String branch;

    public GitCheckoutEvent(Workspace source, String branch) {
        this.workspace = source;
        this.branch = branch;
    }
}
