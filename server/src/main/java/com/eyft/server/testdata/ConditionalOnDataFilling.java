package com.eyft.server.testdata;

import org.springframework.context.annotation.Conditional;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Conditional(OnDataFillingCondition.class)
@Retention(RetentionPolicy.RUNTIME)
public @interface ConditionalOnDataFilling {
}
