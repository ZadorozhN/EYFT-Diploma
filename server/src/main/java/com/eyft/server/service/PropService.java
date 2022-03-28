package com.eyft.server.service;

import com.eyft.server.dto.in.prop.PropChangingInDto;
import com.eyft.server.dto.in.prop.PropOrderChangingInDto;
import com.eyft.server.dto.in.prop.PropOrderInDto;
import com.eyft.server.model.Prop;
import com.eyft.server.model.PropOrder;
import com.eyft.server.model.PropOrderStatus;
import com.eyft.server.model.User;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface PropService {

    Prop getPropById(Long id);

    PropOrder getPropOrderById(Long id);

    List<Prop> getAllProps();

    void removePropById(Long id);

    Prop changeProp(Long id, PropChangingInDto propChangingInDto);

    Prop save(Prop prop);

    void orderProp(Long id, String login, PropOrderInDto propOrder);

    void orderPropSneaky(Long id, String login, PropOrderInDto propOrderInDto);

    List<PropOrder> getAllPropOrdersByUser(User user);

    List<PropOrder> getAllPropOrdersStatusesIn(List<PropOrderStatus> propOrderStatuses);

    void removePropOrder(PropOrder propOrder);

    @Transactional
    void removePropOrderById(Long id);

    Prop getPropByName(String name);

    void updatePropOrder(Long id, PropOrderChangingInDto propOrderChangingInDto);
}
