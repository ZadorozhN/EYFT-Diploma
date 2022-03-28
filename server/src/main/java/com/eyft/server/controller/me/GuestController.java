package com.eyft.server.controller.me;

import com.eyft.server.dto.in.event.EventQueryInDTO;
import com.eyft.server.dto.out.event.EventOutDTO;
import com.eyft.server.dto.out.event.EventsOutDTO;
import com.eyft.server.dto.out.user.UserOutDTO;
import com.eyft.server.exception.UserDoesNotExistException;
import com.eyft.server.model.Category;
import com.eyft.server.model.User;
import com.eyft.server.model.mapper.EventMapper;
import com.eyft.server.model.mapper.UserMapper;
import com.eyft.server.service.EventService;
import com.eyft.server.service.UserService;
import com.eyft.server.service.specification.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/guest")
public class GuestController {

    private final EventService eventService;
    private final UserService userService;
    private final EventMapper eventMapper;
    private final UserMapper userMapper;

    @GetMapping("/{login}")
    public UserOutDTO getUser(@PathVariable String login){
        User user = userService.findByLogin(login).orElseThrow(UserDoesNotExistException::new);

        return userMapper.fillUserOutDTO(user);
    }

    @GetMapping("/{login}/joined")
    public EventsOutDTO getJoinedEvents(@PathVariable String login){
        User user = userService.findByLogin(login).orElseThrow(UserDoesNotExistException::new);

        List<EventOutDTO> eventOutDTOS = user.getEvents().stream()
                .map(eventMapper::fillEventOutDTO)
                .collect(Collectors.toList());

        //TODO already finished events

        return new EventsOutDTO(eventOutDTOS);
    }

    @PostMapping("/{login}/joined")
    public EventsOutDTO queryJoinedEvents(@RequestBody EventQueryInDTO eventQueryInDTO,
                                          @PathVariable String login){
        User user = userService.findByLogin(login).orElseThrow(UserDoesNotExistException::new);

        String filterField = eventQueryInDTO.getFilterField();
        String filterValue = eventQueryInDTO.getFilterValue();
        Operation filterOperation = eventQueryInDTO.getFilterOperation();
        String sortField = eventQueryInDTO.getSortField();
        String sortOrder = eventQueryInDTO.getSortOrder();

        //TODO Optimize this approach
        return new EventsOutDTO(eventService.findAll(filterField, filterOperation, filterValue, sortField, sortOrder).stream()
                .filter(event -> user.getEvents().contains(event)
                        && (eventQueryInDTO.getEventState() == null
                        || event.getEventState().equals(eventQueryInDTO.getEventState()))
                        && (eventQueryInDTO.getCategoriesNames() == null
                        || eventQueryInDTO.getCategoriesNames().isEmpty()
                        || event.getCategories().stream()
                        .map(Category::getName)
                        .collect(Collectors.toList())
                        .containsAll(eventQueryInDTO.getCategoriesNames())))
                .map(eventMapper::fillEventOutDTO)
                .collect(Collectors.toList()));
    }

    @GetMapping("/{login}/arranged")
    public EventsOutDTO getArrangedEvents(@PathVariable String login){
        User user = userService.findByLogin(login).orElseThrow(UserDoesNotExistException::new);

        List<EventOutDTO> eventOutDTOS = user.getCreatedEvents().stream()
                .map(eventMapper::fillEventOutDTO)
                .collect(Collectors.toList());

        //TODO already finished events

        return new EventsOutDTO(eventOutDTOS);
    }

    @PostMapping("/{login}/arranged")
    public EventsOutDTO queryArrangedEvents(@RequestBody EventQueryInDTO eventQueryInDTO,
                                          @PathVariable String login){
        User user = userService.findByLogin(login).orElseThrow(UserDoesNotExistException::new);

        String filterField = eventQueryInDTO.getFilterField();
        String filterValue = eventQueryInDTO.getFilterValue();
        Operation filterOperation = eventQueryInDTO.getFilterOperation();
        String sortField = eventQueryInDTO.getSortField();
        String sortOrder = eventQueryInDTO.getSortOrder();

        //TODO Optimize this approach
        return new EventsOutDTO(eventService.findAll(filterField, filterOperation, filterValue, sortField, sortOrder).stream()
                .filter(event -> user.getCreatedEvents().contains(event)
                        && (eventQueryInDTO.getEventState() == null
                        || event.getEventState().equals(eventQueryInDTO.getEventState()))
                        && (eventQueryInDTO.getCategoriesNames() == null
                        || eventQueryInDTO.getCategoriesNames().isEmpty()
                        || event.getCategories().stream()
                        .map(Category::getName)
                        .collect(Collectors.toList())
                        .containsAll(eventQueryInDTO.getCategoriesNames())))
                .map(eventMapper::fillEventOutDTO)
                .collect(Collectors.toList()));
    }
}
