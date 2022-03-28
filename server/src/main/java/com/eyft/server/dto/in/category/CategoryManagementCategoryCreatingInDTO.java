package com.eyft.server.dto.in.category;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryManagementCategoryCreatingInDTO {
    private String name;
    private String description;
}
