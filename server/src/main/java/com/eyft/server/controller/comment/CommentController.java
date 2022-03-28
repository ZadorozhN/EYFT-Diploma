package com.eyft.server.controller.comment;

import com.eyft.server.dto.in.comment.CommentInDto;
import com.eyft.server.dto.out.SuccessfulOutDTO;
import com.eyft.server.dto.out.comment.CommentOutDto;
import com.eyft.server.dto.out.comment.CommentsOutDto;
import com.eyft.server.model.Comment;
import com.eyft.server.model.mapper.CommentMapper;
import com.eyft.server.service.CommentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/comments")
public class CommentController {

    private final CommentService commentService;
    private final CommentMapper commentMapper;
    private final ObjectMapper objectMapper;

    @GetMapping("/event/{id}")
    public CommentsOutDto getEventComments(@PathVariable Long id){
        List<Comment> comments = commentService.getEventComments(id);

        List<CommentOutDto> commentOutDtos = comments.stream()
                .map(commentMapper::fillCommentOutDto)
                .collect(Collectors.toList());

        return new CommentsOutDto(commentOutDtos);
    }

    @PostMapping("/event/{id}")
    public SuccessfulOutDTO postEventComment(@PathVariable Long id, @RequestBody CommentInDto commentInDto,
                                             Authentication authentication){
        Comment comment = objectMapper.convertValue(commentInDto, Comment.class);

        commentService.save(comment, id, authentication.getPrincipal().toString());

        return new SuccessfulOutDTO("Comment was published");
    }
}
