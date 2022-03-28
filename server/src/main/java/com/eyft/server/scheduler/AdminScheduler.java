package com.eyft.server.scheduler;

import com.eyft.server.model.Role;
import com.eyft.server.model.User;
import com.eyft.server.service.UserService;
import com.eyft.server.testdata.DataFillingStartEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(value = "admin.verifying.enabled", havingValue = "true")
public class AdminScheduler {
    private final UserService userService;
    private final ApplicationEventPublisher applicationEventPublisher;

    @Value("${admin.verifying.login}")
    private String adminLogin;

    @Value("${admin.verifying.password}")
    private String adminPassword;

    @Value("${admin.verifying.email}")
    private String adminEmail;

    @Value("${admin.verifying.firstName}")
    private String adminFirstName;

    @Value("${admin.verifying.lastName}")
    private String adminLastName;

    @Scheduled(fixedRateString = "${scheduler.admin.adminVerification.fixedRateMs}")
    public void verifyAdmin(){
        Optional<User> optionalAdmin = userService.findByLogin(adminLogin);

        if(optionalAdmin.isEmpty()){
            log.warn("Admin account {} does not exist", adminLogin);

            User user = new User();
            user.setLogin(adminLogin);
            user.setPassword(adminPassword);
            user.setEmail(adminEmail);
            user.setFirstName(adminFirstName);
            user.setLastName(adminLastName);

            userService.save(user, Role.ADMIN);

            log.info("Admin account {} was crated", adminLogin);

            applicationEventPublisher.publishEvent(new DataFillingStartEvent(this));

            return;
        }

        User user = optionalAdmin.get();

        if(user.getRole() != Role.ADMIN){
            log.warn("Admin account {} has no admin permissions", adminLogin);

            user.setRole(Role.ADMIN);
            userService.save(user);

            log.warn("Admin permissions were added to admin account {}", adminLogin);
        }
    }
}
