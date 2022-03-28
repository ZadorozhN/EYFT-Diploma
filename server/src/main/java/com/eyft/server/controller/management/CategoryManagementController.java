package com.eyft.server.controller.management;

import com.eyft.server.dto.in.category.CategoryManagementCategoryChangingInDTO;
import com.eyft.server.dto.in.category.CategoryManagementCategoryCreatingInDTO;
import com.eyft.server.dto.out.SuccessfulOutDTO;
import com.eyft.server.dto.out.category.CategoryManagementCategoriesOutDTO;
import com.eyft.server.dto.out.category.CategoryManagementCategoryOutDTO;
import com.eyft.server.dto.out.category.CategoryOutDTO;
import com.eyft.server.exception.CategoryDoesNotExistException;
import com.eyft.server.exception.CustomInternalApplicationException;
import com.eyft.server.exception.category.CategoryAlreadyExistsException;
import com.eyft.server.model.Category;
import com.eyft.server.model.mapper.CategoryMapper;
import com.eyft.server.service.CategoryService;
import com.eyft.server.service.EventService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RequestMapping("/category-management")
@RequiredArgsConstructor
@RestController
public class CategoryManagementController {

    private final CategoryService categoryService;
    private final EventService eventService;
    private final ObjectMapper objectMapper;
    private final CategoryMapper categoryMapper;

    @GetMapping("/categories")
    public CategoryManagementCategoriesOutDTO getCategories(){
        List<CategoryManagementCategoryOutDTO> categories = categoryService.findAll().stream()
                .map(categoryMapper::fillCategoryManagementCategoryOutDTO)
                .collect(Collectors.toList());

        return new CategoryManagementCategoriesOutDTO(categories);
    }

    @GetMapping("/categories/{id}")
    public CategoryManagementCategoryOutDTO getCategory(@PathVariable Long id){
        Category category = categoryService.findById(id).orElseThrow(CategoryDoesNotExistException::new);

        return categoryMapper.fillCategoryManagementCategoryOutDTO(category);
    }

    @PostMapping("/categories")
    @Transactional
    public CategoryOutDTO createCategory(
            @RequestBody CategoryManagementCategoryCreatingInDTO categoryManagementCategoryCreatingInDTO){
        Category category = objectMapper.convertValue(categoryManagementCategoryCreatingInDTO, Category.class);

        if(categoryService.findByName(category.getName()).isPresent()){
            throw new CategoryAlreadyExistsException();
        }

        category = categoryService.save(category);

        return categoryMapper.fillCategoryOutDTO(category);
    }

    @DeleteMapping("/categories/{id}")
    @Transactional
    public SuccessfulOutDTO deleteEvent(@PathVariable Long id){
        Category category = categoryService.findById(id).orElseThrow(CategoryDoesNotExistException::new);

        category.getEvents().forEach(event -> {
            event.getCategories().remove(category);
            eventService.save(event);
        });

        categoryService.deleteById(id);

        return new SuccessfulOutDTO("Category was deleted");
    }

    @PutMapping("/categories/{id}")
    @Transactional
    public SuccessfulOutDTO changeEvent(
            @RequestBody CategoryManagementCategoryChangingInDTO categoryManagementCategoryChangingInDTO) {
        Category category = categoryService.findById(categoryManagementCategoryChangingInDTO.getId())
                .orElseThrow(CategoryDoesNotExistException::new);

        categoryMapper.fillFromInDTO(category, categoryManagementCategoryChangingInDTO);

        categoryService.save(category);

        return new SuccessfulOutDTO("Category was changed");
    }
}
