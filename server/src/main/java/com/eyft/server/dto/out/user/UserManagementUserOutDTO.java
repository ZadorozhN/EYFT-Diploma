package com.eyft.server.dto.out.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserManagementUserOutDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String login;
    private String role;
    private boolean enabled;
    private boolean isArrangerRoleRequested;
}
