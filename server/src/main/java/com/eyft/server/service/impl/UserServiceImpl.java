package com.eyft.server.service.impl;

import com.eyft.server.exception.CustomInternalApplicationException;
import com.eyft.server.exception.InvalidEmailException;
import com.eyft.server.exception.PhotoDoesNotBelongToEventException;
import com.eyft.server.exception.validation.CommonValidationException;
import com.eyft.server.model.*;
import com.eyft.server.repository.UserRepository;
import com.eyft.server.service.MoneyHandler;
import com.eyft.server.service.UserService;
import lombok.RequiredArgsConstructor;
import net.bytebuddy.utility.RandomString;
import org.apache.commons.validator.routines.EmailValidator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final PasswordEncoder bCryptPasswordEncoder;
    private final UserRepository userRepository;
    private final MoneyHandler moneyHandler;

    private final Role standardRole = Role.USER;

    @Value("${mail.validation.enabled}")
    private boolean isMailValidationEnabled;

    @Value("${personalData.validation.enabled}")
    private boolean isPersonalDataValidationEnabled;

    @Value("${personalData.validation.dataLength.max}")
    private int personalDataValidationDataLengthMax;

    @Value("${personalData.validation.dataLength.min}")
    private int personalDataValidationDataLengthMin;

    @Value("${personalData.validation.passwordLength.min}")
    private int personalDataValidationPasswordLengthMin;

    @Override
    @Transactional(readOnly = true)
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<User> findByLogin(String login) {
        return userRepository.findByLogin(login);
    }

    @Override
    public void setAvatar(User user, Photo photo) {
        if(!user.getPhotos().contains(photo)){
            throw new PhotoDoesNotBelongToEventException();
        }

        user.setAvatar(photo);

        userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    @Transactional
    public void save(User user) {
        checkEmail(user);
        checkPersonalData(user);

        if(user.getId() == null){
            user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
            user.setEnabled(true);
            user.setArrangerRoleRequested(false);
            user.setRole(standardRole);
            Balance balance = new Balance(UUID.randomUUID().toString());
            balance.setUser(user);
            user.setBalance(balance);
        }

        userRepository.save(user);
    }

    @Override
    @Transactional
    public void save(User user, Role role) {
        checkEmail(user);
        checkPersonalData(user);

        if(user.getId() == null){
            user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
            user.setEnabled(true);
            user.setArrangerRoleRequested(false);
            user.setRole(role);
            Balance balance = new Balance(UUID.randomUUID().toString());
            balance.setUser(user);
            user.setBalance(balance);
        }

        userRepository.save(user);
    }

    @Override
    @Transactional
    public void becomeArranger(User user) {
        user.setArrangerRoleRequested(true);

        userRepository.save(user);
    }

    @Override
    public boolean checkPassword(User user, String password) {
        return bCryptPasswordEncoder.matches(password, user.getPassword());
    }

    @Override
    @Transactional
    public void setPassword(User user, String password) {
        if (!validatePassword(password)) {
            throw new CommonValidationException(CommonValidationException.ValidationError.INVALID_PASSWORD);
        }

        user.setPassword(bCryptPasswordEncoder.encode(password));
    }

    @Override
    @Transactional
    public String recoverPassword(User user) {
        String password = RandomString.make(personalDataValidationPasswordLengthMin);

        setPassword(user, password);

        return password;
    }

    @Override
    @Transactional
    public void joinEvent(User user, Event event) {
        Balance balance = user.getBalance();

        if (balance.getCents() < event.getPrice()) {
            throw new CustomInternalApplicationException("Not enough amount of money");
        }
        moneyHandler.handleRequest(balance.getAccountId(), -event.getPrice());
        user.getEvents().add(event);
        save(user);

    }

    @Override
    public void leaveEvent(User user, Event event) {
        Balance balance = user.getBalance();

        if (!user.getEvents().contains(event)) {
            throw new CustomInternalApplicationException("User hasn't joined the event");
        }

        if (balance.getCents() < event.getPrice()) {
            throw new CustomInternalApplicationException("Not enough amount of money");
        }

        moneyHandler.handleRequest(balance.getAccountId(), event.getPrice());

        user.getEvents().remove(event);
        save(user);
    }

    private void checkEmail(User user){
        if(isMailValidationEnabled && !EmailValidator.getInstance().isValid(user.getEmail())){
            throw new InvalidEmailException();
        }
    }

    private void checkPersonalData(User user){
        if(!isPersonalDataValidationEnabled){
            return;
        }

        if(!EmailValidator.getInstance().isValid(user.getEmail())){
            throw new CommonValidationException(CommonValidationException.ValidationError.INVALID_EMAIL);
        }

        if(!validateStringData(user.getLogin())){
            throw new CommonValidationException(CommonValidationException.ValidationError.INVALID_LOGIN);
        }

        if(!validatePassword(user.getPassword())){
            throw new CommonValidationException(CommonValidationException.ValidationError.INVALID_PASSWORD);
        }

        if(!validateStringData(user.getFirstName())){
            throw new CommonValidationException(CommonValidationException.ValidationError.INVALID_FIRST_NAME);
        }

        if(!validateStringData(user.getLastName())){
            throw new CommonValidationException(CommonValidationException.ValidationError.INVALID_LAST_NAME);
        }
    }

    private boolean validateStringData(String data){
        return data != null &&data.length() >= personalDataValidationDataLengthMin
                && data.length() <= personalDataValidationDataLengthMax;
    }

    private boolean validatePassword(String password){
        return password != null && password.length() >= personalDataValidationPasswordLengthMin;
    }
}
