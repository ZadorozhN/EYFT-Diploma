package com.eyft.server.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AccessToken {
    private String accessToken;
    private String tokenType;
    private long expiresIn;
}
