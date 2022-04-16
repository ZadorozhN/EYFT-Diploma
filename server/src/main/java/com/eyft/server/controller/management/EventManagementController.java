package com.eyft.server.controller.management;

import com.eyft.server.dto.in.event.EventManagementEventChangingInDTO;
import com.eyft.server.dto.in.event.EventQueryInDTO;
import com.eyft.server.dto.out.SuccessfulOutDTO;
import com.eyft.server.dto.out.event.EventManagementEventOutDTO;
import com.eyft.server.dto.out.event.EventManagementEventsOutDTO;
import com.eyft.server.dto.out.event.EventsOutDTO;
import com.eyft.server.exception.EventDoesNotExistException;
import com.eyft.server.model.Category;
import com.eyft.server.model.Event;
import com.eyft.server.model.User;
import com.eyft.server.model.mapper.EventMapper;
import com.eyft.server.service.CategoryService;
import com.eyft.server.service.EventService;
import com.eyft.server.service.UserService;
import com.eyft.server.service.specification.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/event-management")
public class EventManagementController {

    private final EventService eventService;
    private final CategoryService categoryService;
    private final UserService userService;
    private final EventMapper eventMapper;

    @GetMapping("/events")
    public EventManagementEventsOutDTO getEvents(){
        List<EventManagementEventOutDTO> eventOutDTOS = eventService.findAll()
                .stream()
                .map(eventMapper::fillEventManagementEventOutDTO)
                .collect(Collectors.toList());

        return new EventManagementEventsOutDTO(eventOutDTOS);
    }

    @GetMapping("/events/{id}")
    public EventManagementEventOutDTO getEvent(@PathVariable Long id){
        Event event = eventService.findById(id).orElseThrow(EventDoesNotExistException::new);

        return eventMapper.fillEventManagementEventOutDTO(event);
    }

    @DeleteMapping("/events/{id}")
    public SuccessfulOutDTO deleteEvent(@PathVariable Long id){
        Event event = eventService.findById(id).orElseThrow(EventDoesNotExistException::new);

        event.getCategories().forEach(category -> {
            category.getEvents().remove(event);
            categoryService.save(category);
        });

        event.getUsers().forEach(user -> {
            user.getEvents().remove(event);
            userService.save(user);
        });

        eventService.delete(event);

        return new SuccessfulOutDTO("Event was deleted");
    }

    @PutMapping("/events/{id}")
    public SuccessfulOutDTO changeEvent(@RequestBody EventManagementEventChangingInDTO eventManagementEventChangingInDTO) {
        Event event = eventService.findById(eventManagementEventChangingInDTO.getId())
                .orElseThrow(EventDoesNotExistException::new);

        eventMapper.fillFromInDTO(event, eventManagementEventChangingInDTO);

        eventService.save(event);

        return new SuccessfulOutDTO("Event was changed");
    }

    @PostMapping("/events/filter")
    public EventManagementEventsOutDTO queryJoinedEvents(@RequestBody EventQueryInDTO eventQueryInDTO){
        String filterField = eventQueryInDTO.getFilterField();
        String filterValue = eventQueryInDTO.getFilterValue();
        Operation filterOperation = eventQueryInDTO.getFilterOperation();
        String sortField = eventQueryInDTO.getSortField();
        String sortOrder = eventQueryInDTO.getSortOrder();

        //TODO Optimize this approach
        return new EventManagementEventsOutDTO(eventService
                .findAll(filterField, filterOperation, filterValue, sortField, sortOrder).stream()
                .filter(event -> (eventQueryInDTO.getEventState() == null
                        || event.getEventState().equals(eventQueryInDTO.getEventState()))
                        && (eventQueryInDTO.getCategoriesNames() == null
                        || eventQueryInDTO.getCategoriesNames().isEmpty()
                        || event.getCategories().stream()
                        .map(Category::getName)
                        .collect(Collectors.toList())
                        .containsAll(eventQueryInDTO.getCategoriesNames())))
                .map(eventMapper::fillEventManagementEventOutDTO)
                .collect(Collectors.toList()));
    }
}
