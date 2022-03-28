package com.eyft.server.service;

import com.eyft.server.model.Event;
import com.eyft.server.model.Photo;
import com.eyft.server.model.User;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;
import java.util.Optional;

public interface PhotoService {

    void save(List<MultipartFile> files, Event event);

    void save(List<MultipartFile> files, User user);

    void remove(Photo photo);

    Optional<Photo> findById(Long id);

    File getPhotoFile(Event event, Photo photo);

    File getPhotoFile(User user, Photo photo);
}
