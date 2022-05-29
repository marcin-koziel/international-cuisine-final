package ca.sheridancollege.marcin.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import ca.sheridancollege.marcin.IntegrationTest;
import ca.sheridancollege.marcin.domain.RestaurantMenu;
import ca.sheridancollege.marcin.repository.RestaurantMenuRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link RestaurantMenuResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class RestaurantMenuResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/restaurant-menus";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private RestaurantMenuRepository restaurantMenuRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRestaurantMenuMockMvc;

    private RestaurantMenu restaurantMenu;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RestaurantMenu createEntity(EntityManager em) {
        RestaurantMenu restaurantMenu = new RestaurantMenu().title(DEFAULT_TITLE);
        return restaurantMenu;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RestaurantMenu createUpdatedEntity(EntityManager em) {
        RestaurantMenu restaurantMenu = new RestaurantMenu().title(UPDATED_TITLE);
        return restaurantMenu;
    }

    @BeforeEach
    public void initTest() {
        restaurantMenu = createEntity(em);
    }

    @Test
    @Transactional
    void createRestaurantMenu() throws Exception {
        int databaseSizeBeforeCreate = restaurantMenuRepository.findAll().size();
        // Create the RestaurantMenu
        restRestaurantMenuMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(restaurantMenu))
            )
            .andExpect(status().isCreated());

        // Validate the RestaurantMenu in the database
        List<RestaurantMenu> restaurantMenuList = restaurantMenuRepository.findAll();
        assertThat(restaurantMenuList).hasSize(databaseSizeBeforeCreate + 1);
        RestaurantMenu testRestaurantMenu = restaurantMenuList.get(restaurantMenuList.size() - 1);
        assertThat(testRestaurantMenu.getTitle()).isEqualTo(DEFAULT_TITLE);
    }

    @Test
    @Transactional
    void createRestaurantMenuWithExistingId() throws Exception {
        // Create the RestaurantMenu with an existing ID
        restaurantMenu.setId(1L);

        int databaseSizeBeforeCreate = restaurantMenuRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRestaurantMenuMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(restaurantMenu))
            )
            .andExpect(status().isBadRequest());

        // Validate the RestaurantMenu in the database
        List<RestaurantMenu> restaurantMenuList = restaurantMenuRepository.findAll();
        assertThat(restaurantMenuList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllRestaurantMenus() throws Exception {
        // Initialize the database
        restaurantMenuRepository.saveAndFlush(restaurantMenu);

        // Get all the restaurantMenuList
        restRestaurantMenuMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(restaurantMenu.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)));
    }

    @Test
    @Transactional
    void getRestaurantMenu() throws Exception {
        // Initialize the database
        restaurantMenuRepository.saveAndFlush(restaurantMenu);

        // Get the restaurantMenu
        restRestaurantMenuMockMvc
            .perform(get(ENTITY_API_URL_ID, restaurantMenu.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(restaurantMenu.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE));
    }

    @Test
    @Transactional
    void getNonExistingRestaurantMenu() throws Exception {
        // Get the restaurantMenu
        restRestaurantMenuMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewRestaurantMenu() throws Exception {
        // Initialize the database
        restaurantMenuRepository.saveAndFlush(restaurantMenu);

        int databaseSizeBeforeUpdate = restaurantMenuRepository.findAll().size();

        // Update the restaurantMenu
        RestaurantMenu updatedRestaurantMenu = restaurantMenuRepository.findById(restaurantMenu.getId()).get();
        // Disconnect from session so that the updates on updatedRestaurantMenu are not directly saved in db
        em.detach(updatedRestaurantMenu);
        updatedRestaurantMenu.title(UPDATED_TITLE);

        restRestaurantMenuMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRestaurantMenu.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedRestaurantMenu))
            )
            .andExpect(status().isOk());

        // Validate the RestaurantMenu in the database
        List<RestaurantMenu> restaurantMenuList = restaurantMenuRepository.findAll();
        assertThat(restaurantMenuList).hasSize(databaseSizeBeforeUpdate);
        RestaurantMenu testRestaurantMenu = restaurantMenuList.get(restaurantMenuList.size() - 1);
        assertThat(testRestaurantMenu.getTitle()).isEqualTo(UPDATED_TITLE);
    }

    @Test
    @Transactional
    void putNonExistingRestaurantMenu() throws Exception {
        int databaseSizeBeforeUpdate = restaurantMenuRepository.findAll().size();
        restaurantMenu.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRestaurantMenuMockMvc
            .perform(
                put(ENTITY_API_URL_ID, restaurantMenu.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(restaurantMenu))
            )
            .andExpect(status().isBadRequest());

        // Validate the RestaurantMenu in the database
        List<RestaurantMenu> restaurantMenuList = restaurantMenuRepository.findAll();
        assertThat(restaurantMenuList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRestaurantMenu() throws Exception {
        int databaseSizeBeforeUpdate = restaurantMenuRepository.findAll().size();
        restaurantMenu.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRestaurantMenuMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(restaurantMenu))
            )
            .andExpect(status().isBadRequest());

        // Validate the RestaurantMenu in the database
        List<RestaurantMenu> restaurantMenuList = restaurantMenuRepository.findAll();
        assertThat(restaurantMenuList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRestaurantMenu() throws Exception {
        int databaseSizeBeforeUpdate = restaurantMenuRepository.findAll().size();
        restaurantMenu.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRestaurantMenuMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(restaurantMenu)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the RestaurantMenu in the database
        List<RestaurantMenu> restaurantMenuList = restaurantMenuRepository.findAll();
        assertThat(restaurantMenuList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRestaurantMenuWithPatch() throws Exception {
        // Initialize the database
        restaurantMenuRepository.saveAndFlush(restaurantMenu);

        int databaseSizeBeforeUpdate = restaurantMenuRepository.findAll().size();

        // Update the restaurantMenu using partial update
        RestaurantMenu partialUpdatedRestaurantMenu = new RestaurantMenu();
        partialUpdatedRestaurantMenu.setId(restaurantMenu.getId());

        restRestaurantMenuMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRestaurantMenu.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRestaurantMenu))
            )
            .andExpect(status().isOk());

        // Validate the RestaurantMenu in the database
        List<RestaurantMenu> restaurantMenuList = restaurantMenuRepository.findAll();
        assertThat(restaurantMenuList).hasSize(databaseSizeBeforeUpdate);
        RestaurantMenu testRestaurantMenu = restaurantMenuList.get(restaurantMenuList.size() - 1);
        assertThat(testRestaurantMenu.getTitle()).isEqualTo(DEFAULT_TITLE);
    }

    @Test
    @Transactional
    void fullUpdateRestaurantMenuWithPatch() throws Exception {
        // Initialize the database
        restaurantMenuRepository.saveAndFlush(restaurantMenu);

        int databaseSizeBeforeUpdate = restaurantMenuRepository.findAll().size();

        // Update the restaurantMenu using partial update
        RestaurantMenu partialUpdatedRestaurantMenu = new RestaurantMenu();
        partialUpdatedRestaurantMenu.setId(restaurantMenu.getId());

        partialUpdatedRestaurantMenu.title(UPDATED_TITLE);

        restRestaurantMenuMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRestaurantMenu.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRestaurantMenu))
            )
            .andExpect(status().isOk());

        // Validate the RestaurantMenu in the database
        List<RestaurantMenu> restaurantMenuList = restaurantMenuRepository.findAll();
        assertThat(restaurantMenuList).hasSize(databaseSizeBeforeUpdate);
        RestaurantMenu testRestaurantMenu = restaurantMenuList.get(restaurantMenuList.size() - 1);
        assertThat(testRestaurantMenu.getTitle()).isEqualTo(UPDATED_TITLE);
    }

    @Test
    @Transactional
    void patchNonExistingRestaurantMenu() throws Exception {
        int databaseSizeBeforeUpdate = restaurantMenuRepository.findAll().size();
        restaurantMenu.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRestaurantMenuMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, restaurantMenu.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(restaurantMenu))
            )
            .andExpect(status().isBadRequest());

        // Validate the RestaurantMenu in the database
        List<RestaurantMenu> restaurantMenuList = restaurantMenuRepository.findAll();
        assertThat(restaurantMenuList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRestaurantMenu() throws Exception {
        int databaseSizeBeforeUpdate = restaurantMenuRepository.findAll().size();
        restaurantMenu.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRestaurantMenuMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(restaurantMenu))
            )
            .andExpect(status().isBadRequest());

        // Validate the RestaurantMenu in the database
        List<RestaurantMenu> restaurantMenuList = restaurantMenuRepository.findAll();
        assertThat(restaurantMenuList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRestaurantMenu() throws Exception {
        int databaseSizeBeforeUpdate = restaurantMenuRepository.findAll().size();
        restaurantMenu.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRestaurantMenuMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(restaurantMenu))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the RestaurantMenu in the database
        List<RestaurantMenu> restaurantMenuList = restaurantMenuRepository.findAll();
        assertThat(restaurantMenuList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRestaurantMenu() throws Exception {
        // Initialize the database
        restaurantMenuRepository.saveAndFlush(restaurantMenu);

        int databaseSizeBeforeDelete = restaurantMenuRepository.findAll().size();

        // Delete the restaurantMenu
        restRestaurantMenuMockMvc
            .perform(delete(ENTITY_API_URL_ID, restaurantMenu.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<RestaurantMenu> restaurantMenuList = restaurantMenuRepository.findAll();
        assertThat(restaurantMenuList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
