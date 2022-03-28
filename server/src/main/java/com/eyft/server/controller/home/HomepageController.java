package com.eyft.server.controller.home;

import com.eyft.server.dto.in.event.EventQueryInDTO;
import com.eyft.server.dto.out.event.EventOutDTO;
import com.eyft.server.dto.out.event.EventsOutDTO;
import com.eyft.server.model.Category;
import com.eyft.server.model.mapper.EventMapper;
import com.eyft.server.service.EventService;
import com.eyft.server.service.specification.Operation;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@AllArgsConstructor
@RequestMapping("/homepage")
public class HomepageController {

    private final EventService eventService;
    private final EventMapper eventMapper;

    @GetMapping("/events")
    public EventsOutDTO getHomepageEvents() {
        List<EventOutDTO> events = eventService.findAll()
                .stream().map(eventMapper::fillEventOutDTO)
                .collect(Collectors.toList());

        return new EventsOutDTO(events);
    }

    @PostMapping("/events")
    public EventsOutDTO getFilteredHomepageEvents(@RequestBody EventQueryInDTO eventQueryInDTO) {

        String filterField = eventQueryInDTO.getFilterField();
        String filterValue = eventQueryInDTO.getFilterValue();
        Operation filterOperation = eventQueryInDTO.getFilterOperation();
        String sortField = eventQueryInDTO.getSortField();
        String sortOrder = eventQueryInDTO.getSortOrder();

        //TODO Optimize this approach
        return new EventsOutDTO(eventService.findAll(filterField, filterOperation, filterValue, sortField, sortOrder).stream()
                .filter(event -> eventQueryInDTO.getEventState() == null
                        || event.getEventState().equals(eventQueryInDTO.getEventState()))
                .filter(event -> event.getCategories().stream().map(Category::getName)
                        .collect(Collectors.toList()).containsAll(eventQueryInDTO.getCategoriesNames()))
                .map(eventMapper::fillEventOutDTO)
                .collect(Collectors.toList()));
    }
}
