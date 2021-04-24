package net.coding.ide.model;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Key {
    private String privateKey;

    private String publicKey;

    private String fingerprint;

    public Key(String privateKey, String publicKey, String fingerprint) {
        this.privateKey = privateKey;
        this.publicKey = publicKey;
        this.fingerprint = fingerprint;
    }
}
