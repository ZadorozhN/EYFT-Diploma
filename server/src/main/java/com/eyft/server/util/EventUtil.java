package com.eyft.server.util;

import com.eyft.server.exception.StartInstantIsAfterEndInstantException;
import com.eyft.server.exception.StartInstantIsBeforeNowException;
import com.eyft.server.model.Event;
import com.eyft.server.model.EventState;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class EventUtil {

    public void checkNewEvent(Event event){
        Instant now = Instant.now();

         if(!event.getStartInstant().isAfter(now)){
             throw new StartInstantIsBeforeNowException();
         }

         if(!event.getStartInstant().isBefore(event.getEndInstant())){
             throw new StartInstantIsAfterEndInstantException();
         }
    }

    public boolean isRelevant(Event event) {
        Instant now = Instant.now();

        return event.getEventState().equals(EventState.WAITING_FOR_START)
                || event.getEventState().equals(EventState.STARTED);
    }
}
