package com.eyft.server.repository;

import com.eyft.server.model.Event;
import com.eyft.server.model.EventState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long>, JpaSpecificationExecutor<Event> {
    List<Event> findAllByEventState(EventState eventState);
}
