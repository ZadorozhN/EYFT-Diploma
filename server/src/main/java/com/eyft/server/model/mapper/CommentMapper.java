package com.eyft.server.model.mapper;

import com.eyft.server.dto.in.comment.CommentInDto;
import com.eyft.server.dto.out.comment.CommentOutDto;
import com.eyft.server.model.Comment;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CommentMapper {
    private final EventMapper eventMapper;
    private final UserMapper userMapper;

    public CommentOutDto fillCommentOutDto(Comment comment){
        return new CommentOutDto(comment.getId(),
                comment.getText(),
                eventMapper.fillEventOutDTO(comment.getEvent()),
                userMapper.fillUserOutDTO(comment.getUser()),
                comment.getCreationTime());
    }
}
