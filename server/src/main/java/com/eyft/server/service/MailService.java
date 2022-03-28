package com.eyft.server.service;

import com.eyft.server.model.Event;
import com.eyft.server.model.User;

public interface MailService {
    void sendEmail(User user, String subject, String message);

    void sendEventStoppedNotification(User user, Event event);

    void sendEventStartedNotification(User user, Event event);

    void sendEventFinishedNotification(User user, Event event);

    void sendEventClosedNotification(User user, Event event);
}
