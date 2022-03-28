package com.eyft.server.service.impl;

import com.eyft.server.exception.DeleteUploadedPhotoException;
import com.eyft.server.exception.SaveUploadedPhotoException;
import com.eyft.server.model.Event;
import com.eyft.server.model.Photo;
import com.eyft.server.model.User;
import com.eyft.server.repository.PhotoRepository;
import com.eyft.server.service.PhotoService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PhotoServiceImpl implements PhotoService {

    private final PhotoRepository photoRepository;

    @Value("${photo.directory.path}")
    private String photoDirectoryPath;

    @Override
    @Transactional
    public void save(List<MultipartFile> files, Event event) {
        List<Path> savedPhotoPaths = new ArrayList<>();

        Path fullPhotoDirectoryPath = Paths.get(photoDirectoryPath, event.getId().toString());
        try {
            Files.createDirectories(fullPhotoDirectoryPath);
            for (MultipartFile file : files) {
                String extension = FilenameUtils.getExtension(file.getOriginalFilename());
                String uuid = UUID.randomUUID().toString();
                Path fullPhotoPath = fullPhotoDirectoryPath.resolve(uuid + FilenameUtils.EXTENSION_SEPARATOR + extension);
                Files.createFile(fullPhotoPath);
                file.transferTo(fullPhotoPath);

                savedPhotoPaths.add(fullPhotoPath);

                Photo photo = new Photo();
                photo.setPath(uuid + FilenameUtils.EXTENSION_SEPARATOR + extension);
                photo.setEvent(event);

                photoRepository.save(photo);
            }
        } catch (IOException e) {
            savedPhotoPaths.forEach(path -> {
                try {
                    Files.delete(path);
                } catch (IOException ioException) {
                    throw new DeleteUploadedPhotoException();
                }
            });

            throw new SaveUploadedPhotoException();
        }
    }

    @Override
    @Transactional
    public void save(List<MultipartFile> files, User user) {
        List<Path> savedPhotoPaths = new ArrayList<>();

        Path fullPhotoDirectoryPath = Paths.get(photoDirectoryPath, "user-" + user.getId().toString());
        try {
            Files.createDirectories(fullPhotoDirectoryPath);
            for (MultipartFile file : files) {
                String extension = FilenameUtils.getExtension(file.getOriginalFilename());
                String uuid = UUID.randomUUID().toString();
                Path fullPhotoPath = fullPhotoDirectoryPath.resolve(uuid + FilenameUtils.EXTENSION_SEPARATOR + extension);
                Files.createFile(fullPhotoPath);
                file.transferTo(fullPhotoPath);

                savedPhotoPaths.add(fullPhotoPath);

                Photo photo = new Photo();
                photo.setPath(uuid + FilenameUtils.EXTENSION_SEPARATOR + extension);
                photo.setUser(user);

                photoRepository.save(photo);
            }
        } catch (IOException e) {
            savedPhotoPaths.forEach(path -> {
                try {
                    Files.delete(path);
                } catch (IOException ioException) {
                    throw new DeleteUploadedPhotoException();
                }
            });

            throw new SaveUploadedPhotoException();
        }
    }

    @Override
    @Transactional
    public void remove(Photo photo) {
        photoRepository.deleteById(photo.getId());
    }

    @Override
    public Optional<Photo> findById(Long id) {
        return photoRepository.findById(id);
    }

    @Override
    public File getPhotoFile(Event event, Photo photo) {
        Path fullPhotoDirectoryPath = Paths.get(photoDirectoryPath, event.getId().toString(), photo.getPath());

        return fullPhotoDirectoryPath.toFile();
    }

    @Override
    public File getPhotoFile(User user, Photo photo) {
        Path fullPhotoDirectoryPath = Paths.get(photoDirectoryPath, "user-" + user.getId().toString(), photo.getPath());

        return fullPhotoDirectoryPath.toFile();
    }
}
