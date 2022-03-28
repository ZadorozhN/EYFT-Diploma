package com.eyft.server.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.Instant;
import java.util.Date;

@Data
@Entity
@NoArgsConstructor
public class PropOrder {
    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @Column(name = "orderedDate")
    private Date orderedDate;

    @Column(name = "pieces")
    private Long pieces;

    @ManyToOne
    @JoinColumn(name = "prop_id")
    private Prop prop;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name="cost")
    private Long cost;

    @Column(name="comment")
    private String comment;

    @Column(name="answer")
    private String answer;

    @Column(name="status")
    private PropOrderStatus status;

    @Column(name = "creationTime")
    private Instant creationTime;

    public PropOrder(Date orderedDate, User user, Long cost){
        this.orderedDate = orderedDate;
        this.user = user;
        this.cost = cost;
    }

    public PropOrder(long pieces, User user, Long cost){
        this.pieces = pieces;
        this.user = user;
        this.cost = cost;
    }
}
