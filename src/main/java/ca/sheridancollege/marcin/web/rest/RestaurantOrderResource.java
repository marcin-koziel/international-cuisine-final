package ca.sheridancollege.marcin.web.rest;

import ca.sheridancollege.marcin.domain.RestaurantOrder;
import ca.sheridancollege.marcin.repository.RestaurantOrderRepository;
import ca.sheridancollege.marcin.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link ca.sheridancollege.marcin.domain.RestaurantOrder}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class RestaurantOrderResource {

    private final Logger log = LoggerFactory.getLogger(RestaurantOrderResource.class);

    private static final String ENTITY_NAME = "restaurantOrder";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RestaurantOrderRepository restaurantOrderRepository;

    public RestaurantOrderResource(RestaurantOrderRepository restaurantOrderRepository) {
        this.restaurantOrderRepository = restaurantOrderRepository;
    }

    /**
     * {@code POST  /restaurant-orders} : Create a new restaurantOrder.
     *
     * @param restaurantOrder the restaurantOrder to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new restaurantOrder, or with status {@code 400 (Bad Request)} if the restaurantOrder has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/restaurant-orders")
    public ResponseEntity<RestaurantOrder> createRestaurantOrder(@RequestBody RestaurantOrder restaurantOrder) throws URISyntaxException {
        log.debug("REST request to save RestaurantOrder : {}", restaurantOrder);
        if (restaurantOrder.getId() != null) {
            throw new BadRequestAlertException("A new restaurantOrder cannot already have an ID", ENTITY_NAME, "idexists");
        }
        RestaurantOrder result = restaurantOrderRepository.save(restaurantOrder);
        return ResponseEntity
            .created(new URI("/api/restaurant-orders/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /restaurant-orders/:id} : Updates an existing restaurantOrder.
     *
     * @param id the id of the restaurantOrder to save.
     * @param restaurantOrder the restaurantOrder to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated restaurantOrder,
     * or with status {@code 400 (Bad Request)} if the restaurantOrder is not valid,
     * or with status {@code 500 (Internal Server Error)} if the restaurantOrder couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/restaurant-orders/{id}")
    public ResponseEntity<RestaurantOrder> updateRestaurantOrder(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody RestaurantOrder restaurantOrder
    ) throws URISyntaxException {
        log.debug("REST request to update RestaurantOrder : {}, {}", id, restaurantOrder);
        if (restaurantOrder.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, restaurantOrder.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!restaurantOrderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        RestaurantOrder result = restaurantOrderRepository.save(restaurantOrder);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, restaurantOrder.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /restaurant-orders/:id} : Partial updates given fields of an existing restaurantOrder, field will ignore if it is null
     *
     * @param id the id of the restaurantOrder to save.
     * @param restaurantOrder the restaurantOrder to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated restaurantOrder,
     * or with status {@code 400 (Bad Request)} if the restaurantOrder is not valid,
     * or with status {@code 404 (Not Found)} if the restaurantOrder is not found,
     * or with status {@code 500 (Internal Server Error)} if the restaurantOrder couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/restaurant-orders/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<RestaurantOrder> partialUpdateRestaurantOrder(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody RestaurantOrder restaurantOrder
    ) throws URISyntaxException {
        log.debug("REST request to partial update RestaurantOrder partially : {}, {}", id, restaurantOrder);
        if (restaurantOrder.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, restaurantOrder.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!restaurantOrderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<RestaurantOrder> result = restaurantOrderRepository
            .findById(restaurantOrder.getId())
            .map(existingRestaurantOrder -> {
                if (restaurantOrder.getQuantity() != null) {
                    existingRestaurantOrder.setQuantity(restaurantOrder.getQuantity());
                }
                if (restaurantOrder.getTotal() != null) {
                    existingRestaurantOrder.setTotal(restaurantOrder.getTotal());
                }

                return existingRestaurantOrder;
            })
            .map(restaurantOrderRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, restaurantOrder.getId().toString())
        );
    }

    /**
     * {@code GET  /restaurant-orders} : get all the restaurantOrders.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of restaurantOrders in body.
     */
    @GetMapping("/restaurant-orders")
    public List<RestaurantOrder> getAllRestaurantOrders(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all RestaurantOrders");
        return restaurantOrderRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /restaurant-orders/:id} : get the "id" restaurantOrder.
     *
     * @param id the id of the restaurantOrder to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the restaurantOrder, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/restaurant-orders/{id}")
    public ResponseEntity<RestaurantOrder> getRestaurantOrder(@PathVariable Long id) {
        log.debug("REST request to get RestaurantOrder : {}", id);
        Optional<RestaurantOrder> restaurantOrder = restaurantOrderRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(restaurantOrder);
    }

    /**
     * {@code DELETE  /restaurant-orders/:id} : delete the "id" restaurantOrder.
     *
     * @param id the id of the restaurantOrder to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/restaurant-orders/{id}")
    public ResponseEntity<Void> deleteRestaurantOrder(@PathVariable Long id) {
        log.debug("REST request to delete RestaurantOrder : {}", id);
        restaurantOrderRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
