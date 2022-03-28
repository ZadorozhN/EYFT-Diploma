package com.eyft.server.scheduler;

import com.eyft.server.model.Event;
import com.eyft.server.service.EventService;
import com.eyft.server.service.MailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class MailScheduler {

    private final EventService eventService;
    private final MailService mailService;

    @Scheduled(fixedRateString = "${scheduler.mail.notification.fixedRateMs}")
    public void go(){
//        log.info("Mail notifications fired");
//
//        List<Event> events = eventService.findAll();
//
//        events.forEach(this::notifyEventMembers);
    }

//    private final void notifyEventMembers(Event event){
//
//        event.getUsers().forEach();
//
//        SimpleMailMessage message = new SimpleMailMessage();
//        message.setFrom("noreply@baeldung.com");
//        message.setTo("zadorozhny.nik@gmail.com");
//        message.setSubject("Hi Nikita");
//        message.setText("I am from eyft service");
//        emailSender.send(message);
//    }
}
