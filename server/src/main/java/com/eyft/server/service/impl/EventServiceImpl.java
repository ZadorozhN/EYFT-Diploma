package com.eyft.server.service.impl;

import com.eyft.server.exception.EventDoesNotExistException;
import com.eyft.server.exception.IllegalEventStateChangeException;
import com.eyft.server.exception.PhotoDoesNotBelongToEventException;
import com.eyft.server.model.Event;
import com.eyft.server.model.EventState;
import com.eyft.server.model.Photo;
import com.eyft.server.repository.EventRepository;
import com.eyft.server.repository.PhotoRepository;
import com.eyft.server.service.EventService;
import com.eyft.server.service.MoneyHandler;
import com.eyft.server.service.specification.EventSpecification;
import com.eyft.server.service.specification.Operation;
import com.eyft.server.service.specification.SearchCriteria;
import com.eyft.server.util.EventUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private final PhotoRepository photoRepository;
    private final EventUtil eventUtil;
    private final MoneyHandler moneyHandler;

    @Override
    @Transactional(readOnly = true)
    public List<Event> findAll() {
        return eventRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Event> findAll(String filterField, Operation filterOperation, Object filterValue,
                               String sortField, String sortOrder) {
        List<Event> events;
        Sort sort = buildSort(sortField, sortOrder);

        if(Objects.nonNull(filterField) && Objects.nonNull(filterValue) && Objects.nonNull(filterOperation)) {
            EventSpecification eventSpecification = new EventSpecification(new SearchCriteria(filterField, filterOperation, filterValue));
            events = eventRepository.findAll(eventSpecification, sort);
        } else {
            events = eventRepository.findAll(sort);
        }

        return events;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Event> findAllByEventState(EventState eventState) {
        return eventRepository.findAllByEventState(eventState);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Event> findAllRelevant() {
        return eventRepository.findAll().stream()
                .filter(eventUtil::isRelevant)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Event> findById(Long id) {
        return eventRepository.findById(id);
    }

    @Override
    public void setPreview(Event event, Photo photo) {
        if(!event.getPhotos().contains(photo)){
            throw new PhotoDoesNotBelongToEventException();
        }

        event.setPreview(photo);

        eventRepository.save(event);
    }

    @Override
    @Deprecated
    @Transactional
    public void deleteById(Long id) {
        eventRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void delete(Event event) {
        eventRepository.delete(event);

        if(event.getEventState() == EventState.WAITING_FOR_START || event.getEventState() == EventState.STARTED){
            event.getUsers().parallelStream().forEach(user -> {
                moneyHandler.handleRequest(user.getBalance().getAccountId(), event.getPrice());
            });
        }
    }

    @Override
    @Transactional
    public void save(Event event) {
        eventRepository.save(event);
    }

    @Override
    @Transactional
    public void start(Long id) {
        Event event = eventRepository.findById(id).orElseThrow(EventDoesNotExistException::new);

        if(!event.getEventState().equals(EventState.WAITING_FOR_START)){
            throw new IllegalEventStateChangeException();
        }

        event.setEventState(EventState.STARTED);

        eventRepository.save(event);
    }

    @Override
    @Transactional
    public void stop(Long id) {
        Event event = eventRepository.findById(id).orElseThrow(EventDoesNotExistException::new);

        if(!event.getEventState().equals(EventState.STARTED)){
            throw new IllegalEventStateChangeException();
        }

        event.setEventState(EventState.WAITING_FOR_START);

        eventRepository.save(event);
    }

    @Override
    @Transactional
    public void finish(Long id) {
        Event event = eventRepository.findById(id).orElseThrow(EventDoesNotExistException::new);

        if(!event.getEventState().equals(EventState.STARTED)){
            throw new IllegalEventStateChangeException();
        }

        event.setEventState(EventState.FINISHED);

        eventRepository.save(event);
    }

    @Override
    @Transactional
    public void close(Long id) {
        Event event = eventRepository.findById(id).orElseThrow(EventDoesNotExistException::new);

        event.setEventState(EventState.CLOSED);

        eventRepository.save(event);
    }

    private Sort buildSort(String sortField, String sortOrder){
        if(Objects.isNull(sortField) || Objects.isNull(sortOrder)){
            return Sort.by(Sort.DEFAULT_DIRECTION, "id");
        }

        return Sort.by(Sort.Direction.valueOf(sortOrder), sortField);
    }
}
