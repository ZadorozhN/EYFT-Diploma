package com.eyft.server.dto.out.event;

import com.eyft.server.dto.out.photo.PhotoOutDTO;
import com.eyft.server.dto.out.photo.PhotosOutDTO;
import com.eyft.server.model.EventState;
import com.eyft.server.model.Photo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Collection;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventOutDTO {
    private Long id;
    private String name;
    private String description;
    private String place;
    private String userLogin;
    private Collection<String> categoriesNames;
    private Instant startInstant;
    private Instant endInstant;
    private EventState eventState;
    private Collection<PhotoOutDTO> photos;
    private PhotoOutDTO preview;
}
