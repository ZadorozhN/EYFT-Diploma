package com.eyft.server.testdata;

import com.eyft.server.service.MoneyHandler;
import com.eyft.server.testdata.creator.HeroCreator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnDataFilling
public class DataFillerConfiguration {

    @Bean
    public DataFillerListener dataFillerListener(HeroCreator heroCreator) {
        return new DataFillerListener(heroCreator);
    }
}
