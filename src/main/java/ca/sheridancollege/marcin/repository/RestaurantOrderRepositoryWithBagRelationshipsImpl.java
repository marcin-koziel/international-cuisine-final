package ca.sheridancollege.marcin.repository;

import ca.sheridancollege.marcin.domain.RestaurantOrder;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class RestaurantOrderRepositoryWithBagRelationshipsImpl implements RestaurantOrderRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<RestaurantOrder> fetchBagRelationships(Optional<RestaurantOrder> restaurantOrder) {
        return restaurantOrder.map(this::fetchItems);
    }

    @Override
    public Page<RestaurantOrder> fetchBagRelationships(Page<RestaurantOrder> restaurantOrders) {
        return new PageImpl<>(
            fetchBagRelationships(restaurantOrders.getContent()),
            restaurantOrders.getPageable(),
            restaurantOrders.getTotalElements()
        );
    }

    @Override
    public List<RestaurantOrder> fetchBagRelationships(List<RestaurantOrder> restaurantOrders) {
        return Optional.of(restaurantOrders).map(this::fetchItems).orElse(Collections.emptyList());
    }

    RestaurantOrder fetchItems(RestaurantOrder result) {
        return entityManager
            .createQuery(
                "select restaurantOrder from RestaurantOrder restaurantOrder left join fetch restaurantOrder.items where restaurantOrder is :restaurantOrder",
                RestaurantOrder.class
            )
            .setParameter("restaurantOrder", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<RestaurantOrder> fetchItems(List<RestaurantOrder> restaurantOrders) {
        return entityManager
            .createQuery(
                "select distinct restaurantOrder from RestaurantOrder restaurantOrder left join fetch restaurantOrder.items where restaurantOrder in :restaurantOrders",
                RestaurantOrder.class
            )
            .setParameter("restaurantOrders", restaurantOrders)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
    }
}
