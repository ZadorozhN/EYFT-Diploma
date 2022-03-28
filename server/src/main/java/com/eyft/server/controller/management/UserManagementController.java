package com.eyft.server.controller.management;

import com.eyft.server.dto.in.user.UserArrangerRequestAnswerInDto;
import com.eyft.server.dto.in.user.UserManagementUserChangingInDTO;
import com.eyft.server.dto.out.SuccessfulOutDTO;
import com.eyft.server.dto.out.event.EventManagementEventOutDTO;
import com.eyft.server.dto.out.event.EventManagementEventsOutDTO;
import com.eyft.server.dto.out.user.UserManagementUserOutDTO;
import com.eyft.server.dto.out.user.UserManagementUsersOutDTO;
import com.eyft.server.exception.UserDoesNotExistException;
import com.eyft.server.model.Role;
import com.eyft.server.model.User;
import com.eyft.server.model.mapper.EventMapper;
import com.eyft.server.model.mapper.UserMapper;
import com.eyft.server.service.EventService;
import com.eyft.server.service.PhotoService;
import com.eyft.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user-management")
public class UserManagementController {

    private final PhotoService photoService;
    private final EventService eventService;
    private final UserService userService;
    private final UserMapper userMapper;
    private final EventMapper eventMapper;

    @GetMapping("/users")
    @Transactional
    public UserManagementUsersOutDTO getUsers(){
        List<UserManagementUserOutDTO> usersOutDTO = userService.findAll()
                .stream()
                .map(userMapper::fillUserManagementUserOutDTO)
                .collect(Collectors.toList());

        return new UserManagementUsersOutDTO(usersOutDTO);
    }

    @GetMapping("/users/{id}")
    @Transactional
    public UserManagementUserOutDTO getUser(@PathVariable Long id){
        User user = userService.findById(id).orElseThrow(UserDoesNotExistException::new);

        return userMapper.fillUserManagementUserOutDTO(user);
    }


    @PutMapping("/users/{id}/arrangerRequest")
    @Transactional
    public SuccessfulOutDTO putArrangerRequest(@PathVariable Long id,
                                                       @RequestBody UserArrangerRequestAnswerInDto userArrangerRequestAnswerInDto){
        User user = userService.findById(id).orElseThrow(UserDoesNotExistException::new);

        if(userArrangerRequestAnswerInDto.isAccepted()){
            user.setArrangerRoleRequested(false);
            user.setRole(Role.ARRANGER);
            userService.save(user);

            return new SuccessfulOutDTO("Request has been accepted");
        }

        user.setArrangerRoleRequested(false);
        userService.save(user);

        return new SuccessfulOutDTO("Request has been declined");
    }

    @GetMapping("/users/{id}/events")
    @Transactional
    public EventManagementEventsOutDTO getUserEvents(@PathVariable Long id){
        List<EventManagementEventOutDTO> eventOutDTOS = userService.findById(id)
                .orElseThrow(UserDoesNotExistException::new)
                .getCreatedEvents().stream()
                .map(eventMapper::fillEventManagementEventOutDTO)
                .collect(Collectors.toList());

        return new EventManagementEventsOutDTO(eventOutDTOS);
    }

    @GetMapping("/users/{id}/joins")
    @Transactional
    public EventManagementEventsOutDTO getUserJoins(@PathVariable Long id){
        List<EventManagementEventOutDTO> eventOutDTOS = userService.findById(id)
                .orElseThrow(UserDoesNotExistException::new)
                .getEvents().stream()
                .map(eventMapper::fillEventManagementEventOutDTO)
                .collect(Collectors.toList());

        return new EventManagementEventsOutDTO(eventOutDTOS);
    }

    @DeleteMapping("/users/{id}")
    @Transactional
    public SuccessfulOutDTO deleteUser(@PathVariable Long id){
        User user = userService.findById(id).orElseThrow(UserDoesNotExistException::new);

        user.getEvents().clear();
        user.getCreatedEvents().clear();
        //TODO if invalid email an exception will rose here
        userService.save(user);

        userService.deleteById(id);

        return new SuccessfulOutDTO("User was deleted");
    }

    @PutMapping("/users/{id}")
    @Transactional
    public SuccessfulOutDTO changeUser(@RequestBody UserManagementUserChangingInDTO userManagementUserChangingInDTO) {
        User user = userService.findById(userManagementUserChangingInDTO.getId())
                .orElseThrow(UserDoesNotExistException::new);

        userMapper.fillFromInDTO(user, userManagementUserChangingInDTO);

        userService.save(user);

        return new SuccessfulOutDTO("User was changed");
    }
}
