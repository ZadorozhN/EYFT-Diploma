package com.eyft.server.service;

import com.eyft.server.model.Event;
import com.eyft.server.model.Photo;
import com.eyft.server.model.Role;
import com.eyft.server.model.User;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface UserService {
    List<User> findAll();

    Optional<User> findById(Long id);

    Optional<User> findByLogin(String login);

    void setAvatar(User user, Photo photo);

    void deleteById(Long id);

    void save(User user);

    void save(User user, Role role);

    void becomeArranger(User user);

    boolean checkPassword(User user, String password);

    void setPassword(User user, String password);

    String recoverPassword(User user);

    void joinEvent(User user, Event event);

    void leaveEvent(User user, Event event);
}
