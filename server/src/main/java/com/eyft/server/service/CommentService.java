package com.eyft.server.service;

import com.eyft.server.model.Comment;

import java.util.List;

public interface CommentService {
    List<Comment> getEventComments(Long id);

    void save(Comment comment, Long eventId, String userLogin);
}
