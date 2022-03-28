package com.eyft.server.dto.out.prop;

import com.eyft.server.model.PropOrderStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PropOrderOutDto {
    private Long id;
    private Date orderedDate;
    private Long pieces;
    private String userLogin;
    private SimplePropOutDto prop;
    private Long cost;
    private String comment;
    private String answer;
    private String status;
    private Instant creationTime;
}
