package com.eyft.server.controller.me;

import com.eyft.server.controller.tokenhandler.TokenHandler;
import com.eyft.server.dto.in.event.ChangeEventInDto;
import com.eyft.server.dto.in.event.EventCreatingInDTO;
import com.eyft.server.dto.in.event.EventQueryInDTO;
import com.eyft.server.dto.in.photo.PhotoInDTO;
import com.eyft.server.dto.out.SuccessfulOutDTO;
import com.eyft.server.dto.out.event.EventOutDTO;
import com.eyft.server.dto.out.event.EventsOutDTO;
import com.eyft.server.dto.out.prop.PropOrderOutDto;
import com.eyft.server.dto.out.prop.PropOrdersOutDto;
import com.eyft.server.exception.CustomInternalApplicationException;
import com.eyft.server.exception.EventDoesNotExistException;
import com.eyft.server.exception.NotEventArrangerException;
import com.eyft.server.exception.PhotoDoesNotExistException;
import com.eyft.server.model.*;
import com.eyft.server.model.mapper.EventMapper;
import com.eyft.server.model.mapper.PropMapper;
import com.eyft.server.repository.PropOrderRepository;
import com.eyft.server.service.EventService;
import com.eyft.server.service.PhotoService;
import com.eyft.server.service.PropService;
import com.eyft.server.service.UserService;
import com.eyft.server.service.specification.Operation;
import com.eyft.server.util.EventUtil;
import com.eyft.server.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/arranger")
public class ArrangerController {
    private final TokenHandler tokenHandler;
    private final EventService eventService;
    private final PhotoService photoService;
    private final UserService userService;
    private final EventMapper eventMapper;
    private final PropService propService;
    private final PropMapper propMapper;
    private final EventUtil eventUtil;
    private final JwtUtil jwtUtil;

    @GetMapping("/arranged")
    public EventsOutDTO getArrangedEvents(@RequestHeader(name="Authorization") String token){
        User user = tokenHandler.getUser(token);

        List<EventOutDTO> eventOutDTOS = user.getCreatedEvents().stream()
                .map(eventMapper::fillEventOutDTO)
                .collect(Collectors.toList());

        //TODO already finished events

        return new EventsOutDTO(eventOutDTOS);
    }

    @GetMapping("/arranged/{id}")
    public EventOutDTO getArrangedEvent(@PathVariable Long id, @RequestHeader(name="Authorization") String token){
        User user = tokenHandler.getUser(token);
        Event event = eventService.findById(id).orElseThrow(EventDoesNotExistException::new);

        if(!event.getUser().equals(user) && !user.getRole().equals(Role.ADMIN)){
            throw new NotEventArrangerException();
        }

        //TODO already finished events

        return eventMapper.fillEventOutDTO(event);
    }

    @PutMapping("/arranged/{id}")
    @Transactional
    public SuccessfulOutDTO changeArrangedEvent(@PathVariable Long id, @RequestHeader(name="Authorization") String token,
                                           @RequestBody ChangeEventInDto changeEventInDto){
        User user = tokenHandler.getUser(token);
        Event event = eventService.findById(id).orElseThrow(EventDoesNotExistException::new);

        if(!event.getUser().equals(user) && !user.getRole().equals(Role.ADMIN)){
            throw new NotEventArrangerException();
        }

        eventMapper.fillFromInDTO(event, changeEventInDto);

        eventService.save(event);

        //TODO already finished events

        return new SuccessfulOutDTO("Event was changed");
    }

    @PostMapping("/arranged")
    @Transactional
    public EventsOutDTO queryArrangedEvents(@RequestBody EventQueryInDTO eventQueryInDTO,
                                            @RequestHeader(name="Authorization") String token){
        User user = tokenHandler.getUser(token);

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

    @PutMapping("/arranged/{id}/preview")
    @Transactional
    public SuccessfulOutDTO setPreview(@PathVariable Long id, @RequestHeader(name="Authorization") String token,
                                       @RequestBody PhotoInDTO photoInDTO){
        Photo photo = photoService.findById(photoInDTO.getId()).orElseThrow(PhotoDoesNotExistException::new);
        Event event = eventService.findById(id).orElseThrow(EventDoesNotExistException::new);
        User user = tokenHandler.getUser(token);

        if (!event.getUser().equals(user) && !user.getRole().equals(Role.ADMIN)){
            throw new NotEventArrangerException();
        }

        eventService.setPreview(event, photo);

        return new SuccessfulOutDTO("Preview was set");
    }

    @DeleteMapping("/arranged/{id}/photos/{photoId}")
    @Transactional
    public SuccessfulOutDTO deletePhoto(@PathVariable Long id, @RequestHeader(name="Authorization") String token,
                                        @PathVariable Long photoId){
        Photo photo = photoService.findById(photoId).orElseThrow(PhotoDoesNotExistException::new);
        Event event = eventService.findById(id).orElseThrow(EventDoesNotExistException::new);
        User user = tokenHandler.getUser(token);

        if (!event.getUser().equals(user) && !user.getRole().equals(Role.ADMIN)){
            throw new NotEventArrangerException();
        }

        event.getPhotos().remove(photo);
        if(event.getPreview().equals(photo)){
            event.setPreview(null);
        }

        eventService.save(event);
        photoService.remove(photo);

        return new SuccessfulOutDTO("Preview was set");
    }

    @PostMapping("/arrangement")
    @Transactional
    public SuccessfulOutDTO createEvent(@RequestBody EventCreatingInDTO eventCreatingInDTO,
                                        @RequestHeader(name="Authorization") String token) {
        User user = tokenHandler.getUser(token);

        Event event = new Event();
        eventMapper.fillFromInDTO(event, eventCreatingInDTO);
        eventUtil.checkNewEvent(event);

        event.setUser(user);

        //TODO should i add to user.getCreatedEvents
        eventService.save(event);

        return new SuccessfulOutDTO("Event was created");
    }

    @GetMapping("/props/ordered")
    public PropOrdersOutDto getAllMyOrders(Authentication authentication){
        String login = authentication.getPrincipal().toString();
        User user = userService.findByLogin(login)
                .orElseThrow(() -> new CustomInternalApplicationException("User does not exist"));

        List<PropOrderOutDto> propOrdersDtoList = propService.getAllPropOrdersByUser(user)
                .stream()
                .map(propMapper::fillPropOrderOutDto)
                .collect(Collectors.toList());

        return new PropOrdersOutDto(propOrdersDtoList);
    }

    @DeleteMapping("/props/ordered/{id}")
    public SuccessfulOutDTO removeOrder(@PathVariable Long id, Authentication authentication){
        String login = authentication.getPrincipal().toString();
        User user = userService.findByLogin(login)
                .orElseThrow(() -> new CustomInternalApplicationException("User does not exist"));

        PropOrder propOrder = propService.getPropOrderById(id);

        if(!user.equals(propOrder.getUser())) {
            throw new CustomInternalApplicationException("You aren't an owner of the order");
        }

        propService.removePropOrder(propOrder);

        return new SuccessfulOutDTO("Order was canceled");
    }
}
