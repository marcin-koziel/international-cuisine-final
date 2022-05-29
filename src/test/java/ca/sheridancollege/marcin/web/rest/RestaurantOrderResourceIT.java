package ca.sheridancollege.marcin.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import ca.sheridancollege.marcin.IntegrationTest;
import ca.sheridancollege.marcin.domain.RestaurantOrder;
import ca.sheridancollege.marcin.repository.RestaurantOrderRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link RestaurantOrderResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class RestaurantOrderResourceIT {

    private static final Integer DEFAULT_QUANTITY = 1;
    private static final Integer UPDATED_QUANTITY = 2;

    private static final Float DEFAULT_TOTAL = 1F;
    private static final Float UPDATED_TOTAL = 2F;

    private static final String ENTITY_API_URL = "/api/restaurant-orders";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private RestaurantOrderRepository restaurantOrderRepository;

    @Mock
    private RestaurantOrderRepository restaurantOrderRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRestaurantOrderMockMvc;

    private RestaurantOrder restaurantOrder;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RestaurantOrder createEntity(EntityManager em) {
        RestaurantOrder restaurantOrder = new RestaurantOrder().quantity(DEFAULT_QUANTITY).total(DEFAULT_TOTAL);
        return restaurantOrder;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RestaurantOrder createUpdatedEntity(EntityManager em) {
        RestaurantOrder restaurantOrder = new RestaurantOrder().quantity(UPDATED_QUANTITY).total(UPDATED_TOTAL);
        return restaurantOrder;
    }

    @BeforeEach
    public void initTest() {
        restaurantOrder = createEntity(em);
    }

    @Test
    @Transactional
    void createRestaurantOrder() throws Exception {
        int databaseSizeBeforeCreate = restaurantOrderRepository.findAll().size();
        // Create the RestaurantOrder
        restRestaurantOrderMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(restaurantOrder))
            )
            .andExpect(status().isCreated());

        // Validate the RestaurantOrder in the database
        List<RestaurantOrder> restaurantOrderList = restaurantOrderRepository.findAll();
        assertThat(restaurantOrderList).hasSize(databaseSizeBeforeCreate + 1);
        RestaurantOrder testRestaurantOrder = restaurantOrderList.get(restaurantOrderList.size() - 1);
        assertThat(testRestaurantOrder.getQuantity()).isEqualTo(DEFAULT_QUANTITY);
        assertThat(testRestaurantOrder.getTotal()).isEqualTo(DEFAULT_TOTAL);
    }

    @Test
    @Transactional
    void createRestaurantOrderWithExistingId() throws Exception {
        // Create the RestaurantOrder with an existing ID
        restaurantOrder.setId(1L);

        int databaseSizeBeforeCreate = restaurantOrderRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRestaurantOrderMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(restaurantOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the RestaurantOrder in the database
        List<RestaurantOrder> restaurantOrderList = restaurantOrderRepository.findAll();
        assertThat(restaurantOrderList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllRestaurantOrders() throws Exception {
        // Initialize the database
        restaurantOrderRepository.saveAndFlush(restaurantOrder);

        // Get all the restaurantOrderList
        restRestaurantOrderMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(restaurantOrder.getId().intValue())))
            .andExpect(jsonPath("$.[*].quantity").value(hasItem(DEFAULT_QUANTITY)))
            .andExpect(jsonPath("$.[*].total").value(hasItem(DEFAULT_TOTAL.doubleValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllRestaurantOrdersWithEagerRelationshipsIsEnabled() throws Exception {
        when(restaurantOrderRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restRestaurantOrderMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(restaurantOrderRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllRestaurantOrdersWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(restaurantOrderRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restRestaurantOrderMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(restaurantOrderRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getRestaurantOrder() throws Exception {
        // Initialize the database
        restaurantOrderRepository.saveAndFlush(restaurantOrder);

        // Get the restaurantOrder
        restRestaurantOrderMockMvc
            .perform(get(ENTITY_API_URL_ID, restaurantOrder.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(restaurantOrder.getId().intValue()))
            .andExpect(jsonPath("$.quantity").value(DEFAULT_QUANTITY))
            .andExpect(jsonPath("$.total").value(DEFAULT_TOTAL.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingRestaurantOrder() throws Exception {
        // Get the restaurantOrder
        restRestaurantOrderMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewRestaurantOrder() throws Exception {
        // Initialize the database
        restaurantOrderRepository.saveAndFlush(restaurantOrder);

        int databaseSizeBeforeUpdate = restaurantOrderRepository.findAll().size();

        // Update the restaurantOrder
        RestaurantOrder updatedRestaurantOrder = restaurantOrderRepository.findById(restaurantOrder.getId()).get();
        // Disconnect from session so that the updates on updatedRestaurantOrder are not directly saved in db
        em.detach(updatedRestaurantOrder);
        updatedRestaurantOrder.quantity(UPDATED_QUANTITY).total(UPDATED_TOTAL);

        restRestaurantOrderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRestaurantOrder.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedRestaurantOrder))
            )
            .andExpect(status().isOk());

        // Validate the RestaurantOrder in the database
        List<RestaurantOrder> restaurantOrderList = restaurantOrderRepository.findAll();
        assertThat(restaurantOrderList).hasSize(databaseSizeBeforeUpdate);
        RestaurantOrder testRestaurantOrder = restaurantOrderList.get(restaurantOrderList.size() - 1);
        assertThat(testRestaurantOrder.getQuantity()).isEqualTo(UPDATED_QUANTITY);
        assertThat(testRestaurantOrder.getTotal()).isEqualTo(UPDATED_TOTAL);
    }

    @Test
    @Transactional
    void putNonExistingRestaurantOrder() throws Exception {
        int databaseSizeBeforeUpdate = restaurantOrderRepository.findAll().size();
        restaurantOrder.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRestaurantOrderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, restaurantOrder.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(restaurantOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the RestaurantOrder in the database
        List<RestaurantOrder> restaurantOrderList = restaurantOrderRepository.findAll();
        assertThat(restaurantOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRestaurantOrder() throws Exception {
        int databaseSizeBeforeUpdate = restaurantOrderRepository.findAll().size();
        restaurantOrder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRestaurantOrderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(restaurantOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the RestaurantOrder in the database
        List<RestaurantOrder> restaurantOrderList = restaurantOrderRepository.findAll();
        assertThat(restaurantOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRestaurantOrder() throws Exception {
        int databaseSizeBeforeUpdate = restaurantOrderRepository.findAll().size();
        restaurantOrder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRestaurantOrderMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(restaurantOrder))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the RestaurantOrder in the database
        List<RestaurantOrder> restaurantOrderList = restaurantOrderRepository.findAll();
        assertThat(restaurantOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRestaurantOrderWithPatch() throws Exception {
        // Initialize the database
        restaurantOrderRepository.saveAndFlush(restaurantOrder);

        int databaseSizeBeforeUpdate = restaurantOrderRepository.findAll().size();

        // Update the restaurantOrder using partial update
        RestaurantOrder partialUpdatedRestaurantOrder = new RestaurantOrder();
        partialUpdatedRestaurantOrder.setId(restaurantOrder.getId());

        partialUpdatedRestaurantOrder.quantity(UPDATED_QUANTITY);

        restRestaurantOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRestaurantOrder.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRestaurantOrder))
            )
            .andExpect(status().isOk());

        // Validate the RestaurantOrder in the database
        List<RestaurantOrder> restaurantOrderList = restaurantOrderRepository.findAll();
        assertThat(restaurantOrderList).hasSize(databaseSizeBeforeUpdate);
        RestaurantOrder testRestaurantOrder = restaurantOrderList.get(restaurantOrderList.size() - 1);
        assertThat(testRestaurantOrder.getQuantity()).isEqualTo(UPDATED_QUANTITY);
        assertThat(testRestaurantOrder.getTotal()).isEqualTo(DEFAULT_TOTAL);
    }

    @Test
    @Transactional
    void fullUpdateRestaurantOrderWithPatch() throws Exception {
        // Initialize the database
        restaurantOrderRepository.saveAndFlush(restaurantOrder);

        int databaseSizeBeforeUpdate = restaurantOrderRepository.findAll().size();

        // Update the restaurantOrder using partial update
        RestaurantOrder partialUpdatedRestaurantOrder = new RestaurantOrder();
        partialUpdatedRestaurantOrder.setId(restaurantOrder.getId());

        partialUpdatedRestaurantOrder.quantity(UPDATED_QUANTITY).total(UPDATED_TOTAL);

        restRestaurantOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRestaurantOrder.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRestaurantOrder))
            )
            .andExpect(status().isOk());

        // Validate the RestaurantOrder in the database
        List<RestaurantOrder> restaurantOrderList = restaurantOrderRepository.findAll();
        assertThat(restaurantOrderList).hasSize(databaseSizeBeforeUpdate);
        RestaurantOrder testRestaurantOrder = restaurantOrderList.get(restaurantOrderList.size() - 1);
        assertThat(testRestaurantOrder.getQuantity()).isEqualTo(UPDATED_QUANTITY);
        assertThat(testRestaurantOrder.getTotal()).isEqualTo(UPDATED_TOTAL);
    }

    @Test
    @Transactional
    void patchNonExistingRestaurantOrder() throws Exception {
        int databaseSizeBeforeUpdate = restaurantOrderRepository.findAll().size();
        restaurantOrder.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRestaurantOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, restaurantOrder.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(restaurantOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the RestaurantOrder in the database
        List<RestaurantOrder> restaurantOrderList = restaurantOrderRepository.findAll();
        assertThat(restaurantOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRestaurantOrder() throws Exception {
        int databaseSizeBeforeUpdate = restaurantOrderRepository.findAll().size();
        restaurantOrder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRestaurantOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(restaurantOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the RestaurantOrder in the database
        List<RestaurantOrder> restaurantOrderList = restaurantOrderRepository.findAll();
        assertThat(restaurantOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRestaurantOrder() throws Exception {
        int databaseSizeBeforeUpdate = restaurantOrderRepository.findAll().size();
        restaurantOrder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRestaurantOrderMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(restaurantOrder))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the RestaurantOrder in the database
        List<RestaurantOrder> restaurantOrderList = restaurantOrderRepository.findAll();
        assertThat(restaurantOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRestaurantOrder() throws Exception {
        // Initialize the database
        restaurantOrderRepository.saveAndFlush(restaurantOrder);

        int databaseSizeBeforeDelete = restaurantOrderRepository.findAll().size();

        // Delete the restaurantOrder
        restRestaurantOrderMockMvc
            .perform(delete(ENTITY_API_URL_ID, restaurantOrder.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<RestaurantOrder> restaurantOrderList = restaurantOrderRepository.findAll();
        assertThat(restaurantOrderList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
