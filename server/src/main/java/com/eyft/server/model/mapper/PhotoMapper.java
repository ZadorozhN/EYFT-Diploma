package com.eyft.server.model.mapper;

import com.eyft.server.dto.out.photo.PhotoOutDTO;
import com.eyft.server.model.Photo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PhotoMapper {
    public PhotoOutDTO fillPhotoOutDTO(Photo photo){
        return new PhotoOutDTO(
                photo.getId(),
                photo.getEvent() == null ? null : photo.getEvent().getId(),
                photo.getUser() == null ? null : photo.getUser().getId(),
                photo.getPath()
        );
    }
}
