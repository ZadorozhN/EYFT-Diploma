package com.eyft.server.testdata;

import org.springframework.context.ApplicationEvent;

public class DataFillingStartEvent extends ApplicationEvent {
    public DataFillingStartEvent(Object source) {
        super(source);
    }
}
