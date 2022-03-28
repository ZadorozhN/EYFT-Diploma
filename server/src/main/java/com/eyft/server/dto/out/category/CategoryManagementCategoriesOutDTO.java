package com.eyft.server.dto.out.category;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryManagementCategoriesOutDTO {
    @JsonProperty("categories")
    List<CategoryManagementCategoryOutDTO> categories;
}
