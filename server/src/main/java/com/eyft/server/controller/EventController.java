package com.eyft.server.controller;

import com.eyft.server.controller.tokenhandler.TokenHandler;
import com.eyft.server.dto.out.SuccessfulOutDTO;
import com.eyft.server.dto.out.event.EventOutDTO;
import com.eyft.server.dto.out.event.EventsOutDTO;
import com.eyft.server.exception.EventDoesNotExistException;
import com.eyft.server.exception.EventHasBeenFinishedException;
import com.eyft.server.exception.NotEventArrangerException;
import com.eyft.server.model.Event;
import com.eyft.server.model.Role;
import com.eyft.server.model.User;
import com.eyft.server.model.mapper.EventMapper;
import com.eyft.server.service.*;
import com.eyft.server.util.EventUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * TODO Bad REST uris
 */
@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/events")
public class EventController {

    @Value("${mail.notification.enabled}")
    private boolean isMailNotificationEnabled;

    private final TokenHandler tokenHandler;
    private final EventService eventService;
    private final UserService userService;
    private final EventMapper eventMapper;
    private final MailService mailService;
    private final EventUtil eventUtil;
    private final MessageService messageService;
    private final CommentService commentService ;

    @GetMapping("/{id}")
    public EventOutDTO getEvent(@PathVariable Long id) {
        Event event = eventService.findById(id).orElseThrow(EventDoesNotExistException::new);

        return eventMapper.fillEventOutDTO(event);
    }

    //TODO
    @PostMapping("/{id}/comment")
    public SuccessfulOutDTO saveComment(@PathVariable Long id, Authentication authentication) {

        return new SuccessfulOutDTO("Comment was added");
    }

    @GetMapping
    public EventsOutDTO getEvents() {
        List<EventOutDTO> events = eventService.findAll()
                .stream().map(eventMapper::fillEventOutDTO)
                .collect(Collectors.toList());

        return new EventsOutDTO(events);
    }

    @PutMapping("/{id}/join")
    public SuccessfulOutDTO joinEvent(@PathVariable Long id, @RequestHeader(name="Authorization") String token) {
        Event event = eventService.findById(id).orElseThrow(EventDoesNotExistException::new);
        User user = tokenHandler.getUser(token);

        if(eventUtil.isRelevant(event)) {
            userService.joinEvent(user, event);
            return new SuccessfulOutDTO("Joined event");
        }

        throw new EventHasBeenFinishedException();
    }

    @PutMapping("/{id}/leave")
    public SuccessfulOutDTO leaveEvent(@PathVariable Long id, @RequestHeader(name="Authorization") String token) {

        Event event = eventService.findById(id).orElseThrow(EventDoesNotExistException::new);
        User user = tokenHandler.getUser(token);

        if(eventUtil.isRelevant(event)) {
            userService.leaveEvent(user, event);
            return new SuccessfulOutDTO("Left event");
        }

        throw new EventHasBeenFinishedException();
    }

    @PutMapping("/{id}/start")
    public SuccessfulOutDTO startEvent(@PathVariable Long id, @RequestHeader(name="Authorization") String token) {

        Event event = eventService.findById(id).orElseThrow(EventDoesNotExistException::new);
        User user = tokenHandler.getUser(token);

        if (!event.getUser().equals(user) && !user.getRole().equals(Role.ADMIN)){
            throw new NotEventArrangerException();
        }

        eventService.start(id);

        if(isMailNotificationEnabled) {
            event.getUsers().forEach(participant -> mailService.sendEventStartedNotification(participant, event));
        }

        return new SuccessfulOutDTO("Event has been started");
    }

    @PutMapping("/{id}/stop")
    public SuccessfulOutDTO stopEvent(@PathVariable Long id, @RequestHeader(name="Authorization") String token) {

        Event event = eventService.findById(id).orElseThrow(EventDoesNotExistException::new);
        User user = tokenHandler.getUser(token);

        if (!event.getUser().equals(user) && !user.getRole().equals(Role.ADMIN)){
            throw new NotEventArrangerException();
        }

        eventService.stop(id);

        if(isMailNotificationEnabled) {
            event.getUsers().forEach(participant -> mailService.sendEventStoppedNotification(participant, event));
        }

        return new SuccessfulOutDTO("Event has been stopped");
    }

    @PutMapping("/{id}/finish")
    public SuccessfulOutDTO finishEvent(@PathVariable Long id, @RequestHeader(name="Authorization") String token) {

        Event event = eventService.findById(id).orElseThrow(EventDoesNotExistException::new);
        User user = tokenHandler.getUser(token);

        if (!event.getUser().equals(user) && !user.getRole().equals(Role.ADMIN)){
            throw new NotEventArrangerException();
        }

        eventService.finish(id);
        if(isMailNotificationEnabled) {
            event.getUsers().forEach(participant -> mailService.sendEventFinishedNotification(participant, event));
        }

        return new SuccessfulOutDTO("Event has been finished");
    }

    @PutMapping("/{id}/close")
    public SuccessfulOutDTO closeEvent(@PathVariable Long id, @RequestHeader(name="Authorization") String token) {

        Event event = eventService.findById(id).orElseThrow(EventDoesNotExistException::new);
        User user = tokenHandler.getUser(token);

        if (!event.getUser().equals(user) && !user.getRole().equals(Role.ADMIN)){
            throw new NotEventArrangerException();
        }

        eventService.close(id);

        if(isMailNotificationEnabled) {
            event.getUsers().forEach(participant -> mailService.sendEventClosedNotification(participant, event));
        }

        return new SuccessfulOutDTO("Event has been closed");
    }
}
