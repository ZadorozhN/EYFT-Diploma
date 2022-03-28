package com.eyft.server.testdata;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties("data-filling")
public class DataFillingProperties {
    private boolean enabled;
}
