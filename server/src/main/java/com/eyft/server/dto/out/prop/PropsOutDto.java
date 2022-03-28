package com.eyft.server.dto.out.prop;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PropsOutDto {
    private List<PropOutDto> props;
}
