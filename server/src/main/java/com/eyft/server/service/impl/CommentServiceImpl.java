package com.eyft.server.service.impl;

import com.eyft.server.exception.CustomInternalApplicationException;
import com.eyft.server.model.Comment;
import com.eyft.server.model.Event;
import com.eyft.server.model.User;
import com.eyft.server.repository.CommentRepository;
import com.eyft.server.service.CommentService;
import com.eyft.server.service.EventService;
import com.eyft.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final EventService eventService;
    private final UserService userService;

    @Override
    public List<Comment> getEventComments(Long id) {
        Event event = eventService.findById(id).orElseThrow(() ->
                new CustomInternalApplicationException("Event does not exist"));

        return commentRepository.findAllByEvent(event);
    }

    @Override
    @Transactional
    public void save(Comment comment, Long eventId, String userLogin) {
        Event event = eventService.findById(eventId).orElseThrow(() ->
                new CustomInternalApplicationException("Event does not exist"));

        User user = userService.findByLogin(userLogin).orElseThrow(() ->
                new CustomInternalApplicationException("User does not exist"));

        comment.setEvent(event);
        comment.setUser(user);
        comment.setCreationTime(Instant.now());

        commentRepository.save(comment);
    }
}
