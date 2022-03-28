package com.eyft.server.dto.in.user;

import com.eyft.server.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserManagementUserChangingInDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private Boolean enabled;
}
