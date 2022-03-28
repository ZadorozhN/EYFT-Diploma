package com.eyft.server.dto.out.photo;

import com.eyft.server.model.Photo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PhotosOutDTO {
    private List<PhotoOutDTO> photos;
}
