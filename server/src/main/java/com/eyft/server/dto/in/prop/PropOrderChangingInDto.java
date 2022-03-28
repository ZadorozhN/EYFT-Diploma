package com.eyft.server.dto.in.prop;

import com.eyft.server.model.PropOrderStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PropOrderChangingInDto {
    private String message;
    private PropOrderStatus status;
}
