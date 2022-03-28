package com.eyft.server.testdata;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Condition;
import org.springframework.context.annotation.ConditionContext;
import org.springframework.core.type.AnnotatedTypeMetadata;

@RequiredArgsConstructor
public class OnDataFillingCondition implements Condition {

    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        return Boolean.TRUE.equals(context.getEnvironment().getProperty("data-filling.enabled", Boolean.class));
    }
}
