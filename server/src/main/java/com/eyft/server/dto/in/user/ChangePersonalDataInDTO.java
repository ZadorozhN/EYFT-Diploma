package com.eyft.server.dto.in.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChangePersonalDataInDTO {
    private String firstName;
    private String lastName;
    private String email;
}
