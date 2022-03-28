package com.eyft.server.repository;

import com.eyft.server.model.Comment;
import com.eyft.server.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findAllByEvent(Event event);
}
