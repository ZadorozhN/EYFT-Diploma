package com.eyft.server.controller.management;

import com.eyft.server.dto.in.prop.PropChangingInDto;
import com.eyft.server.dto.in.prop.PropCreatingInDto;
import com.eyft.server.dto.in.prop.PropOrderChangingInDto;
import com.eyft.server.dto.out.SuccessfulOutDTO;
import com.eyft.server.dto.out.prop.PropOrderOutDto;
import com.eyft.server.dto.out.prop.PropOrdersOutDto;
import com.eyft.server.dto.out.prop.PropOutDto;
import com.eyft.server.dto.out.prop.PropsOutDto;
import com.eyft.server.model.Prop;
import com.eyft.server.model.PropOrder;
import com.eyft.server.model.PropOrderStatus;
import com.eyft.server.model.mapper.PropMapper;
import com.eyft.server.service.PropService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.Lists;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/prop-management")
@RequiredArgsConstructor
public class PropManagementController {
    private final ObjectMapper objectMapper;
    private final PropService propService;
    private final PropMapper propMapper;

    @GetMapping("/props")
    public PropsOutDto getAllProps(){
        List<PropOutDto> propOutDtos = propService.getAllProps().stream()
                .map(propMapper::fillPropOutDto)
                .collect(Collectors.toList());

        return new PropsOutDto(propOutDtos);
    }

    @PostMapping("/props")
    public PropOutDto createProp(@RequestBody PropCreatingInDto propCreatingInDto){

        Prop prop = objectMapper.convertValue(propCreatingInDto, Prop.class);

        prop = propService.save(prop);

        return propMapper.fillPropOutDto(prop);
    }

    @GetMapping("/props/{id}")
    public PropOutDto getEvent(@PathVariable Long id){

        Prop prop = propService.getPropById(id);

        return propMapper.fillPropOutDto(prop);
    }

    @DeleteMapping("/props/{id}")
    public SuccessfulOutDTO deleteProp(@PathVariable Long id){

        propService.removePropById(id);

        return new SuccessfulOutDTO("Prop was deleted");
    }

    @PutMapping("/props/{id}")
    public PropOutDto changeProp(@PathVariable Long id, @RequestBody PropChangingInDto propChangingInDto){
        Prop prop = propService.changeProp(id, propChangingInDto);

        return propMapper.fillPropOutDto(prop);
    }

    @GetMapping("/orders")
    public PropOrdersOutDto getPropOrders(){
        List<PropOrder> propOrders = propService.getAllPropOrdersStatusesIn(Lists.newArrayList(PropOrderStatus.ORDERED,
                PropOrderStatus.ACCEPTED, PropOrderStatus.DELIVERED));

        List<PropOrderOutDto> propOrderOutDtoList = propOrders.stream()
                .map(propMapper::fillPropOrderOutDto)
                .collect(Collectors.toList());

        return new PropOrdersOutDto(propOrderOutDtoList);
    }

    @DeleteMapping("/orders/{id}")
    public SuccessfulOutDTO deletePropOrder(@PathVariable Long id){
        propService.removePropOrderById(id);

        return new SuccessfulOutDTO("Prop Order was removed");
    }

    @PutMapping("/orders/{id}")
    public SuccessfulOutDTO deletePropOrder(@PathVariable Long id, @RequestBody PropOrderChangingInDto propOrderChangingInDto){
        propService.updatePropOrder(id, propOrderChangingInDto);

        return new SuccessfulOutDTO("Prop Order state was changed");
    }

    @GetMapping("/orders/ordered")
    public PropOrdersOutDto getPropOrdersToHandle(){
        List<PropOrder> propOrders = propService.getAllPropOrdersStatusesIn(Lists.newArrayList(PropOrderStatus.ORDERED));

        List<PropOrderOutDto> propOrderOutDtoList = propOrders.stream()
                .map(propMapper::fillPropOrderOutDto)
                .collect(Collectors.toList());

        return new PropOrdersOutDto(propOrderOutDtoList);
    }

}
