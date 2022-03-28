package com.eyft.server.service.impl;

import com.eyft.server.model.Message;
import com.eyft.server.model.User;
import com.eyft.server.repository.MessageRepository;
import com.eyft.server.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;

    @Override
    @Transactional
    public Message save(Message message) {
        return messageRepository.save(message);
    }

    @Override
    @Transactional
    public Message save(User receiver, User sender, String text) {
        Message message = new Message(text, sender, receiver, Instant.now());
        return messageRepository.save(message);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Message> getAllBySender(User sender) {
        return messageRepository.getAllBySender(sender);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Message> getAllBySenderAndReceiver(User sender, User receiver) {
        return messageRepository.getAllBySenderAndReceiver(sender, receiver);
    }

    @Override
    public List<Message> getAllByUser(User user) {
        return messageRepository.getAllBySenderOrReceiver(user, user);
    }
}
