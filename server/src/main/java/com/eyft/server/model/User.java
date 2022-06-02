package com.eyft.server.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Collection;
import java.util.List;

@Data
@Entity
@NoArgsConstructor
public class User {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    @Column(name = "login", unique = true)
    private String login;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "firstName")
    private String firstName;

    @Column(name = "lastName")
    private String lastName;

    @Column(name = "enabled")
    private boolean enabled;

    @Column(name = "isArrangerRoleRequested")
    private boolean arrangerRoleRequested;

    @Column(name =  "role")
    private Role role;

    //Created
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")
    private Collection<Event> createdEvents;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")
    private List<Comment> comments;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "receiver_id")
    private List<Message> receivedMessaged;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "sender_id")
    private List<Message> sentMessaged;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")
    private List<PropOrder> propOrders;

    //Participation
    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(name = "user_event_link",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "event_id")
    )
    private Collection<Event> events;

    @OneToOne
    @JoinColumn(name = "avatar_id", nullable = true)
    @JsonProperty("avatar")
    private Photo avatar;

    @JsonProperty("photos")
    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")
    private List<Photo> photos;

    @OneToOne(cascade = CascadeType.ALL)
    private Balance balance;

    public User(Long id, String login, String email, String password, String firstName, String lastName, boolean enabled, Role role) {
        this.id = id;
        this.login = login;
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.enabled = enabled;
        this.role = role;
    }
}
