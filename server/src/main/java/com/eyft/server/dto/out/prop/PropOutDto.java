package com.eyft.server.dto.out.prop;

import com.eyft.server.model.PropOrder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PropOutDto {
    private Long id;
    private String name;
    private String description;
    private String propType;
    private Long cost;
    private String costType;
    private List<PropOrderOutDto> propOrders;
}
