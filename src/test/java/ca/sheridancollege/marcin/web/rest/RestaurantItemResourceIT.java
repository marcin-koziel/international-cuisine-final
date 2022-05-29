package ca.sheridancollege.marcin.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import ca.sheridancollege.marcin.IntegrationTest;
import ca.sheridancollege.marcin.domain.RestaurantItem;
import ca.sheridancollege.marcin.repository.RestaurantItemRepository;
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
 * Integration tests for the {@link RestaurantItemResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class RestaurantItemResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_SUMMARY = "AAAAAAAAAA";
    private static final String UPDATED_SUMMARY = "BBBBBBBBBB";

    private static final Float DEFAULT_PRICE = 1F;
    private static final Float UPDATED_PRICE = 2F;

    private static final Float DEFAULT_ITEM_DISCOUNT = 1F;
    private static final Float UPDATED_ITEM_DISCOUNT = 2F;

    private static final String ENTITY_API_URL = "/api/restaurant-items";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private RestaurantItemRepository restaurantItemRepository;

    @Mock
    private RestaurantItemRepository restaurantItemRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRestaurantItemMockMvc;

    private RestaurantItem restaurantItem;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RestaurantItem createEntity(EntityManager em) {
        RestaurantItem restaurantItem = new RestaurantItem()
            .title(DEFAULT_TITLE)
            .summary(DEFAULT_SUMMARY)
            .price(DEFAULT_PRICE)
            .itemDiscount(DEFAULT_ITEM_DISCOUNT);
        return restaurantItem;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RestaurantItem createUpdatedEntity(EntityManager em) {
        RestaurantItem restaurantItem = new RestaurantItem()
            .title(UPDATED_TITLE)
            .summary(UPDATED_SUMMARY)
            .price(UPDATED_PRICE)
            .itemDiscount(UPDATED_ITEM_DISCOUNT);
        return restaurantItem;
    }

    @BeforeEach
    public void initTest() {
        restaurantItem = createEntity(em);
    }

    @Test
    @Transactional
    void createRestaurantItem() throws Exception {
        int databaseSizeBeforeCreate = restaurantItemRepository.findAll().size();
        // Create the RestaurantItem
        restRestaurantItemMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(restaurantItem))
            )
            .andExpect(status().isCreated());

        // Validate the RestaurantItem in the database
        List<RestaurantItem> restaurantItemList = restaurantItemRepository.findAll();
        assertThat(restaurantItemList).hasSize(databaseSizeBeforeCreate + 1);
        RestaurantItem testRestaurantItem = restaurantItemList.get(restaurantItemList.size() - 1);
        assertThat(testRestaurantItem.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testRestaurantItem.getSummary()).isEqualTo(DEFAULT_SUMMARY);
        assertThat(testRestaurantItem.getPrice()).isEqualTo(DEFAULT_PRICE);
        assertThat(testRestaurantItem.getItemDiscount()).isEqualTo(DEFAULT_ITEM_DISCOUNT);
    }

    @Test
    @Transactional
    void createRestaurantItemWithExistingId() throws Exception {
        // Create the RestaurantItem with an existing ID
        restaurantItem.setId(1L);

        int databaseSizeBeforeCreate = restaurantItemRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRestaurantItemMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(restaurantItem))
            )
            .andExpect(status().isBadRequest());

        // Validate the RestaurantItem in the database
        List<RestaurantItem> restaurantItemList = restaurantItemRepository.findAll();
        assertThat(restaurantItemList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllRestaurantItems() throws Exception {
        // Initialize the database
        restaurantItemRepository.saveAndFlush(restaurantItem);

        // Get all the restaurantItemList
        restRestaurantItemMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(restaurantItem.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].summary").value(hasItem(DEFAULT_SUMMARY)))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.doubleValue())))
            .andExpect(jsonPath("$.[*].itemDiscount").value(hasItem(DEFAULT_ITEM_DISCOUNT.doubleValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllRestaurantItemsWithEagerRelationshipsIsEnabled() throws Exception {
        when(restaurantItemRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restRestaurantItemMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(restaurantItemRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllRestaurantItemsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(restaurantItemRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restRestaurantItemMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(restaurantItemRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getRestaurantItem() throws Exception {
        // Initialize the database
        restaurantItemRepository.saveAndFlush(restaurantItem);

        // Get the restaurantItem
        restRestaurantItemMockMvc
            .perform(get(ENTITY_API_URL_ID, restaurantItem.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(restaurantItem.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.summary").value(DEFAULT_SUMMARY))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE.doubleValue()))
            .andExpect(jsonPath("$.itemDiscount").value(DEFAULT_ITEM_DISCOUNT.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingRestaurantItem() throws Exception {
        // Get the restaurantItem
        restRestaurantItemMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewRestaurantItem() throws Exception {
        // Initialize the database
        restaurantItemRepository.saveAndFlush(restaurantItem);

        int databaseSizeBeforeUpdate = restaurantItemRepository.findAll().size();

        // Update the restaurantItem
        RestaurantItem updatedRestaurantItem = restaurantItemRepository.findById(restaurantItem.getId()).get();
        // Disconnect from session so that the updates on updatedRestaurantItem are not directly saved in db
        em.detach(updatedRestaurantItem);
        updatedRestaurantItem.title(UPDATED_TITLE).summary(UPDATED_SUMMARY).price(UPDATED_PRICE).itemDiscount(UPDATED_ITEM_DISCOUNT);

        restRestaurantItemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRestaurantItem.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedRestaurantItem))
            )
            .andExpect(status().isOk());

        // Validate the RestaurantItem in the database
        List<RestaurantItem> restaurantItemList = restaurantItemRepository.findAll();
        assertThat(restaurantItemList).hasSize(databaseSizeBeforeUpdate);
        RestaurantItem testRestaurantItem = restaurantItemList.get(restaurantItemList.size() - 1);
        assertThat(testRestaurantItem.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testRestaurantItem.getSummary()).isEqualTo(UPDATED_SUMMARY);
        assertThat(testRestaurantItem.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testRestaurantItem.getItemDiscount()).isEqualTo(UPDATED_ITEM_DISCOUNT);
    }

    @Test
    @Transactional
    void putNonExistingRestaurantItem() throws Exception {
        int databaseSizeBeforeUpdate = restaurantItemRepository.findAll().size();
        restaurantItem.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRestaurantItemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, restaurantItem.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(restaurantItem))
            )
            .andExpect(status().isBadRequest());

        // Validate the RestaurantItem in the database
        List<RestaurantItem> restaurantItemList = restaurantItemRepository.findAll();
        assertThat(restaurantItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRestaurantItem() throws Exception {
        int databaseSizeBeforeUpdate = restaurantItemRepository.findAll().size();
        restaurantItem.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRestaurantItemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(restaurantItem))
            )
            .andExpect(status().isBadRequest());

        // Validate the RestaurantItem in the database
        List<RestaurantItem> restaurantItemList = restaurantItemRepository.findAll();
        assertThat(restaurantItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRestaurantItem() throws Exception {
        int databaseSizeBeforeUpdate = restaurantItemRepository.findAll().size();
        restaurantItem.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRestaurantItemMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(restaurantItem)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the RestaurantItem in the database
        List<RestaurantItem> restaurantItemList = restaurantItemRepository.findAll();
        assertThat(restaurantItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRestaurantItemWithPatch() throws Exception {
        // Initialize the database
        restaurantItemRepository.saveAndFlush(restaurantItem);

        int databaseSizeBeforeUpdate = restaurantItemRepository.findAll().size();

        // Update the restaurantItem using partial update
        RestaurantItem partialUpdatedRestaurantItem = new RestaurantItem();
        partialUpdatedRestaurantItem.setId(restaurantItem.getId());

        partialUpdatedRestaurantItem.summary(UPDATED_SUMMARY).price(UPDATED_PRICE);

        restRestaurantItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRestaurantItem.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRestaurantItem))
            )
            .andExpect(status().isOk());

        // Validate the RestaurantItem in the database
        List<RestaurantItem> restaurantItemList = restaurantItemRepository.findAll();
        assertThat(restaurantItemList).hasSize(databaseSizeBeforeUpdate);
        RestaurantItem testRestaurantItem = restaurantItemList.get(restaurantItemList.size() - 1);
        assertThat(testRestaurantItem.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testRestaurantItem.getSummary()).isEqualTo(UPDATED_SUMMARY);
        assertThat(testRestaurantItem.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testRestaurantItem.getItemDiscount()).isEqualTo(DEFAULT_ITEM_DISCOUNT);
    }

    @Test
    @Transactional
    void fullUpdateRestaurantItemWithPatch() throws Exception {
        // Initialize the database
        restaurantItemRepository.saveAndFlush(restaurantItem);

        int databaseSizeBeforeUpdate = restaurantItemRepository.findAll().size();

        // Update the restaurantItem using partial update
        RestaurantItem partialUpdatedRestaurantItem = new RestaurantItem();
        partialUpdatedRestaurantItem.setId(restaurantItem.getId());

        partialUpdatedRestaurantItem.title(UPDATED_TITLE).summary(UPDATED_SUMMARY).price(UPDATED_PRICE).itemDiscount(UPDATED_ITEM_DISCOUNT);

        restRestaurantItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRestaurantItem.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRestaurantItem))
            )
            .andExpect(status().isOk());

        // Validate the RestaurantItem in the database
        List<RestaurantItem> restaurantItemList = restaurantItemRepository.findAll();
        assertThat(restaurantItemList).hasSize(databaseSizeBeforeUpdate);
        RestaurantItem testRestaurantItem = restaurantItemList.get(restaurantItemList.size() - 1);
        assertThat(testRestaurantItem.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testRestaurantItem.getSummary()).isEqualTo(UPDATED_SUMMARY);
        assertThat(testRestaurantItem.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testRestaurantItem.getItemDiscount()).isEqualTo(UPDATED_ITEM_DISCOUNT);
    }

    @Test
    @Transactional
    void patchNonExistingRestaurantItem() throws Exception {
        int databaseSizeBeforeUpdate = restaurantItemRepository.findAll().size();
        restaurantItem.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRestaurantItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, restaurantItem.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(restaurantItem))
            )
            .andExpect(status().isBadRequest());

        // Validate the RestaurantItem in the database
        List<RestaurantItem> restaurantItemList = restaurantItemRepository.findAll();
        assertThat(restaurantItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRestaurantItem() throws Exception {
        int databaseSizeBeforeUpdate = restaurantItemRepository.findAll().size();
        restaurantItem.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRestaurantItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(restaurantItem))
            )
            .andExpect(status().isBadRequest());

        // Validate the RestaurantItem in the database
        List<RestaurantItem> restaurantItemList = restaurantItemRepository.findAll();
        assertThat(restaurantItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRestaurantItem() throws Exception {
        int databaseSizeBeforeUpdate = restaurantItemRepository.findAll().size();
        restaurantItem.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRestaurantItemMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(restaurantItem))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the RestaurantItem in the database
        List<RestaurantItem> restaurantItemList = restaurantItemRepository.findAll();
        assertThat(restaurantItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRestaurantItem() throws Exception {
        // Initialize the database
        restaurantItemRepository.saveAndFlush(restaurantItem);

        int databaseSizeBeforeDelete = restaurantItemRepository.findAll().size();

        // Delete the restaurantItem
        restRestaurantItemMockMvc
            .perform(delete(ENTITY_API_URL_ID, restaurantItem.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<RestaurantItem> restaurantItemList = restaurantItemRepository.findAll();
        assertThat(restaurantItemList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
