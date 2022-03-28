package com.eyft.server.dto.out.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventsOutDTO {
    List<EventOutDTO> events;
}
