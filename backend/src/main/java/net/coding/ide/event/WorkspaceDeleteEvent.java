package net.coding.ide.event;


public class WorkspaceDeleteEvent extends WorkspaceStatusEvent {
    public WorkspaceDeleteEvent(Object source, String spaceKey) {
        super(source, spaceKey);
    }
}
