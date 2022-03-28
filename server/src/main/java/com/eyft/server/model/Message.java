package com.eyft.server.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.Instant;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Message {

    public Message(String text, User sender, User receiver, Instant creationTime) {
        this.text = text;
        this.sender = sender;
        this.receiver = receiver;
        this.creationTime = creationTime;
    }

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @Column(name = "text")
    private String text;

    @ManyToOne
    @JoinColumn(name = "sender_id")
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id")
    private User receiver;

    @Column(name = "creationTime")
    private Instant creationTime;

    @Override
    public String toString(){
        return String.format("{%s} Sender: %s - Receiver: %s", text, sender.getId(), receiver.getId());
    }
}
