package com.eyft.server.repository;

import com.eyft.server.model.Message;
import com.eyft.server.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> getAllBySender(User sender);

    List<Message> getAllBySenderAndReceiver(User sender, User receiver);

    List<Message> getAllBySenderOrReceiver(User sender, User receiver);
}
