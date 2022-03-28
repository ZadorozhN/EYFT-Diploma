package com.eyft.server.testdata.creator;

import com.eyft.server.dto.in.prop.PropOrderInDto;
import com.eyft.server.exception.UserDoesNotExistException;
import com.eyft.server.model.*;
import com.eyft.server.service.*;
import com.google.common.collect.Lists;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class HeroCreator {

    private final PropService propService;
    private final UserService userService;
    private final EventService eventService;
    private final MoneyHandler moneyHandler;
    private final CategoryService categoryService;

    public void createHero(String login, String password, String email,
                           String firstName, String lastName, String avatar, Role role){
        User hero = new User();
        hero.setLogin(login);
        hero.setPassword(password);
        hero.setEmail(email);
        hero.setFirstName(firstName);
        hero.setLastName(lastName);

        Photo frodoAvatar = new Photo();
        frodoAvatar.setUser(hero);
        frodoAvatar.setPath(avatar);
        hero.setPhotos(Lists.newArrayList(frodoAvatar));
        hero.setAvatar(frodoAvatar);

        userService.save(hero, role);

        log.info("{} has arrived", hero.getFirstName());
    }

    public void createCategory(String name, String description){
        Category category = new Category();
        category.setName(name);
        category.setDescription(description);
        categoryService.save(category);
    }

    public void createEvent(String login, String name, String description, String place, List<String> categories,
                            int daysBeforeStart, int daysBeforeEnd, String preview){
        User user = userService.findByLogin(login).orElseThrow(UserDoesNotExistException::new);

        List<Category> categoryList = categories.stream().map(categoryName -> {
            Optional<Category> categoryOptional = categoryService.findByName(categoryName);
            Category category;

            if(categoryOptional.isEmpty()){
                category = new Category();
                category.setName(categoryName);
                categoryService.save(category);
            } else {
                category = categoryOptional.get();
            }

            return category;
        }).collect(Collectors.toList());

        Event event = new Event();
        event.setUser(user);
        event.setPlace(place);
        event.setName(name);
        event.setDescription(description);
        event.setCategories(categoryList);
        event.setStartInstant(Instant.now().plus(daysBeforeStart, ChronoUnit.DAYS));
        event.setEndInstant(Instant.now().plus(daysBeforeEnd, ChronoUnit.DAYS));

        Photo previewPhoto = new Photo();
        previewPhoto.setEvent(event);
        previewPhoto.setPath(preview);
        event.setPhotos(Lists.newArrayList(previewPhoto));
        event.setPreview(previewPhoto);

        eventService.save(event);
    }

    public void createProp(String name, String description, Long cost, CostType costType, PropType propType){
        Prop prop = new Prop();
        prop.setName(name);
        prop.setDescription(description);
        prop.setCost(cost);
        prop.setCostType(costType);
        prop.setPropType(propType);

        propService.save(prop);

        log.info("{} has been found", prop.getName());
    }

    public void createPropOrder(String login, String propName, Long pieces, String date){
        Prop prop = propService.getPropByName(propName);
        PropOrderInDto propOrderInDto = new PropOrderInDto();
        propOrderInDto.setOrderedDays(Lists.newArrayList(date));
        propOrderInDto.setPieces(pieces);

        propService.orderPropSneaky(prop.getId(), login, propOrderInDto);
    }

    @SneakyThrows
    private Date parseDate(String date){
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd.MM.yyyy");
        return dateFormat.parse(date);
    }

    public void sendMoney(String login, long amount) {
        User user = userService.findByLogin(login).orElseThrow(UserDoesNotExistException::new);
        moneyHandler.handleRequest(user.getBalance().getAccountId(), amount);
    }
}
