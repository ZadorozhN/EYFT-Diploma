package com.eyft.server.dto.out.category;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryManagementCategoryOutDTO {
    private Long id;
    private String name;
    private String description;
}
