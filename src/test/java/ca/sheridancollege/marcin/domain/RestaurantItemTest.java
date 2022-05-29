package ca.sheridancollege.marcin.domain;

import static org.assertj.core.api.Assertions.assertThat;

import ca.sheridancollege.marcin.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class RestaurantItemTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(RestaurantItem.class);
        RestaurantItem restaurantItem1 = new RestaurantItem();
        restaurantItem1.setId(1L);
        RestaurantItem restaurantItem2 = new RestaurantItem();
        restaurantItem2.setId(restaurantItem1.getId());
        assertThat(restaurantItem1).isEqualTo(restaurantItem2);
        restaurantItem2.setId(2L);
        assertThat(restaurantItem1).isNotEqualTo(restaurantItem2);
        restaurantItem1.setId(null);
        assertThat(restaurantItem1).isNotEqualTo(restaurantItem2);
    }
}
