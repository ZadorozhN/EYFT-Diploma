package com.eyft.server.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.Instant;
import java.util.Collection;
import java.util.List;

@Data
@Entity
@NoArgsConstructor
public class Event {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonProperty("name")
    private String name;

    @JsonProperty("description")
    private String description;

    @JsonProperty("place")
    private String place;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "event_category_link",
            joinColumns = @JoinColumn(name = "event_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Collection<Category> categories;

    //Owner
    @ManyToOne(optional = true)
    @JoinColumn(name = "user_id")
    @JsonProperty("user")
    private User user;

    @ManyToMany(mappedBy = "events")
    private Collection<User> users;

    @JsonProperty("startInstant")
    private Instant startInstant;

    @JsonProperty("endInstant")
    private Instant endInstant;

    @JsonProperty("eventState")
    private EventState eventState = EventState.WAITING_FOR_START;

    @OneToOne
    @JoinColumn(name = "preview_id", nullable = true)
    @JsonProperty("preview")
    private Photo preview;

    @JsonProperty("photos")
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "event_id")
    private List<Photo> photos;

    @Column(name = "price")
    private Long price;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "event_id")
    private List<Comment> comments;
}
