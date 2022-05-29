package ca.sheridancollege.marcin.domain;

import static org.assertj.core.api.Assertions.assertThat;

import ca.sheridancollege.marcin.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class RestaurantMenuTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(RestaurantMenu.class);
        RestaurantMenu restaurantMenu1 = new RestaurantMenu();
        restaurantMenu1.setId(1L);
        RestaurantMenu restaurantMenu2 = new RestaurantMenu();
        restaurantMenu2.setId(restaurantMenu1.getId());
        assertThat(restaurantMenu1).isEqualTo(restaurantMenu2);
        restaurantMenu2.setId(2L);
        assertThat(restaurantMenu1).isNotEqualTo(restaurantMenu2);
        restaurantMenu1.setId(null);
        assertThat(restaurantMenu1).isNotEqualTo(restaurantMenu2);
    }
}
