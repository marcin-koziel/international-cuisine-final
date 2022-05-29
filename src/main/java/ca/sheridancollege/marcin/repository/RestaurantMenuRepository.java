package ca.sheridancollege.marcin.repository;

import ca.sheridancollege.marcin.domain.RestaurantMenu;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the RestaurantMenu entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RestaurantMenuRepository extends JpaRepository<RestaurantMenu, Long> {}
