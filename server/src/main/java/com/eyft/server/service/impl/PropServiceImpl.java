package com.eyft.server.service.impl;

import com.eyft.server.dto.in.prop.PropChangingInDto;
import com.eyft.server.dto.in.prop.PropOrderChangingInDto;
import com.eyft.server.dto.in.prop.PropOrderInDto;
import com.eyft.server.exception.CustomInternalApplicationException;
import com.eyft.server.model.*;
import com.eyft.server.model.mapper.PropMapper;
import com.eyft.server.repository.PropOrderRepository;
import com.eyft.server.repository.PropRepository;
import com.eyft.server.service.MoneyHandler;
import com.eyft.server.service.PropService;
import com.eyft.server.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PropServiceImpl implements PropService {

    private final MoneyHandler moneyHandler;
    private final PropRepository propRepository;
    private final PropOrderRepository propOrderRepository;
    private final UserService userService;
    private final PropMapper propMapper;

    @Override
    @Transactional(readOnly = true)
    public Prop getPropById(Long id) {
        return propRepository.findById(id)
                .orElseThrow(() -> new CustomInternalApplicationException("Prop does not exist"));
    }

    @Override
    public PropOrder getPropOrderById(Long id) {
        return propOrderRepository.findById(id)
                .orElseThrow(() -> new CustomInternalApplicationException("Prop does not exist"));
    }

    //TODO investigate @Transactional(readOnly = true)
    @Override
    @Transactional(readOnly = true)
    public List<Prop> getAllProps() {
        return propRepository.findAll();
    }

    @Override
    @Transactional
    public void removePropById(Long id) {
        Prop prop = propRepository.getById(id);
        prop.getPropOrders().forEach(this::removePropOrder);
        //TODO refund/ noRefund/ expiration/ so on and so on
        propRepository.deleteById(id);
    }

    @Override
    @Transactional
    public Prop changeProp(Long id, PropChangingInDto propChangingInDto) {
        Prop prop = propRepository.findById(id)
                .orElseThrow(() -> new CustomInternalApplicationException("Prop does not exist"));

        if(!prop.getPropOrders().isEmpty() && (propChangingInDto.getPropType() != null && propChangingInDto.getPropType() != prop.getPropType())) {
            throw new CustomInternalApplicationException("Can't change prop type when prop was already booked");
        }

        if(!prop.getPropOrders().isEmpty() && (propChangingInDto.getCostType() != null && propChangingInDto.getCostType() != prop.getCostType())) {
            throw new CustomInternalApplicationException("Can't change cost type when prop was already booked");
        }

        propMapper.fillFromPropOutDto(prop, propChangingInDto);

        return propRepository.save(prop);
    }

    @Override
    public Prop save(Prop prop) {
        return propRepository.save(prop);
    }

    @Override
    @Transactional
    public void orderProp(Long id, String login, PropOrderInDto propOrderInDto) {
        Prop prop = propRepository.findById(id).orElseThrow(() ->
                new CustomInternalApplicationException("Prop does not exist"));
        User user = userService.findByLogin(login).orElseThrow(() ->
                new CustomInternalApplicationException("User does not exist"));

        long totalCost = 0;

        if(prop.getCostType().equals(CostType.DAY)){
            List<PropOrder> propOrders = propOrderInDto.getOrderedDays().stream()
                    .map(orderedDay -> new PropOrder(parseDate(orderedDay), user, prop.getCost()))
                    .collect(Collectors.toList());

            propOrders.forEach(propOrder -> {
                propOrder.setCreationTime(Instant.now());
                propOrder.setStatus(PropOrderStatus.ORDERED);
                propOrder.setComment(propOrderInDto.getComment());
            });

            totalCost += propOrders.size() * prop.getCost();

            prop.getPropOrders().addAll(propOrders);
            propRepository.save(prop);

        } else if (prop.getCostType().equals(CostType.PIECE)) {
            PropOrder propOrder = new PropOrder(propOrderInDto.getPieces(), user, prop.getCost() * propOrderInDto.getPieces());

            propOrder.setCreationTime(Instant.now());
            propOrder.setStatus(PropOrderStatus.ORDERED);
            propOrder.setComment(propOrderInDto.getComment());

            prop.getPropOrders().add(propOrder);

            totalCost += propOrder.getPieces() * prop.getCost();

            propRepository.save(prop);
        }

        if(user.getBalance().getCents() < totalCost){
            throw new CustomInternalApplicationException("Not enough amount of money");
        }

        String accountId = user.getBalance().getAccountId();
        moneyHandler.handleRequest(accountId, -totalCost);
    }

    @Override
    @Transactional
    public void orderPropSneaky(Long id, String login, PropOrderInDto propOrderInDto) {
        Prop prop = propRepository.findById(id).orElseThrow(() ->
                new CustomInternalApplicationException("Prop does not exist"));
        User user = userService.findByLogin(login).orElseThrow(() ->
                new CustomInternalApplicationException("User does not exist"));

        if(prop.getCostType().equals(CostType.DAY)){
            List<PropOrder> propOrders = propOrderInDto.getOrderedDays().stream()
                    .map(orderedDay -> new PropOrder(parseDate(orderedDay), user, prop.getCost()))
                    .collect(Collectors.toList());

            propOrders.forEach(propOrder -> {
                propOrder.setCreationTime(Instant.now());
                propOrder.setStatus(PropOrderStatus.ORDERED);
                propOrder.setComment(propOrderInDto.getComment());
            });

            prop.getPropOrders().addAll(propOrders);
            propRepository.save(prop);

        } else if (prop.getCostType().equals(CostType.PIECE)) {
            PropOrder propOrder = new PropOrder(propOrderInDto.getPieces(), user, prop.getCost() * propOrderInDto.getPieces());

            propOrder.setCreationTime(Instant.now());
            propOrder.setStatus(PropOrderStatus.ORDERED);
            propOrder.setComment(propOrderInDto.getComment());

            prop.getPropOrders().add(propOrder);

            propRepository.save(prop);
        }
    }

    @Override
    public List<PropOrder> getAllPropOrdersByUser(User user) {
        return propOrderRepository.getAllByUser(user);
    }

    @Override
    public List<PropOrder> getAllPropOrdersStatusesIn(List<PropOrderStatus> propOrderStatuses) {
        return propOrderRepository.getAllByStatusIn(propOrderStatuses);
    }

    @Override
    @Transactional
    public void removePropOrder(PropOrder propOrder) {
        User user = propOrder.getUser();
        propOrderRepository.delete(propOrder);

        String accountId = user.getBalance().getAccountId();
        if(propOrder.getStatus() != PropOrderStatus.DELIVERED) {
            moneyHandler.handleRequest(accountId, +propOrder.getCost());
        };
    }

    @Override
    @Transactional
    public void removePropOrderById(Long id) {
        PropOrder propOrder = propOrderRepository.getById(id);
        User user = propOrder.getUser();
        propOrderRepository.delete(propOrder);

        String accountId = user.getBalance().getAccountId();

        if(propOrder.getStatus() != PropOrderStatus.DELIVERED) {
            moneyHandler.handleRequest(accountId, +propOrder.getCost());
        };
    }

    @Override
    public Prop getPropByName(String name) {
        return propRepository.getPropByName(name);
    }

    @Override
    public void updatePropOrder(Long id, PropOrderChangingInDto propOrderChangingInDto) {
        PropOrder propOrder = propOrderRepository.getById(id);

        propOrder.setAnswer(propOrderChangingInDto.getMessage());
        propOrder.setStatus(propOrderChangingInDto.getStatus());

        propOrderRepository.save(propOrder);
    }

    @SneakyThrows
    private Date parseDate(String date){
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd.MM.yyyy");
        return dateFormat.parse(date);
    }
}
