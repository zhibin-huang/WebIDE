package net.coding.ide.model;

import lombok.Data;


@Data
public class User {

    private Long id;

    private String email;

    private String password;

    private String name;

    private String globalKey;

    private String avatar;

    public User(String email, String password) {
        this.email = email;
        this.password = password;
    }
}
