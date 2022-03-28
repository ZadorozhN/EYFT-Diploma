package com.eyft.server.model.mapper;

import com.eyft.server.dto.in.category.CategoryManagementCategoryChangingInDTO;
import com.eyft.server.dto.out.category.CategoryManagementCategoryOutDTO;
import com.eyft.server.dto.out.category.CategoryOutDTO;
import com.eyft.server.model.Category;
import com.google.common.base.Strings;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CategoryMapper {

    public CategoryManagementCategoryOutDTO fillCategoryManagementCategoryOutDTO(Category category){
        return new CategoryManagementCategoryOutDTO(
                category.getId(),
                category.getName(),
                category.getDescription()
        );
    }

    public CategoryOutDTO fillCategoryOutDTO(Category category){
        return new CategoryOutDTO(
                category.getId(),
                category.getName(),
                category.getDescription()
        );
    }

    public void fillFromInDTO(Category category,
                              CategoryManagementCategoryChangingInDTO categoryManagementCategoryChangingInDTO){

        if(!Strings.isNullOrEmpty(categoryManagementCategoryChangingInDTO.getName())){
            category.setName(categoryManagementCategoryChangingInDTO.getName());
        }

        if(!Strings.isNullOrEmpty(categoryManagementCategoryChangingInDTO.getDescription())){
            category.setDescription(categoryManagementCategoryChangingInDTO.getDescription());
        }
    }
}
