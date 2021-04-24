package net.coding.ide.event;

public class WorkspaceOfflineEvent extends WorkspaceStatusEvent {

    public WorkspaceOfflineEvent(Object source, String spaceKey) {
        super(source, spaceKey);
    }
}
