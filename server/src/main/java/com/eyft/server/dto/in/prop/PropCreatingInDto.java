package com.eyft.server.dto.in.prop;

import com.eyft.server.model.PropType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PropCreatingInDto {
    private String name;
    private String description;
    private PropType propType;
    private Long cost;
    private String costType;
}
