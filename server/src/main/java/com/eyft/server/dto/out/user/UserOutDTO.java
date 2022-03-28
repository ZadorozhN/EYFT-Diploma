package com.eyft.server.dto.out.user;

import com.eyft.server.dto.out.photo.PhotoOutDTO;
import com.eyft.server.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collection;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserOutDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String login;
    private String role;
    private boolean enabled;
    private boolean isArrangerRoleRequested;
    private Collection<PhotoOutDTO> photos;
    private PhotoOutDTO avatar;
}
