package net.coding.ide.service;

import net.coding.ide.entity.ConfigEntity;


public interface ConfigService {

    String getName(String key);

    ConfigEntity getByKey(String key);

    void setName(String key, String name);

    String getValue(String key);

    String getValue(String key, String defaultValue);

    String getValue(String key, String... subs);

    void setValue(String key, String value);

    void setCfg(String key, String name, String value);

    Iterable<ConfigEntity> findAll();

    void deleteCfg(String key);

    boolean exist(String key);

    String[] getValues(String key, String separatorChar);
}
