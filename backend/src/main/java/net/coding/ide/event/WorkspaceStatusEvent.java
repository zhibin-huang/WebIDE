package net.coding.ide.event;

import lombok.Data;
import org.springframework.context.ApplicationEvent;

@Data
public class WorkspaceStatusEvent extends ApplicationEvent {
    private String spaceKey;
    public WorkspaceStatusEvent(Object source, String spaceKey){
        super(source);
        this.spaceKey = spaceKey;
    }
}
