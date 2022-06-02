//package com.eyft.server.config;
//
//import com.eyft.server.config.properties.MailProperties;
//import lombok.RequiredArgsConstructor;
//import org.springframework.boot.context.properties.EnableConfigurationProperties;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.mail.javamail.JavaMailSenderImpl;
//
//import java.util.Properties;
//
//@Configuration
//@RequiredArgsConstructor
//@EnableConfigurationProperties(MailProperties.class)
//public class MailConfig {
//
//    private final MailProperties mailProperties;
//
//    @Bean
//    public JavaMailSender getJavaMailSender() {
//        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
//        mailSender.setHost(mailProperties.getHost());
//        mailSender.setPort(mailProperties.getPort());
//
//        mailSender.setUsername(mailProperties.getUsername());
//        mailSender.setPassword(mailProperties.getPassword());
//
//        Properties props = mailSender.getJavaMailProperties();
//        props.put("mail.transport.protocol", "smtp");
//        props.put("mail.smtp.auth", "true");
//        props.put("mail.smtp.starttls.enable", "true");
//        props.put("mail.debug", "true");
////        props.put("mail.smtp.ssl.enable", "true");
//
//        return mailSender;
//    }
//}
