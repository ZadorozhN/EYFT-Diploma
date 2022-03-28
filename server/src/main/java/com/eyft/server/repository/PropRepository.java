package com.eyft.server.repository;

import com.eyft.server.model.Prop;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PropRepository extends JpaRepository<Prop, Long> {
    Prop getPropByName(String name);
}
