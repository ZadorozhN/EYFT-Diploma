package com.eyft.server.dto.out.category;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoriesOutDTO {
    private List<CategoryOutDTO> categories;
}
