package ca.sheridancollege.marcin.domain;

import static org.assertj.core.api.Assertions.assertThat;

import ca.sheridancollege.marcin.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class RestaurantOrderTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(RestaurantOrder.class);
        RestaurantOrder restaurantOrder1 = new RestaurantOrder();
        restaurantOrder1.setId(1L);
        RestaurantOrder restaurantOrder2 = new RestaurantOrder();
        restaurantOrder2.setId(restaurantOrder1.getId());
        assertThat(restaurantOrder1).isEqualTo(restaurantOrder2);
        restaurantOrder2.setId(2L);
        assertThat(restaurantOrder1).isNotEqualTo(restaurantOrder2);
        restaurantOrder1.setId(null);
        assertThat(restaurantOrder1).isNotEqualTo(restaurantOrder2);
    }
}
