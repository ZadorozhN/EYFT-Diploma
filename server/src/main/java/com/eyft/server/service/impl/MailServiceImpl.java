package com.eyft.server.service.impl;

import com.eyft.server.model.Event;
import com.eyft.server.model.User;
import com.eyft.server.service.MailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.MailMessage;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class MailServiceImpl implements MailService {

    private final JavaMailSender emailSender;

    @Value("${mail.notification.eventStopped.pattern.subject}")
    private String eventStoppedSubject;

    @Value("${mail.notification.eventStopped.pattern.message}")
    private String eventStoppedMessage;

    @Value("${mail.notification.eventStarted.pattern.subject}")
    private String eventStartedSubject;

    @Value("${mail.notification.eventStarted.pattern.message}")
    private String eventStartedMessage;

    @Value("${mail.notification.eventFinished.pattern.subject}")
    private String eventFinishedSubject;

    @Value("${mail.notification.eventFinished.pattern.message}")
    private String eventFinishedMessage;

    @Value("${mail.notification.eventClosed.pattern.subject}")
    private String eventClosedSubject;

    @Value("${mail.notification.eventClosed.pattern.message}")
    private String eventClosedMessage;

    @Value("${spring.mail.username}")
    private String sender;

    @Override
    public void sendEmail(User user, String subject, String message) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(user.getEmail());
        mailMessage.setFrom(sender);
        mailMessage.setSubject(subject);
        mailMessage.setText(message);
        sendMessage(mailMessage);
    }

    @Override
    public void sendEventStoppedNotification(User user, Event event) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(user.getEmail());
        mailMessage.setSubject(eventStoppedSubject);
        mailMessage.setText(String.format(eventStoppedMessage, user.getFirstName(), event.getName()));
        sendMessage(mailMessage);
    }

    @Override
    public void sendEventStartedNotification(User user, Event event) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(user.getEmail());
        mailMessage.setSubject(eventStartedSubject);
        mailMessage.setText(String.format(eventStartedMessage, user.getFirstName(), event.getName()));
        sendMessage(mailMessage);
    }

    @Override
    public void sendEventFinishedNotification(User user, Event event) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(user.getEmail());
        mailMessage.setSubject(eventFinishedSubject);
        mailMessage.setText(String.format(eventFinishedMessage, user.getFirstName(), event.getName()));
        sendMessage(mailMessage);
    }

    @Override
    public void sendEventClosedNotification(User user, Event event) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(user.getEmail());
        mailMessage.setSubject(eventClosedSubject);
        mailMessage.setText(String.format(eventClosedMessage, user.getFirstName(), event.getName()));
        sendMessage(mailMessage);
    }

    private void sendMessage(SimpleMailMessage mailMessage){
        String[] receivers = Objects.requireNonNull(mailMessage.getTo());

        try {
            emailSender.send(mailMessage);
            for (String s : receivers) {
                log.info("Message was sent to {}", s);
            }
        } catch (MailException e) {
            for (String s : receivers) {
                log.warn("Invalid email. Can't send a message to {} because of {}", s, e.getMessage());
            }
        }
    }
}
