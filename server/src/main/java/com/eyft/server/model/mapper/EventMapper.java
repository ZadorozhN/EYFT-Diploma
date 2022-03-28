package com.eyft.server.model.mapper;

import com.eyft.server.dto.in.event.ChangeEventInDto;
import com.eyft.server.dto.in.event.EventCreatingInDTO;
import com.eyft.server.dto.in.event.EventManagementEventChangingInDTO;
import com.eyft.server.dto.out.event.EventManagementEventOutDTO;
import com.eyft.server.dto.out.event.EventOutDTO;
import com.eyft.server.exception.CategoryDoesNotExistException;
import com.eyft.server.exception.UserDoesNotExistException;
import com.eyft.server.model.Category;
import com.eyft.server.model.Event;
import com.eyft.server.model.User;
import com.eyft.server.service.CategoryService;
import com.eyft.server.service.UserService;
import com.google.common.base.Strings;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class EventMapper {
    private final UserService userService;
    private final CategoryService categoryService;
    private final PhotoMapper photoMapper;

    public EventManagementEventOutDTO fillEventManagementEventOutDTO(Event event){
        return new EventManagementEventOutDTO(
                event.getId(),
                event.getName(),
                event.getDescription(),
                event.getPlace(),
                event.getUser() != null ?event.getUser().getLogin() : null,
                event.getCategories().stream().map(Category::getName).collect(Collectors.toList()),
                event.getStartInstant(),
                event.getEndInstant(),
                event.getEventState()
        );
    }

    public EventOutDTO fillEventOutDTO(Event event){
        return new EventOutDTO(
                event.getId(),
                event.getName(),
                event.getDescription(),
                event.getPlace(),
                event.getUser() != null ? event.getUser().getLogin() : null,
                event.getCategories().stream().map(Category::getName).collect(Collectors.toList()),
                event.getStartInstant(),
                event.getEndInstant(),
                event.getEventState(),
                event.getPhotos().stream().map(photoMapper::fillPhotoOutDTO).collect(Collectors.toList()),
                event.getPreview() != null ? photoMapper.fillPhotoOutDTO(event.getPreview()) : null
        );
    }

    public void fillFromInDTO(Event event, EventManagementEventChangingInDTO eventManagementEventChangingInDTO){
        if(!Strings.isNullOrEmpty(eventManagementEventChangingInDTO.getName())){
            event.setName(eventManagementEventChangingInDTO.getName());
        }

        if(!Strings.isNullOrEmpty(eventManagementEventChangingInDTO.getDescription())){
            event.setDescription(eventManagementEventChangingInDTO.getDescription());
        }

        if(!Strings.isNullOrEmpty(eventManagementEventChangingInDTO.getPlace())){
            event.setPlace(eventManagementEventChangingInDTO.getPlace());
        }

        if(eventManagementEventChangingInDTO.getStartInstant() != null){
            event.setStartInstant(eventManagementEventChangingInDTO.getStartInstant());
        }

        if(eventManagementEventChangingInDTO.getEndInstant() != null){
            event.setEndInstant(eventManagementEventChangingInDTO.getEndInstant());
        }

        if(eventManagementEventChangingInDTO.getEventState() != null){
            event.setEventState(eventManagementEventChangingInDTO.getEventState());
        }

        if(!Strings.isNullOrEmpty(eventManagementEventChangingInDTO.getUserLogin())){
            User eventOwner = userService.findByLogin(eventManagementEventChangingInDTO.getUserLogin())
                    .orElseThrow(UserDoesNotExistException::new);
            event.setUser(eventOwner);
        }

        if(!eventManagementEventChangingInDTO.getCategoriesNames().isEmpty()){
            Collection<Category> categories = eventManagementEventChangingInDTO.getCategoriesNames().stream()
                            .map(categoryName -> categoryService
                                    .findByName(categoryName)
                                    .orElseThrow(CategoryDoesNotExistException  ::new))
                    .collect(Collectors.toList());

            event.setCategories(categories);
        }
    }

    public void fillFromInDTO(Event event, ChangeEventInDto changeEventInDto){
        if(!Strings.isNullOrEmpty(changeEventInDto.getName())){
            event.setName(changeEventInDto.getName());
        }

        if(!Strings.isNullOrEmpty(changeEventInDto.getDescription())){
            event.setDescription(changeEventInDto.getDescription());
        }

        if(!Strings.isNullOrEmpty(changeEventInDto.getPlace())){
            event.setPlace(changeEventInDto.getPlace());
        }

        if(changeEventInDto.getStartInstant() != null){
            event.setStartInstant(changeEventInDto.getStartInstant());
        }

        if(changeEventInDto.getEndInstant() != null){
            event.setEndInstant(changeEventInDto.getEndInstant());
        }

        if(!changeEventInDto.getCategoriesNames().isEmpty()){
            Collection<Category> categories = changeEventInDto.getCategoriesNames().stream()
                            .map(categoryName -> categoryService
                                    .findByName(categoryName)
                                    .orElseThrow(CategoryDoesNotExistException  ::new))
                    .collect(Collectors.toList());

            event.setCategories(categories);
        }
    }

    public void fillFromInDTO(Event event, EventCreatingInDTO eventCreatingInDTO){
        if(!Strings.isNullOrEmpty(eventCreatingInDTO.getName())){
            event.setName(eventCreatingInDTO.getName());
        }

        if(!Strings.isNullOrEmpty(eventCreatingInDTO.getDescription())){
            event.setDescription(eventCreatingInDTO.getDescription());
        }

        if(!Strings.isNullOrEmpty(eventCreatingInDTO.getPlace())){
            event.setPlace(eventCreatingInDTO.getPlace());
        }

        if(eventCreatingInDTO.getStartInstant() != null){
            event.setStartInstant(eventCreatingInDTO.getStartInstant());
        }

        if(eventCreatingInDTO.getEndInstant() != null){
            event.setEndInstant(eventCreatingInDTO.getEndInstant());
        }

        if(!eventCreatingInDTO.getCategoriesNames().isEmpty()){
            Collection<Category> categories = eventCreatingInDTO.getCategoriesNames().stream()
                    .map(categoryName -> categoryService
                            .findByName(categoryName)
                            .orElseThrow(CategoryDoesNotExistException::new))
                    .collect(Collectors.toList());

            event.setCategories(categories);
        }
    }
}
