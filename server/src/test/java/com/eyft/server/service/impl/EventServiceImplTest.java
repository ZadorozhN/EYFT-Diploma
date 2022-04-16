//package com.eyft.server.service.impl;
//
//import com.eyft.server.model.Event;
//import com.eyft.server.model.EventState;
//import com.eyft.server.repository.EventRepository;
//import com.eyft.server.repository.PhotoRepository;
//import com.eyft.server.util.EventUtil;
//import org.junit.jupiter.api.Test;
//
//import java.util.Optional;
//
//import static org.mockito.Mockito.*;
//
//class EventServiceImplTest {
//
//    private final EventRepository eventRepository = mock(EventRepository.class);
//    private final PhotoRepository photoRepository = mock(PhotoRepository.class);
//    private final EventUtil eventUtil = mock(EventUtil.class);
//
//    private final EventServiceImpl eventService = new EventServiceImpl(eventRepository, photoRepository, eventUtil);
//
//    @Test
//    void deleteById() {
//        long someEventId = 5;
//
//        eventService.deleteById(someEventId);
//
//        verify(eventRepository, only()).deleteById(someEventId);
//    }
//
//    @Test
//    void findById(){
//        long someEventId = 5;
//
//        eventService.findById(someEventId);
//
//        verify(eventRepository, only()).findById(someEventId);
//    }
//
//    @Test
//    void findAll(){
//        eventService.findAll();
//
//        verify(eventRepository, only()).findAll();
//    }
//
//    @Test
//    void start(){
//        long someEventId = 5;
//        Event event = new Event();
//        event.setId(someEventId);
//        event.setEventState(EventState.WAITING_FOR_START);
//
//        when(eventRepository.findById(someEventId)).thenReturn(Optional.of(event));
//
//        eventService.start(someEventId);
//
//        verify(eventRepository, times(1)).findById(someEventId);
//        verify(eventRepository, times(1)).save(event);
//    }
//
//    @Test
//    void stop(){
//        long someEventId = 5;
//        Event event = new Event();
//        event.setId(someEventId);
//        event.setEventState(EventState.STARTED);
//
//        when(eventRepository.findById(someEventId)).thenReturn(Optional.of(event));
//
//        eventService.stop(someEventId);
//
//        verify(eventRepository, times(1)).findById(someEventId);
//        verify(eventRepository, times(1)).save(event);
//    }
//
//    @Test
//    void finish(){
//        long someEventId = 5;
//        Event event = new Event();
//        event.setId(someEventId);
//        event.setEventState(EventState.STARTED);
//
//        when(eventRepository.findById(someEventId)).thenReturn(Optional.of(event));
//
//        eventService.finish(someEventId);
//
//        verify(eventRepository, times(1)).findById(someEventId);
//        verify(eventRepository, times(1)).save(event);
//    }
//
//    @Test
//    void close(){
//        long someEventId = 5;
//        Event event = new Event();
//        event.setId(someEventId);
//        event.setEventState(EventState.FINISHED);
//
//        when(eventRepository.findById(someEventId)).thenReturn(Optional.of(event));
//
//        eventService.close(someEventId);
//
//        verify(eventRepository, times(1)).findById(someEventId);
//        verify(eventRepository, times(1)).save(event);
//    }
//}