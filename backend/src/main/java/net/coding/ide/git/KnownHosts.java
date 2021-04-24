package net.coding.ide.git;

import org.eclipse.jgit.transport.CredentialItem;

import java.io.File;


public class KnownHosts extends CredentialItem {

    private File knownHostsFile;


    public KnownHosts() {
        super(null, false);
    }

    @Override
    public void clear() {

    }

    public File getValue() {
        return knownHostsFile;
    }

    public void setValue(File knowHostsFile) {
        this.knownHostsFile = knowHostsFile;
    }
}
