package ca.sheridancollege.marcin.web.rest;

import ca.sheridancollege.marcin.domain.RestaurantItem;
import ca.sheridancollege.marcin.repository.RestaurantItemRepository;
import ca.sheridancollege.marcin.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link ca.sheridancollege.marcin.domain.RestaurantItem}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class RestaurantItemResource {

    private final Logger log = LoggerFactory.getLogger(RestaurantItemResource.class);

    private static final String ENTITY_NAME = "restaurantItem";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RestaurantItemRepository restaurantItemRepository;

    public RestaurantItemResource(RestaurantItemRepository restaurantItemRepository) {
        this.restaurantItemRepository = restaurantItemRepository;
    }

    /**
     * {@code POST  /restaurant-items} : Create a new restaurantItem.
     *
     * @param restaurantItem the restaurantItem to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new restaurantItem, or with status {@code 400 (Bad Request)} if the restaurantItem has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/restaurant-items")
    public ResponseEntity<RestaurantItem> createRestaurantItem(@RequestBody RestaurantItem restaurantItem) throws URISyntaxException {
        log.debug("REST request to save RestaurantItem : {}", restaurantItem);
        if (restaurantItem.getId() != null) {
            throw new BadRequestAlertException("A new restaurantItem cannot already have an ID", ENTITY_NAME, "idexists");
        }
        RestaurantItem result = restaurantItemRepository.save(restaurantItem);
        return ResponseEntity
            .created(new URI("/api/restaurant-items/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /restaurant-items/:id} : Updates an existing restaurantItem.
     *
     * @param id the id of the restaurantItem to save.
     * @param restaurantItem the restaurantItem to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated restaurantItem,
     * or with status {@code 400 (Bad Request)} if the restaurantItem is not valid,
     * or with status {@code 500 (Internal Server Error)} if the restaurantItem couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/restaurant-items/{id}")
    public ResponseEntity<RestaurantItem> updateRestaurantItem(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody RestaurantItem restaurantItem
    ) throws URISyntaxException {
        log.debug("REST request to update RestaurantItem : {}, {}", id, restaurantItem);
        if (restaurantItem.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, restaurantItem.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!restaurantItemRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        RestaurantItem result = restaurantItemRepository.save(restaurantItem);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, restaurantItem.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /restaurant-items/:id} : Partial updates given fields of an existing restaurantItem, field will ignore if it is null
     *
     * @param id the id of the restaurantItem to save.
     * @param restaurantItem the restaurantItem to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated restaurantItem,
     * or with status {@code 400 (Bad Request)} if the restaurantItem is not valid,
     * or with status {@code 404 (Not Found)} if the restaurantItem is not found,
     * or with status {@code 500 (Internal Server Error)} if the restaurantItem couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/restaurant-items/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<RestaurantItem> partialUpdateRestaurantItem(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody RestaurantItem restaurantItem
    ) throws URISyntaxException {
        log.debug("REST request to partial update RestaurantItem partially : {}, {}", id, restaurantItem);
        if (restaurantItem.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, restaurantItem.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!restaurantItemRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<RestaurantItem> result = restaurantItemRepository
            .findById(restaurantItem.getId())
            .map(existingRestaurantItem -> {
                if (restaurantItem.getTitle() != null) {
                    existingRestaurantItem.setTitle(restaurantItem.getTitle());
                }
                if (restaurantItem.getSummary() != null) {
                    existingRestaurantItem.setSummary(restaurantItem.getSummary());
                }
                if (restaurantItem.getPrice() != null) {
                    existingRestaurantItem.setPrice(restaurantItem.getPrice());
                }
                if (restaurantItem.getItemDiscount() != null) {
                    existingRestaurantItem.setItemDiscount(restaurantItem.getItemDiscount());
                }

                return existingRestaurantItem;
            })
            .map(restaurantItemRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, restaurantItem.getId().toString())
        );
    }

    /**
     * {@code GET  /restaurant-items} : get all the restaurantItems.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of restaurantItems in body.
     */
    @GetMapping("/restaurant-items")
    public List<RestaurantItem> getAllRestaurantItems(
        @RequestParam(required = false) String filter,
        @RequestParam(required = false, defaultValue = "false") boolean eagerload
    ) {
        if ("restaurantorder-is-null".equals(filter)) {
            log.debug("REST request to get all RestaurantItems where restaurantOrder is null");
            return StreamSupport
                .stream(restaurantItemRepository.findAll().spliterator(), false)
                .filter(restaurantItem -> restaurantItem.getRestaurantOrder() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all RestaurantItems");
        return restaurantItemRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /restaurant-items/:id} : get the "id" restaurantItem.
     *
     * @param id the id of the restaurantItem to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the restaurantItem, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/restaurant-items/{id}")
    public ResponseEntity<RestaurantItem> getRestaurantItem(@PathVariable Long id) {
        log.debug("REST request to get RestaurantItem : {}", id);
        Optional<RestaurantItem> restaurantItem = restaurantItemRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(restaurantItem);
    }

    /**
     * {@code DELETE  /restaurant-items/:id} : delete the "id" restaurantItem.
     *
     * @param id the id of the restaurantItem to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/restaurant-items/{id}")
    public ResponseEntity<Void> deleteRestaurantItem(@PathVariable Long id) {
        log.debug("REST request to delete RestaurantItem : {}", id);
        restaurantItemRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
