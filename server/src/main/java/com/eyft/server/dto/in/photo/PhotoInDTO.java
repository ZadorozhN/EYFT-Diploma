package com.eyft.server.dto.in.photo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PhotoInDTO {
    private Long id;
    private Long eventId;
    private Long userId;
    private String path;
}
