package com.eyft.server.service;

import com.eyft.server.model.Category;
import java.util.List;
import java.util.Optional;

public interface CategoryService {
    List<Category> findAll();

    Optional<Category> findById(Long id);

    Optional<Category> findByName(String name);

    void deleteById(Long id);

    Category save(Category category);
}
