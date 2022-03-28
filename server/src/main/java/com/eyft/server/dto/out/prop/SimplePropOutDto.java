package com.eyft.server.dto.out.prop;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SimplePropOutDto {
    private Long id;
    private String name;
    private String description;
    private String propType;
    private Long cost;
    private String costType;
}
