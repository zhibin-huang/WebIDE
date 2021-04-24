package net.coding.ide.git;

import org.eclipse.jgit.transport.CredentialItem;

import java.io.File;

public class Identity extends CredentialItem {


    private File identityFile;


    public Identity() {
        super(null, false);
    }

    @Override
    public void clear() {

    }

    public File getValue() {
        return identityFile;
    }

    public void setValue(File identityFile) {
        this.identityFile = identityFile;
    }
}
