package com.eyft.server.service.specification;

import com.eyft.server.exception.InvalidFilterArgumentException;
import com.eyft.server.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.Objects;

@RequiredArgsConstructor
public class UserSpecification implements Specification<User> {

    private final SearchCriteria criteria;

    @Override
    public Predicate toPredicate(Root<User> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder criteriaBuilder) {
        if(Objects.isNull(criteria.getValue()) || Objects.isNull(criteria.getOperation())
                || Objects.isNull(criteria.getKey())){
            throw new InvalidFilterArgumentException();
        }

        Operation operation = criteria.getOperation();
        return switch(operation){
            case LIKE -> criteriaBuilder.like(root.get(criteria.getKey()),
                    "%" + criteria.getValue().toString() + "%");
            case EQUAL -> criteriaBuilder.equal(root.get(criteria.getKey()),criteria.getValue());
        };
    }
}
