package com.eyft.server.controller.resource;

import com.eyft.server.exception.EventDoesNotExistException;
import com.eyft.server.exception.PhotoDoesNotExistException;
import com.eyft.server.exception.UserDoesNotExistException;
import com.eyft.server.model.Event;
import com.eyft.server.model.Photo;
import com.eyft.server.model.User;
import com.eyft.server.service.EventService;
import com.eyft.server.service.PhotoService;
import com.eyft.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/resources")
public class PhotoController {
    private final PhotoService photoService;
    private final EventService eventService;
    private final UserService userService;

    @PostMapping("/events/{id}")
    public void uploadEventPhotos(@PathVariable Long id, @RequestParam("photos") List<MultipartFile> photos){
        Event event = eventService.findById(id).orElseThrow(EventDoesNotExistException::new);
        //TODO Auth
        photoService.save(photos, event);
    }

    @PostMapping("/users/{id}")
    public void uploadUserPhotos(@PathVariable Long id, @RequestParam("photos") List<MultipartFile> photos){
        User user = userService.findById(id).orElseThrow(UserDoesNotExistException::new);
        //TODO Auth
        photoService.save(photos, user);
    }

    @GetMapping(path = "/events/{id}/photos/{photoId}")
    public ResponseEntity<Resource> getEventPhoto(@PathVariable Long id, @PathVariable Long photoId) throws IOException {
        Event event = eventService.findById(id).orElseThrow(EventDoesNotExistException::new);
        Photo photo = photoService.findById(photoId).orElseThrow(PhotoDoesNotExistException::new);

        File photoFile = photoService.getPhotoFile(event, photo);
        InputStreamResource resource = new InputStreamResource(new FileInputStream(photoFile));

        MediaType mediaType = isJpg(photoFile)
                ? MediaType.IMAGE_JPEG
                : isPng(photoFile)
                    ? MediaType.IMAGE_PNG
                    : MediaType.APPLICATION_OCTET_STREAM;


        return ResponseEntity.ok()
                .contentType(mediaType)
                .contentLength(photoFile.length())
                .body(resource);
    }

    @GetMapping(path = "/users/{id}/photos/{photoId}")
    public ResponseEntity<Resource> getUserPhoto(@PathVariable Long id, @PathVariable Long photoId) throws IOException {
        User user = userService.findById(id).orElseThrow(UserDoesNotExistException::new);
        Photo photo = photoService.findById(photoId).orElseThrow(PhotoDoesNotExistException::new);

        File photoFile = photoService.getPhotoFile(user, photo);
        InputStreamResource resource = new InputStreamResource(new FileInputStream(photoFile));

        MediaType mediaType = isJpg(photoFile)
                ? MediaType.IMAGE_JPEG
                : isPng(photoFile)
                    ? MediaType.IMAGE_PNG
                    : MediaType.APPLICATION_OCTET_STREAM;


        return ResponseEntity.ok()
                .contentType(mediaType)
                .contentLength(photoFile.length())
                .body(resource);
    }

    private boolean isJpg(File file){
        return file.getName().endsWith(".jpg") || file.getName().endsWith(".jpeg");
    }

    private boolean isPng(File file){
        return file.getName().endsWith(".png");
    }
}
