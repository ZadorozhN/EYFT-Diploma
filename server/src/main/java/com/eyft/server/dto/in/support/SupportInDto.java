package com.eyft.server.dto.in.support;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupportInDto {
    private String email;
    private String type;
}
