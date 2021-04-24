package net.coding.ide;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import javax.annotation.PostConstruct;


@SpringBootApplication
public class Application {

    @Value("${PTY_LIB_FOLDER}")
    private String ptyLibFolder;

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @PostConstruct
    public void init(){
        System.setProperty("PTY_LIB_FOLDER", ptyLibFolder);
    }
}
