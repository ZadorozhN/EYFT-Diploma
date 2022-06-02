package com.eyft.server.model.mapper;

import com.eyft.server.dto.in.prop.PropChangingInDto;
import com.eyft.server.dto.out.prop.PropOrderOutDto;
import com.eyft.server.dto.out.prop.PropOutDto;
import com.eyft.server.dto.out.prop.PropsOutDto;
import com.eyft.server.dto.out.prop.SimplePropOutDto;
import com.eyft.server.model.Prop;
import com.eyft.server.model.PropOrder;
import com.google.common.base.Strings;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class PropMapper {

    public PropOutDto fillPropOutDto(Prop prop){
        return new PropOutDto(
                prop.getId(),
                prop.getName(),
                prop.getDescription(),
                prop.getPropType().name(),
                prop.getCost(),
                prop.getCostType().name(),
                prop.getPropOrders() == null ? null : prop.getPropOrders().stream()
                        .map(this::fillPropOrderOutDto)
                        .collect(Collectors.toList())
        );
    }

    public PropsOutDto fillPropOutDtos(List<Prop> props){
        List<PropOutDto> propOutDtos = props.stream()
                .map(this::fillPropOutDto)
                .collect(Collectors.toList());

        return new PropsOutDto(propOutDtos);
    }

    public PropOrderOutDto fillPropOrderOutDto(PropOrder propOrder){
        return new PropOrderOutDto(
                propOrder.getId(),
                propOrder.getOrderedDate(),
                propOrder.getPieces(),
                propOrder.getUser().getLogin(),
                fillSimplePropOutDto(propOrder.getProp()),
                propOrder.getCost(),
                propOrder.getComment(),
                propOrder.getAnswer(),
                propOrder.getStatus().name(),
                propOrder.getCreationTime()
        );
    }

    public void fillFromPropOutDto(Prop prop, PropChangingInDto propChangingInDto){
        if(!Strings.isNullOrEmpty(propChangingInDto.getName())){
            prop.setName(propChangingInDto.getName());
        }

        if(!Strings.isNullOrEmpty(propChangingInDto.getDescription())){
            prop.setDescription(propChangingInDto.getDescription());
        }

        if(propChangingInDto.getPropType() != null){
            prop.setPropType(propChangingInDto.getPropType());
        }

        if(propChangingInDto.getCostType() != null){
            prop.setCostType(propChangingInDto.getCostType());
        }

        if(propChangingInDto.getCost() != null){
            prop.setCost(propChangingInDto.getCost());
        }
    }

    public SimplePropOutDto fillSimplePropOutDto(Prop prop){
        return new SimplePropOutDto(
                prop.getId(),
                prop.getName(),
                prop.getDescription(),
                prop.getPropType().name(),
                prop.getCost(),
                prop.getCostType().name()
        );
    }
}
