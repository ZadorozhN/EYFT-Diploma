package com.eyft.server.service;

import com.eyft.server.model.Event;
import com.eyft.server.model.EventState;
import com.eyft.server.model.Photo;
import com.eyft.server.model.User;
import com.eyft.server.service.specification.Operation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface EventService {
    List<Event> findAll();

    List<Event> findAll(String filterField, Operation filterOperation, Object filterValue,
                        String sortField, String sortOrder);

    List<Event> findAllByEventState(EventState eventState);

    List<Event> findAllRelevant();

    Optional<Event> findById(Long id);

    void setPreview(Event event, Photo photo);

    void deleteById(Long id);

    @Transactional
    void delete(Event event);

    void save(Event event);

    void start(Long id);

    void stop(Long id);

    void finish(Long id);

    void close(Long id);
}
