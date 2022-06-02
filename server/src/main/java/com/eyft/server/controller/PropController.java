package com.eyft.server.controller;

import com.eyft.server.dto.in.prop.PropOrderInDto;
import com.eyft.server.dto.out.SuccessfulOutDTO;
import com.eyft.server.dto.out.prop.PropOutDto;
import com.eyft.server.dto.out.prop.PropsOutDto;
import com.eyft.server.model.Prop;
import com.eyft.server.model.mapper.PropMapper;
import com.eyft.server.service.PropService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/props")
@RequiredArgsConstructor
public class PropController {

    private final PropService propService;
    private final PropMapper propMapper;

    @GetMapping
    public PropsOutDto getAllProps(){
        List<Prop> props = propService.getAllProps();

        return propMapper.fillPropOutDtos(props);
    }

    @GetMapping("/{id}")
    public PropOutDto getProp(@PathVariable Long id){
        Prop prop = propService.getPropById(id);

        return propMapper.fillPropOutDto(prop);
    }

    @PostMapping("/{id}/orders")
    public SuccessfulOutDTO makeOrders(@PathVariable Long id, Authentication authentication,
                                       @RequestBody PropOrderInDto propOrderInDto){
        String login = authentication.getPrincipal().toString();

        propService.orderProp(id, login, propOrderInDto);

        return new SuccessfulOutDTO("Prop was ordered");
    }
}
