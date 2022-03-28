package com.eyft.server.dto.in.event;

import com.eyft.server.model.EventState;
import com.eyft.server.service.specification.Operation;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventQueryInDTO {
    private String filterField;
    private String filterValue;
    private Operation filterOperation;
    private String sortField;
    private String sortOrder;
    private EventState eventState;
    private List<String> categoriesNames;
}

