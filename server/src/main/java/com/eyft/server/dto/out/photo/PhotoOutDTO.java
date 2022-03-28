package com.eyft.server.dto.out.photo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PhotoOutDTO {
    private Long id;
    private Long eventId;
    private Long userId;
    private String path;
}
