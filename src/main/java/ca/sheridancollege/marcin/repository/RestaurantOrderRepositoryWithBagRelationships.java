package ca.sheridancollege.marcin.repository;

import ca.sheridancollege.marcin.domain.RestaurantOrder;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface RestaurantOrderRepositoryWithBagRelationships {
    Optional<RestaurantOrder> fetchBagRelationships(Optional<RestaurantOrder> restaurantOrder);

    List<RestaurantOrder> fetchBagRelationships(List<RestaurantOrder> restaurantOrders);

    Page<RestaurantOrder> fetchBagRelationships(Page<RestaurantOrder> restaurantOrders);
}
