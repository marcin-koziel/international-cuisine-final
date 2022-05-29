package ca.sheridancollege.marcin.repository;

import ca.sheridancollege.marcin.domain.RestaurantItem;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the RestaurantItem entity.
 */
@Repository
public interface RestaurantItemRepository extends JpaRepository<RestaurantItem, Long> {
    default Optional<RestaurantItem> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<RestaurantItem> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<RestaurantItem> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct restaurantItem from RestaurantItem restaurantItem left join fetch restaurantItem.restaurantMenu",
        countQuery = "select count(distinct restaurantItem) from RestaurantItem restaurantItem"
    )
    Page<RestaurantItem> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct restaurantItem from RestaurantItem restaurantItem left join fetch restaurantItem.restaurantMenu")
    List<RestaurantItem> findAllWithToOneRelationships();

    @Query(
        "select restaurantItem from RestaurantItem restaurantItem left join fetch restaurantItem.restaurantMenu where restaurantItem.id =:id"
    )
    Optional<RestaurantItem> findOneWithToOneRelationships(@Param("id") Long id);
}
