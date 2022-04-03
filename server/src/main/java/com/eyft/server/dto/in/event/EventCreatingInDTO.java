package com.eyft.server.dto.in.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Collection;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventCreatingInDTO {
    private String name;
    private String description;
    private String place;
    private Collection<String> categoriesNames;
    private Instant startInstant;
    private Instant endInstant;
    private Long price;
}
