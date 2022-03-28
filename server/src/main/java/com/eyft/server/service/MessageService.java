package com.eyft.server.service;

import com.eyft.server.model.Message;
import com.eyft.server.model.User;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface MessageService {
    Message save(Message message);

    Message save(User receiver, User sender, String text);

    List<Message> getAllBySender(User sender);

    List<Message> getAllBySenderAndReceiver(User sender, User receiver);

    List<Message> getAllByUser(User user);
}
