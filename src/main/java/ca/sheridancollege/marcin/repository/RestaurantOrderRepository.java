package ca.sheridancollege.marcin.repository;

import ca.sheridancollege.marcin.domain.RestaurantOrder;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the RestaurantOrder entity.
 */
@Repository
public interface RestaurantOrderRepository extends JpaRepository<RestaurantOrder, Long> {
    default Optional<RestaurantOrder> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<RestaurantOrder> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<RestaurantOrder> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct restaurantOrder from RestaurantOrder restaurantOrder left join fetch restaurantOrder.item",
        countQuery = "select count(distinct restaurantOrder) from RestaurantOrder restaurantOrder"
    )
    Page<RestaurantOrder> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct restaurantOrder from RestaurantOrder restaurantOrder left join fetch restaurantOrder.item")
    List<RestaurantOrder> findAllWithToOneRelationships();

    @Query("select restaurantOrder from RestaurantOrder restaurantOrder left join fetch restaurantOrder.item where restaurantOrder.id =:id")
    Optional<RestaurantOrder> findOneWithToOneRelationships(@Param("id") Long id);
}
