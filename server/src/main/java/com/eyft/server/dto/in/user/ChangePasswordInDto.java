package com.eyft.server.dto.in.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChangePasswordInDto {
    private String oldPassword;
    private String newPassword;
    private String newPasswordRepeat;
}
