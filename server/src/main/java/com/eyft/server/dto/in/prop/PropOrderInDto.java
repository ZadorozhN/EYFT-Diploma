package com.eyft.server.dto.in.prop;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PropOrderInDto {
    private List<String> orderedDays;
    private String comment;
    private Long pieces;
}
