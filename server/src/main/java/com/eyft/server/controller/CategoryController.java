package com.eyft.server.controller;

import com.eyft.server.dto.out.category.CategoriesOutDTO;
import com.eyft.server.dto.out.category.CategoryOutDTO;
import com.eyft.server.model.mapper.CategoryMapper;
import com.eyft.server.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/categories")
public class CategoryController {

    private final CategoryService categoryService;
    private final CategoryMapper categoryMapper;

    @GetMapping
    public CategoriesOutDTO getAllCategories(){
        List<CategoryOutDTO> categories =categoryService.findAll().stream()
                .map(categoryMapper::fillCategoryOutDTO)
                .collect(Collectors.toList());

        return new CategoriesOutDTO(categories);
    }
}
