package com.eyft.server.dto.out.event;

import com.eyft.server.model.EventState;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Collection;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventManagementEventOutDTO {
    private Long id;
    private String name;
    private String description;
    private String place;
    private String userLogin;
    private Collection<String> categoriesNames;
    private Instant startInstant;
    private Instant endInstant;
    private EventState eventState;
}
