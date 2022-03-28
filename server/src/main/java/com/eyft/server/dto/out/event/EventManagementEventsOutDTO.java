package com.eyft.server.dto.out.event;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventManagementEventsOutDTO {
    @JsonProperty("events")
    List<EventManagementEventOutDTO> events;
}
