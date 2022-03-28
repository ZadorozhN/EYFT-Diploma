package com.eyft.server.model.mapper;

import com.eyft.server.dto.in.user.ChangePersonalDataInDTO;
import com.eyft.server.dto.in.user.UserManagementUserChangingInDTO;
import com.eyft.server.dto.out.message.ReceiverOutDto;
import com.eyft.server.dto.out.user.UserManagementUserOutDTO;
import com.eyft.server.dto.out.user.UserOutDTO;
import com.eyft.server.model.Role;
import com.eyft.server.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class UserMapper {

    private final PhotoMapper photoMapper;

    public UserManagementUserOutDTO fillUserManagementUserOutDTO(User user){
        return new UserManagementUserOutDTO(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getLogin(),
                user.getRole().name(),
                user.isEnabled(),
                user.isArrangerRoleRequested()
        );
    }

    public UserOutDTO fillUserOutDTO(User user){
        return new UserOutDTO(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getLogin(),
                user.getRole().name(),
                user.isEnabled(),
                user.isArrangerRoleRequested(),
                user.getPhotos().stream().map(photoMapper::fillPhotoOutDTO).collect(Collectors.toList()),
                user.getAvatar() != null ? photoMapper.fillPhotoOutDTO(user.getAvatar()) : null
        );
    }

    public ReceiverOutDto fillReceiverOutDto(User user){
        return new ReceiverOutDto(
                user.getId(),
                user.getLogin(),
                user.getAvatar() == null ? null : user.getAvatar().getId()
        );
    }

    public void fillFromInDTO(User user, UserManagementUserChangingInDTO userManagementUserChangingInDTO){
        if(userManagementUserChangingInDTO.getEmail() != null) {
            user.setEmail(userManagementUserChangingInDTO.getEmail());
        }

        if(userManagementUserChangingInDTO.getFirstName() != null) {
            user.setFirstName(userManagementUserChangingInDTO.getFirstName());
        }

        if(userManagementUserChangingInDTO.getLastName() != null) {
            user.setLastName(userManagementUserChangingInDTO.getLastName());
        }

        if(userManagementUserChangingInDTO.getEnabled() != null) {
            user.setEnabled(userManagementUserChangingInDTO.getEnabled());
        }

        if(userManagementUserChangingInDTO.getRole() != null) {
            user.setRole(Role.valueOf(userManagementUserChangingInDTO.getRole()));
        }
    }

    public void fillFromInDTO(User user, ChangePersonalDataInDTO changePersonalDataInDTO){
        if(changePersonalDataInDTO.getEmail() != null) {
            user.setEmail(changePersonalDataInDTO.getEmail());
        }

        if(changePersonalDataInDTO.getFirstName() != null) {
            user.setFirstName(changePersonalDataInDTO.getFirstName());
        }

        if(changePersonalDataInDTO.getLastName() != null) {
            user.setLastName(changePersonalDataInDTO.getLastName());
        }
    }
}
