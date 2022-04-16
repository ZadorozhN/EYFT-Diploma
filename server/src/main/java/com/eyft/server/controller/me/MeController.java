package com.eyft.server.controller.me;

import com.eyft.server.controller.tokenhandler.TokenHandler;
import com.eyft.server.dto.in.event.EventQueryInDTO;
import com.eyft.server.dto.in.photo.PhotoInDTO;
import com.eyft.server.dto.in.user.ChangePasswordInDto;
import com.eyft.server.dto.in.user.ChangePersonalDataInDTO;
import com.eyft.server.dto.out.SuccessfulOutDTO;
import com.eyft.server.dto.out.balance.BalanceOutDto;
import com.eyft.server.dto.out.event.EventOutDTO;
import com.eyft.server.dto.out.event.EventsOutDTO;
import com.eyft.server.dto.out.user.UserOutDTO;
import com.eyft.server.exception.*;
import com.eyft.server.model.*;
import com.eyft.server.model.mapper.BalanceMapper;
import com.eyft.server.model.mapper.EventMapper;
import com.eyft.server.model.mapper.UserMapper;
import com.eyft.server.service.EventService;
import com.eyft.server.service.PhotoService;
import com.eyft.server.service.UserService;
import com.eyft.server.service.specification.Operation;
import com.eyft.server.util.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/me")
public class MeController {

    private final BalanceMapper balanceMapper;
    private final TokenHandler tokenHandler;
    private final EventService eventService;
    private final PhotoService photoService;
    private final UserService userService;
    private final EventMapper eventMapper;
    private final UserMapper userMapper;
    private final JwtUtil jwtUtil;

    @GetMapping
    public UserOutDTO getMe(@RequestHeader(name="Authorization") String token){
        User user = getUser(token);

        return userMapper.fillUserOutDTO(user);
    }

    @PutMapping("/password")
    public SuccessfulOutDTO changePassword(@RequestHeader(name="Authorization") String token,
                                           @RequestBody ChangePasswordInDto changePasswordInDto){
        User user = getUser(token);

        if(!userService.checkPassword(user, changePasswordInDto.getOldPassword())
            || !changePasswordInDto.getNewPassword().equals(changePasswordInDto.getNewPasswordRepeat())){
            throw new DifferentPasswordsException();
        }

        userService.setPassword(user, changePasswordInDto.getNewPassword());

        return new SuccessfulOutDTO("Password was changed");
    }

    @GetMapping("/joined")
    public EventsOutDTO getJoinedEvents(@RequestHeader(name="Authorization") String token){
        User user = getUser(token);

        List<EventOutDTO> eventOutDTOS = user.getEvents().stream()
                .map(eventMapper::fillEventOutDTO)
                .collect(Collectors.toList());

        //TODO already finished events

        return new EventsOutDTO(eventOutDTOS);
    }

    @PostMapping("/joined")
    public EventsOutDTO queryJoinedEvents(@RequestBody EventQueryInDTO eventQueryInDTO,
                                          @RequestHeader(name="Authorization") String token){
        User user = getUser(token);

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

    @GetMapping("/to-join")
    public EventsOutDTO getEventsToJoin(@RequestHeader(name="Authorization") String token){
        User user = getUser(token);

        List<Event> events = eventService.findAllRelevant();

        events.removeAll(user.getEvents());

        List<EventOutDTO> eventOutDTOS = events.stream()
                .filter(this::canBeJoined)
                .map(eventMapper::fillEventOutDTO)
                .collect(Collectors.toList());

        return new EventsOutDTO(eventOutDTOS);
    }

    @PutMapping("/avatar")
    public SuccessfulOutDTO setAvatar(@RequestHeader(name="Authorization") String token,
                                       @RequestBody PhotoInDTO photoInDTO){
        Photo photo = photoService.findById(photoInDTO.getId()).orElseThrow(PhotoDoesNotExistException::new);
        User user = tokenHandler.getUser(token);

        userService.setAvatar(user, photo);

        return new SuccessfulOutDTO("Preview was set");
    }

    @PostMapping("/to-join")
    public EventsOutDTO queryEventsToJoin(@RequestBody EventQueryInDTO eventQueryInDTO,
                                          @RequestHeader(name="Authorization") String token){
        User user = getUser(token);

        String filterField = eventQueryInDTO.getFilterField();
        String filterValue = eventQueryInDTO.getFilterValue();
        Operation filterOperation = eventQueryInDTO.getFilterOperation();
        String sortField = eventQueryInDTO.getSortField();
        String sortOrder = eventQueryInDTO.getSortOrder();

        return new EventsOutDTO(eventService.findAll(filterField, filterOperation, filterValue, sortField, sortOrder).stream()
                .filter(event -> !user.getEvents().contains(event)
                        && (eventQueryInDTO.getEventState() == null
                        || event.getEventState().equals(eventQueryInDTO.getEventState()))
                        && (eventQueryInDTO.getCategoriesNames() == null
                        || eventQueryInDTO.getCategoriesNames().isEmpty()
                        || event.getCategories().stream()
                        .map(Category::getName)
                        .collect(Collectors.toList())
                        .containsAll(eventQueryInDTO.getCategoriesNames())))
                .filter(this::canBeJoined)
                .map(eventMapper::fillEventOutDTO)
                .collect(Collectors.toList()));
    }

    @PutMapping("/becomeArranger")
    public SuccessfulOutDTO setAvatar(@RequestHeader(name="Authorization") String token){
        User user = tokenHandler.getUser(token);

        if(!user.getRole().equals(Role.USER) || user.isArrangerRoleRequested()){
            throw new UserHasAlreadyObtainedArrangerRole();
        }

        userService.becomeArranger(user);

        return new SuccessfulOutDTO("Request to become an arranger has been sent");
    }

    private User getUser(String token){
        token = tokenHandler.handleToken(token);

        String login = jwtUtil.getLogin(token);

        return userService.findByLogin(login)
                .orElseThrow(UserDoesNotExistException::new);
    }

    @GetMapping("/personalData")
    public UserOutDTO getPersonalData(@RequestHeader(name="Authorization") String token){
        User user = tokenHandler.getUser(token);

        return userMapper.fillUserOutDTO(user);
    }

    @PutMapping("/personalData")
    public SuccessfulOutDTO changePersonalData(@RequestHeader(name="Authorization") String token,
                                               @RequestBody ChangePersonalDataInDTO changePersonalDataInDTO){
        User user = tokenHandler.getUser(token);

        userMapper.fillFromInDTO(user, changePersonalDataInDTO);

        //TODO email check

        userService.save(user);

        return new SuccessfulOutDTO("Personal data was changed");
    }

    @DeleteMapping("/photos")
    public SuccessfulOutDTO deletePhoto(@RequestHeader(name="Authorization") String token,
                                        @RequestBody PhotoInDTO photoInDTO){
        User user = tokenHandler.getUser(token);
        Photo photo = photoService.findById(photoInDTO.getId()).orElseThrow(PhotoDoesNotExistException::new);

        if(!user.getPhotos().contains(photo)){
            throw new PhotoDoesNotBelongToEventException();
        }

        if (user.getAvatar() != null && user.getAvatar().equals(photo)) {
            user.setAvatar(null);
        }

        user.getPhotos().remove(photo);
        userService.save(user);
        photoService.remove(photo);

        return new SuccessfulOutDTO("Photo was deleted");
    }

    @GetMapping("/balance")
    public BalanceOutDto getBalance(Authentication authentication){
        User user = userService.findByLogin(authentication.getPrincipal().toString())
                .orElseThrow(UserDoesNotExistException::new);

        Balance balance = user.getBalance();

        return balanceMapper.fillBalanceOutDto(balance);
    }

    private boolean canBeJoined(Event event){
        return event.getEventState() == EventState.WAITING_FOR_START
                || event.getEventState() == EventState.STARTED;
    }
}
